import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Box,
  Compass,
  Volume2,
  VolumeX,
  Plus,
  Upload,
  Check,
  AlertTriangle,
  Trash2,
  Sliders,
  RotateCcw,
  Move,
  Home,
  Layers,
  Eye,
  Info,
} from 'lucide-react';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { useMuseumStore } from '../../store/museumStore';
import { useContentStore } from '../../store/contentStore';
import { Artifact, Model3D } from '../../types';
import { validate3DFile, saveModelBlob, resolveModelUrl } from '../../services/modelStorage';
import { buildVillageEnvironment, VILLAGE_AREAS, VillageArea } from './village/VillageBuilder';
import { useVillageAssetStore } from '../../store/villageAssetStore';
import { VillageAssetManagerModal } from './village/VillageAssetManagerModal';
import {
  useVillageObjectStore,
  VillageCustomObject,
  TransformGizmoMode,
} from '../../store/villageObjectStore';
import { Insert3DObjectModal } from './village/Insert3DObjectModal';
import { ObjectPropertiesPanel } from './village/ObjectPropertiesPanel';
import { VillageObjectListDrawer } from './village/VillageObjectListDrawer';

interface VillageHotspot {
  id: string;
  name: string;
  zone: string;
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  artifact: Artifact;
  info: string;
}

function createProceduralArtifactMesh(artifactId: string, hs: VillageHotspot): THREE.Group {
  const g = new THREE.Group();
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.7 });
  const bambooMat = new THREE.MeshStandardMaterial({ color: 0xc4a362, roughness: 0.65 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.8 });
  const silkMat = new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.5 });
  const redMat = new THREE.MeshStandardMaterial({ color: 0x9e2424, roughness: 0.6 });

  if (artifactId.includes('maku')) {
    // Sculpted bamboo boat shuttle
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.05, 0.08), bambooMat);
    body.position.set(0, 0.45, 0);
    g.add(body);
    [-0.24, 0.24].forEach((x) => {
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.08, 12), goldMat);
      tip.rotation.z = x < 0 ? Math.PI / 2 : -Math.PI / 2;
      tip.position.set(x, 0.45, 0);
      g.add(tip);
    });
    const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.22, 12), silkMat);
    spool.rotation.z = Math.PI / 2;
    spool.position.set(0, 0.45, 0);
    g.add(spool);
  } else if (artifactId.includes('paddle')) {
    // Foot treadle
    const pedal = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.65), timberMat);
    pedal.position.set(0, 0.45, 0);
    pedal.rotation.x = 0.15;
    g.add(pedal);
    const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.2, 8), bambooMat);
    pivot.rotation.z = Math.PI / 2;
    pivot.position.set(0, 0.43, -0.28);
    g.add(pivot);
  } else if (artifactId.includes('bobin')) {
    // Cylindrical turned case
    const caseGeo = new THREE.CylinderGeometry(0.12, 0.13, 0.26, 16);
    const caseMesh = new THREE.Mesh(caseGeo, timberMat);
    caseMesh.position.set(0, 0.52, 0);
    g.add(caseMesh);
    const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.18, 12), silkMat);
    spool.position.set(0, 0.55, 0);
    g.add(spool);
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), goldMat);
    finial.position.set(0, 0.67, 0);
    g.add(finial);
  } else if (artifactId.includes('swrki')) {
    // Reed batten comb
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.05), timberMat);
    frame.position.set(0, 0.52, 0);
    g.add(frame);
    const teeth = new THREE.Mesh(
      new THREE.PlaneGeometry(0.75, 0.14),
      new THREE.MeshStandardMaterial({ color: 0xd9ba7a, roughness: 0.5, side: THREE.DoubleSide })
    );
    teeth.position.set(0, 0.52, 0.026);
    g.add(teeth);
  } else if (artifactId.includes('zenther')) {
    // Hand cotton gin with rollers & crank
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.05, 0.25), timberMat);
    base.position.set(0, 0.45, 0);
    g.add(base);
    [-0.18, 0.18].forEach((x) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 0.05), timberMat);
      col.position.set(x, 0.6, 0);
      g.add(col);
    });
    [0.55, 0.63].forEach((y) => {
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.32, 12), timberMat);
      roller.rotation.z = Math.PI / 2;
      roller.position.set(0, y, 0);
      g.add(roller);
    });
    const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8), bambooMat);
    crank.position.set(0.2, 0.63, 0.08);
    g.add(crank);
  } else if (artifactId.includes('mushra')) {
    // Guiding swift implement
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), bambooMat);
    stem.position.set(0, 0.58, 0);
    g.add(stem);
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.04), timberMat);
    cross.position.set(0, 0.68, 0);
    g.add(cross);
  } else if (artifactId.includes('loom')) {
    // Miniature frame loom
    const loom = new THREE.Group();
    [-0.3, 0.3].forEach((x) => {
      [-0.2, 0.2].forEach((z) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.04), timberMat);
        post.position.set(x, 0.62, z);
        loom.add(post);
      });
    });
    const warp = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.36), silkMat);
    warp.rotation.x = Math.PI / 2;
    warp.position.set(0, 0.64, 0);
    loom.add(warp);
    g.add(loom);
  } else if (artifactId.includes('dokhona')) {
    const drape = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.8), new THREE.MeshStandardMaterial({ color: 0xdeb038, roughness: 0.7 }));
    drape.position.set(0, 0.5, 0);
    g.add(drape);
    const bdr = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.18), redMat);
    bdr.position.set(0, 0.2, 0.01);
    g.add(bdr);
  } else if (artifactId.includes('aronai')) {
    const stole = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.85), redMat);
    stole.position.set(0, 0.5, 0);
    g.add(stole);
  } else {
    // Default decorative heirloom pedestal item
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.22), goldMat);
    box.position.set(0, 0.45, 0);
    g.add(box);
  }

  g.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = true;
      c.receiveShadow = true;
      (c as any).hotspotData = hs;
    }
  });

  return g;
}

