import { create } from 'zustand';
import { SiteContent, INITIAL_SITE_CONTENT } from '../data/siteContent';
import { Motif, DyeingStep, ProcessStage, WeaverProfile, Artifact, Model3D, DyeingImageRecord, DocumentaryVideo } from '../types';
import { INITIAL_MOTIFS } from '../data/motifs';
import { INITIAL_DYEING_STEPS } from '../data/dyeing';
import { INITIAL_DYEING_IMAGES } from '../data/dyeingImages';
import { INITIAL_PROCESSES } from '../data/processes';
import { INITIAL_WEAVERS } from '../data/weavers';
import { INITIAL_ARTIFACTS } from '../data/artifacts';
import { INITIAL_3D_MODELS } from '../data/models';
import { INITIAL_DOCUMENTARIES } from '../data/documentaries';
import { deleteModelBlob } from '../services/modelStorage';
import {
  saveContentPayload,
  loadContentPayload,
  getInitialSynchronousContent,
} from '../services/contentStorage';

export type EditorSectionKey =
  | 'hero'
  | 'about'
  | 'motifs'
  | 'dyeing'
  | 'weavers'
  | 'processes'
  | 'artifacts'
  | 'models'
  | 'export';

interface ContentState {
  siteContent: SiteContent;
  motifs: Motif[];
  dyeingSteps: DyeingStep[];
  dyeingImages: DyeingImageRecord[];
  processes: ProcessStage[];
  weavers: WeaverProfile[];
  documentaries: DocumentaryVideo[];
  artifacts: Artifact[];
  models: Model3D[];
  customImages: Record<string, string>; // key -> base64 data URL or external URL

  // Persistence & UI State
  isEditModeActive: boolean;
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError: string | null;
  hasUnsavedChanges: boolean;
  isHydrated: boolean;

  // Actions
  persistAll: () => Promise<boolean>;
  hydrateAsync: () => Promise<void>;

  updateSiteContent: <K extends keyof SiteContent>(section: K, updates: Partial<SiteContent[K]>) => void;
  setCustomImage: (key: string, dataUrl: string) => void;
  removeCustomImage: (key: string) => void;
  getImage: (key: string) => string | undefined;

  // Granular update actions
  updateMotif: (id: string, updates: Partial<Motif>) => void;
  addMotif: (motif: Motif) => void;
  deleteMotif: (id: string) => void;

  updateDyeingStep: (id: string, updates: Partial<DyeingStep>) => void;
  setDyeingSteps: (steps: DyeingStep[]) => void;
  addDyeingStep: (step: DyeingStep) => void;
  deleteDyeingStep: (id: string) => void;
  reorderDyeingSteps: (steps: DyeingStep[]) => void;
  saveDyeingProcess: (updates: {
    heading?: string;
    highlightWord?: string;
    subtitle?: string;
    description?: string;
    steps: DyeingStep[];
    metadata?: Partial<ContentState['siteContent']['dyeingSection']>;
  }) => void;

  // Dedicated Dyeing Image Registry Actions
  updateDyeingImage: (id: string, updates: Partial<DyeingImageRecord>) => void;
  addDyeingImage: (image: DyeingImageRecord) => void;
  deleteDyeingImage: (id: string) => void;
  reorderDyeingImages: (images: DyeingImageRecord[]) => void;
  toggleDyeingImagePublished: (id: string) => void;
  resetDyeingImages: () => void;
  updateProcess: (id: string, updates: Partial<ProcessStage>) => void;
  updateWeaver: (id: string, updates: Partial<WeaverProfile>) => void;
  addWeaver: (weaver: WeaverProfile) => void;
  deleteWeaver: (id: string) => void;

  // Documentary Archive Actions
  addDocumentary: (doc: DocumentaryVideo) => void;
  updateDocumentary: (id: string, updates: Partial<DocumentaryVideo>) => void;
  deleteDocumentary: (id: string) => void;
  toggleDocumentaryPublished: (id: string) => void;
  toggleDocumentaryFeatured: (id: string) => void;

