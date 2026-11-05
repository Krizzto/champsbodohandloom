import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { resolveModelUrl } from '../../../services/modelStorage';
import { VillageAssetSlotConfig, useVillageAssetStore } from '../../../store/villageAssetStore';

export interface VillageSlotContainer {
  slotId: string;
  rootGroup: THREE.Group;
  proceduralGroup: THREE.Group;
  customGroup: THREE.Group;
  currentLoadedModel?: THREE.Object3D;
  isLoading?: boolean;
}

/**
 * Disposes all geometries, materials, and textures in an Object3D hierarchy
 */
export function disposeHierarchy(obj: THREE.Object3D) {
  obj.traverse((child: any) => {
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((mat: any) => {
          if (mat.map) mat.map.dispose();
          mat.dispose();
        });
      } else {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
    }
  });
}

export class VillageAssetSystem {
  private slots = new Map<string, VillageSlotContainer>();
  private gltfLoader = new GLTFLoader();
  private unsubscribeStore?: () => void;

  /**
   * Register a slot container with its procedural element
   */
  public registerSlot(
    slotId: string,
    parentGroup: THREE.Group,
    buildProcedural: (proceduralGroup: THREE.Group) => void,
    defaultPosition: [number, number, number] = [0, 0, 0]
  ): VillageSlotContainer {
    const rootGroup = new THREE.Group();
    rootGroup.name = `slot_root_${slotId}`;
    rootGroup.position.set(defaultPosition[0], defaultPosition[1], defaultPosition[2]);

    const proceduralGroup = new THREE.Group();
    proceduralGroup.name = `slot_procedural_${slotId}`;
    buildProcedural(proceduralGroup);
    rootGroup.add(proceduralGroup);

    const customGroup = new THREE.Group();
    customGroup.name = `slot_custom_${slotId}`;
    rootGroup.add(customGroup);

    parentGroup.add(rootGroup);

    const container: VillageSlotContainer = {
      slotId,
      rootGroup,
      proceduralGroup,
      customGroup,
    };

    this.slots.set(slotId, container);
    return container;
  }

  /**
   * Initialize all registered slots with current store configs
   */
  public initialize() {
    const assetConfigs = useVillageAssetStore.getState().assets;
    Object.values(assetConfigs).forEach((config) => {
      this.applySlotConfig(config);
    });

    // Subscribe to store updates for real-time 3D canvas syncing
    this.unsubscribeStore = useVillageAssetStore.subscribe((state, prevState) => {
      Object.keys(state.assets).forEach((slotId) => {
        const curConfig = state.assets[slotId];
        const prevConfig = prevState.assets[slotId];
        if (curConfig !== prevConfig) {
          this.applySlotConfig(curConfig);
        }
      });
    });
  }

