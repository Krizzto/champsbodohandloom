import { create } from 'zustand';
import { Model3D } from '../types';
import { saveModelBlob, deleteModelBlob, resolveModelUrl } from '../services/modelStorage';

export type VillageAssetCategory =
  | 'HOUSES'
  | 'STRUCTURES'
  | 'TREES'
  | 'VEGETATION'
  | 'ENVIRONMENT_PROPS'
  | 'LOOMS'
  | 'TEXTILES'
  | 'TOOLS'
  | 'MOTIFS'
  | 'PEDESTALS'
  | 'CUSTOM';

export interface VillageAssetSlotConfig {
  id: string;
  name: string;
  bodoName?: string;
  category: VillageAssetCategory;
  description: string;
  defaultPosition: [number, number, number];
  enabled: boolean;
  isCustom: boolean;
  customModelId?: string;
  customModelUrl?: string;
  customModelName?: string;
  customFileName?: string;
  customFileSize?: number;
  transform: {
    position: [number, number, number]; // [offsetX, offsetY, offsetZ]
    rotation: [number, number, number]; // [rotX, rotY, rotZ] in degrees
    scale: [number, number, number]; // [scaleX, scaleY, scaleZ]
  };
  updatedAt?: number;
}

export const INITIAL_ASSET_SLOTS: VillageAssetSlotConfig[] = [
  // 1. HOUSES & BUILDINGS
  {
    id: 'house-main',
    name: 'Traditional Homestead (No-Mano)',
    bodoName: 'नो-मानो (No-Mano)',
    category: 'HOUSES',
    description: 'Main residential family homestead with thatching, open front veranda, and timber posts.',
    defaultPosition: [-12, 0, 4],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'house-granary',
    name: 'Raised Granary (Bhoral)',
    bodoName: 'बख्रि (Bakhri / Bhoral)',
    category: 'HOUSES',
    description: 'Elevated timber stilt granary used for storing sacred paddy harvest above damp ground.',
    defaultPosition: [-18, 0, 0],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },

  // 2. BAMBOO STRUCTURES, ENTRANCE GATES & FENCES
  {
    id: 'entrance-gate',
    name: 'Village Entrance Torana Gate',
    bodoName: 'गामि हाबनाय थरा (Torana Gate)',
    category: 'STRUCTURES',
    description: 'Traditional twin bamboo archway gateway with thatched canopy.',
    defaultPosition: [0, 0, 12.5],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'gate-signboard',
    name: 'Welcome Signboard Plaque',
    bodoName: 'बरायनाय सिला (Welcome Board)',
    category: 'STRUCTURES',
    description: 'Large central heritage signboard displaying "WELCOME TO BODO HANDLOOM HERITAGE".',
    defaultPosition: [0, 2.85, 12.55],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'bamboo-fences',
    name: 'Village Perimeter Bamboo Fence (Bera)',
    bodoName: 'बेरा (Woven Bamboo Fence)',
    category: 'STRUCTURES',
    description: 'Hand-woven split bamboo fencing surrounding the homestead and courtyards.',
    defaultPosition: [0, 0, 0],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'bathou-altar',
    name: 'Bathou Sacred Altar',
    bodoName: 'बाथौ साला (Bathou Altar)',
    category: 'STRUCTURES',
    description: 'Courtyard sacred altar enclosed by 18 bamboo rings with a central Euphorbia Siju stalk.',
    defaultPosition: [-8.2, 0, 7.5],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },

  // 3. ALL TREES, BANANA PLANTS & BAMBOO CLUSTERS
  {
    id: 'trees-banana',
    name: 'Assamese Banana Plants (Talir)',
    bodoName: 'थालिर फां (Banana Grove)',
    category: 'TREES',
    description: 'Lush broadleaf banana plants with arching fronds planted near courtyards and verandas.',
    defaultPosition: [0, 0, 0],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'trees-bamboo',
    name: 'Bamboo Groves (Owa Thum)',
    bodoName: 'अवा थुम (Bamboo Clumps)',
    category: 'TREES',
    description: 'Tall golden and green bamboo thickets providing shade and building materials.',
    defaultPosition: [0, 0, 0],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'trees-betel',
    name: 'Betel Nut Palms (Goy)',
    bodoName: 'गय फां (Areca Nut Palms)',
    category: 'TREES',
    description: 'Slender, tall betel nut palm trees characteristic of rural Assamese villages.',
    defaultPosition: [0, 0, 0],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'trees-distant',
    name: 'Distant Forest Perimeter',
    bodoName: 'हाग्रामा (Forest Boundary)',
    category: 'TREES',
    description: 'Dense distant tree canopy ringing the village perimeter against the foothills.',
    defaultPosition: [0, 0, 0],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },

  // 4. GRASS, SHRUBS, FLOWERS & VEGETATION
  {
    id: 'veg-shrubs',
    name: 'Flowering Shrubs & Hibiscus (Jaba Bibar)',
    bodoName: 'जाबा बिबार (Flowering Bushes)',
    category: 'VEGETATION',
    description: 'Garden shrubs, Assamese tea bushes, and tropical flowering flora along the paths.',
    defaultPosition: [0, 0, 0],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'veg-grass',
    name: 'Natural Grass Tufts & Ground Cover',
    bodoName: 'गांसो (Grass Clusters)',
    category: 'VEGETATION',
    description: 'Natural Assamese pasture grass and fern clumps scattered over the terrain.',
    defaultPosition: [0, 0, 0],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },

  // 5. GROUND DECORATIONS & ENVIRONMENTAL PROPS
  {
    id: 'props-bench',
    name: 'Veranda Wooden Bench (Pidha)',
    bodoName: 'फिदा आरो गांखं (Bench & Seat)',
    category: 'ENVIRONMENT_PROPS',
    description: 'Hand-hewn timber sitting bench and stool set upon the homestead veranda.',
    defaultPosition: [-13.8, 0.65, 5.8],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'props-pitcher',
    name: 'Brass Water Lota & Zou-Khoro Pitcher',
    bodoName: 'लथा आरो जौ-खरो (Brass Pot & Vessel)',
    category: 'ENVIRONMENT_PROPS',
    description: 'Polished ceremonial brass pitcher and traditional earthen vessel on the porch.',
    defaultPosition: [-12.3, 0.68, 5.8],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'props-signpost',
    name: 'Directional Wooden Signpost',
    bodoName: 'लामा दिन्थिग्रा (Directional Sign)',
    category: 'ENVIRONMENT_PROPS',
    description: 'Rustic wooden signpost pointing towards the homestead, workshop, gallery, and motifs.',
    defaultPosition: [3.2, 0, 10.5],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },

  // 6. HANDLOOM FRAMES & WEAVING EQUIPMENT
  {
    id: 'loom-frame',
    name: 'Traditional Throw-Shuttle Loom (Sal)',
    bodoName: 'साल (Traditional Bodo Loom)',
    category: 'LOOMS',
    description: 'Authentic four-poster timber loom frame with cloth beam, warp cords, and seat.',
    defaultPosition: [-12, 0.35, -9],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'loom-reeds',
    name: 'Warp Beams, Reed & Heddles',
    bodoName: 'राख आरो गन्थं (Reed & Comb)',
    category: 'LOOMS',
    description: 'Fine bamboo weaving reed (Rakh), bamboo heddle shafts, and suspended roller beams.',
    defaultPosition: [-12, 1.25, -9.1],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'loom-treadles',
    name: 'Foot Treadles & Bobbin Shuttle (Maku)',
    bodoName: 'माखु (Throw Shuttle & Pedals)',
    category: 'LOOMS',
    description: 'Wood and buffalo-horn polished shuttle containing bobbin loaded with weft yarn.',
    defaultPosition: [-12, 0.9, -8.7],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'loom-yarn',
    name: 'Dyed Yarn Skeins (Khabang)',
    bodoName: 'खाबां (Dyed Yarn Skeins)',
    category: 'LOOMS',
    description: 'Hanging hanks of handspun golden muga silk, eri yarn, and naturally dyed cotton.',
    defaultPosition: [-9.5, 1.8, -10.5],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'workshop-shed',
    name: 'Handloom Workshop Shed (Sal-Ghor)',
    bodoName: 'साल-घर (Sal-Ghor Weaving Shed)',
    category: 'LOOMS',
    description: 'Open-sided timber and bamboo shelter housing the master weaver loom equipment.',
    defaultPosition: [-12, 0, -9],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },

  // 7. DOKHONA, ARONAI, ERI SILK & TEXTILE DISPLAYS
  {
    id: 'textile-dokhona',
    name: 'Dokhona Thaosi Drape Display',
    bodoName: 'दखना थावसि (Dokhona Thaosi)',
    category: 'TEXTILES',
    description: 'Iconic mustard-gold Dokhona body with intricate red geometric Agor border.',
    defaultPosition: [-1.8, 0.4, -16.6],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'textile-aronai',
    name: 'Aronai Ceremonial Scarf Display',
    bodoName: "आर'नाइ (Sacred Aronai Stole)",
    category: 'TEXTILES',
    description: 'Ceremonial scarf woven with auspicious Hajw mountain motifs presented as honor.',
    defaultPosition: [1.8, 0.4, -16.6],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'textile-pavilion',
    name: 'Textile Gallery Pavilion',
    bodoName: 'दखना मन्दिर (Textile Pavilion)',
    category: 'TEXTILES',
    description: 'Stately open pavilion showcasing documented Bodo weaves and traditional attire.',
    defaultPosition: [0, 0, -16],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },

  // 8. BASKETS, SPINDLES, REELS, TOOLS & MATERIALS
  {
    id: 'tools-baskets',
    name: 'Woven Cane Baskets (Khara) with Cocoons',
    bodoName: 'खारा आरो एन्दिखा (Baskets & Silk Cocoons)',
    category: 'TOOLS',
    description: 'Handwoven bamboo baskets filled with golden and white natural Eri silkworm cocoons.',
    defaultPosition: [13, 0.55, -9.6],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'tools-janthi',
    name: 'Yarn Winding Frame (Janthi)',
    bodoName: 'जान्थि (Yarn Reel & Winder)',
    category: 'TOOLS',
    description: 'Rotating bamboo cross frame used for skeining and winding warp thread.',
    defaultPosition: [12.2, 1.3, -7.9],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'tools-table',
    name: 'Tools Exhibition Table',
    bodoName: 'हाथियारि टेबल (Workbench Table)',
    category: 'TOOLS',
    description: 'Timber display platform supporting spindles (Takli), reeds, and silk skeins.',
    defaultPosition: [13, 0.7, -7.9],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'tools-shelter',
    name: 'Tools Compound Bamboo Shelter',
    bodoName: 'आजिं-बाजिं न’ (Tools Shed)',
    category: 'TOOLS',
    description: 'Open thatched bamboo structure covering the spinning and processing exhibit.',
    defaultPosition: [13, 0, -9],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },

  // 9. MOTIF DISPLAYS, DYEING EQUIPMENT & PROPS
  {
    id: 'dyeing-indigo',
    name: 'Fermented Indigo Cauldron & Hearth',
    bodoName: 'निल रं (Indigo Cauldron)',
    category: 'MOTIFS',
    description: 'Earthen hearth and clay cauldron for botanical fermented indigo leaf dye baths.',
    defaultPosition: [12.9, 0.65, 6.2],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'dyeing-turmeric',
    name: 'Turmeric & Botanical Golden Cauldron',
    bodoName: 'हालदै रं (Turmeric Cauldron)',
    category: 'MOTIFS',
    description: 'Cauldron with natural wild turmeric (Haldi) infusion for vibrant sunshine yellow.',
    defaultPosition: [15.1, 0.65, 6.2],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'motif-board',
    name: 'Sacred Agor Pattern Display Board',
    bodoName: 'आगोर दिनथिफुल (Agor Motif Board)',
    category: 'MOTIFS',
    description: 'Exhibition board explaining Hajw (Hills), Daorai (Peacock), and Pharew Megon motifs.',
    defaultPosition: [14, 1.7, 3.2],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'motif-pavilion',
    name: 'Motif Exhibition Canopy',
    bodoName: 'आगोर मन्दिर (Motif Pavilion)',
    category: 'MOTIFS',
    description: 'Timber and thatched exhibition pavilion for dyeing and sacred motif education.',
    defaultPosition: [14, 0, 5],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },

  // 10. PEDESTALS & EXHIBIT STANDS
  {
    id: 'pedestal-style',
    name: 'Rustic Interactive Exhibit Pedestals',
    bodoName: 'दिन्थिग्रा थाम (Exhibit Pedestals)',
    category: 'PEDESTALS',
    description: 'Cylindrical bamboo-timber display pedestals throughout the village.',
    defaultPosition: [0, 0, 0],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },

  // 11. DEDICATED WEAVING IMPLEMENTS & HISTORICAL TOOLS
  {
    id: 'tool-makuu',
    name: 'Makuu (Weaving Shuttle)',
    bodoName: 'माखु (Makuu Shuttle)',
    category: 'TOOLS',
    description: 'Polished seasoned bamboo shuttle that propels the weft thread across the loom shed.',
    defaultPosition: [-10.2, 0.45, -8.5],
    enabled: true,
    isCustom: true,
    customModelUrl: '/assets/models/tools/makuu.glb',
    customFileName: 'makuu.glb',
    customModelName: 'Makuu (Weaving Shuttle)',
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'tool-paddle',
    name: 'Loom Foot Paddle (Treadle)',
    bodoName: 'गांखं / फेदेल (Loom Paddle)',
    category: 'TOOLS',
    description: 'Hardwood foot pedal operated by the master weaver to open the warp shed.',
    defaultPosition: [-11.8, 0.45, -8.3],
    enabled: true,
    isCustom: true,
    customModelUrl: '/assets/models/tools/paddle.glb',
    customFileName: 'paddle.glb',
    customModelName: 'Loom Foot Paddle (Treadle)',
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'tool-bobbin-case',
    name: 'Bobin Case (Yarn Spool Carrier)',
    bodoName: 'बबिन केस (Bobin Case)',
    category: 'TOOLS',
    description: 'Turned hardwood protective container holding wound Eri and Muga silk bobbins.',
    defaultPosition: [-13.2, 0.45, -8.5],
    enabled: true,
    isCustom: true,
    customModelUrl: '/assets/models/tools/Bobin_case.glb',
    customFileName: 'Bobin_case.glb',
    customModelName: 'Bobin Case (Yarn Spool Carrier)',
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'tool-swrki',
    name: 'Swrki (Bamboo Reed Batten)',
    bodoName: 'सोरखि (Swrki / Serski)',
    category: 'TOOLS',
    description: 'High-density bamboo reed comb used to beat weft threads tightly into alignment.',
    defaultPosition: [12.2, 0.45, -9.8],
    enabled: true,
    isCustom: true,
    customModelUrl: '/assets/models/tools/Swrki.glb',
    customFileName: 'Swrki.glb',
    customModelName: 'Swrki (Bamboo Reed Batten)',
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'tool-zenther',
    name: 'Zenther (Hand Cotton Gin)',
    bodoName: 'जेन्थर (Zenther)',
    category: 'TOOLS',
    description: 'Twin-roller hand-turned wooden gin that extracts cotton seeds from the raw lint.',
    defaultPosition: [11.2, 0.45, -8.0],
    enabled: true,
    isCustom: true,
    customModelUrl: '/assets/models/tools/zenther.glb',
    customFileName: 'zenther.glb',
    customModelName: 'Zenther (Hand Cotton Gin)',
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'tool-mushra',
    name: 'Mushra (Traditional Yarn Guide Tool)',
    bodoName: 'मुस्रा (Mushra Guide)',
    category: 'TOOLS',
    description: 'Handcrafted timber guide and tensioning implement used during warp beam preparation.',
    defaultPosition: [13.2, 0.45, -8.0],
    enabled: true,
    isCustom: true,
    customModelUrl: '/assets/models/tools/mushra.glb',
    customFileName: 'mushra.glb',
    customModelName: 'Mushra (Traditional Yarn Guide Tool)',
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },

  // 12. 3D ETHNOGRAPHIC EXHIBITION & PHOTO INSTALLATIONS
  {
    id: 'exhibit-photo-gallery',
    name: 'Master Weaver Ethnographic Photo Gallery',
    bodoName: 'दावबायग्रा सोलो दिनथिफुल (Photo Gallery)',
    category: 'STRUCTURES',
    description: 'Museum gallery installation displaying field photography of master weavers at work in Bodoland.',
    defaultPosition: [0, 1.6, -18.2],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  {
    id: 'exhibit-welcome-easel',
    name: 'Heritage Orientation Display Easel',
    bodoName: 'बरायनाय सिला (Welcome Photo Easel)',
    category: 'STRUCTURES',
    description: 'Carved timber display easel greeting visitors at the village entrance with master weaver portrait.',
    defaultPosition: [4.2, 0, 12.0],
    enabled: true,
    isCustom: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
];

interface VillageAssetState {
  assets: Record<string, VillageAssetSlotConfig>;
  isManagerOpen: boolean;
  activeCategory: VillageAssetCategory | 'ALL';
  selectedSlotId: string | null;

  // Actions
  openManager: (category?: VillageAssetCategory | 'ALL', slotId?: string) => void;
  closeManager: () => void;
  setActiveCategory: (cat: VillageAssetCategory | 'ALL') => void;
  selectSlot: (slotId: string | null) => void;

  // Slot Management
  replaceWithModel: (
    slotId: string,
    params: {
      modelId: string;
      modelUrl: string;
      fileName: string;
      modelName: string;
      fileSize?: number;
    }
  ) => void;
  updateTransform: (
    slotId: string,
    transform: Partial<VillageAssetSlotConfig['transform']>
  ) => void;
  toggleSlotEnabled: (slotId: string) => void;
  resetSlotToDefault: (slotId: string) => void;
  resetAllToDefaults: () => void;
  addCustomPropSlot: (slot: {
    name: string;
    description: string;
    position: [number, number, number];
  }) => string;
  removeCustomPropSlot: (slotId: string) => void;

  // Persistence export/import
  exportConfigs: () => string;
  importConfigs: (json: string) => boolean;
}

const STORAGE_KEY = 'bodo_village_replaceable_assets_v2';

const loadSavedAssetConfigs = (): Record<string, VillageAssetSlotConfig> => {
  const initialMap: Record<string, VillageAssetSlotConfig> = {};
  INITIAL_ASSET_SLOTS.forEach((slot) => {
    initialMap[slot.id] = { ...slot };
  });

  if (typeof window === 'undefined') return initialMap;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialMap;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      Object.keys(parsed).forEach((k) => {
        if (initialMap[k]) {
          const stored = parsed[k];
          initialMap[k] = {
            ...initialMap[k],
            ...stored,
            // Ensure default GLB model URLs are preserved if stored config lacked one
            customModelUrl: stored.customModelUrl || initialMap[k].customModelUrl,
            customFileName: stored.customFileName || initialMap[k].customFileName,
            isCustom: stored.customModelUrl ? stored.isCustom : (initialMap[k].isCustom ?? false),
          };
        } else if (k.startsWith('custom-prop-')) {
          initialMap[k] = parsed[k];
        }
      });
    }
    return initialMap;
  } catch (err) {
    console.warn('Failed to load village replaceable asset configs:', err);
    return initialMap;
  }
};

