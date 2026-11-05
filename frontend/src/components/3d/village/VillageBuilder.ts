import * as THREE from 'three';
import { VillageAssetSystem } from './VillageAssetSystem';

/**
 * Village Area Definition
 */
export interface VillageArea {
  id: string;
  name: string;
  bodoName: string;
  description: string;
  position: [number, number, number]; // [x, y, z] camera teleport target
  lookAt: [number, number, number];
  icon: string;
}

export const VILLAGE_AREAS: VillageArea[] = [
  {
    id: 'ENTRANCE',
    name: 'Village Entrance (Torana Gate)',
    bodoName: 'गामि हाबनाय (Gami Habnay)',
    description: 'Welcome to the Bodo Heritage Village. Traditional bamboo torana gate with "WELCOME TO BODO HANDLOOM HERITAGE" signboard, directional signpost, and earthen paths.',
    position: [0, 1.65, 18],
    lookAt: [0, 1.8, 12.5],
    icon: 'Compass',
  },
  {
    id: 'HOUSE',
    name: 'Traditional Homestead (No-Mano)',
    bodoName: 'नो-मानो (No-Mano)',
    description: 'Authentic Bodo residential homestead with thatched roof, open veranda (Dakhin-duari), Bathou sacred altar, and domestic utensils.',
    position: [-10.5, 1.65, 6],
    lookAt: [-14, 1.5, 4],
    icon: 'Home',
  },
  {
    id: 'WORKSHOP',
    name: 'Handloom Workshop (Sal-Ghor)',
    bodoName: 'साल-घर (Sal-Ghor)',
    description: 'Traditional weaving shed housing the authentic Bodo throw-shuttle loom (Sal), foot treadles, warp beams, and dyed yarn skeins.',
    position: [-9.5, 1.65, -8],
    lookAt: [-12, 1.5, -10],
    icon: 'Sparkles',
  },
  {
    id: 'TEXTILES',
    name: 'Textile Gallery (Dokhona Pavilion)',
    bodoName: "दखना आरो आर'नाइ (Dokhona & Aronai)",
    description: 'Open timber pavilion showcasing Dokhona Thaosi, sacred Aronai ceremonial stoles, Gamusa, and handspun Eri silk shawls.',
    position: [0, 1.65, -12],
    lookAt: [0, 1.5, -16],
    icon: 'Layers',
  },
  {
    id: 'TOOLS',
    name: 'Tools & Materials Area (Janthi & Khara)',
    bodoName: 'आजिं-बाजिं (Tools & Silk Materials)',
    description: 'Traditional silk spinning tools, drop spindles (Takli), yarn winders (Janthi), and baskets of natural golden Eri silkworm cocoons.',
    position: [10, 1.65, -6.5],
    lookAt: [13, 1.5, -9],
    icon: 'Box',
  },
  {
    id: 'MOTIFS',
    name: 'Motif & Botanical Dyeing Exhibition',
    bodoName: 'आगोर आरो रं खालामनाय (Agor & Dyeing)',
    description: 'Sacred geometric patterns (Hajw, Daorai, Pharew Megon) and natural botanical dyeing cauldrons with fermented indigo and turmeric.',
    position: [11, 1.65, 7.5],
    lookAt: [14, 1.5, 5],
    icon: 'Eye',
  },
];

/**
 * Creates high-resolution organic terrain texture with lush Assamese pasture tones
 */
function createTerrainTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Base vibrant meadow green
  ctx.fillStyle = '#44702c';
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Large soft organic tone washes (subtle soil & moisture variations)
  const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 600);
  grad.addColorStop(0, 'rgba(78, 128, 48, 0.4)');
  grad.addColorStop(0.5, 'rgba(54, 88, 36, 0.3)');
  grad.addColorStop(1, 'rgba(42, 70, 28, 0.5)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // 3. Medium grass clumping & clover tones
  const greens = ['#518534', '#3d6628', '#5b913d', '#335422', '#639c43', '#49732e'];
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = 2 + Math.random() * 9;
    ctx.fillStyle = greens[Math.floor(Math.random() * greens.length)];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Subtle alluvial soil, sand & silt specks
  for (let i = 0; i < 2200; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = 1 + Math.random() * 3.5;
    ctx.fillStyle = Math.random() > 0.6 ? 'rgba(102, 94, 62, 0.5)' : 'rgba(74, 65, 42, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

/**
 * Creates beaten earthen village path texture with soft feathered dust edges
 */
function createPathTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Rich terracotta earth base
  ctx.fillStyle = '#835237';
  ctx.fillRect(0, 0, 512, 512);

  // 2. Center worn track (compacted clay & dry silt)
  const pathGrad = ctx.createLinearGradient(0, 0, 512, 0);
  pathGrad.addColorStop(0, 'rgba(110, 72, 48, 0.7)');
  pathGrad.addColorStop(0.2, 'rgba(145, 96, 65, 0.9)');
  pathGrad.addColorStop(0.5, 'rgba(160, 110, 75, 1.0)');
  pathGrad.addColorStop(0.8, 'rgba(145, 96, 65, 0.9)');
  pathGrad.addColorStop(1, 'rgba(110, 72, 48, 0.7)');
  ctx.fillStyle = pathGrad;
  ctx.fillRect(0, 0, 512, 512);

  // 3. Compacted gravel, stone & dust flecks
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 0.8 + Math.random() * 2.8;
    const isLight = Math.random() > 0.45;
    ctx.fillStyle = isLight ? 'rgba(185, 140, 105, 0.5)' : 'rgba(85, 52, 34, 0.6)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);
  return texture;
}

/**
 * Creates woven bamboo thatch pattern texture with natural straw fibers
 */
function createThatchTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base golden straw tone
  ctx.fillStyle = '#9c7c46';
  ctx.fillRect(0, 0, 512, 512);

  // Horizontal thatch layers & straw fibers
  for (let y = 0; y < 512; y += 7) {
    const isRidge = y % 14 === 0;
    ctx.strokeStyle = isRidge ? '#6e4f24' : '#ba9355';
    ctx.lineWidth = isRidge ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    for (let x = 0; x < 512; x += 5) {
      ctx.strokeStyle = Math.random() > 0.4 ? '#87622d' : '#d8b577';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() * 4 - 2), y + 6.5);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/**
 * Creates woven bamboo mat (Bera) texture with authentic Assamese herringbone weave
 */
function createBambooMatTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#c5a46e';
  ctx.fillRect(0, 0, 512, 512);

  const step = 20;
  for (let x = 0; x < 512; x += step) {
    for (let y = 0; y < 512; y += step) {
      const isAlt = (x / step + y / step) % 2 === 0;
      ctx.fillStyle = isAlt ? '#d9bb85' : '#b38f56';
      ctx.fillRect(x, y, step, step);

      // Fine split bamboo grain lines inside each slat
      ctx.strokeStyle = isAlt ? '#c29d61' : '#9c763d';
      ctx.lineWidth = 1;
      for (let k = 3; k < step; k += 4) {
        ctx.beginPath();
        if (isAlt) {
          ctx.moveTo(x + k, y);
          ctx.lineTo(x + k, y + step);
        } else {
          ctx.moveTo(x, y + k);
          ctx.lineTo(x + step, y + k);
        }
        ctx.stroke();
      }

      ctx.strokeStyle = '#7d5c2e';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, step, step);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 3);
  return texture;
}

/**
 * Creates the high-contrast heritage signboard texture with exact text:
 * "WELCOME TO BODO HANDLOOM HERITAGE"
 */
export function createWelcomeSignboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Rich dark Assamese timber background with deep wood grain
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#1c1008');
  bgGrad.addColorStop(0.3, '#2a180e');
  bgGrad.addColorStop(0.7, '#24140b');
  bgGrad.addColorStop(1, '#160d06');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 512);

  // Organic wood grain striations
  for (let y = 0; y < 512; y += 3) {
    const isDark = y % 9 === 0;
    ctx.strokeStyle = isDark ? 'rgba(80, 48, 25, 0.4)' : 'rgba(12, 6, 3, 0.35)';
    ctx.lineWidth = 1 + (y % 3);
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(y * 0.04) * 2.5);
    ctx.lineTo(2048, y + Math.cos(y * 0.03) * 3);
    ctx.stroke();
  }

  // 2. Cultural Heritage Golden Filigree & Borders
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 12;
  ctx.strokeRect(20, 20, 2048 - 40, 512 - 40);

  ctx.strokeStyle = '#F7DE8B';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(38, 38, 2048 - 76, 512 - 76);

  // Corner Bodo Agor stepped mountain / chevron diamond motifs
  const drawAgorCorner = (cx: number, cy: number, flipX: number, flipY: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(flipX, flipY);
    ctx.fillStyle = '#D4AF37';
    ctx.strokeStyle = '#FFF6D1';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(44, 0);
    ctx.lineTo(44, 14);
    ctx.lineTo(30, 14);
    ctx.lineTo(30, 28);
    ctx.lineTo(14, 28);
    ctx.lineTo(14, 44);
    ctx.lineTo(0, 44);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(56, 56);
    ctx.lineTo(70, 42);
    ctx.lineTo(84, 56);
    ctx.lineTo(70, 70);
    ctx.closePath();
    ctx.fillStyle = '#F5D77F';
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  };

  drawAgorCorner(38, 38, 1, 1);
  drawAgorCorner(2048 - 38, 38, -1, 1);
  drawAgorCorner(38, 512 - 38, 1, -1);
  drawAgorCorner(2048 - 38, 512 - 38, -1, -1);

  // Top & bottom center decorative crest flourish
  const drawCrestFlourish = (y: number) => {
    ctx.save();
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.moveTo(1024 - 55, y);
    ctx.lineTo(1024, y - 16);
    ctx.lineTo(1024 + 55, y);
    ctx.lineTo(1024, y + 16);
    ctx.closePath();
    ctx.fill();

    [-95, -75, 75, 95].forEach((dx) => {
      ctx.beginPath();
      ctx.arc(1024 + dx, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#F7DE8B';
      ctx.fill();
    });
    ctx.restore();
  };
  drawCrestFlourish(38);
  drawCrestFlourish(512 - 38);

  // 3. Central Exact Lettering: "WELCOME TO BODO HANDLOOM HERITAGE"
  const text = 'WELCOME TO BODO HANDLOOM HERITAGE';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 84px "Cinzel", "Playfair Display", "Times New Roman", Georgia, serif';

  // Deep shadow pass
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.98)';
  ctx.lineWidth = 18;
  ctx.strokeText(text, 1024, 256);

  // Golden rim outline
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 6;
  ctx.strokeText(text, 1024, 256);

  // Primary warm ivory / cream text fill
  ctx.fillStyle = '#FFFDF5';
  ctx.fillText(text, 1024, 256);

  // Subtle upper bevel highlight
  ctx.fillStyle = '#FBF3DD';
  ctx.fillText(text, 1024, 254);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a sky gradient texture evoking the serene daylight of rural Assam & Bodoland
 */
function createSkyGradientTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
  skyGrad.addColorStop(0, '#2e75b6'); // Azure zenith
  skyGrad.addColorStop(0.35, '#5ea3d6'); // Clear mid-sky
  skyGrad.addColorStop(0.7, '#a2cbe8'); // Soft atmospheric haze
  skyGrad.addColorStop(0.9, '#dceaf5'); // Warm horizon
  skyGrad.addColorStop(1.0, '#f2e8dc'); // Warm golden ground contact
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Soft high-altitude wispy clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  for (let i = 0; i < 20; i++) {
    const cx = (i * 90 + 30) % 1024;
    const cy = 60 + (i % 5) * 35;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 70 + (i % 4) * 25, 12 + (i % 3) * 6, (i % 3) * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Builds the entire polished outdoor Bodo Village 3D scene with:
 * 1. Natural terrain, grass, and beaten earthen pathways
 * 2. Traditional Bodo architecture (No-Mano homestead, Sal-Ghor workshop, granary, Bathou altar, pavilions)
 * 3. Authentic indigenous flora (banana plants, bamboo groves, betel nut palms, flowering hibiscus)
 * 4. Realistic proportions, soft contact shadows, and atmospheric Himalayan foothills
 * 5. Full backwards compatibility with the VillageAssetSystem slot architecture
 */
export function buildVillageEnvironment(scene: THREE.Scene): {
  collisionObstacles: { minX: number; maxX: number; minZ: number; maxZ: number }[];
  assetSystem: VillageAssetSystem;
  cleanup: () => void;
} {
  const villageGroup = new THREE.Group();
  villageGroup.name = 'BodoVillageGroup';
  scene.add(villageGroup);

  const collisionObstacles: { minX: number; maxX: number; minZ: number; maxZ: number }[] = [];
  const assetSystem = new VillageAssetSystem();

  // ==========================================
  // 1. ATMOSPHERE, SKY DOME & HIMALAYAN FOOTHILLS
  // ==========================================
  const skyTexture = createSkyGradientTexture();
  const skyGeo = new THREE.SphereGeometry(180, 32, 24);
  const skyMat = new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.BackSide,
  });
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  villageGroup.add(skyDome);

  // Distant Mountain Foothills (Himalayas bordering Bodoland / Bhutan)
  // Layer 1: Distant hazy blue-slate ridges
  const mountainFarMat = new THREE.MeshStandardMaterial({
    color: 0x486c7d,
    roughness: 0.95,
    metalness: 0.05,
  });
  // Layer 2: Closer forested green ridges
  const mountainNearMat = new THREE.MeshStandardMaterial({
    color: 0x335948,
    roughness: 0.9,
    metalness: 0.05,
  });

  const mountainRanges = [
    // North / Far Himalayas
    { x: -50, z: -115, scale: [65, 26, 42], rot: 0.25, mat: mountainFarMat },
    { x: 15, z: -125, scale: [85, 32, 50], rot: -0.12, mat: mountainFarMat },
    { x: 80, z: -110, scale: [72, 25, 42], rot: 0.35, mat: mountainNearMat },
    { x: -95, z: -85, scale: [55, 20, 32], rot: -0.28, mat: mountainNearMat },
    // Flanking ridges
    { x: 105, z: 15, scale: [68, 22, 38], rot: 0.45, mat: mountainFarMat },
    { x: -110, z: 18, scale: [68, 22, 38], rot: -0.42, mat: mountainNearMat },
    { x: 95, z: -50, scale: [60, 20, 35], rot: 0.15, mat: mountainNearMat },
    { x: -95, z: -40, scale: [58, 19, 32], rot: -0.15, mat: mountainFarMat },
  ];

  mountainRanges.forEach((m) => {
    const geo = new THREE.ConeGeometry(1, 1, 7);
    const mesh = new THREE.Mesh(geo, m.mat);
    mesh.position.set(m.x, m.scale[1] / 2 - 2, m.z);
    mesh.scale.set(m.scale[0], m.scale[1], m.scale[2]);
    mesh.rotation.y = m.rot;
    villageGroup.add(mesh);
  });

  // Distant Tree Line Perimeter (Replaceable Slot: trees-distant)
  assetSystem.registerSlot(
    'trees-distant',
    villageGroup,
    (proceduralGroup) => {
      // Natural multi-tonal forest foliage
      const treeCanopyMat1 = new THREE.MeshStandardMaterial({ color: 0x244b2a, roughness: 0.85 });
      const treeCanopyMat2 = new THREE.MeshStandardMaterial({ color: 0x335d37, roughness: 0.85 });
      const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3726, roughness: 0.9 });

      for (let i = 0; i < 48; i++) {
        const angle = (i / 48) * Math.PI * 2;
        const dist = 58 + (i % 5) * 3;
        const treeX = Math.cos(angle) * dist;
        const treeZ = Math.sin(angle) * dist;
        const h = 7.5 + (i % 6) * 1.5;

        const treeGroup = new THREE.Group();
        treeGroup.position.set(treeX, 0, treeZ);

        // Trunk
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.45, h * 0.4, 6),
          treeTrunkMat
        );
        trunk.position.y = (h * 0.4) / 2;
        treeGroup.add(trunk);

        // Tiered organic canopy (not just a single cone)
        const mat = i % 2 === 0 ? treeCanopyMat1 : treeCanopyMat2;
        const canopy1 = new THREE.Mesh(new THREE.ConeGeometry(3.6, h * 0.6, 6), mat);
        canopy1.position.y = h * 0.45;
        treeGroup.add(canopy1);

        const canopy2 = new THREE.Mesh(new THREE.ConeGeometry(2.6, h * 0.45, 6), mat);
        canopy2.position.y = h * 0.72;
        treeGroup.add(canopy2);

        proceduralGroup.add(treeGroup);
      }
    },
    [0, 0, 0]
  );

  // ==========================================
  // 2. TERRAIN & ORGANIC BEATEN EARTH PATHWAYS
  // ==========================================
  const terrainTexture = createTerrainTexture();
  const terrainGeo = new THREE.PlaneGeometry(140, 140, 1, 1);
  const terrainMat = new THREE.MeshStandardMaterial({
    map: terrainTexture,
    roughness: 0.95,
    metalness: 0.02,
  });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.rotation.x = -Math.PI / 2;
  terrain.receiveShadow = true;
  villageGroup.add(terrain);

  // Beaten terracotta village paths with soft texture
  const pathTexture = createPathTexture();
  const pathMat = new THREE.MeshStandardMaterial({
    map: pathTexture,
    color: 0x946042,
    roughness: 0.92,
    metalness: 0.03,
  });

  const pathSegments = [
    // Entrance avenue towards central junction
    { pos: [0, 0.015, 14], scale: [3.8, 8], rot: 0 },
    { pos: [0, 0.015, 7], scale: [3.8, 8], rot: 0 },
    { pos: [0, 0.015, 0], scale: [5.2, 5.2], rot: 0 }, // Central village circle / junction

    // Path leading West to Homestead Courtyard & Sal-Ghor
    { pos: [-5.5, 0.015, 3.5], scale: [9, 3.2], rot: 0.2 },
    { pos: [-11, 0.015, 5], scale: [6.5, 5.5], rot: 0 }, // Homestead Sotal courtyard

    // Path connecting Homestead to Sal-Ghor Handloom Workshop
    { pos: [-12.5, 0.015, -2], scale: [3.4, 11], rot: -0.05 },
    { pos: [-11, 0.015, -8.5], scale: [8, 6.5], rot: 0 }, // Sal-Ghor loom forecourt

    // Path leading North to Textile Gallery Pavilion
    { pos: [-5.5, 0.015, -12], scale: [11, 3.2], rot: -0.22 },
    { pos: [0, 0.015, -8], scale: [3.6, 12], rot: 0 },
    { pos: [0, 0.015, -14], scale: [8.5, 7], rot: 0 }, // Textile Pavilion terrace

    // Path leading East to Tools & Silk Compound
    { pos: [6, 0.015, -11.5], scale: [11, 3.2], rot: 0.22 },
    { pos: [11.5, 0.015, -8], scale: [7.5, 6.5], rot: 0 }, // Tools compound apron
    { pos: [12.5, 0.015, -2], scale: [3.4, 10], rot: 0.05 },

    // Path connecting to Motif & Botanical Dyeing Exhibition
    { pos: [12.5, 0.015, 4.5], scale: [7.5, 7], rot: 0 }, // Dyeing courtyard apron
    { pos: [6, 0.015, 4.5], scale: [10, 3.2], rot: -0.25 },
  ];

  pathSegments.forEach((p) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(p.scale[0], p.scale[1]), pathMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = p.rot;
    mesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
    mesh.receiveShadow = true;
    villageGroup.add(mesh);
  });

  // Shared authentic architectural materials
  const thatchTex = createThatchTexture();
  const thatchMat = new THREE.MeshStandardMaterial({
    map: thatchTex,
    roughness: 0.92,
    metalness: 0.02,
  });

  const bambooMatTex = createBambooMatTexture();
  const wallMat = new THREE.MeshStandardMaterial({
    map: bambooMatTex,
    roughness: 0.85,
    metalness: 0.04,
  });

  const timberMat = new THREE.MeshStandardMaterial({
    color: 0x543628,
    roughness: 0.72,
    metalness: 0.08,
  });

  const bambooPostMat = new THREE.MeshStandardMaterial({
    color: 0xc4a362,
    roughness: 0.65,
    metalness: 0.04,
  });

  const earthenPlinthMat = new THREE.MeshStandardMaterial({
    color: 0x7a4c33,
    roughness: 0.95,
  });

  // ==========================================
  // 3. HERITAGE AREA 1: TRADITIONAL HOMESTEAD (NO-MANO) & COURTYARD
  // Location: [-13.5, 0, 4]
  // ==========================================

  // Replaceable Slot: house-main (The Authentic Bodo Residential Homestead)
  assetSystem.registerSlot(
    'house-main',
    villageGroup,
    (houseGroup) => {
      // 1. Raised earthen foundation plinth (Dhibi / Pitha)
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.35, 5.8), earthenPlinthMat);
      plinth.position.set(0, 0.175, 0);
      plinth.receiveShadow = true;
      houseGroup.add(plinth);

      // Low earthen front step
      const step = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.6), earthenPlinthMat);
      step.position.set(0, 0.075, 3.1);
      step.receiveShadow = true;
      houseGroup.add(step);

      // 2. Main enclosed residential room (rear & sides)
      const room = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.5, 3.8), wallMat);
      room.position.set(0, 1.6, -0.7);
      room.castShadow = true;
      room.receiveShadow = true;
      houseGroup.add(room);

      // Window frames with bamboo vertical security bars (Khirki)
      [-2.4, 2.4].forEach((wx) => {
        const winFrame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 0.08), timberMat);
        winFrame.position.set(wx, 1.7, 1.22);
        houseGroup.add(winFrame);

        [-0.3, 0, 0.3].forEach((bx) => {
          const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.74, 6), bambooPostMat);
          bar.position.set(wx + bx, 1.7, 1.23);
          houseGroup.add(bar);
        });
      });

      // Wooden entrance doorway opening
      const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.0, 0.08), timberMat);
      doorFrame.position.set(0, 1.35, 1.22);
      houseGroup.add(doorFrame);

      const doorPanel = new THREE.Mesh(
        new THREE.PlaneGeometry(1.0, 1.85),
        new THREE.MeshStandardMaterial({ color: 0x3d2719, roughness: 0.8 })
      );
      doorPanel.position.set(0, 1.35, 1.24);
      houseGroup.add(doorPanel);

      // 3. Open front veranda (Dakhin-duari / Chali) with 4 timber pillars
      [-3.4, -1.2, 1.2, 3.4].forEach((px) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 2.7, 8), timberMat);
        pillar.position.set(px, 1.52, 2.4);
        pillar.castShadow = true;
        houseGroup.add(pillar);
      });

      // Low bamboo veranda balustrade / railing
      const railMat = new THREE.MeshStandardMaterial({ color: 0xb59963, roughness: 0.75 });
      const rail = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.06, 0.05), railMat);
      rail.position.set(0, 0.75, 2.4);
      houseGroup.add(rail);

      // Veranda timber lintel beam
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.12, 0.12), timberMat);
      lintel.position.set(0, 2.8, 2.4);
      houseGroup.add(lintel);

      // 4. Thatched Gabled Roof (Kheror No) with realistic eaves overhang
      const roofGeo = new THREE.ConeGeometry(6.2, 2.6, 4);
      const roof = new THREE.Mesh(roofGeo, thatchMat);
      roof.position.set(0, 3.8, 0.2);
      roof.scale.set(1.45, 0.9, 1.15);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      roof.receiveShadow = true;
      houseGroup.add(roof);

      // Bamboo Ridge Cap (Kharom) along top peak
      const ridgeCap = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.15, 0.2), bambooPostMat);
      ridgeCap.position.set(0, 4.85, 0.2);
      houseGroup.add(ridgeCap);

      // Warm veranda lantern light
      const lantern = new THREE.PointLight(0xffecc2, 1.8, 8, 1.4);
      lantern.position.set(0, 2.4, 2.2);
      houseGroup.add(lantern);
    },
    [-13.5, 0, 4.0]
  );

  // Replaceable Slot: props-bench (Veranda Wooden Bench)
  assetSystem.registerSlot(
    'props-bench',
    villageGroup,
    (benchGroup) => {
      // Seat
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.45), timberMat);
      seat.position.set(0, 0.45, 0);
      benchGroup.add(seat);
      // Legs
      [-0.65, 0.65].forEach((bx) => {
        [-0.15, 0.15].forEach((bz) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 6), timberMat);
          leg.position.set(bx, 0.225, bz);
          benchGroup.add(leg);
        });
      });
    },
    [-12.2, 0, 5.8]
  );

  // Replaceable Slot: props-pitcher (Brass Water Lota & Vessel)
  assetSystem.registerSlot(
    'props-pitcher',
    villageGroup,
    (pitcherGroup) => {
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.35, metalness: 0.8 });
      const pot = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), brassMat);
      pot.position.y = 0.18;
      pot.scale.set(1, 0.85, 1);
      pitcherGroup.add(pot);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.14, 12), brassMat);
      neck.position.y = 0.32;
      pitcherGroup.add(neck);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 16), brassMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.38;
      pitcherGroup.add(rim);
    },
    [-14.8, 0.35, 5.8]
  );

  // Replaceable Slot: house-granary (Raised Stilt Granary - Bakhri / Bhoral)
  assetSystem.registerSlot(
    'house-granary',
    villageGroup,
    (granaryGroup) => {
      // 4 Heavy timber stilts with anti-rodent disc guards (Dhol)
      [-1.3, 1.3].forEach((gx) => {
        [-1.1, 1.1].forEach((gz) => {
          const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.4, 8), timberMat);
          stilt.position.set(gx, 0.7, gz);
          stilt.castShadow = true;
          granaryGroup.add(stilt);

          // Disc rat-guard
          const ratGuard = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 12), timberMat);
          ratGuard.position.set(gx, 1.25, gz);
          granaryGroup.add(ratGuard);
        });
      });

      // Raised timber platform
      const granPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.15, 2.8), timberMat);
      granPlinth.position.set(0, 1.45, 0);
      granaryGroup.add(granPlinth);

      // Granary woven body (Bakhri)
      const granBody = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.9, 2.4), wallMat);
      granBody.position.set(0, 2.4, 0);
      granBody.castShadow = true;
      granaryGroup.add(granBody);

      // Thatched pyramid roof with eaves
      const granRoof = new THREE.Mesh(new THREE.ConeGeometry(2.7, 1.7, 4), thatchMat);
      granRoof.position.set(0, 4.15, 0);
      granRoof.rotation.y = Math.PI / 4;
      granRoof.castShadow = true;
      granaryGroup.add(granRoof);

      // Small wooden ladder leading to granary door
      const ladderMat = new THREE.MeshStandardMaterial({ color: 0x5a3d2e, roughness: 0.8 });
      [-0.2, 0.2].forEach((lx) => {
        const side = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.7, 6), ladderMat);
        side.position.set(lx, 0.75, 1.6);
        side.rotation.x = -0.32;
        granaryGroup.add(side);
      });
      [0.3, 0.6, 0.9, 1.2].forEach((ry) => {
        const rung = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.03), ladderMat);
        rung.position.set(0, ry, 1.95 - ry * 0.4);
        granaryGroup.add(rung);
      });
    },
    [-18.5, 0, -1.0]
  );

  // Replaceable Slot: bathou-altar (Sacred Courtyard Altar)
  assetSystem.registerSlot(
    'bathou-altar',
    villageGroup,
    (bathouGroup) => {
      // Circular stepped earthen altar plinth
      const altarBase = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.45, 0.3, 24), earthenPlinthMat);
      altarBase.position.y = 0.15;
      altarBase.receiveShadow = true;
      bathouGroup.add(altarBase);

      const upperPlinth = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.1, 0.18, 24), earthenPlinthMat);
      upperPlinth.position.y = 0.35;
      bathouGroup.add(upperPlinth);

      // 5 Concentric rings of split bamboo fence (Bathou Sali)
      const ringHeights = [0.45, 0.6, 0.75, 0.9, 1.05];
      ringHeights.forEach((ry, idx) => {
        const radius = 1.08 - idx * 0.05;
        const ringGeo = new THREE.TorusGeometry(radius, 0.025, 6, 24);
        const ringMesh = new THREE.Mesh(ringGeo, bambooPostMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = ry;
        bathouGroup.add(ringMesh);
      });

      // 18 Small bamboo vertical boundary stakes supporting the rings
      for (let i = 0; i < 18; i++) {
        const ang = (i / 18) * Math.PI * 2;
        const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 1.1, 6), bambooPostMat);
        stake.position.set(Math.cos(ang) * 1.05, 0.55, Math.sin(ang) * 1.05);
        bathouGroup.add(stake);
      }

      // Sacred Siju plant (Euphorbia antiquorum) with five-angled segmented branches
      const sijuStemMat = new THREE.MeshStandardMaterial({ color: 0x366935, roughness: 0.65 });
      const sijuTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 1.6, 8), sijuStemMat);
      sijuTrunk.position.y = 1.15;
      sijuTrunk.castShadow = true;
      bathouGroup.add(sijuTrunk);

      // 5 Arching branches radiating in 5 directions (5 sacred principles)
      [0, 1.256, 2.513, 3.769, 5.026].forEach((ang) => {
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.65, 6), sijuStemMat);
        branch.position.set(Math.cos(ang) * 0.22, 1.45, Math.sin(ang) * 0.22);
        branch.rotation.z = Math.cos(ang) * 0.45;
        branch.rotation.x = Math.sin(ang) * 0.45;
        bathouGroup.add(branch);
      });

      // Sacred brass offering oil lamp (Bathi) at base
      const lampMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.35, metalness: 0.8 });
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.05, 12), lampMat);
      lamp.position.set(0.45, 0.45, 0.45);
      bathouGroup.add(lamp);
    },
    [-8.2, 0, 7.5]
  );

  collisionObstacles.push({ minX: -18, maxX: -9, minZ: 0.5, maxZ: 7.5 });
  collisionObstacles.push({ minX: -20.5, maxX: -16.5, minZ: -3, maxZ: 1 });

  // ==========================================
  // 4. HERITAGE AREA 2: HANDLOOM WORKSHOP (SAL-GHOR)
  // Location: [-12, 0, -9]
  // ==========================================

  // Replaceable Slot: workshop-shed
  assetSystem.registerSlot(
    'workshop-shed',
    villageGroup,
    (shedGroup) => {
      const workshopPlinth = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.35, 6.8), earthenPlinthMat);
      workshopPlinth.position.set(0, 0.175, 0);
      workshopPlinth.receiveShadow = true;
      shedGroup.add(workshopPlinth);

      // 6 Sturdy timber posts with diagonal braces
      [-3.8, 0, 3.8].forEach((wx) => {
        [-2.8, 2.8].forEach((wz) => {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 3.2, 8), timberMat);
          post.position.set(wx, 1.7, wz);
          post.castShadow = true;
          shedGroup.add(post);
        });
      });

      // Longitudinal tie beams
      [-2.8, 2.8].forEach((wz) => {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.12, 0.12), timberMat);
        beam.position.set(0, 3.1, wz);
        shedGroup.add(beam);
      });

      // Sloping Thatched Roof with natural eaves
      const shedRoof = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.28, 7.4), thatchMat);
      shedRoof.position.set(0, 3.45, 0);
      shedRoof.rotation.x = -0.12;
      shedRoof.castShadow = true;
      shedRoof.receiveShadow = true;
      shedGroup.add(shedRoof);

      // Warm workshop illumination
      const shedLight = new THREE.PointLight(0xfff2d4, 2.0, 10, 1.2);
      shedLight.position.set(0, 2.8, 0);
      shedGroup.add(shedLight);
    },
    [-12, 0, -9]
  );

  // Replaceable Slot: loom-frame (Traditional Loom Frame)
  assetSystem.registerSlot(
    'loom-frame',
    villageGroup,
    (loomGroup) => {
      [-1.15, 1.15].forEach((lx) => {
        [-0.85, 0.85].forEach((lz) => {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.0, 0.12), timberMat);
          post.position.set(lx, 1.0, lz);
          post.castShadow = true;
          loomGroup.add(post);
        });
      });

      [-0.85, 0.85].forEach((lz) => {
        const topBeam = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.1), timberMat);
        topBeam.position.set(0, 1.95, lz);
        loomGroup.add(topBeam);
      });

      [-1.15, 1.15].forEach((lx) => {
        const sideBeam = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.8), timberMat);
        sideBeam.position.set(lx, 0.95, 0);
        loomGroup.add(sideBeam);
      });

      const weaverSeat = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 0.38), timberMat);
      weaverSeat.position.set(0, 0.45, 1.0);
      loomGroup.add(weaverSeat);
    },
    [-12, 0.35, -9]
  );

  // Replaceable Slot: loom-reeds (Warp Beam & Reed Rakh)
  assetSystem.registerSlot(
    'loom-reeds',
    villageGroup,
    (reedsGroup) => {
      const warpBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.3, 12), timberMat);
      warpBeam.rotation.z = Math.PI / 2;
      warpBeam.position.set(0, 0, -0.65);
      reedsGroup.add(warpBeam);

      const clothBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.3, 12), timberMat);
      clothBeam.rotation.z = Math.PI / 2;
      clothBeam.position.set(0, -0.4, 0.65);
      reedsGroup.add(clothBeam);

      const reedFrame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.38, 0.06), timberMat);
      reedFrame.position.set(0, 0.15, 0);
      reedsGroup.add(reedFrame);

      // Gold silk warp threads stretched across loom
      const warpThreads = new THREE.Mesh(
        new THREE.PlaneGeometry(1.8, 1.3),
        new THREE.MeshStandardMaterial({
          color: 0xdfba48,
          roughness: 0.55,
          side: THREE.DoubleSide,
        })
      );
      warpThreads.rotation.x = Math.PI / 2;
      warpThreads.position.set(0, -0.05, 0);
      reedsGroup.add(warpThreads);
    },
    [-12, 1.25, -9.1]
  );

  // Replaceable Slot: loom-treadles (Pedals & Shuttle Maku)
  assetSystem.registerSlot(
    'loom-treadles',
    villageGroup,
    (treadlesGroup) => {
      [-0.22, 0.22].forEach((tx) => {
        const treadle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.75), timberMat);
        treadle.position.set(tx, -0.2, 0.2);
        treadle.rotation.x = -0.2;
        treadlesGroup.add(treadle);
      });

      const hornMat = new THREE.MeshStandardMaterial({
        color: 0x1a1614,
        roughness: 0.25,
        metalness: 0.45,
      });
      const shuttle = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.07), hornMat);
      shuttle.position.set(0.3, 0.05, 0);
      shuttle.rotation.y = 0.2;
      treadlesGroup.add(shuttle);
    },
    [-12, 0.9, -8.7]
  );

  // Replaceable Slot: loom-yarn (Dyed Yarn Skeins Khabang)
  assetSystem.registerSlot(
    'loom-yarn',
    villageGroup,
    (yarnGroup) => {
      // Authentic Bodo natural dye colors: Turmeric Gold, Madder Red, Fermented Indigo, Natural Eri Silk, Botanical Green
      const yarnColors = [0xdeb841, 0xb83838, 0x27496d, 0xf0ece1, 0x477038];
      yarnColors.forEach((color, idx) => {
        const skein = new THREE.Mesh(
          new THREE.TorusGeometry(0.22, 0.055, 8, 16),
          new THREE.MeshStandardMaterial({ color, roughness: 0.88 })
        );
        skein.position.set((idx - 2) * 0.48, 0, 0);
        skein.scale.set(0.6, 1.5, 0.6);
        yarnGroup.add(skein);
      });
    },
    [-9.5, 1.8, -10.5]
  );

  collisionObstacles.push({ minX: -16.5, maxX: -7.5, minZ: -12.5, maxZ: -5.5 });

  // ==========================================
  // 5. HERITAGE AREA 3: TEXTILE GALLERY (DOKHONA PAVILION)
  // Location: [0, 0, -16]
  // ==========================================

  // Replaceable Slot: textile-pavilion
  assetSystem.registerSlot(
    'textile-pavilion',
    villageGroup,
    (textilePavilion) => {
      const galleryPlinth = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.4, 7.6), earthenPlinthMat);
      galleryPlinth.position.set(0, 0.2, 0);
      galleryPlinth.receiveShadow = true;
      textilePavilion.add(galleryPlinth);

      // 6 Polished columns with carved capital brackets
      [-4.0, 0, 4.0].forEach((px) => {
        [-3.2, 3.2].forEach((pz) => {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 3.3, 8), timberMat);
          col.position.set(px, 1.85, pz);
          col.castShadow = true;
          textilePavilion.add(col);

          // Capital bracket
          const cap = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.42), timberMat);
          cap.position.set(px, 3.45, pz);
          textilePavilion.add(cap);
        });
      });

      // Thatched double hip roof
      const galleryRoof = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.35, 8.2), thatchMat);
      galleryRoof.position.set(0, 3.65, 0);
      galleryRoof.rotation.x = -0.05;
      galleryRoof.castShadow = true;
      textilePavilion.add(galleryRoof);
    },
    [0, 0, -16]
  );

  // Replaceable Slot: textile-dokhona (Dokhona Drape Display)
  assetSystem.registerSlot(
    'textile-dokhona',
    villageGroup,
    (drape1) => {
      const dokhonaMat = new THREE.MeshStandardMaterial({ color: 0xdeb038, roughness: 0.7 });
      const borderMat = new THREE.MeshStandardMaterial({ color: 0x9e2424, roughness: 0.6 });

      const stand1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), timberMat);
      stand1.position.y = 1.1;
      drape1.add(stand1);
      const bar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), timberMat);
      bar1.rotation.z = Math.PI / 2;
      bar1.position.y = 2.1;
      drape1.add(bar1);

      const fabricBody1 = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.7), dokhonaMat);
      fabricBody1.position.set(0, 1.25, 0.02);
      drape1.add(fabricBody1);

      const fabricBorder1 = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.35), borderMat);
      fabricBorder1.position.set(0, 0.55, 0.03);
      drape1.add(fabricBorder1);
    },
    [-1.8, 0.4, -16.6]
  );

  // Replaceable Slot: textile-aronai (Aronai Ceremonial Scarf Display)
  assetSystem.registerSlot(
    'textile-aronai',
    villageGroup,
    (drape2) => {
      const stand2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), timberMat);
      stand2.position.y = 1.1;
      drape2.add(stand2);
      const bar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), timberMat);
      bar2.rotation.z = Math.PI / 2;
      bar2.position.y = 2.1;
      drape2.add(bar2);

      const aronaiFabric = new THREE.Mesh(
        new THREE.PlaneGeometry(0.65, 1.8),
        new THREE.MeshStandardMaterial({ color: 0xc43d3d, roughness: 0.7 })
      );
      aronaiFabric.position.set(0, 1.2, 0.02);
      drape2.add(aronaiFabric);

      const aronaiEnd = new THREE.Mesh(
        new THREE.PlaneGeometry(0.65, 0.35),
        new THREE.MeshStandardMaterial({ color: 0xf5d061, roughness: 0.6 })
      );
      aronaiEnd.position.set(0, 0.45, 0.03);
      drape2.add(aronaiEnd);
    },
    [1.8, 0.4, -16.6]
  );

  // Replaceable Slot: exhibit-photo-gallery (Master Weaver Ethnographic Photo Gallery Wall)
  assetSystem.registerSlot(
    'exhibit-photo-gallery',
    villageGroup,
    (photoGalleryGroup) => {
      const texLoader = new THREE.TextureLoader();
      const teakMat = new THREE.MeshStandardMaterial({ color: 0x301e12, roughness: 0.65 });
      const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.35, metalness: 0.7 });
      const plaqueMat = new THREE.MeshStandardMaterial({ color: 0xbfa15f, roughness: 0.4, metalness: 0.6 });

      // Gallery Wall Backing
      const galleryWall = new THREE.Mesh(new THREE.BoxGeometry(7.4, 2.4, 0.1), teakMat);
      galleryWall.position.set(0, 0, 0);
      galleryWall.receiveShadow = true;
      photoGalleryGroup.add(galleryWall);

      // Top Header Plate
      const headerPlate = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.24, 0.14), goldTrimMat);
      headerPlate.position.set(0, 1.05, 0.02);
      photoGalleryGroup.add(headerPlate);

      // 4 Ethnographic photographs from public/assets/images/about/
      const PHOTOS = [
        {
          id: 'photo-sal-weaver',
          file: 'about-1.JPG',
          title: 'Master Weaver at Sal Loom',
          bodoTitle: 'साल दाग्रा बैरागी',
          desc: 'Living ethnographic documentation of traditional Bodo handloom shuttle throwing.',
        },
        {
          id: 'photo-eri-silk',
          file: 'about-3.JPG',
          title: 'Wild Eri Silk Harvest',
          bodoTitle: 'एरा खुन आरो एन्दिखा',
          desc: 'Sorting and manual reeling of Ahimsa peace silk cocoons.',
        },
        {
          id: 'photo-botanical-dye',
          file: 'about-4.JPG',
          title: 'Natural Botanical Dyeing',
          bodoTitle: 'निल आरो हालदै रं',
          desc: 'Herbal fermentation and skein dyeing with indigenous plant mordants.',
        },
        {
          id: 'photo-dokhona-master',
          file: 'about-5.JPG',
          title: 'Dokhona Thaosi Heirloom',
          bodoTitle: 'दखना थावसि',
          desc: 'Master artisan presenting an intricately patterned golden yellow Dokhona.',
        },
      ];

      const frameWidth = 1.48;
      const frameHeight = 1.32;
      const spacingX = 1.68;
      const startX = -2.52;

      PHOTOS.forEach((p, idx) => {
        const posX = startX + idx * spacingX;
        const frameGroup = new THREE.Group();
        frameGroup.position.set(posX, -0.05, 0.08);

        const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(frameWidth, frameHeight, 0.06), teakMat);
        frameGroup.add(outerFrame);
        const innerBevel = new THREE.Mesh(new THREE.BoxGeometry(frameWidth - 0.08, frameHeight - 0.08, 0.07), goldTrimMat);
        frameGroup.add(innerBevel);

        const photoTex = texLoader.load(`/assets/images/about/${p.file}`);
        photoTex.colorSpace = THREE.SRGBColorSpace;
        const photoMat = new THREE.MeshStandardMaterial({
          map: photoTex,
          roughness: 0.35,
          metalness: 0.05,
        });
        const photoMesh = new THREE.Mesh(new THREE.PlaneGeometry(frameWidth - 0.16, frameHeight - 0.3), photoMat);
        photoMesh.position.set(0, 0.06, 0.04);
        (photoMesh as any).hotspotData = {
          id: `hs-${p.id}`,
          name: p.title,
          zone: 'TEXTILE GALLERY',
          position: [posX, 1.6 - 0.05, -18.2],
          artifact: {
            id: p.id,
            name: p.title,
            bodoName: p.bodoTitle,
            category: 'TEXTILES',
            description: p.desc,
            culturalSignificance: `Authentic ethnographic field photograph documenting Bodo handloom heritage practices.`,
            image: `/assets/images/about/${p.file}`,
            imageUrl: `/assets/images/about/${p.file}`,
          },
          info: `${p.bodoTitle} — ${p.desc}`,
        };
        frameGroup.add(photoMesh);

        const plaque = new THREE.Mesh(new THREE.BoxGeometry(frameWidth - 0.25, 0.12, 0.02), plaqueMat);
        plaque.position.set(0, -0.48, 0.04);
        frameGroup.add(plaque);

        const photoSpot = new THREE.SpotLight(0xfffae6, 2.0, 5, Math.PI / 6, 0.4);
        photoSpot.position.set(0, 1.5, 1.2);
        photoSpot.target = photoMesh;
        frameGroup.add(photoSpot);

        photoGalleryGroup.add(frameGroup);
      });
    },
    [0, 1.6, -18.8]
  );

  collisionObstacles.push({ minX: -5.2, maxX: 5.2, minZ: -20.0, maxZ: -13.5 });

  // ==========================================
  // 6. HERITAGE AREA 4: TOOLS & MATERIALS COMPOUND
  // Location: [13, 0, -9]
  // ==========================================

  // Replaceable Slot: tools-shelter
  assetSystem.registerSlot(
    'tools-shelter',
    villageGroup,
    (toolsCompound) => {
      const toolsPlinth = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.35, 6.5), earthenPlinthMat);
      toolsPlinth.position.set(0, 0.175, 0);
      toolsPlinth.receiveShadow = true;
      toolsCompound.add(toolsPlinth);

      [-3.2, 3.2].forEach((tx) => {
        [-2.6, 2.6].forEach((tz) => {
          const p = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 2.8, 8), bambooPostMat);
          p.position.set(tx, 1.55, tz);
          p.castShadow = true;
          toolsCompound.add(p);
        });
      });

      const toolsRoof = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.22, 7.0), thatchMat);
      toolsRoof.position.set(0, 3.0, 0);
      toolsRoof.rotation.x = -0.15;
      toolsRoof.castShadow = true;
      toolsCompound.add(toolsRoof);
    },
    [13, 0, -9]
  );

  // Replaceable Slot: tools-baskets (Cane Baskets Khara with Cocoons)
  assetSystem.registerSlot(
    'tools-baskets',
    villageGroup,
    (basketsGroup) => {
      const caneMat = new THREE.MeshStandardMaterial({ color: 0x9e7b4b, roughness: 0.8 });
      const cocoonMat = new THREE.MeshStandardMaterial({ color: 0xf4eedb, roughness: 0.5 });

      [-1.5, 0, 1.5].forEach((bx) => {
        const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.35, 0.45, 12), caneMat);
        basket.position.set(bx, 0, 0);
        basket.castShadow = true;
        basketsGroup.add(basket);

        const cocoons = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), cocoonMat);
        cocoons.position.set(bx, 0.17, 0);
        cocoons.scale.set(1, 0.6, 1);
        basketsGroup.add(cocoons);
      });
    },
    [13, 0.55, -9.6]
  );

  // Replaceable Slot: tools-table
  assetSystem.registerSlot(
    'tools-table',
    villageGroup,
    (tableGroup) => {
      const toolsTable = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.7, 1.3), timberMat);
      toolsTable.position.set(0, 0, 0);
      toolsTable.castShadow = true;
      tableGroup.add(toolsTable);
    },
    [13, 0.7, -7.9]
  );

  // Replaceable Slot: tools-janthi (Janthi Winding Reel)
  assetSystem.registerSlot(
    'tools-janthi',
    villageGroup,
    (janthiGroup) => {
      const janthiX = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), bambooPostMat);
      janthiX.rotation.z = 0.78;
      janthiGroup.add(janthiX);

      const janthiY = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), bambooPostMat);
      janthiY.rotation.z = -0.78;
      janthiGroup.add(janthiY);
    },
    [12.2, 1.3, -7.9]
  );

  // Dedicated Tool Slots
  assetSystem.registerSlot(
    'tool-makuu',
    villageGroup,
    (g) => {
      const bambooMat = new THREE.MeshStandardMaterial({ color: 0xc4a362, roughness: 0.65 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.8 });
      const silkMat = new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.5 });

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.05, 0.08), bambooMat);
      g.add(body);
      [-0.24, 0.24].forEach((x) => {
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.08, 12), goldMat);
        tip.rotation.z = x < 0 ? Math.PI / 2 : -Math.PI / 2;
        tip.position.set(x, 0, 0);
        g.add(tip);
      });
      const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.22, 12), silkMat);
      spool.rotation.z = Math.PI / 2;
      g.add(spool);
    },
    [-10.2, 0.45, -8.5]
  );

  assetSystem.registerSlot(
    'tool-paddle',
    villageGroup,
    (g) => {
      const pedal = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.65), timberMat);
      pedal.rotation.x = 0.15;
      g.add(pedal);
      const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.2, 8), bambooPostMat);
      pivot.rotation.z = Math.PI / 2;
      pivot.position.set(0, -0.02, -0.28);
      g.add(pivot);
    },
    [-11.8, 0.45, -8.3]
  );

  assetSystem.registerSlot(
    'tool-bobbin-case',
    villageGroup,
    (g) => {
      const silkMat = new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.5 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.8 });

      const caseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.26, 16), timberMat);
      g.add(caseMesh);
      const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.18, 12), silkMat);
      spool.position.set(0, 0.06, 0);
      g.add(spool);
      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), goldMat);
      finial.position.set(0, 0.18, 0);
      g.add(finial);
    },
    [-13.2, 0.45, -8.5]
  );

  assetSystem.registerSlot(
    'tool-swrki',
    villageGroup,
    (g) => {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.05), timberMat);
      g.add(frame);
      const teeth = new THREE.Mesh(
        new THREE.PlaneGeometry(0.75, 0.14),
        new THREE.MeshStandardMaterial({ color: 0xd9ba7a, roughness: 0.5, side: THREE.DoubleSide })
      );
      teeth.position.set(0, 0, 0.026);
      g.add(teeth);
    },
    [12.2, 0.45, -9.8]
  );

  assetSystem.registerSlot(
    'tool-zenther',
    villageGroup,
    (g) => {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.05, 0.28), timberMat);
      g.add(base);
      [-0.2, 0.2].forEach((x) => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.34, 0.05), timberMat);
        col.position.set(x, 0.17, 0);
        g.add(col);
      });
      [0.12, 0.22].forEach((y) => {
        const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.36, 12), timberMat);
        roller.rotation.z = Math.PI / 2;
        roller.position.set(0, y, 0);
        g.add(roller);
      });
      const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.16, 8), bambooPostMat);
      crank.position.set(0.22, 0.22, 0.08);
      g.add(crank);
    },
    [11.2, 0.45, -8.0]
  );

  assetSystem.registerSlot(
    'tool-mushra',
    villageGroup,
    (g) => {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), bambooPostMat);
      stem.position.set(0, 0.17, 0);
      g.add(stem);
      const cross = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.04), timberMat);
      cross.position.set(0, 0.32, 0);
      g.add(cross);
    },
    [13.2, 0.45, -8.0]
  );

  collisionObstacles.push({ minX: 10.5, maxX: 16.0, minZ: -12.0, maxZ: -6.5 });

  // ==========================================
  // 7. HERITAGE AREA 5: MOTIF & BOTANICAL DYEING
  // Location: [14, 0, 5]
  // ==========================================

  // Replaceable Slot: motif-pavilion
  assetSystem.registerSlot(
    'motif-pavilion',
    villageGroup,
    (motifCompound) => {
      const motifPlinth = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.35, 6.5), earthenPlinthMat);
      motifPlinth.position.set(0, 0.175, 0);
      motifPlinth.receiveShadow = true;
      motifCompound.add(motifPlinth);

      [-3.2, 3.2].forEach((mx) => {
        [-2.6, 2.6].forEach((mz) => {
          const p = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 2.8, 8), timberMat);
          p.position.set(mx, 1.55, mz);
          p.castShadow = true;
          motifCompound.add(p);
        });
      });

      const motifRoof = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.22, 7.0), thatchMat);
      motifRoof.position.set(0, 3.0, 0);
      motifRoof.rotation.x = 0.15;
      motifRoof.castShadow = true;
      motifCompound.add(motifRoof);
    },
    [14, 0, 5]
  );

  // Replaceable Slot: motif-board (Sacred Agor Pattern Exhibition Gallery)
  assetSystem.registerSlot(
    'motif-board',
    villageGroup,
    (boardGroup) => {
      const texLoader = new THREE.TextureLoader();
      const timberFrameMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.7 });
      const goldFrameMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.35, metalness: 0.75 });
      const brassPlaqueMat = new THREE.MeshStandardMaterial({ color: 0xbfa15f, roughness: 0.4, metalness: 0.6 });

      const wallBackdrop = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.4, 0.12), timberFrameMat);
      wallBackdrop.position.set(0, 0, 0);
      wallBackdrop.castShadow = true;
      wallBackdrop.receiveShadow = true;
      boardGroup.add(wallBackdrop);

      const titleBanner = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.3, 0.16), goldFrameMat);
      titleBanner.position.set(0, 1.05, 0.03);
      boardGroup.add(titleBanner);

      const MOTIF_GALLERY = [
        { id: 'hajw-agor', name: 'Hajw Agor', bodoName: 'हाजो आगोर', file: 'motif-01.jpg', meaning: 'Sacred Himalayan foothills & protection' },
        { id: 'daorai-agor', name: 'Daorai Agor', bodoName: 'दावराय आगोर', file: 'motif-02.jpg', meaning: 'Wild peacock plume dance of celebration' },
        { id: 'pharew-megon', name: 'Pharew Megon', bodoName: 'फारेव मेगन', file: 'motif-03.jpg', meaning: "Pigeon's eye spiritual vigilance" },
        { id: 'daothu-gidob', name: 'Daothu Gidob', bodoName: 'दावथु गिदब', file: 'motif-04.jpg', meaning: 'Resting forest dove of communal peace' },
        { id: 'gorkha-agor', name: 'Gorkha Agor', bodoName: 'गोर्खा आगोर', file: 'motif-05.jpg', meaning: 'Ancestral shield & courage amulet' },
        { id: 'thaigir-bibar', name: 'Thaigir Bibar', bodoName: 'थाइगिर बिबार', file: 'motif-06.jpg', meaning: 'Elephant apple blossom auspicious harvest' },
        { id: 'khungkhri-agor', name: 'Khungkhri Agor', bodoName: 'खुंख्रि आगोर', file: 'motif-07.jpg', meaning: 'Sacred stepped triangle cosmic order' },
        { id: 'makar-agor', name: 'Makar Agor', bodoName: 'माकार आगोर', file: 'motif-08.jpg', meaning: 'River dragon of life-giving waters' },
      ];

      const cols = 4;
      const startX = -1.8;
      const gapX = 1.2;
      const rowY = [0.45, -0.45];

      MOTIF_GALLERY.forEach((m, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const posX = startX + col * gapX;
        const posY = rowY[row];

        const panelGroup = new THREE.Group();
        panelGroup.position.set(posX, posY, 0.08);

        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.72, 0.05), goldFrameMat);
        panelGroup.add(frame);

        const tex = texLoader.load(`/assets/images/motifs/${m.file}`);
        tex.colorSpace = THREE.SRGBColorSpace;
        const picMat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.5,
          metalness: 0.05,
        });
        const picture = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.52), picMat);
        picture.position.set(0, 0.05, 0.03);
        (picture as any).hotspotData = {
          id: `hs-${m.id}`,
          name: m.name,
          zone: 'MOTIF & BOTANICAL DYEING',
          position: [14 + posX, 1.7 + posY, 3.2],
          artifact: {
            id: m.id,
            name: m.name,
            bodoName: m.bodoName,
            category: 'MOTIFS',
            description: m.meaning,
            culturalSignificance: `Authentic traditional Bodo Agor pattern documented from living master weavers across Bodoland. ${m.meaning}.`,
            image: `/assets/images/motifs/${m.file}`,
            imageUrl: `/assets/images/motifs/${m.file}`,
          },
          info: `${m.bodoName} — ${m.meaning}`,
        };
        panelGroup.add(picture);

        const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.1, 0.02), brassPlaqueMat);
        plaque.position.set(0, -0.27, 0.03);
        panelGroup.add(plaque);

        boardGroup.add(panelGroup);
      });

      const wallSpot = new THREE.SpotLight(0xfffae6, 3.0, 10, Math.PI / 4, 0.4);
      wallSpot.position.set(0, 2.5, 2.5);
      wallSpot.target = wallBackdrop;
      boardGroup.add(wallSpot);
    },
    [14, 1.7, 3.2]
  );

  // Replaceable Slot: dyeing-indigo (Fermented Indigo Cauldron)
  assetSystem.registerSlot(
    'dyeing-indigo',
    villageGroup,
    (indigoGroup) => {
      const clayHearthMat = new THREE.MeshStandardMaterial({ color: 0x5a3f2d, roughness: 0.9 });
      const indigoPotMat = new THREE.MeshStandardMaterial({ color: 0x24375b, roughness: 0.4 });

      const hearth = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.4, 12), clayHearthMat);
      hearth.position.set(0, -0.15, 0);
      hearth.castShadow = true;
      indigoGroup.add(hearth);

      const pot = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), indigoPotMat);
      pot.position.set(0, 0.15, 0);
      pot.scale.set(1, 0.85, 1);
      pot.castShadow = true;
      indigoGroup.add(pot);
    },
    [12.9, 0.65, 6.2]
  );

  // Replaceable Slot: dyeing-turmeric (Turmeric Golden Cauldron)
  assetSystem.registerSlot(
    'dyeing-turmeric',
    villageGroup,
    (turmericGroup) => {
      const clayHearthMat = new THREE.MeshStandardMaterial({ color: 0x5a3f2d, roughness: 0.9 });
      const turmericPotMat = new THREE.MeshStandardMaterial({ color: 0x8a6322, roughness: 0.4 });

      const hearth = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.4, 12), clayHearthMat);
      hearth.position.set(0, -0.15, 0);
      hearth.castShadow = true;
      turmericGroup.add(hearth);

      const pot = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), turmericPotMat);
      pot.position.set(0, 0.15, 0);
      pot.scale.set(1, 0.85, 1);
      pot.castShadow = true;
      turmericGroup.add(pot);
    },
    [15.1, 0.65, 6.2]
  );

  collisionObstacles.push({ minX: 11.5, maxX: 16.5, minZ: 2.5, maxZ: 7.5 });

  // ==========================================
  // 8. VILLAGE ENTRANCE (TORANA ARCHWAY & WELCOME SIGNBOARD)
  // Location: [0, 0, 12.5]
  // ==========================================

  // Replaceable Slot: entrance-gate (Torana Archway Structure)
  assetSystem.registerSlot(
    'entrance-gate',
    villageGroup,
    (gateProceduralGroup) => {
      // Twin bamboo gateway posts
      [-2.2, 2.2].forEach((gx) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 3.8, 8), bambooPostMat);
        post.position.set(gx, 1.9, 0);
        post.castShadow = true;
        gateProceduralGroup.add(post);
      });

      // Bamboo Cross beam
      const crossBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.2, 8), bambooPostMat);
      crossBeam.rotation.z = Math.PI / 2;
      crossBeam.position.set(0, 3.5, 0);
      gateProceduralGroup.add(crossBeam);

      // Thatched arch canopy
      const archCanopy = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.25, 1.4), thatchMat);
      archCanopy.position.set(0, 3.9, 0);
      archCanopy.castShadow = true;
      gateProceduralGroup.add(archCanopy);

      // Hanging ties / bamboo bindings from crossbeam to signboard
      const tieGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.38, 8);
      [-1.5, 1.5].forEach((tx) => {
        const tie = new THREE.Mesh(tieGeo, timberMat);
        tie.position.set(tx, 3.42, 0);
        gateProceduralGroup.add(tie);
      });

      // Warm directional / point illumination directly focusing on the signboard
      const signLightFront = new THREE.PointLight(0xfff1cc, 2.2, 12, 1.2);
      signLightFront.position.set(0, 3.6, 2.4);
      gateProceduralGroup.add(signLightFront);

      const signLightBack = new THREE.PointLight(0xfff1cc, 1.8, 10, 1.2);
      signLightBack.position.set(0, 3.6, -2.4);
      gateProceduralGroup.add(signLightBack);
    },
    [0, 0, 12.5]
  );

  // Replaceable Slot: gate-signboard (The exact Welcome Signboard Plaque)
  assetSystem.registerSlot(
    'gate-signboard',
    villageGroup,
    (signboardGroup) => {
      const plaqueWidth = 4.2;
      const plaqueHeight = 0.96;
      const plaqueDepth = 0.12;

      const plaqueMesh = new THREE.Mesh(
        new THREE.BoxGeometry(plaqueWidth, plaqueHeight, plaqueDepth),
        timberMat
      );
      plaqueMesh.position.set(0, 0, 0);
      plaqueMesh.castShadow = true;
      signboardGroup.add(plaqueMesh);

      const signboardTexture = createWelcomeSignboardTexture();

      // Front textured face: faces approaching visitor (+Z)
      const frontFaceMat = new THREE.MeshStandardMaterial({
        map: signboardTexture,
        roughness: 0.35,
        metalness: 0.2,
      });
      const frontFaceMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(plaqueWidth - 0.08, plaqueHeight - 0.08),
        frontFaceMat
      );
      frontFaceMesh.position.set(0, 0, plaqueDepth / 2 + 0.005);
      signboardGroup.add(frontFaceMesh);

      // Back textured face: faces visitor inside village looking back (-Z)
      const backFaceMat = new THREE.MeshStandardMaterial({
        map: signboardTexture,
        roughness: 0.35,
        metalness: 0.2,
      });
      const backFaceMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(plaqueWidth - 0.08, plaqueHeight - 0.08),
        backFaceMat
      );
      backFaceMesh.rotation.y = Math.PI;
      backFaceMesh.position.set(0, 0, -(plaqueDepth / 2 + 0.005));
      signboardGroup.add(backFaceMesh);
    },
    [0, 2.85, 12.55]
  );

  // Replaceable Slot: props-signpost (Directional Wooden Signpost)
  assetSystem.registerSlot(
    'props-signpost',
    villageGroup,
    (signpost) => {
      const signPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.5, 8), timberMat);
      signPole.position.y = 1.25;
      signPole.castShadow = true;
      signpost.add(signPole);

      const sign1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.25, 0.05), timberMat);
      sign1.position.set(-0.5, 2.1, 0);
      sign1.rotation.y = 0.2;
      signpost.add(sign1);

      const sign2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.25, 0.05), timberMat);
      sign2.position.set(0.5, 1.7, 0);
      sign2.rotation.y = -0.3;
      signpost.add(sign2);
    },
    [3.2, 0, 10.5]
  );

  // Replaceable Slot: exhibit-welcome-easel (Heritage Orientation Easel with hero-main.JPG)
  assetSystem.registerSlot(
    'exhibit-welcome-easel',
    villageGroup,
    (easelGroup) => {
      const texLoader = new THREE.TextureLoader();
      const timberEaselMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.7 });
      const goldFrameMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.35, metalness: 0.75 });
      const plaqueMat = new THREE.MeshStandardMaterial({ color: 0xbfa15f, roughness: 0.4, metalness: 0.6 });

      [-0.45, 0.45].forEach((lx) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8), timberEaselMat);
        leg.position.set(lx, 1.1, 0);
        leg.rotation.z = lx > 0 ? 0.12 : -0.12;
        leg.rotation.x = -0.15;
        easelGroup.add(leg);
      });
      const backLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.3, 8), timberEaselMat);
      backLeg.position.set(0, 1.1, -0.45);
      backLeg.rotation.x = 0.28;
      easelGroup.add(backLeg);

      const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 0.15), timberEaselMat);
      shelf.position.set(0, 0.85, 0.05);
      easelGroup.add(shelf);

      const heroTex = texLoader.load('/assets/images/hero/hero-main.JPG');
      heroTex.colorSpace = THREE.SRGBColorSpace;
      const heroFrame = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.05, 0.06), goldFrameMat);
      heroFrame.position.set(0, 1.4, 0.02);
      heroFrame.rotation.x = -0.15;
      easelGroup.add(heroFrame);

      const heroPic = new THREE.Mesh(
        new THREE.PlaneGeometry(1.22, 0.92),
        new THREE.MeshStandardMaterial({ map: heroTex, roughness: 0.4, metalness: 0.05 })
      );
      heroPic.position.set(0, 1.4, 0.055);
      heroPic.rotation.x = -0.15;
      (heroPic as any).hotspotData = {
        id: 'hs-hero-portrait',
        name: 'Master Weaver Living Tradition',
        zone: 'VILLAGE ENTRANCE',
        position: [4.2, 1.4, 12.0],
        artifact: {
          id: 'hero-portrait',
          name: 'Master Weaver Living Tradition',
          bodoName: 'बड’ खाथि दाग्रा बैरागी',
          category: 'TEXTILES',
          description: 'Monumental photographic documentation of indigenous Bodo handloom weaving culture.',
          culturalSignificance: 'Captures the living spirit of the Bodo textile heritage passed down across unbroken generations.',
          image: '/assets/images/hero/hero-main.JPG',
          imageUrl: '/assets/images/hero/hero-main.JPG',
        },
        info: 'Welcome to the Bodo Handloom Cultural Heritage Village — Celebrating our living master weavers.',
      };
      easelGroup.add(heroPic);

      const greetingPlaque = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.14, 0.02), plaqueMat);
      greetingPlaque.position.set(0, 0.72, 0.08);
      easelGroup.add(greetingPlaque);

      const spot = new THREE.SpotLight(0xfffae6, 2.5, 6, Math.PI / 5, 0.3);
      spot.position.set(0, 2.8, 1.8);
      spot.target = heroPic;
      easelGroup.add(spot);
    },
    [4.2, 0, 12.0]
  );

  // ==========================================
  // 9. LUSH FLORA: BANANA PLANTS, BAMBOO GROVES & BETEL NUT PALMS
  // ==========================================
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x3d782f,
    roughness: 0.65,
    side: THREE.DoubleSide,
  });
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x547538,
    roughness: 0.8,
  });

  // Helper to build a realistic Assamese Banana Plant (Talir)
  function createBananaPlant(x: number, z: number, scale = 1): THREE.Group {
    const bp = new THREE.Group();
    bp.position.set(x, 0, z);
    bp.scale.set(scale, scale, scale);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.19, 2.4, 8), trunkMat);
    trunk.position.y = 1.2;
    trunk.castShadow = true;
    bp.add(trunk);

    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.25;
      const leafCurve = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 2.3, 2, 4), leafMat);
      leafCurve.position.set(Math.cos(angle) * 0.85, 2.35, Math.sin(angle) * 0.85);
      leafCurve.rotation.y = -angle;
      leafCurve.rotation.x = 0.85;
      leafCurve.rotation.z = Math.random() * 0.2 - 0.1;
      bp.add(leafCurve);
    }
    return bp;
  }

  // Helper to build a Bamboo Grove (Owa Clump) with segmented ring details & natural curvature
  function createBambooGrove(x: number, z: number, count = 8): THREE.Group {
    const bg = new THREE.Group();
    bg.position.set(x, 0, z);
    for (let i = 0; i < count; i++) {
      const bx = (Math.random() - 0.5) * 1.6;
      const bz = (Math.random() - 0.5) * 1.6;
      const h = 6.5 + Math.random() * 3.5;
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, h, 8), bambooPostMat);
      stalk.position.set(bx, h / 2, bz);
      // Slight organic lean
      stalk.rotation.z = (Math.random() - 0.5) * 0.12;
      stalk.rotation.x = (Math.random() - 0.5) * 0.12;
      stalk.castShadow = true;
      bg.add(stalk);

      // Node rings along stalk
      const numRings = Math.floor(h / 0.8);
      for (let r = 1; r < numRings; r++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.075, 0.015, 4, 8),
          new THREE.MeshStandardMaterial({ color: 0x8a7243, roughness: 0.8 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.set(bx, r * 0.8, bz);
        bg.add(ring);
      }

      // Feathery foliage crown
      const topLeaves = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.5, 6), leafMat);
      topLeaves.position.set(bx, h + 0.8, bz);
      bg.add(topLeaves);
    }
    return bg;
  }

  // Replaceable Slot: trees-banana
  assetSystem.registerSlot(
    'trees-banana',
    villageGroup,
    (bananaGroup) => {
      const bananaPositions = [
        [-19, 9, 1.15],
        [-20, 2.5, 1.2],
        [-18.5, -6, 0.95],
        [-15, -16, 1.05],
        [-8.5, -17.5, 1.1],
        [5.5, -18, 0.9],
        [17.5, -13, 1.0],
        [18.5, -4, 1.15],
        [17.5, 10, 0.95],
        [5.5, 12.5, 1.0],
        [-5.5, 12.5, 1.05],
        [-7.5, 10.5, 0.85],
      ];
      bananaPositions.forEach(([bx, bz, bs]) => {
        bananaGroup.add(createBananaPlant(bx, bz, bs));
      });
    },
    [0, 0, 0]
  );

  // Replaceable Slot: trees-bamboo
  assetSystem.registerSlot(
    'trees-bamboo',
    villageGroup,
    (grovesGroup) => {
      const bambooPositions = [
        [-22.5, 13],
        [-23.5, -10],
        [-17.5, -20.5],
        [-3.5, -22],
        [10.5, -20.5],
        [22.5, -14],
        [22.5, 2.5],
        [20.5, 14.5],
        [-2.5, 20.5],
        [-22.5, 0],
      ];
      bambooPositions.forEach(([gx, gz]) => {
        grovesGroup.add(createBambooGrove(gx, gz, 7 + Math.floor(Math.random() * 5)));
      });
    },
    [0, 0, 0]
  );

  // Replaceable Slot: trees-betel (Betel Nut Palms / Goy Phan)
  assetSystem.registerSlot(
    'trees-betel',
    villageGroup,
    (palmsGroup) => {
      const palmPositions = [
        [-16.5, 14.5],
        [-13.5, 16.5],
        [14.5, 15.5],
        [16.5, 12.5],
        [-15.5, -18.5],
        [14.5, -18.5],
      ];
      palmPositions.forEach(([px, pz]) => {
        const palm = new THREE.Group();
        palm.position.set(px, 0, pz);

        // Slender trunk with leaf-scar rings
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.13, 9.5, 8),
          new THREE.MeshStandardMaterial({ color: 0x6e5340, roughness: 0.85 })
        );
        trunk.position.y = 4.75;
        trunk.castShadow = true;
        palm.add(trunk);

        // Horizontal ring scars
        for (let y = 1; y < 9; y += 0.8) {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.1, 0.015, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0x473427, roughness: 0.9 })
          );
          ring.rotation.x = Math.PI / 2;
          ring.position.y = y;
          palm.add(ring);
        }

        // Hanging betel nut bunches (orange-gold)
        const nutMat = new THREE.MeshStandardMaterial({ color: 0xd9822b, roughness: 0.6 });
        const bunch = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), nutMat);
        bunch.position.set(0, 9.0, 0.12);
        palm.add(bunch);

        // Arching palm frond crown
        const crown = new THREE.Mesh(new THREE.ConeGeometry(2.0, 1.8, 8), leafMat);
        crown.position.y = 9.8;
        palm.add(crown);

        palmsGroup.add(palm);
      });
    },
    [0, 0, 0]
  );

  // Replaceable Slot: bamboo-fences (Perimeter Bamboo Fence Bera)
  assetSystem.registerSlot(
    'bamboo-fences',
    villageGroup,
    (fenceGroup) => {
      const fenceMat = new THREE.MeshStandardMaterial({
        color: 0xb59963,
        roughness: 0.8,
      });

      function createFenceSegment(x: number, z: number, length: number, rot: number) {
        const fence = new THREE.Group();
        fence.position.set(x, 0, z);
        fence.rotation.y = rot;

        const rail1 = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 0.04), fenceMat);
        rail1.position.y = 0.45;
        fence.add(rail1);

        const rail2 = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 0.04), fenceMat);
        rail2.position.y = 0.95;
        fence.add(rail2);

        const numPickets = Math.floor(length / 0.4);
        for (let i = 0; i < numPickets; i++) {
          const px = -length / 2 + (i + 0.5) * 0.4;
          const picket = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.03, 1.2, 6),
            fenceMat
          );
          picket.position.set(px, 0.6, 0);
          picket.castShadow = true;
          fence.add(picket);
        }
        return fence;
      }

      fenceGroup.add(createFenceSegment(-18.5, 9, 8, 0));
      fenceGroup.add(createFenceSegment(-22, 5, 8, Math.PI / 2));
      fenceGroup.add(createFenceSegment(17.5, 9.5, 7, 0));
      fenceGroup.add(createFenceSegment(20.5, 5, 8, Math.PI / 2));
      fenceGroup.add(createFenceSegment(-16, -15, 8, 0.2));
      fenceGroup.add(createFenceSegment(16, -14, 7, -0.2));
    },
    [0, 0, 0]
  );

  // Replaceable Slot: veg-shrubs (Flowering Hibiscus & Assam Tea Bushes)
  assetSystem.registerSlot(
    'veg-shrubs',
    villageGroup,
    (shrubsGroup) => {
      const shrubGeo = new THREE.SphereGeometry(0.65, 8, 6);
      const shrubMat = new THREE.MeshStandardMaterial({ color: 0x3d702d, roughness: 0.9 });
      const redFlowerMat = new THREE.MeshStandardMaterial({ color: 0xc42b2b, roughness: 0.5 });

      const shrubPositions = [
        [-3.8, 11.5],
        [3.8, 11.5],
        [-7.2, 8.5],
        [7.2, 8.5],
        [-10.5, -3.2],
        [10.5, -2.2],
        [-4.2, -10.2],
        [4.2, -10.2],
      ];
      shrubPositions.forEach(([sx, sz], idx) => {
        const shrub = new THREE.Mesh(shrubGeo, shrubMat);
        shrub.position.set(sx, 0.4, sz);
        shrub.scale.set(1, 0.75, 1);
        shrubsGroup.add(shrub);

        // Hibiscus red blossom accents
        if (idx % 2 === 0) {
          const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), redFlowerMat);
          blossom.position.set(sx + 0.2, 0.72, sz + 0.15);
          shrubsGroup.add(blossom);
        }
      });
    },
    [0, 0, 0]
  );

  // Replaceable Slot: veg-grass (Natural Grass Tufts & Ferns)
  assetSystem.registerSlot(
    'veg-grass',
    villageGroup,
    (grassGroup) => {
      const tuftGeo = new THREE.ConeGeometry(0.28, 0.5, 4);
      const tuftMat = new THREE.MeshStandardMaterial({ color: 0x5a8a3a, roughness: 0.9 });
      for (let i = 0; i < 45; i++) {
        const tuft = new THREE.Mesh(tuftGeo, tuftMat);
        const tx = (Math.random() - 0.5) * 44;
        const tz = (Math.random() - 0.5) * 40;
        // Keep grass away from paths and center
        if (Math.abs(tx) > 2.5 || Math.abs(tz) > 15) {
          tuft.position.set(tx, 0.25, tz);
          tuft.rotation.y = Math.random() * Math.PI;
          grassGroup.add(tuft);
        }
      }
    },
    [0, 0, 0]
  );

  // Initialize all replaceable slots with existing store configs
  assetSystem.initialize();

  // Cleanup helper
  const cleanup = () => {
    assetSystem.cleanup();
    scene.remove(villageGroup);
    villageGroup.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      }
    });
    terrainTexture.dispose();
    pathTexture.dispose();
    thatchTex.dispose();
    bambooMatTex.dispose();
    skyTexture.dispose();
  };

  return { collisionObstacles, assetSystem, cleanup };
}