  /**
   * Apply slot configuration (model change, transforms, enable/disable)
   */
  public async applySlotConfig(config: VillageAssetSlotConfig) {
    const container = this.slots.get(config.id);
    if (!container) return;

    // 1. Visibility
    container.rootGroup.visible = config.enabled;
    if (!config.enabled) return;

    // 2. Custom Model vs Procedural
    if (config.isCustom && config.customModelUrl) {
      // Hide procedural fallback
      container.proceduralGroup.visible = false;
      container.customGroup.visible = true;

      // Apply transform to customGroup
      container.customGroup.position.set(
        config.transform.position[0],
        config.transform.position[1],
        config.transform.position[2]
      );
      container.customGroup.rotation.set(
        THREE.MathUtils.degToRad(config.transform.rotation[0]),
        THREE.MathUtils.degToRad(config.transform.rotation[1]),
        THREE.MathUtils.degToRad(config.transform.rotation[2])
      );
      container.customGroup.scale.set(
        config.transform.scale[0],
        config.transform.scale[1],
        config.transform.scale[2]
      );

      // Check if we already loaded this specific model
      const currentUrlTag = (container.customGroup as any).__loadedUrl;
      if (currentUrlTag === config.customModelUrl) {
        return; // already loaded, transform updated
      }

      // Load new custom model
      container.isLoading = true;
      try {
        const resolvedUrl = await resolveModelUrl(config.customModelUrl);
        if (!resolvedUrl) {
          console.warn(`[VillageAssetSystem] Could not resolve URL for slot ${config.id}`);
          container.proceduralGroup.visible = true;
          return;
        }

        // Clean up previous model
        while (container.customGroup.children.length > 0) {
          const prev = container.customGroup.children[0];
          container.customGroup.remove(prev);
          disposeHierarchy(prev);
        }

        this.gltfLoader.load(
          resolvedUrl,
          (gltf) => {
            const model = gltf.scene;

            // 1. Calculate dimensions and normalize scale
            const initialBbox = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            initialBbox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);

            // Scale normalization if model is exported in mm or off-scale
            if (config.category === 'TOOLS' && (maxDim > 2.5 || maxDim < 0.05)) {
              const targetScale = 0.65 / (maxDim || 1);
              model.scale.multiplyScalar(targetScale);
            } else if (config.category === 'TEXTILES' && (maxDim > 5.0 || maxDim < 0.1)) {
              const targetScale = 1.5 / (maxDim || 1);
              model.scale.multiplyScalar(targetScale);
            } else if (maxDim > 50) {
              const targetScale = 2.0 / maxDim;
              model.scale.multiplyScalar(targetScale);
            }

            // 2. Ground base at y=0 and center horizontally in the slot
            const finalBbox = new THREE.Box3().setFromObject(model);
            const finalCenter = finalBbox.getCenter(new THREE.Vector3());
            model.position.x -= finalCenter.x;
            model.position.z -= finalCenter.z;
            model.position.y -= finalBbox.min.y;

            // 3. Materials, shadows, and interactive raycast data
            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                (child as any).hotspotData = {
                  id: config.id,
                  name: config.customModelName || config.name,
                  zone: config.category,
                  position: config.defaultPosition,
                  info: config.description,
                  artifact: {
                    id: config.id,
                    name: config.customModelName || config.name,
                    category: config.category,
                    description: config.description,
                    modelUrl: config.customModelUrl,
                    model: config.customModelUrl,
                    origin: 'Bodoland Territorial Region, Assam',
                    significance: config.description,
                    arAvailable: true,
                  },
                };
              }
            });

            container.customGroup.add(model);
            container.currentLoadedModel = model;
            (container.customGroup as any).__loadedUrl = config.customModelUrl;
            container.isLoading = false;
          },
          undefined,
          (err) => {
            console.error(`[VillageAssetSystem] Failed to load 3D model for slot ${config.id}:`, err);
            // Fallback to procedural
            container.proceduralGroup.visible = true;
            container.isLoading = false;
          }
        );
      } catch (err) {
        console.error(`[VillageAssetSystem] Error resolving model for ${config.id}:`, err);
        container.proceduralGroup.visible = true;
        container.isLoading = false;
      }
    } else {
      // Revert to Procedural Default
      container.proceduralGroup.visible = true;
      container.customGroup.visible = false;

      // Clean up any loaded custom model
      while (container.customGroup.children.length > 0) {
        const prev = container.customGroup.children[0];
        container.customGroup.remove(prev);
        disposeHierarchy(prev);
      }
      container.currentLoadedModel = undefined;
      (container.customGroup as any).__loadedUrl = undefined;
    }
  }

  /**
   * Reset a single slot
   */
  public resetSlot(slotId: string) {
    useVillageAssetStore.getState().resetSlotToDefault(slotId);
  }

  /**
   * Reset all slots to procedural defaults
   */
  public resetAll() {
    useVillageAssetStore.getState().resetAllToDefaults();
  }

  /**
   * Cleanup resources on unmount
   */
  public cleanup() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
    this.slots.forEach((container) => {
      while (container.customGroup.children.length > 0) {
        const child = container.customGroup.children[0];
        container.customGroup.remove(child);
        disposeHierarchy(child);
      }
      while (container.proceduralGroup.children.length > 0) {
        const child = container.proceduralGroup.children[0];
        container.proceduralGroup.remove(child);
        disposeHierarchy(child);
      }
    });
    this.slots.clear();
  }
}
