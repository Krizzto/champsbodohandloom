export interface HeritageStat {
  label: string;
  value: string;
  subtext: string;
  icon: string;
}

export interface CulturalMotif {
  id: string;
  name: string;
  bodoName: string;
  translation: string;
  meaning: string;
  culturalSignificance: string;
  colors: {
    bg: string;
    pattern: string;
    accent: string;
  };
}

export interface WeavingCluster {
  id: string;
  district: string;
  center: string;
  specialty: string;
  description: string;
  coordinates: { x: number; y: number }; // percentage position for responsive cultural map
}

export const heritageStats: HeritageStat[] = [
  {
    label: 'Sacred Motifs',
    value: '40+',
    subtext: 'Documented geometric and nature-inspired Agor patterns',
    icon: 'Sparkles'
  },
  {
    label: 'Traditional Stages',
    value: '9 Stages',
    subtext: 'From seed ginning with Zenther to finished ceremonial cloth',
    icon: 'GitBranch'
  },
  {
    label: 'Indigenous Clusters',
    value: '4 Districts',
    subtext: 'Kokrajhar, Chirang, Baksa, and Udalguri weaving belts',
    icon: 'MapPin'
  },
  {
    label: 'Ahimsa Eri Silk',
    value: '100% Non-Violent',
    subtext: 'Eco-reared peace silk and botanical plant dyes',
    icon: 'ShieldCheck'
  }
];

export const culturalMotifs: CulturalMotif[] = [
  {
    id: 'hajw-agor',
    name: 'Hajw Agor',
    bodoName: 'हाजो आगोर (Hajw Agor)',
    translation: 'Mountain Motif',
    meaning: 'Depicts the sacred mountain ridges and sub-Himalayan peaks surrounding the Brahmaputra valley. Symbolizes steadfast endurance, protection, and eternal connection to indigenous lands.',
    culturalSignificance: 'Woven along the hemline borders of Dokhona Thaosi and ceremonial Aronai.',
    colors: { bg: '#8B1E3F', pattern: '#FFE600', accent: '#2B6E44' }
  },
  {
    id: 'daorai-agor',
    name: 'Daorai Agor',
    bodoName: 'दावराय आगोर (Daorai Agor)',
    translation: 'Peacock Feather Motif',
    meaning: 'Inspired by the graceful plumage and seasonal dance of the wild forest peacock. Symbolizes beauty, festive prosperity, and springtime joy.',
    culturalSignificance: 'Celebrated in Bodo folk poetry and Bagurumba traditional dances as a mark of master craftsmanship.',
    colors: { bg: '#1C3A27', pattern: '#FFE600', accent: '#E63946' }
  },
  {
    id: 'dingkhia-agor',
    name: 'Dingkhia Agor',
    bodoName: 'दिंखिया आगोर (Dingkhia Agor)',
    translation: 'Fern Leaf Motif',
    meaning: 'Reflects the coiled fiddlehead spirals of the wild edible Dhekia fern, representing forest nourishment, humility, and spontaneous vitality.',
    culturalSignificance: 'Frequently embellished on daily wear Dokhonas and lightweight Jwmgra shoulder wraps.',
    colors: { bg: '#2C4A3E', pattern: '#95D5B2', accent: '#FFE600' }
  },
  {
    id: 'muphur-apha',
    name: 'Muphur Apha',
    bodoName: 'मुफुर आफा (Muphur Apha)',
    translation: 'Bear Paw Motif',
    meaning: 'An ancient totemic impression signifying animal tracks across sacred groves, reminding modern communities of harmonious forest co-existence.',
    culturalSignificance: 'A venerated geometric impression woven on heirloom male Gamusas and ceremonial Aronais.',
    colors: { bg: '#3A1F04', pattern: '#E09F3E', accent: '#FDF0D5' }
  },
  {
    id: 'singri-agor',
    name: 'Singri Agor',
    bodoName: 'सिंग्रि आगोर (Singri Agor)',
    translation: 'Diamond Shield Motif',
    meaning: 'Interlocking geometric diamond lattice representing ancestral protective armor, community unity, and unbroken lineage continuity.',
    culturalSignificance: 'The core structural Agor framing royal ceremonial wraps and wedding Dokhonas.',
    colors: { bg: '#1F2421', pattern: '#FFE600', accent: '#DCE1DE' }
  }
];

export const weavingClusters: WeavingCluster[] = [
  {
    id: 'kokrajhar',
    district: 'Kokrajhar',
    center: 'Dotma & Titaguri',
    specialty: 'Eri Silk Dokhona Thaosi & Natural Turmeric Yellow Dyeing',
    description: 'The cultural capital of Bodoland handloom, hosting master craftswomen guilds proficient in rare historical Agor geometries.',
    coordinates: { x: 28, y: 48 }
  },
  {
    id: 'chirang',
    district: 'Chirang',
    center: 'Bijni & Sidli',
    specialty: 'Short-Staple Cotton Ginning (Zenther) & Wild Indigo Fermentation',
    description: 'Specializes in hand-cranked Zenther ginning techniques and ancient cold-vat alkaline indigo dye processes.',
    coordinates: { x: 46, y: 42 }
  },
  {
    id: 'baksa',
    district: 'Baksa',
    center: 'Musalpur & Tamulpur',
    specialty: 'Heavy Sal Frame Looms & High-Tension Warping Assemblies',
    description: 'Renowned for carpenter guilds crafting timber Sal looms and ceremonial Aronai scarves given during festivals.',
    coordinates: { x: 68, y: 38 }
  },
  {
    id: 'udalguri',
    district: 'Udalguri',
    center: 'Rowta & Mazbat',
    specialty: 'Handcrafted Bamboo Serski Reed Combs & Fine Festival Chadars',
    description: 'Home to master bamboo comb artisans whose finely tuned Serski battens set the density standard for high-count weaves.',
    coordinates: { x: 86, y: 45 }
  }
];