export const VRMuseumModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const openVillageAssetManager = useVillageAssetStore((state) => state.openManager);
  const [activeAreaId, setActiveAreaId] = useState('ENTRANCE');
  const [selectedHotspot, setSelectedHotspot] = useState<VillageHotspot | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [controlsHelpOpen, setControlsHelpOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRepositionModalOpen, setIsRepositionModalOpen] = useState(false);
  const [repositioningArtifact, setRepositioningArtifact] = useState<Artifact | null>(null);

  // New object form state
  const [newObjName, setNewObjName] = useState('');
  const [newObjBodoName, setNewObjBodoName] = useState('');
  const [newObjCategory, setNewObjCategory] = useState<'TOOLS' | 'TEXTILES' | 'MOTIFS' | 'DYEING' | 'LOOMS' | 'MATERIALS'>('TOOLS');
  const [newObjZone, setNewObjZone] = useState('WORKSHOP');
  const [newObjDesc, setNewObjDesc] = useState('');
  const [newObjModelFile, setNewObjModelFile] = useState<File | null>(null);
  const [newObjSelectedModelId, setNewObjSelectedModelId] = useState('');
  const [newObjPosX, setNewObjPosX] = useState(-10.2);
  const [newObjPosY, setNewObjPosY] = useState(0.45);
  const [newObjPosZ, setNewObjPosZ] = useState(-8.5);
  const [newObjRotY, setNewObjRotY] = useState(0);
  const [newObjScale, setNewObjScale] = useState(1);
  const [newObjUploadError, setNewObjUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reposition modal state
  const [editPosX, setEditPosX] = useState(0);
  const [editPosY, setEditPosY] = useState(0.45);
  const [editPosZ, setEditPosZ] = useState(0);
  const [editRotY, setEditRotY] = useState(0);
  const [editScale, setEditScale] = useState(1);

  const {
    open3DViewer,
    openAR,
    openAIPanelWithContext,
    pendingNavigationAction,
    setPendingNavigationAction,
  } = useMuseumStore();
  const { artifacts, models, addArtifact, updateArtifact, addModel, deleteArtifact } = useContentStore();

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const exhibitsGroupRef = useRef<THREE.Group | null>(null);
  const obstaclesRef = useRef<{ minX: number; maxX: number; minZ: number; maxZ: number }[]>([]);

  // Default coordinates mapped to the 5 Heritage Areas of the Village
  const villageDefaultPositions: Record<string, [number, number, number]> = {
    // Handloom Workshop
    'maku-shuttle': [-10.2, 0.45, -8.5],
    'makuu-shuttle': [-10.2, 0.45, -8.5],
    'traditional-bodo-loom': [-12, 0.35, -10],
    'loom-paddle': [-11.8, 0.45, -8.3],
    'bobin-case': [-13.2, 0.45, -8.5],
    // Textile Gallery
    'dokhona-thaosi': [-1.8, 0.45, -16],
    'aronai-scarf': [1.8, 0.45, -16],
    'aronai-muga': [1.8, 0.45, -16],
    'photo-sal-weaver': [-2.475, 1.55, -18.2],
    'photo-eri-silk': [-0.825, 1.55, -18.2],
    'photo-botanical-dye': [0.825, 1.55, -18.2],
    'photo-dokhona-master': [2.475, 1.55, -18.2],
    // Village Entrance
    'hero-portrait': [4.2, 1.4, 12.0],
    // Traditional Homestead
    'serja-instrument': [-13.5, 0.45, 5.8],
    // Tools & Materials Area
    'khabang-bobbin-holder': [12.2, 0.45, -8],
    'khabang-winder': [12.2, 0.45, -8],
    'eri-silk-cocoons': [14.2, 0.45, -9.5],
    'eri-silk-cocoon': [14.2, 0.45, -9.5],
    'swrki-reed': [12.2, 0.45, -9.8],
    'zenther-gin': [11.2, 0.45, -8.0],
    'mushra-tool': [13.2, 0.45, -8.0],
    // Motif & Dyeing Exhibition
    'natural-indigo-pot': [14.8, 0.45, 6.2],
    'sacred-agor-collection': [13.2, 0.45, 3.8],
  };

  // Additional courtyard display slots for newly added objects
  const extraVillageSlots: [number, number, number][] = [
    [-11, 0.45, 3],     // Homestead courtyard
    [-13, 0.45, -8],    // Workshop front
    [-3.2, 0.45, -14],  // Textile pavilion left
    [3.2, 0.45, -14],   // Textile pavilion right
    [11, 0.45, -6.5],   // Tools courtyard
    [13, 0.45, 7],      // Dyeing pavilion front
    [-6, 0.45, 6],      // Village path west
    [6, 0.45, 6],       // Village path east
    [0, 0.45, 2],       // Central plaza
  ];

  // Dynamic hotspots derived from artifacts in contentStore
  const hotspots = useMemo<VillageHotspot[]>(() => {
    let extraIdx = 0;
    return artifacts.map((art) => {
      // Check if custom position was saved
      let pos: [number, number, number] = (art as any).villagePosition;
      if (!pos) {
        pos = villageDefaultPositions[art.id] || extraVillageSlots[extraIdx % extraVillageSlots.length];
        extraIdx++;
      }

      let zone = 'HANDLOOM WORKSHOP';
      if (art.category === 'TOOLS' || art.id.includes('maku') || art.id.includes('loom')) {
        zone = 'HANDLOOM WORKSHOP';
      } else if (art.category === 'TEXTILES' || art.id.includes('dokhona') || art.id.includes('aronai')) {
        zone = 'TEXTILE GALLERY';
      } else if (art.id.includes('serja') || art.id.includes('house') || (art as any).villageZone === 'HOUSE') {
        zone = 'TRADITIONAL HOMESTEAD';
      } else if (art.category === 'MATERIALS' || art.id.includes('khabang') || art.id.includes('cocoon')) {
        zone = 'TOOLS & MATERIALS';
      } else if (art.category === 'MOTIFS' || art.category === 'DYEING' || art.id.includes('indigo') || art.id.includes('agor')) {
        zone = 'MOTIF & DYEING EXHIBITION';
      }

      return {
        id: `hs-${art.id}`,
        name: art.name,
        zone,
        position: pos,
        rotationY: (art as any).villageRotation?.[1] || 0,
        scale: (art as any).villageScale || 1,
        artifact: art,
        info: art.description || art.culturalSignificance || 'Traditional Bodo cultural heritage item.',
      };
    });
  }, [artifacts]);

  // Handle incoming AI Docent 3D navigation actions
  useEffect(() => {
    if (!pendingNavigationAction) return;

    const timer = setTimeout(() => {
      const [targetX, targetY, targetZ] = pendingNavigationAction.coordinates;
      if (cameraRef.current) {
        cameraRef.current.position.set(targetX, 1.65, targetZ + 2.2);
        cameraRef.current.lookAt(targetX, targetY || 0.6, targetZ);
      }

      // Try matching an exhibit hotspot to open details card
      const cleanExId = pendingNavigationAction.exhibitId.replace(/^exhibit_/, '').toLowerCase();
      const matched = hotspots.find(
        (h) =>
          h.artifact.id.toLowerCase() === pendingNavigationAction.exhibitId.toLowerCase() ||
          h.artifact.id.toLowerCase().includes(cleanExId) ||
          h.name.toLowerCase().includes(pendingNavigationAction.exhibitName.toLowerCase())
      );
      if (matched) {
        setSelectedHotspot(matched);
      }

      setPendingNavigationAction(null);
    }, 400);

    return () => clearTimeout(timer);
  }, [pendingNavigationAction, hotspots, setPendingNavigationAction]);

  // Set position when zone is selected in Add Object Modal
  const handleZoneSelect = (zone: string) => {
    setNewObjZone(zone);
    if (zone === 'HOUSE') {
      setNewObjPosX(-11.5);
      setNewObjPosY(0.45);
      setNewObjPosZ(4.5);
    } else if (zone === 'WORKSHOP') {
      setNewObjPosX(-10.2);
      setNewObjPosY(0.45);
      setNewObjPosZ(-8.5);
    } else if (zone === 'TEXTILES') {
      setNewObjPosX(0);
      setNewObjPosY(0.45);
      setNewObjPosZ(-14.5);
    } else if (zone === 'TOOLS') {
      setNewObjPosX(11.5);
      setNewObjPosY(0.45);
      setNewObjPosZ(-7.5);
    } else if (zone === 'MOTIFS') {
      setNewObjPosX(12.5);
      setNewObjPosY(0.45);
      setNewObjPosZ(5.5);
    }
  };

  // Main Three.js Scene Setup
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene with daylight sky
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#78BAE8'); // Bright Assamese daytime sky
    scene.fog = new THREE.FogExp2('#A6D2ED', 0.007);
    sceneRef.current = scene;

    // 2. Camera at natural human eye level facing the Torana entrance gate
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 250);
    camera.position.set(0, 1.65, 18); // Village Entrance approach facing gate
    camera.lookAt(0, 1.8, 12.5);
    cameraRef.current = camera;

    // 3. Renderer with soft shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // 4. Natural Daylight & Sun Lighting
    // Directional Sun
    const sunLight = new THREE.DirectionalLight(0xfff6de, 1.8);
    sunLight.position.set(30, 48, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 130;
    sunLight.shadow.camera.left = -40;
    sunLight.shadow.camera.right = 40;
    sunLight.shadow.camera.top = 40;
    sunLight.shadow.camera.bottom = -40;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Natural Hemisphere Light (Sky: Azure, Ground: Earthy Green)
    const hemiLight = new THREE.HemisphereLight(0xe8f4ff, 0x486638, 0.85);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xfff9ec, 0.4);
    scene.add(ambientLight);

    // 5. Build the complete Outdoor Village Environment
    const { collisionObstacles, cleanup: cleanupVillage } = buildVillageEnvironment(scene);
    obstaclesRef.current = collisionObstacles;

    // 6. Exhibits Group (Holds pedestals, real 3D models, beacons, and spotlights)
    const exhibitsGroup = new THREE.Group();
    exhibitsGroup.name = 'ExhibitsGroup';
    exhibitsGroupRef.current = exhibitsGroup;
    scene.add(exhibitsGroup);

    // Helper to populate pedestals and models
    const populateExhibits = (spots: VillageHotspot[]) => {
      // Clear previous exhibits
      while (exhibitsGroup.children.length > 0) {
        const child = exhibitsGroup.children[0];
        exhibitsGroup.remove(child);
        if ((child as any).geometry) (child as any).geometry.dispose();
      }

      const gltfLoader = new GLTFLoader();

      spots.forEach((hs) => {
        const artifactGroup = new THREE.Group();
        artifactGroup.position.set(hs.position[0], hs.position[1], hs.position[2]);
        if (hs.rotationY) artifactGroup.rotation.y = hs.rotationY;
        if (hs.scale) artifactGroup.scale.setScalar(hs.scale);

        // Rustic bamboo/timber display pedestal
        const pedGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.85, 24);
        const pedMat = new THREE.MeshStandardMaterial({
          color: 0x443020, // weathered dark teak / bamboo
          roughness: 0.8,
        });
        const pedestal = new THREE.Mesh(pedGeo, pedMat);
        pedestal.position.set(0, 0, 0);
        pedestal.castShadow = true;
        pedestal.receiveShadow = true;
        (pedestal as any).hotspotData = hs;
        artifactGroup.add(pedestal);

        // Subtle spotlight on pedestal
        const spot = new THREE.SpotLight(0xfffae6, 2.5, 8, Math.PI / 5, 0.3);
        spot.position.set(0, 4.5, 0);
        spot.target = pedestal;
        artifactGroup.add(spot);

        // Rotating golden cultural beacon orb
        const beaconGeo = new THREE.OctahedronGeometry(0.18, 0);
        const beaconMat = new THREE.MeshStandardMaterial({
          color: 0xffe600,
          emissive: 0xffe600,
          emissiveIntensity: 0.9,
          wireframe: true,
        });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(0, 1.45, 0);
        (beacon as any).hotspotData = hs;
        (beacon as any).isBeacon = true;
        artifactGroup.add(beacon);

        // Check if artifact has a real 3D model linked
        const linkedModel = models.find(
          (m) => m.artifactId === hs.artifact.id || m.id === hs.artifact.modelId
        );
        const modelUrl = hs.artifact.modelUrl || linkedModel?.url;

        // 1. Always create the high-fidelity authentic procedural representation first
        // so the pedestal is never empty or delayed
        const proceduralMesh = createProceduralArtifactMesh(hs.artifact.id, hs);
        artifactGroup.add(proceduralMesh);

        if (modelUrl) {
          // Asynchronously attempt loading real GLB model onto the pedestal
          resolveModelUrl(
            linkedModel ||
              ({ id: 'temp', url: modelUrl, storageType: 'static', type: 'glb', arEnabled: true } as any)
          )
            .then((playableUrl) => {
              const tryLoadModel = (urlToLoad: string, fallbackUrl?: string) => {
                gltfLoader.load(
                  urlToLoad,
                  (gltf) => {
                    const modelScene = gltf.scene;
                    // Normalize model size to fit display pedestal
                    const box = new THREE.Box3().setFromObject(modelScene);
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z) || 1;
                    const targetScale = 0.8 / maxDim;
                    modelScene.scale.setScalar(targetScale);

                    // Center horizontally and align base exactly at pedestal surface (y=0.45)
                    const center = box.getCenter(new THREE.Vector3());
                    const yOffset = 0.45 - box.min.y * targetScale;
                    modelScene.position.set(-center.x * targetScale, yOffset, -center.z * targetScale);

                    modelScene.traverse((node) => {
                      if ((node as THREE.Mesh).isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                        (node as any).hotspotData = hs;
                      }
                    });

                    // Successfully loaded real GLB: replace procedural placeholder
                    artifactGroup.remove(proceduralMesh);
                    artifactGroup.add(modelScene);
                  },
                  undefined,
                  () => {
                    if (fallbackUrl && fallbackUrl !== urlToLoad) {
                      tryLoadModel(fallbackUrl);
                    } else {
                      // Graceful fallback to procedural representation
                      console.info(`[Village] Using authentic procedural 3D display for ${hs.name}`);
                    }
                  }
                );
              };

              // Determine alternate casing/naming if applicable
              let altUrl: string | undefined;
              if (playableUrl.includes('Traditional-loom.glb')) {
                altUrl = playableUrl.replace('Traditional-loom.glb', 'traditional-loom.glb');
              } else if (playableUrl.includes('traditional-loom.glb')) {
                altUrl = playableUrl.replace('traditional-loom.glb', 'Traditional-loom.glb');
              } else if (playableUrl.includes('makuu.glb')) {
                altUrl = playableUrl.replace('makuu.glb', 'maku.glb');
              } else if (playableUrl.includes('maku.glb')) {
                altUrl = playableUrl.replace('maku.glb', 'makuu.glb');
              } else if (playableUrl.includes('Swrki.glb')) {
                altUrl = playableUrl.replace('Swrki.glb', 'serski.glb');
              }

              tryLoadModel(playableUrl, altUrl);
            })
            .catch(() => {});
        }

        exhibitsGroup.add(artifactGroup);
      });
    };

    populateExhibits(hotspots);

    // 7. Navigation, Mouse Look, and Touch Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let lon = 180; // Facing north toward village center
    let lat = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      lon -= deltaX * 0.18;
      lat = Math.max(-75, Math.min(75, lat + deltaY * 0.18));
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Mobile touch look
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouse.x;
      const deltaY = e.touches[0].clientY - prevMouse.y;
      lon -= deltaX * 0.22;
      lat = Math.max(-75, Math.min(75, lat + deltaY * 0.22));
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    // Raycasting for clicking pedestals & artifacts
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let current: THREE.Object3D | null = hit.object;
        while (current) {
          if ((current as any).hotspotData) {
            setSelectedHotspot((current as any).hotspotData);
            return;
          }
          current = current.parent;
        }
      }
    };

    // Keyboard Walking with Collision Prevention
    const keysPressed: Record<string, boolean> = {};

    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart);
    dom.addEventListener('touchmove', onTouchMove);
    dom.addEventListener('touchend', onTouchEnd);
    dom.addEventListener('click', onClick);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Handle continuous keyboard movement
      const moveSpeed = 5.2 * delta;
      const prevPos = camera.position.clone();

      if (keysPressed['w'] || keysPressed['arrowup']) {
        camera.translateZ(-moveSpeed);
      }
      if (keysPressed['s'] || keysPressed['arrowdown']) {
        camera.translateZ(moveSpeed);
      }
      if (keysPressed['a'] || keysPressed['arrowleft']) {
        camera.translateX(-moveSpeed);
      }
      if (keysPressed['d'] || keysPressed['arrowright']) {
        camera.translateX(moveSpeed);
      }

      // Keep camera eye level
      camera.position.y = 1.65;

      // Collision checks: Village perimeter limits
      camera.position.x = Math.max(-34, Math.min(34, camera.position.x));
      camera.position.z = Math.max(-34, Math.min(34, camera.position.z));

      // Building solid wall collision prevention
      for (const obs of obstaclesRef.current) {
        if (
          camera.position.x >= obs.minX &&
          camera.position.x <= obs.maxX &&
          camera.position.z >= obs.minZ &&
          camera.position.z <= obs.maxZ
        ) {
          // Revert position to avoid passing through walls
          camera.position.copy(prevPos);
          break;
        }
      }

      // Update camera rotation based on lat/lon
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);
      const target = new THREE.Vector3();
      target.x = camera.position.x + 100 * Math.sin(phi) * Math.cos(theta);
      target.y = camera.position.y + 100 * Math.cos(phi);
      target.z = camera.position.z + 100 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(target);

      // Rotate glowing cultural beacons
      if (exhibitsGroupRef.current) {
        exhibitsGroupRef.current.children.forEach((group) => {
          group.children.forEach((child) => {
            if ((child as any).isBeacon) {
              child.rotation.y += 0.025;
              child.rotation.x += 0.015;
            }
          });
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      dom.removeEventListener('mousedown', onMouseDown);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);
      dom.removeEventListener('click', onClick);
      cleanupVillage();
      renderer.dispose();
    };
  }, []);

  // Teleport to any Village Area
  const teleportToArea = (area: VillageArea) => {
    setActiveAreaId(area.id);
    setSelectedHotspot(null);
    if (cameraRef.current) {
      cameraRef.current.position.set(area.position[0], area.position[1], area.position[2]);
      cameraRef.current.lookAt(area.lookAt[0], area.lookAt[1], area.lookAt[2]);
    }
  };

  // Teleport to an individual artifact hotspot
  const teleportToHotspot = (hs: VillageHotspot) => {
    setSelectedHotspot(hs);
    if (cameraRef.current) {
      cameraRef.current.position.set(hs.position[0], 1.65, hs.position[2] + 2.2);
    }
  };

  // Handle uploading and placing a new 3D model into the village
  const handleCreateNewObject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjName.trim()) {
      setNewObjUploadError('Please provide a name for the cultural object.');
      return;
    }

    setIsSubmitting(true);
    setNewObjUploadError(null);

    try {
      const artifactId = `art-custom-${Date.now()}`;
      let assignedModelUrl: string | undefined = undefined;
      let assignedModelId: string | undefined = undefined;

      // If user uploaded a new 3D model file (.glb / .gltf)
      if (newObjModelFile) {
        const validation = validate3DFile(newObjModelFile);
        if (!validation.valid) {
          setNewObjUploadError(validation.error || 'Invalid 3D file format');
          setIsSubmitting(false);
          return;
        }

        const modelId = `model-user-${Date.now()}`;
        await saveModelBlob(modelId, newObjModelFile, newObjModelFile.name);
        const fileType = newObjModelFile.name.toLowerCase().endsWith('.glb') ? 'glb' : 'gltf';

        const newModel: Model3D = {
          id: modelId,
          artifactId,
          name: `${newObjName.trim()} 3D Model`,
          description: newObjDesc.trim() || undefined,
          type: fileType,
          url: `indexeddb://${modelId}`,
          storageType: 'indexeddb',
          fileName: newObjModelFile.name,
          fileSize: newObjModelFile.size,
          uploadedAt: new Date().toISOString(),
          arEnabled: true,
          transform: {
            position: [newObjPosX, newObjPosY, newObjPosZ],
            rotation: [0, newObjRotY, 0],
            scale: newObjScale,
          },
        };

        addModel(newModel);
        assignedModelId = modelId;
        assignedModelUrl = `indexeddb://${modelId}`;
      } else if (newObjSelectedModelId) {
        const foundModel = models.find((m) => m.id === newObjSelectedModelId);
        if (foundModel) {
          assignedModelId = foundModel.id;
          assignedModelUrl = foundModel.url;
        }
      }

      const newArtifact: Artifact = {
        id: artifactId,
        name: newObjName.trim(),
        bodoName: newObjBodoName.trim() || undefined,
        category: newObjCategory,
        description:
          newObjDesc.trim() ||
          'Authentic cultural artifact cataloged in the Bodo Heritage Village outdoor exhibits.',
        culturalSignificance: `Placed in the Bodo Heritage Village exhibit grounds.`,
        arAvailable: true,
        vrAvailable: true,
        modelUrl: assignedModelUrl,
        modelId: assignedModelId,
        villageZone: newObjZone,
        villagePosition: [newObjPosX, newObjPosY, newObjPosZ],
        villageRotation: [0, newObjRotY, 0],
        villageScale: newObjScale,
      } as any;

      addArtifact(newArtifact);

      // Teleport camera right in front of the newly placed object
      if (cameraRef.current) {
        cameraRef.current.position.set(newObjPosX, 1.65, newObjPosZ + 2.2);
      }

      // Reset form & close modal
      setNewObjName('');
      setNewObjBodoName('');
      setNewObjDesc('');
      setNewObjModelFile(null);
      setNewObjSelectedModelId('');
      setIsAddModalOpen(false);
    } catch (err: any) {
      setNewObjUploadError(err?.message || 'Failed to place object in village');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open reposition modal for selected artifact
  const handleOpenReposition = (hs: VillageHotspot) => {
    setRepositioningArtifact(hs.artifact);
    setEditPosX(hs.position[0]);
    setEditPosY(hs.position[1]);
    setEditPosZ(hs.position[2]);
    setEditRotY(hs.rotationY || 0);
    setEditScale(hs.scale || 1);
    setIsRepositionModalOpen(true);
  };

  // Save updated transforms
  const handleSaveReposition = () => {
    if (!repositioningArtifact) return;

    updateArtifact(repositioningArtifact.id, {
      villagePosition: [editPosX, editPosY, editPosZ],
      villageRotation: [0, editRotY, 0],
      villageScale: editScale,
    } as any);

    // Update in selectedHotspot as well
    if (selectedHotspot && selectedHotspot.artifact.id === repositioningArtifact.id) {
      setSelectedHotspot({
        ...selectedHotspot,
        position: [editPosX, editPosY, editPosZ],
        rotationY: editRotY,
        scale: editScale,
      });
    }

    setIsRepositionModalOpen(false);
  };

  const currentArea = VILLAGE_AREAS.find((a) => a.id === activeAreaId) || VILLAGE_AREAS[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-sky-950 text-white select-none overflow-hidden">
      
      {/* Top Spatial HUD Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-stone-900/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-amber-500/30 shadow-lg">
            <Compass className="w-4 h-4 text-[#FFE600] animate-spin" />
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-xs font-bold tracking-wider text-white">
                BODO HERITAGE VILLAGE
              </span>
              <span className="text-[9px] text-amber-300 font-medium hidden sm:inline">
                {currentArea.name}
              </span>
            </div>
          </div>

          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-2 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-300 border border-white/20 cursor-pointer shadow-md"
            title="Toggle Ambient Audio"
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FFE600]" />}
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Replaceable 3D Village Assets Manager Button */}
          <button
            onClick={() => openVillageAssetManager()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white font-bold text-xs border border-amber-500/40 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
            title="Replace any village house, tree, loom, or prop with custom .glb 3D models"
          >
            <Box className="w-3.5 h-3.5 text-[#FFE600]" />
            <span className="tracking-wide hidden sm:inline">3D ASSETS</span>
            <span className="tracking-wide sm:hidden">ASSETS</span>
          </button>

          {/* Quick Add 3D Object Button */}
          <button
            onClick={() => {
              setNewObjUploadError(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFE600] hover:bg-[#FFF04D] text-black font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer font-editorial"
            title="Upload and place your own 3D model into the village"
          >
            <Plus className="w-4 h-4" />
            <span className="tracking-wide">ADD 3D OBJECT</span>
          </button>

          {/* Reset to Village Entrance */}
          <button
            onClick={() => teleportToArea(VILLAGE_AREAS[0])}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-900/90 hover:bg-stone-800 text-amber-300 hover:text-white text-xs border border-amber-500/30 cursor-pointer shadow-md"
            title="Return to Village Entrance Gate"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Entrance</span>
          </button>

          <button
            onClick={() => setControlsHelpOpen(!controlsHelpOpen)}
            className="px-3 py-2 rounded-full bg-stone-900/90 text-stone-300 hover:text-white text-xs border border-white/20 cursor-pointer hidden sm:block shadow-md"
          >
            Controls
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#8B2635] hover:bg-[#681c28] text-white transition-colors cursor-pointer shadow-lg"
            title="Exit Village"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full flex-1 cursor-grab active:cursor-grabbing relative" />

      {/* Floating Village Area Teleportation Bar at Bottom */}
      <div className="absolute bottom-5 inset-x-4 sm:inset-x-6 z-20 flex flex-wrap items-center justify-center gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 bg-black/85 backdrop-blur-md p-1.5 rounded-full border border-amber-500/30 overflow-x-auto max-w-full shadow-2xl">
          {VILLAGE_AREAS.map((area) => (
            <button
              key={area.id}
              onClick={() => teleportToArea(area)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeAreaId === area.id
                  ? 'bg-[#FFE600] text-black font-bold shadow-md'
                  : 'bg-white/10 text-stone-300 hover:bg-white/20'
              }`}
            >
              <span>{area.name.split(' (')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls Helper Tooltip Overlay */}
      {controlsHelpOpen && (
        <div className="absolute top-18 left-4 z-20 max-w-xs bg-black/90 backdrop-blur-md p-4 rounded-xl border border-amber-500/30 text-xs text-stone-300 pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[#FFE600] uppercase tracking-wider">
              Village Navigation & Controls
            </span>
            <button
              onClick={() => setControlsHelpOpen(false)}
              className="text-stone-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-1.5 text-[11px]">
            <li>• <b>Mouse / Touch Drag:</b> Look around 360° across village</li>
            <li>• <b>W / A / S / D & Arrows:</b> Walk along village paths</li>
            <li>• <b>Click Glowing Beacons:</b> Inspect 3D artifact, loom, or textile</li>
            <li>• <b>Click + ADD 3D OBJECT:</b> Upload `.glb`/`.gltf` model to village</li>
            <li>• <b>Bottom Teleport Bar:</b> Instant travel between 5 heritage areas</li>
          </ul>
        </div>
      )}

      {/* Inspected Artifact Drawer */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="absolute bottom-20 sm:bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-30 bg-[#FAF8F5] text-stone-900 rounded-2xl p-5 shadow-2xl border border-amber-600/30"
          >
            <div className="flex items-start justify-between pb-2 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-amber-800 uppercase">
                  {selectedHotspot.zone} · {selectedHotspot.artifact.category}
                </span>
                <h4 className="text-base font-editorial font-bold text-stone-900">
                  {selectedHotspot.name}
                </h4>
                {selectedHotspot.artifact.bodoName && (
                  <p className="text-xs text-[#8B2635] font-semibold mt-0.5">
                    {selectedHotspot.artifact.bodoName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {/* Reposition button */}
                <button
                  onClick={() => handleOpenReposition(selectedHotspot)}
                  className="p-1.5 text-stone-500 hover:text-amber-700 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
                  title="Adjust 3D position, rotation, and scale in village"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                {/* Delete button if custom */}
                {selectedHotspot.artifact.id.startsWith('art-') && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${selectedHotspot.name}" from the village?`)) {
                        deleteArtifact(selectedHotspot.artifact.id);
                        setSelectedHotspot(null);
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
                    title="Remove this object from village"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-stone-400 hover:text-stone-800 p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <p className="text-xs text-stone-700 font-editorial mt-2.5 leading-relaxed">
              {selectedHotspot.info}
            </p>

            <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => open3DViewer(selectedHotspot.artifact)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171513] text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
                  title="Open 360° orbital 3D model inspector"
                >
                  <Box className="w-3.5 h-3.5 text-[#FFE600]" />
                  Inspect 3D
                </button>

                <button
                  onClick={() => openAR(selectedHotspot.artifact)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors cursor-pointer shadow-xs"
                  title="View in Mobile Augmented Reality"
                >
                  <Compass className="w-3.5 h-3.5 text-white" />
                  AR View
                </button>
              </div>

              <button
                onClick={() =>
                  openAIPanelWithContext(
                    selectedHotspot.artifact,
                    `Tell me about the ${selectedHotspot.name} in the ${selectedHotspot.zone} of the Bodo Heritage Village.`
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFE600] text-black text-xs font-bold hover:bg-[#ebd300] transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask Guide
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reposition / Transform Object Modal */}
      <AnimatePresence>
        {isRepositionModalOpen && repositioningArtifact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1A17] border border-amber-500/40 rounded-2xl w-full max-w-md p-6 text-stone-200 shadow-2xl relative space-y-4"
            >
              <div className="flex items-start justify-between border-b border-stone-700 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE600]">
                    Village 3D Transformation
                  </span>
                  <h3 className="text-lg font-editorial font-bold text-white mt-0.5">
                    Reposition & Scale Exhibit
                  </h3>
                  <p className="text-xs text-stone-400">
                    Adjust {repositioningArtifact.name} location in the village.
                  </p>
                </div>
                <button
                  onClick={() => setIsRepositionModalOpen(false)}
                  className="text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Position X (West ↔ East):</span>
                    <span className="font-mono text-[#FFE600]">{editPosX.toFixed(1)}m</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="0.5"
                    value={editPosX}
                    onChange={(e) => setEditPosX(parseFloat(e.target.value))}
                    className="w-full accent-[#FFE600] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Position Z (North ↔ South):</span>
                    <span className="font-mono text-[#FFE600]">{editPosZ.toFixed(1)}m</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="0.5"
                    value={editPosZ}
                    onChange={(e) => setEditPosZ(parseFloat(e.target.value))}
                    className="w-full accent-[#FFE600] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Elevation Y (Height):</span>
                    <span className="font-mono text-[#FFE600]">{editPosY.toFixed(2)}m</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.05"
                    value={editPosY}
                    onChange={(e) => setEditPosY(parseFloat(e.target.value))}
                    className="w-full accent-[#FFE600] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Rotation Y:</span>
                    <span className="font-mono text-[#FFE600]">{Math.round((editRotY * 180) / Math.PI)}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.PI * 2}
                    step="0.05"
                    value={editRotY}
                    onChange={(e) => setEditRotY(parseFloat(e.target.value))}
                    className="w-full accent-[#FFE600] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Scale Multiplier:</span>
                    <span className="font-mono text-[#FFE600]">{editScale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={editScale}
                    onChange={(e) => setEditScale(parseFloat(e.target.value))}
                    className="w-full accent-[#FFE600] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-700">
                <button
                  type="button"
                  onClick={() => setIsRepositionModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-lg text-stone-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveReposition}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-[#FFE600] text-black hover:bg-[#FFF04D] transition-colors cursor-pointer font-editorial shadow-md"
                >
                  Save Village Placement
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add 3D Object to Village Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1C1A17] border border-amber-500/40 rounded-2xl w-full max-w-lg p-6 text-stone-200 shadow-2xl relative space-y-4 my-8"
            >
              <div className="flex items-start justify-between border-b border-stone-700 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE600]">
                    Village Curator & 3D Manager
                  </span>
                  <h3 className="text-xl font-editorial font-bold text-white mt-0.5">
                    Place 3D Cultural Object in Village
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Upload your own `.glb` or `.gltf` model and position it in any heritage area.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {newObjUploadError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/80 border border-red-800 text-xs text-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{newObjUploadError}</span>
                </div>
              )}

              <form onSubmit={handleCreateNewObject} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Artifact Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maku Shuttle, Serja Fiddle"
                      value={newObjName}
                      onChange={(e) => setNewObjName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-[#FFE600]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Native Bodo Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. माखु, सेर्जा"
                      value={newObjBodoName}
                      onChange={(e) => setNewObjBodoName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-[#FFE600]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Heritage Category
                    </label>
                    <select
                      value={newObjCategory}
                      onChange={(e) => setNewObjCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#FFE600]"
                    >
                      <option value="TOOLS">TOOLS & LOOM IMPLEMENTS</option>
                      <option value="TEXTILES">WOVEN TEXTILES & DRESS</option>
                      <option value="LOOMS">FRAME LOOMS & TREADLES</option>
                      <option value="MOTIFS">SACRED AGOR MOTIFS</option>
                      <option value="DYEING">NATURAL DYES & VATS</option>
                      <option value="MATERIALS">ERI SILK & BOTANICALS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Target Heritage Area
                    </label>
                    <select
                      value={newObjZone}
                      onChange={(e) => handleZoneSelect(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-[#FFE600]"
                    >
                      <option value="HOUSE">Traditional Homestead (No-Mano)</option>
                      <option value="WORKSHOP">Handloom Workshop (Sal-Ghor)</option>
                      <option value="TEXTILES">Textile Gallery (Dokhona Pavilion)</option>
                      <option value="TOOLS">Tools & Materials Compound</option>
                      <option value="MOTIFS">Motif & Dyeing Exhibition</option>
                      <option value="CUSTOM">Custom Village Coordinates</option>
                    </select>
                  </div>
                </div>

                {/* 3D Model Attachment */}
                <div className="p-3.5 rounded-xl bg-stone-900/80 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5 text-[#FFE600]" />
                      Upload 3D Model (.glb / .gltf)
                    </span>
                    <span className="text-[10px] text-amber-300">Real 3D Asset</span>
                  </div>

                  <div>
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setNewObjModelFile(file);
                        if (file) setNewObjSelectedModelId('');
                      }}
                      className="block w-full text-xs text-stone-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-800 file:text-[#FFE600] hover:file:bg-stone-700 file:cursor-pointer"
                    />
                  </div>

                  {models.length > 0 && (
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">
                        Or select from registered 3D library:
                      </label>
                      <select
                        value={newObjSelectedModelId}
                        onChange={(e) => {
                          setNewObjSelectedModelId(e.target.value);
                          if (e.target.value) setNewObjModelFile(null);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:border-[#FFE600]"
                      >
                        <option value="">-- Choose from existing models --</option>
                        {models.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.fileName || m.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Transform coordinates preview */}
                <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-400 p-2.5 bg-stone-900/60 rounded-lg border border-stone-800">
                  <div>X: <span className="text-white font-mono">{newObjPosX.toFixed(1)}</span></div>
                  <div>Z: <span className="text-white font-mono">{newObjPosZ.toFixed(1)}</span></div>
                  <div>Scale: <span className="text-white font-mono">{newObjScale}x</span></div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Cultural Story & Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe weaving technique, materials, historical significance..."
                    value={newObjDesc}
                    onChange={(e) => setNewObjDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-[#FFE600]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-700">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs rounded-lg text-stone-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-[#FFE600] text-black hover:bg-[#FFF04D] transition-all cursor-pointer font-editorial disabled:opacity-50 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isSubmitting ? 'Placing in Village...' : 'Place in Heritage Village'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Replaceable Village 3D Asset Manager Modal */}
      <VillageAssetManagerModal />
    </div>
  );
};