  updateArtifact: (id: string, updates: Partial<Artifact>) => void;
  addArtifact: (artifact: Artifact) => void;
  deleteArtifact: (id: string) => void;

  // 3D Model Registry Actions
  addModel: (model: Model3D) => void;
  updateModel: (id: string, updates: Partial<Model3D>) => void;
  deleteModel: (id: string) => void;
  assignModelToArtifact: (modelId: string, artifactId: string) => void;
  getModelById: (id: string) => Model3D | undefined;
  getModelByArtifactId: (artifactId: string) => Model3D | undefined;

  resetToDefaults: () => void;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;
}

const synchronousBackup = getInitialSynchronousContent();

const mergeSavedSiteContent = (savedContent?: SiteContent): SiteContent => {
  if (!savedContent) return INITIAL_SITE_CONTENT;
  return {
    ...INITIAL_SITE_CONTENT,
    ...savedContent,
    weaverSection: {
      ...INITIAL_SITE_CONTENT.weaverSection,
      ...(savedContent.weaverSection || {}),
    },
    hero: {
      ...INITIAL_SITE_CONTENT.hero,
      ...(savedContent.hero || {}),
    },
    about: {
      ...INITIAL_SITE_CONTENT.about,
      ...(savedContent.about || {}),
    },
    agorSection: {
      ...INITIAL_SITE_CONTENT.agorSection,
      ...(savedContent.agorSection || {}),
    },
    dyeingSection: {
      ...INITIAL_SITE_CONTENT.dyeingSection,
      ...(savedContent.dyeingSection || {}),
    },
    processSection: {
      ...INITIAL_SITE_CONTENT.processSection,
      ...(savedContent.processSection || {}),
    },
  };
};

const mergeSavedMotifs = (savedMotifs?: Motif[]): Motif[] => {
  if (!savedMotifs || !Array.isArray(savedMotifs)) return INITIAL_MOTIFS;
  return INITIAL_MOTIFS.map((def) => {
    const found = savedMotifs.find((m) => m.id === def.id);
    if (!found) return def;
    return {
      ...def,
      ...found,
      image: def.image,
      imageUrl: def.imageUrl,
      meaning: found.meaning || def.meaning,
      description: found.description || found.culturalSignificance || def.description,
      symbolism: found.symbolism || def.symbolism,
      wovenIn: found.wovenIn || found.textileAssociation || def.wovenIn,
    };
  });
};

const mergeSavedDyeingSteps = (savedSteps?: DyeingStep[]): DyeingStep[] => {
  if (!savedSteps || !Array.isArray(savedSteps) || savedSteps.length !== 5) {
    return INITIAL_DYEING_STEPS;
  }
  if (savedSteps.some((s) => s.id.startsWith('stage-raw-materials') || s.id === 'stage-yarn' || s.id === 'stage-weaving')) {
    return INITIAL_DYEING_STEPS;
  }
  return savedSteps;
};

const mergeSavedWeavers = (savedWeavers?: WeaverProfile[]): WeaverProfile[] => {
  if (!savedWeavers || !Array.isArray(savedWeavers) || savedWeavers.length === 0) return INITIAL_WEAVERS;
  
  // If previously saved cache only had 1 weaver (e.g. from single-weaver version), bring in the second default weaver as well
  const baseSaved = [...savedWeavers];
  if (baseSaved.length === 1 && baseSaved[0].id === 'anjali-swargiary' && INITIAL_WEAVERS.length > 1) {
    baseSaved.push(INITIAL_WEAVERS[1]);
  }

  return baseSaved.map((found) => {
    const def = INITIAL_WEAVERS.find((w) => w.id === found.id);
    if (!def) return found;
    return {
      ...def,
      ...found,
      location: found.location ?? def.location,
      district: found.district ?? def.district,
      specialization: found.specialization ?? def.specialization,
      traditionalKnowledge: found.traditionalKnowledge ?? def.traditionalKnowledge,
      interviewQuote: found.interviewQuote ?? def.interviewQuote,
      experience: found.experience ?? def.experience,
      bodoTitle: found.bodoTitle ?? def.bodoTitle,
      name: found.name ?? def.name,
      videoData: {
        ...(def.videoData || {}),
        ...(found.videoData || {}),
      },
      masterpieces: Array.isArray(found.masterpieces) && found.masterpieces.length > 0
        ? found.masterpieces
        : def.masterpieces,
    };
  });
};