const saveAssetConfigs = (assets: Record<string, VillageAssetSlotConfig>) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  } catch (err) {
    console.warn('Failed to save village asset configs:', err);
  }
};

export const useVillageAssetStore = create<VillageAssetState>((set, get) => ({
  assets: loadSavedAssetConfigs(),
  isManagerOpen: false,
  activeCategory: 'ALL',
  selectedSlotId: null,

  openManager: (category = 'ALL', slotId) => {
    set({
      isManagerOpen: true,
      activeCategory: category,
      selectedSlotId: slotId || null,
    });
  },

  closeManager: () => {
    set({ isManagerOpen: false });
  },

  setActiveCategory: (cat) => {
    set({ activeCategory: cat });
  },

  selectSlot: (slotId) => {
    set({ selectedSlotId: slotId });
  },

  replaceWithModel: (slotId, params) => {
    set((state) => {
      const current = state.assets[slotId];
      if (!current) return state;

      const updatedSlot: VillageAssetSlotConfig = {
        ...current,
        isCustom: true,
        customModelId: params.modelId,
        customModelUrl: params.modelUrl,
        customFileName: params.fileName,
        customModelName: params.modelName,
        customFileSize: params.fileSize,
        updatedAt: Date.now(),
      };

      const newAssets = {
        ...state.assets,
        [slotId]: updatedSlot,
      };

      saveAssetConfigs(newAssets);
      return { assets: newAssets };
    });
  },

  updateTransform: (slotId, partialTransform) => {
    set((state) => {
      const current = state.assets[slotId];
      if (!current) return state;

      const updatedSlot: VillageAssetSlotConfig = {
        ...current,
        transform: {
          ...current.transform,
          ...partialTransform,
        },
        updatedAt: Date.now(),
      };

      const newAssets = {
        ...state.assets,
        [slotId]: updatedSlot,
      };

      saveAssetConfigs(newAssets);
      return { assets: newAssets };
    });
  },

  toggleSlotEnabled: (slotId) => {
    set((state) => {
      const current = state.assets[slotId];
      if (!current) return state;

      const updatedSlot: VillageAssetSlotConfig = {
        ...current,
        enabled: !current.enabled,
        updatedAt: Date.now(),
      };

      const newAssets = {
        ...state.assets,
        [slotId]: updatedSlot,
      };

      saveAssetConfigs(newAssets);
      return { assets: newAssets };
    });
  },

  resetSlotToDefault: (slotId) => {
    set((state) => {
      const defaultSlot = INITIAL_ASSET_SLOTS.find((s) => s.id === slotId);
      const current = state.assets[slotId];
      if (!current) return state;

      const restored: VillageAssetSlotConfig = defaultSlot
        ? {
            ...defaultSlot,
            isCustom: false,
            customModelId: undefined,
            customModelUrl: undefined,
            customFileName: undefined,
            customModelName: undefined,
            customFileSize: undefined,
            updatedAt: Date.now(),
          }
        : {
            ...current,
            isCustom: false,
            customModelId: undefined,
            customModelUrl: undefined,
            customFileName: undefined,
            customModelName: undefined,
            customFileSize: undefined,
            updatedAt: Date.now(),
          };

      const newAssets = {
        ...state.assets,
        [slotId]: restored,
      };

      saveAssetConfigs(newAssets);
      return { assets: newAssets };
    });
  },

  resetAllToDefaults: () => {
    const initialMap: Record<string, VillageAssetSlotConfig> = {};
    INITIAL_ASSET_SLOTS.forEach((slot) => {
      initialMap[slot.id] = { ...slot };
    });
    saveAssetConfigs(initialMap);
    set({ assets: initialMap });
  },

  addCustomPropSlot: (slot) => {
    const customId = `custom-prop-${Date.now()}`;
    const newSlot: VillageAssetSlotConfig = {
      id: customId,
      name: slot.name,
      category: 'CUSTOM',
      description: slot.description || 'Custom 3D prop imported into the village.',
      defaultPosition: slot.position,
      enabled: true,
      isCustom: true,
      transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      updatedAt: Date.now(),
    };

    set((state) => {
      const newAssets = {
        ...state.assets,
        [customId]: newSlot,
      };
      saveAssetConfigs(newAssets);
      return { assets: newAssets, selectedSlotId: customId };
    });

    return customId;
  },

  removeCustomPropSlot: (slotId) => {
    set((state) => {
      const copy = { ...state.assets };
      delete copy[slotId];
      saveAssetConfigs(copy);
      return {
        assets: copy,
        selectedSlotId: state.selectedSlotId === slotId ? null : state.selectedSlotId,
      };
    });
  },

  exportConfigs: () => {
    return JSON.stringify(get().assets, null, 2);
  },

  importConfigs: (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        const merged = { ...get().assets, ...parsed };
        saveAssetConfigs(merged);
        set({ assets: merged });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));
