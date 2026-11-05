import { create } from 'zustand';
import { deleteModelBlob } from '../services/modelStorage';

export interface VillageCustomObject {
  id: string;
  name: string;
  description?: string;
  areaId: string;
  areaName: string;
  modelId: string;
  modelUrl: string;
  fileName: string;
  fileSize?: number;
  visible: boolean;
  isCollidable?: boolean;
  transform: {
    position: [number, number, number]; // [x, y, z] in meters
    rotation: [number, number, number]; // [rotX, rotY, rotZ] in degrees
    scale: [number, number, number]; // [scaleX, scaleY, scaleZ]
    uniformScale: boolean; // whether uniform scale lock is active
  };
  createdAt: number;
  updatedAt: number;
}

export type TransformGizmoMode = 'translate' | 'rotate' | 'scale' | 'none';

interface VillageObjectState {
  objects: VillageCustomObject[];
  selectedObjectId: string | null;
  isAddModalOpen: boolean;
  isObjectListOpen: boolean;
  gizmoMode: TransformGizmoMode;

  // Actions
  openAddModal: () => void;
  closeAddModal: () => void;
  toggleObjectList: () => void;
  setObjectListOpen: (open: boolean) => void;
  selectObject: (id: string | null) => void;
  setGizmoMode: (mode: TransformGizmoMode) => void;

  // CRUD
  addObject: (obj: Omit<VillageCustomObject, 'createdAt' | 'updatedAt'>) => VillageCustomObject;
  updateObject: (id: string, updates: Partial<VillageCustomObject>) => void;
  updateTransform: (
    id: string,
    transformUpdates: Partial<VillageCustomObject['transform']>
  ) => void;
  duplicateObject: (id: string) => VillageCustomObject | null;
  deleteObject: (id: string) => void;
  toggleObjectVisibility: (id: string) => void;
  resetObjectTransform: (id: string) => void;
  resetAllObjects: () => void;
  snapObjectToGround: (id: string, groundY?: number) => void;
}

const STORAGE_KEY = 'bodo_village_inserted_objects_v3';

const INITIAL_DEFAULT_OBJECTS: VillageCustomObject[] = [];

const loadSavedObjects = (): VillageCustomObject[] => {
  if (typeof window === 'undefined') return INITIAL_DEFAULT_OBJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_DEFAULT_OBJECTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_DEFAULT_OBJECTS;
  } catch (err) {
    console.warn('Failed to load saved village objects:', err);
    return INITIAL_DEFAULT_OBJECTS;
  }
};

const saveObjectsToStorage = (objects: VillageCustomObject[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objects));
  } catch (err) {
    console.warn('Failed to save village objects:', err);
  }
};

export const useVillageObjectStore = create<VillageObjectState>((set, get) => ({
  objects: loadSavedObjects(),
  selectedObjectId: null,
  isAddModalOpen: false,
  isObjectListOpen: false,
  gizmoMode: 'translate',

  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),

  toggleObjectList: () => set((state) => ({ isObjectListOpen: !state.isObjectListOpen })),
  setObjectListOpen: (open) => set({ isObjectListOpen: open }),

  selectObject: (id) => set({ selectedObjectId: id }),
  setGizmoMode: (mode) => set({ gizmoMode: mode }),

  addObject: (objData) => {
    const now = Date.now();
    const newObj: VillageCustomObject = {
      ...objData,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => {
      const nextObjects = [...state.objects, newObj];
      saveObjectsToStorage(nextObjects);
      return {
        objects: nextObjects,
        selectedObjectId: newObj.id,
        isAddModalOpen: false,
      };
    });

    return newObj;
  },

  updateObject: (id, updates) => {
    set((state) => {
      const nextObjects = state.objects.map((obj) => {
        if (obj.id !== id) return obj;
        return {
          ...obj,
          ...updates,
          updatedAt: Date.now(),
        };
      });
      saveObjectsToStorage(nextObjects);
      return { objects: nextObjects };
    });
  },

  updateTransform: (id, transformUpdates) => {
    set((state) => {
      const nextObjects = state.objects.map((obj) => {
        if (obj.id !== id) return obj;
        const currentTransform = obj.transform;

        let nextScale = transformUpdates.scale || currentTransform.scale;
        if (
          transformUpdates.uniformScale !== undefined
            ? transformUpdates.uniformScale
            : currentTransform.uniformScale
        ) {
          if (transformUpdates.scale) {
            const s = Math.max(0.05, Math.min(25, transformUpdates.scale[0]));
            nextScale = [s, s, s];
          }
        }

        return {
          ...obj,
          transform: {
            ...currentTransform,
            ...transformUpdates,
            scale: nextScale,
          },
          updatedAt: Date.now(),
        };
      });
      saveObjectsToStorage(nextObjects);
      return { objects: nextObjects };
    });
  },

  duplicateObject: (id) => {
    const target = get().objects.find((o) => o.id === id);
    if (!target) return null;

    const newId = `obj-custom-${Date.now()}`;
    const duplicated: VillageCustomObject = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      transform: {
        ...target.transform,
        position: [
          target.transform.position[0] + 1.2,
          target.transform.position[1],
          target.transform.position[2] + 1.2,
        ],
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((state) => {
      const nextObjects = [...state.objects, duplicated];
      saveObjectsToStorage(nextObjects);
      return {
        objects: nextObjects,
        selectedObjectId: newId,
      };
    });

    return duplicated;
  },

  deleteObject: (id) => {
    const target = get().objects.find((o) => o.id === id);
    if (target && target.modelId && target.modelId.startsWith('model-user-')) {
      const others = get().objects.filter((o) => o.id !== id && o.modelId === target.modelId);
      if (others.length === 0) {
        deleteModelBlob(target.modelId).catch(() => {});
      }
    }

    set((state) => {
      const nextObjects = state.objects.filter((o) => o.id !== id);
      saveObjectsToStorage(nextObjects);
      return {
        objects: nextObjects,
        selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
      };
    });
  },

  toggleObjectVisibility: (id) => {
    set((state) => {
      const nextObjects = state.objects.map((obj) => {
        if (obj.id !== id) return obj;
        return {
          ...obj,
          visible: !obj.visible,
          updatedAt: Date.now(),
        };
      });
      saveObjectsToStorage(nextObjects);
      return { objects: nextObjects };
    });
  },

  resetObjectTransform: (id) => {
    set((state) => {
      const nextObjects = state.objects.map((obj) => {
        if (obj.id !== id) return obj;
        return {
          ...obj,
          transform: {
            position: [obj.transform.position[0], 0, obj.transform.position[2]] as [number, number, number],
            rotation: [0, 0, 0] as [number, number, number],
            scale: [1, 1, 1] as [number, number, number],
            uniformScale: true,
          },
          updatedAt: Date.now(),
        };
      });
      saveObjectsToStorage(nextObjects);
      return { objects: nextObjects };
    });
  },

  resetAllObjects: () => {
    set(() => {
      saveObjectsToStorage([]);
      return { objects: [], selectedObjectId: null };
    });
  },

  snapObjectToGround: (id, groundY = 0) => {
    set((state) => {
      const nextObjects = state.objects.map((obj) => {
        if (obj.id !== id) return obj;
        return {
          ...obj,
          transform: {
            ...obj.transform,
            position: [obj.transform.position[0], groundY, obj.transform.position[2]] as [number, number, number],
          },
          updatedAt: Date.now(),
        };
      });
      saveObjectsToStorage(nextObjects);
      return { objects: nextObjects };
    });
  },
}));