const mergeSavedModels = (savedModels?: Model3D[]): Model3D[] => {
  if (!savedModels || !Array.isArray(savedModels)) return INITIAL_3D_MODELS;
  const map = new Map<string, Model3D>();
  INITIAL_3D_MODELS.forEach((m) => map.set(m.id, m));
  savedModels.forEach((m) => map.set(m.id, m));
  return Array.from(map.values());
};

const mergeSavedDyeingImages = (savedImages?: DyeingImageRecord[]): DyeingImageRecord[] => {
  if (!savedImages || !Array.isArray(savedImages) || savedImages.length === 0) return INITIAL_DYEING_IMAGES;
  const map = new Map<string, DyeingImageRecord>();
  INITIAL_DYEING_IMAGES.forEach((img) => map.set(img.id, img));
  savedImages.forEach((img) => {
    const existing = map.get(img.id);
    map.set(img.id, existing ? { ...existing, ...img } : img);
  });
  return Array.from(map.values()).sort((a, b) => a.order - b.order);
};

const mergeSavedDocumentaries = (savedDocs?: DocumentaryVideo[]): DocumentaryVideo[] => {
  if (!savedDocs || !Array.isArray(savedDocs) || savedDocs.length === 0) return INITIAL_DOCUMENTARIES;
  const map = new Map<string, DocumentaryVideo>();
  INITIAL_DOCUMENTARIES.forEach((doc) => map.set(doc.id, doc));
  savedDocs.forEach((doc) => {
    const existing = map.get(doc.id);
    map.set(doc.id, existing ? { ...existing, ...doc } : doc);
  });
  return Array.from(map.values());
};

export const useContentStore = create<ContentState>((set, get) => ({
  siteContent: mergeSavedSiteContent(synchronousBackup?.siteContent),
  motifs: mergeSavedMotifs(synchronousBackup?.motifs),
  dyeingSteps: mergeSavedDyeingSteps(synchronousBackup?.dyeingSteps),
  dyeingImages: mergeSavedDyeingImages(synchronousBackup?.dyeingImages),
  processes: synchronousBackup?.processes || INITIAL_PROCESSES,
  weavers: mergeSavedWeavers(synchronousBackup?.weavers),
  documentaries: mergeSavedDocumentaries((synchronousBackup as any)?.documentaries),
  artifacts: synchronousBackup?.artifacts || INITIAL_ARTIFACTS,
  models: mergeSavedModels(synchronousBackup?.models),
  customImages: synchronousBackup?.customImages || {},

  isEditModeActive: false,
  isSaving: false,
  saveStatus: 'idle',
  saveError: null,
  hasUnsavedChanges: false,
  isHydrated: false,

  hydrateAsync: async () => {
    try {
      const persisted = await loadContentPayload();
      if (persisted) {
        set((state) => ({
          siteContent: mergeSavedSiteContent(persisted.siteContent),
          motifs: mergeSavedMotifs(persisted.motifs),
          dyeingSteps: mergeSavedDyeingSteps(persisted.dyeingSteps),
          dyeingImages: mergeSavedDyeingImages(persisted.dyeingImages),
          processes: persisted.processes || state.processes,
          weavers: mergeSavedWeavers(persisted.weavers),
          documentaries: mergeSavedDocumentaries(persisted.documentaries),
          artifacts: persisted.artifacts || state.artifacts,
          models: mergeSavedModels(persisted.models),
          customImages: { ...state.customImages, ...(persisted.customImages || {}) },
          isHydrated: true,
        }));
      } else {
        set({ isHydrated: true });
      }
    } catch (err) {
      console.warn('[ContentStore] Asynchronous hydration notice:', err);
      set({ isHydrated: true });
    }
  },

  persistAll: async () => {
    const s = get();
    set({ isSaving: true, saveStatus: 'saving', saveError: null });
    try {
      const ok = await saveContentPayload({
        siteContent: s.siteContent,
        weavers: s.weavers,
        documentaries: s.documentaries,
        artifacts: s.artifacts,
        models: s.models,
        motifs: s.motifs,
        dyeingSteps: s.dyeingSteps,
        dyeingImages: s.dyeingImages,
        processes: s.processes,
        customImages: s.customImages,
      });
      set({
        isSaving: false,
        saveStatus: 'saved',
        hasUnsavedChanges: false,
        saveError: ok ? null : 'Saved to local text cache (IndexedDB notice).',
      });
      return true;
    } catch (err: any) {
      set({ isSaving: false, saveStatus: 'error', saveError: err?.message || 'Save failed' });
      return false;
    }
  },


  updateSiteContent: (section, updates) => {
    set((state) => {
      const next = {
        ...state.siteContent,
        [section]: {
          ...state.siteContent[section],
          ...updates,
        },
      };
      saveToStorage({ ...state, siteContent: next });
      return { siteContent: next };
    });
  },

  setCustomImage: (key, dataUrl) => {
    set((state) => {
      const nextImages = {
        ...state.customImages,
        [key]: dataUrl,
      };
      saveToStorage({ ...state, customImages: nextImages });
      return { customImages: nextImages };
    });
  },

  removeCustomImage: (key) => {
    set((state) => {
      const nextImages = { ...state.customImages };
      delete nextImages[key];
      saveToStorage({ ...state, customImages: nextImages });
      return { customImages: nextImages };
    });
  },

  getImage: (key) => {
    return get().customImages[key];
  },

  updateMotif: (id, updates) => {
    set((state) => {
      const nextMotifs = state.motifs.map((m) => (m.id === id ? { ...m, ...updates } : m));
      saveToStorage({ ...state, motifs: nextMotifs });
      return { motifs: nextMotifs };
    });
  },

  addMotif: (motif) => {
    set((state) => {
      const nextMotifs = [...state.motifs, motif];
      saveToStorage({ ...state, motifs: nextMotifs });
      return { motifs: nextMotifs };
    });
  },

  deleteMotif: (id) => {
    set((state) => {
      const nextMotifs = state.motifs.filter((m) => m.id !== id);
      saveToStorage({ ...state, motifs: nextMotifs });
      return { motifs: nextMotifs };
    });
  },

  updateDyeingStep: (id, updates) => {
    set((state) => {
      const next = state.dyeingSteps.map((d) => (d.id === id ? { ...d, ...updates } : d));
      saveToStorage({ ...state, dyeingSteps: next });
      return { dyeingSteps: next };
    });
  },

  setDyeingSteps: (steps) => {
    set((state) => {
      const normalized = steps.map((s, idx) => ({
        ...s,
        order: idx + 1,
        stage: `Stage ${idx + 1} of ${steps.length}`,
      }));
      saveToStorage({ ...state, dyeingSteps: normalized });
      return { dyeingSteps: normalized };
    });
  },

  addDyeingStep: (step) => {
    set((state) => {
      const current = state.dyeingSteps;
      const newStep = {
        ...step,
        order: current.length + 1,
        stage: `Stage ${current.length + 1} of ${current.length + 1}`,
      };
      const next = [...current, newStep].map((s, idx, arr) => ({
        ...s,
        order: idx + 1,
        stage: `Stage ${idx + 1} of ${arr.length}`,
      }));
      saveToStorage({ ...state, dyeingSteps: next });
      return { dyeingSteps: next };
    });
  },

  deleteDyeingStep: (id) => {
    set((state) => {
      const filtered = state.dyeingSteps.filter((s) => s.id !== id);
      const next = filtered.map((s, idx, arr) => ({
        ...s,
        order: idx + 1,
        stage: `Stage ${idx + 1} of ${arr.length}`,
      }));
      saveToStorage({ ...state, dyeingSteps: next });
      return { dyeingSteps: next };
    });
  },

  reorderDyeingSteps: (steps) => {
    set((state) => {
      const next = steps.map((s, idx, arr) => ({
        ...s,
        order: idx + 1,
        stage: `Stage ${idx + 1} of ${arr.length}`,
      }));
      saveToStorage({ ...state, dyeingSteps: next });
      return { dyeingSteps: next };
    });
  },

  saveDyeingProcess: ({ heading, highlightWord, subtitle, description, steps, metadata }) => {
    set((state) => {
      const normalizedSteps = steps.map((s, idx, arr) => ({
        ...s,
        order: idx + 1,
        stage: `Stage ${idx + 1} of ${arr.length}`,
      }));
      const updatedDyeingSection = {
        ...state.siteContent.dyeingSection,
        ...(heading ? { heading } : {}),
        ...(highlightWord ? { highlightWord } : {}),
        ...(subtitle ? { subtitle } : {}),
        ...(description ? { description } : {}),
        ...(metadata || {}),
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      const updatedSiteContent = {
        ...state.siteContent,
        dyeingSection: updatedDyeingSection,
      };
      const nextState = {
        ...state,
        siteContent: updatedSiteContent,
        dyeingSteps: normalizedSteps,
      };
      saveToStorage(nextState);
      return {
        siteContent: updatedSiteContent,
        dyeingSteps: normalizedSteps,
      };
    });
  },

  updateDyeingImage: (id, updates) => {
    set((state) => {
      const next = state.dyeingImages.map((img) => (img.id === id ? { ...img, ...updates } : img));
      saveToStorage({ ...state, dyeingImages: next });
      return { dyeingImages: next };
    });
  },

  addDyeingImage: (image) => {
    set((state) => {
      const next = [...state.dyeingImages, image];
      saveToStorage({ ...state, dyeingImages: next });
      return { dyeingImages: next };
    });
  },

  deleteDyeingImage: (id) => {
    set((state) => {
      const next = state.dyeingImages.filter((img) => img.id !== id);
      saveToStorage({ ...state, dyeingImages: next });
      return { dyeingImages: next };
    });
  },

  reorderDyeingImages: (images) => {
    set((state) => {
      const next = images.map((img, idx) => ({ ...img, order: idx + 1 }));
      saveToStorage({ ...state, dyeingImages: next });
      return { dyeingImages: next };
    });
  },

  toggleDyeingImagePublished: (id) => {
    set((state) => {
      const next = state.dyeingImages.map((img) =>
        img.id === id ? { ...img, published: !img.published } : img
      );
      saveToStorage({ ...state, dyeingImages: next });
      return { dyeingImages: next };
    });
  },

  resetDyeingImages: () => {
    set((state) => {
      saveToStorage({ ...state, dyeingImages: INITIAL_DYEING_IMAGES });
      return { dyeingImages: INITIAL_DYEING_IMAGES };
    });
  },

  updateProcess: (id, updates) => {
    set((state) => {
      const next = state.processes.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveToStorage({ ...state, processes: next });
      return { processes: next };
    });
  },

  updateWeaver: (id, updates) => {
    set((state) => {
      const next = state.weavers.map((w) => (w.id === id ? { ...w, ...updates } : w));
      saveToStorage({ ...state, weavers: next });
      return { weavers: next };
    });
  },

  addWeaver: (weaver) => {
    set((state) => {
      const existingIdx = state.weavers.findIndex((w) => w.id === weaver.id);
      let next: WeaverProfile[];
      if (existingIdx >= 0) {
        next = state.weavers.map((w, idx) => (idx === existingIdx ? { ...w, ...weaver } : w));
      } else {
        next = [...state.weavers, weaver];
      }
      saveToStorage({ ...state, weavers: next });
      return { weavers: next };
    });
  },

  deleteWeaver: (id) => {
    set((state) => {
      if (state.weavers.length <= 1) return state; // Preserve at least 1 weaver
      const next = state.weavers.filter((w) => w.id !== id);
      saveToStorage({ ...state, weavers: next });
      return { weavers: next };
    });
  },

  // Documentary Actions
  addDocumentary: (doc) => {
    set((state) => {
      const next = [doc, ...state.documentaries];
      saveToStorage({ ...state, documentaries: next });
      return { documentaries: next };
    });
  },

  updateDocumentary: (id, updates) => {
    set((state) => {
      const next = state.documentaries.map((d) => (d.id === id ? { ...d, ...updates } : d));
      saveToStorage({ ...state, documentaries: next });
      return { documentaries: next };
    });
  },

  deleteDocumentary: (id) => {
    set((state) => {
      const next = state.documentaries.filter((d) => d.id !== id);
      saveToStorage({ ...state, documentaries: next });
      return { documentaries: next };
    });
  },

  toggleDocumentaryPublished: (id) => {
    set((state) => {
      const next = state.documentaries.map((d) =>
        d.id === id ? { ...d, published: !d.published } : d
      );
      saveToStorage({ ...state, documentaries: next });
      return { documentaries: next };
    });
  },

  toggleDocumentaryFeatured: (id) => {
    set((state) => {
      const next = state.documentaries.map((d) =>
        d.id === id ? { ...d, featured: !d.featured } : d
      );
      saveToStorage({ ...state, documentaries: next });
      return { documentaries: next };
    });
  },

  updateArtifact: (id, updates) => {
    set((state) => {
      const next = state.artifacts.map((a) => (a.id === id ? { ...a, ...updates } : a));
      saveToStorage({ ...state, artifacts: next });
      return { artifacts: next };
    });
  },

  addArtifact: (artifact) => {
    set((state) => {
      const next = [...state.artifacts, artifact];
      saveToStorage({ ...state, artifacts: next });
      return { artifacts: next };
    });
  },

  deleteArtifact: (id) => {
    set((state) => {
      const next = state.artifacts.filter((a) => a.id !== id);
      saveToStorage({ ...state, artifacts: next });
      return { artifacts: next };
    });
  },

  // 3D Model Registry Actions
  addModel: (model) => {
    set((state) => {
      // Remove any existing model with same ID
      const filtered = state.models.filter((m) => m.id !== model.id);
      const nextModels = [...filtered, model];

      // If associated with artifact, update artifact.modelUrl / modelId
      let nextArtifacts = state.artifacts;
      if (model.artifactId) {
        nextArtifacts = state.artifacts.map((a) =>
          a.id === model.artifactId
            ? { ...a, modelId: model.id, modelUrl: model.url, arAvailable: model.arEnabled }
            : a
        );
      }

      saveToStorage({ ...state, models: nextModels, artifacts: nextArtifacts });
      return { models: nextModels, artifacts: nextArtifacts };
    });
  },

  updateModel: (id, updates) => {
    set((state) => {
      const nextModels = state.models.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      );

      const targetModel = nextModels.find((m) => m.id === id);
      let nextArtifacts = state.artifacts;
      if (targetModel && targetModel.artifactId) {
        nextArtifacts = state.artifacts.map((a) =>
          a.id === targetModel.artifactId
            ? {
                ...a,
                modelId: targetModel.id,
                modelUrl: targetModel.url,
                arAvailable: targetModel.arEnabled,
                physicalDimensions: targetModel.physicalDimensions,
              }
            : a
        );
      }

      saveToStorage({ ...state, models: nextModels, artifacts: nextArtifacts });
      return { models: nextModels, artifacts: nextArtifacts };
    });
  },

  deleteModel: (id) => {
    deleteModelBlob(id).catch(console.warn);
    set((state) => {
      const target = state.models.find((m) => m.id === id);
      const nextModels = state.models.filter((m) => m.id !== id);

      let nextArtifacts = state.artifacts;
      if (target?.artifactId) {
        nextArtifacts = state.artifacts.map((a) =>
          a.id === target.artifactId
            ? { ...a, modelId: undefined, modelUrl: undefined, arAvailable: false }
            : a
        );
      }

      saveToStorage({ ...state, models: nextModels, artifacts: nextArtifacts });
      return { models: nextModels, artifacts: nextArtifacts };
    });
  },

  assignModelToArtifact: (modelId, artifactId) => {
    set((state) => {
      const nextModels = state.models.map((m) =>
        m.id === modelId ? { ...m, artifactId } : m
      );

      const targetModel = nextModels.find((m) => m.id === modelId);
      const nextArtifacts = state.artifacts.map((a) => {
        if (a.id === artifactId && targetModel) {
          return {
            ...a,
            modelId: targetModel.id,
            modelUrl: targetModel.url,
            arAvailable: targetModel.arEnabled,
            physicalDimensions: targetModel.physicalDimensions,
          };
        }
        return a;
      });

      saveToStorage({ ...state, models: nextModels, artifacts: nextArtifacts });
      return { models: nextModels, artifacts: nextArtifacts };
    });
  },

  getModelById: (id) => {
    return get().models.find((m) => m.id === id);
  },

  getModelByArtifactId: (artifactId) => {
    return get().models.find((m) => m.artifactId === artifactId);
  },

  resetToDefaults: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bodo_vr_museum_text_cache_v3');
      localStorage.removeItem('bodo_vr_museum_content_v2');
    }
    set({
      siteContent: INITIAL_SITE_CONTENT,
      motifs: INITIAL_MOTIFS,
      dyeingSteps: INITIAL_DYEING_STEPS,
      dyeingImages: INITIAL_DYEING_IMAGES,
      processes: INITIAL_PROCESSES,
      weavers: INITIAL_WEAVERS,
      documentaries: INITIAL_DOCUMENTARIES,
      artifacts: INITIAL_ARTIFACTS,
      models: INITIAL_3D_MODELS,
      customImages: {},
    });
  },

  exportJSON: () => {
    const data = {
      siteContent: get().siteContent,
      motifs: get().motifs,
      dyeingSteps: get().dyeingSteps,
      dyeingImages: get().dyeingImages,
      processes: get().processes,
      weavers: get().weavers,
      documentaries: get().documentaries,
      artifacts: get().artifacts,
      models: get().models,
      customImages: get().customImages,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importJSON: (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      set({
        siteContent: parsed.siteContent || INITIAL_SITE_CONTENT,
        motifs: parsed.motifs || INITIAL_MOTIFS,
        dyeingSteps: parsed.dyeingSteps || INITIAL_DYEING_STEPS,
        dyeingImages: parsed.dyeingImages || INITIAL_DYEING_IMAGES,
        processes: parsed.processes || INITIAL_PROCESSES,
        weavers: parsed.weavers || INITIAL_WEAVERS,
        documentaries: parsed.documentaries || INITIAL_DOCUMENTARIES,
        artifacts: parsed.artifacts || INITIAL_ARTIFACTS,
        models: parsed.models || INITIAL_3D_MODELS,
        customImages: parsed.customImages || {},
      });
      saveToStorage(get());
      return true;
    } catch (e) {
      console.error('Failed to import JSON data', e);
      return false;
    }
  },
}));

function saveToStorage(state: Partial<ContentState>) {
  if (typeof window === 'undefined') return;

  // Asynchronously commit payload to IndexedDB & synced text cache
  saveContentPayload({
    siteContent: state.siteContent || INITIAL_SITE_CONTENT,
    weavers: state.weavers || INITIAL_WEAVERS,
    documentaries: state.documentaries || INITIAL_DOCUMENTARIES,
    artifacts: state.artifacts || INITIAL_ARTIFACTS,
    models: state.models || INITIAL_3D_MODELS,
    motifs: state.motifs || INITIAL_MOTIFS,
    dyeingSteps: state.dyeingSteps || INITIAL_DYEING_STEPS,
    dyeingImages: state.dyeingImages || INITIAL_DYEING_IMAGES,
    processes: state.processes || INITIAL_PROCESSES,
    customImages: state.customImages || {},
  }).catch((err) => {
    console.warn('[ContentStore] Background persist notice:', err);
  });
}

// Automatically initiate asynchronous hydration from authoritative IndexedDB
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useContentStore.getState().hydrateAsync().catch((err) => {
      console.warn('[ContentStore] Initial hydration error:', err);
    });
  }, 10);
}
