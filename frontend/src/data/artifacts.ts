import { Artifact } from '../types';
export type { Artifact };

export const INITIAL_ARTIFACTS: Artifact[] = [
  {
    id: 'maku-shuttle',
    name: 'Maku (Weaving Shuttle)',
    bodoName: 'माकु (Maku)',
    category: 'TOOLS',
    description: 'Carved seasoned bamboo or ironwood boat shuttle that holds the weft bobbin and glides smoothly between shed threads during handloom weaving.',
    culturalSignificance: 'Passed down through matrilineal weaver lineages; ergonomically weighted for fast, rhythmic throwing across the warp.',
    materials: ['Assam seasoned bamboo', 'Polished cane pin', 'Beeswax coating'],
    image: '/assets/images/tools/maku.jpg',
    imageUrl: '/assets/images/tools/maku.jpg',
    model: '/assets/models/tools/maku.glb',
    modelUrl: '/assets/models/tools/maku.glb',
    arAvailable: true,
    vrAvailable: true,
    featured: true,
    tags: ['shuttle', 'weft', 'looming', 'rhythm', 'tools'],
    relatedProcesses: ['weft-winding', 'looming', 'weaving'],
    relatedMotifs: ['hajw-agor', 'singri-agor'],
    sources: [
      { title: 'Traditional Textiles and Loom Implements of Bodoland', author: 'Tribal Research Institute Assam', year: 2021 },
      { title: 'Material Culture of the Bodo Community', author: 'Dr. B. K. Daimary', year: 2018 }
    ],
    details: {
      origin: 'Dotma, Kokrajhar District, Assam',
      artisanCommunity: 'Bodo Handloom Guild',
      dimensions: '32 cm x 3.5 cm x 2.8 cm',
      period: 'Early 20th Century / Living Tradition'
    }
  },
  {
    id: 'dokhona-thaosi',
    name: 'Dokhona Thaosi (Traditional Woven Dress)',
    bodoName: 'दखना थावसि (Dokhona Thaosi)',
    category: 'TEXTILES',
    description: 'The iconic traditional draped garment worn by Bodo women, distinguished by intense yellow-gold and madder fields with exquisite Agor border motifs.',
    culturalSignificance: 'An emblem of dignity, pride, and Bodo identity. The word Thaosi denotes a fully decorated, master-woven heirloom piece.',
    materials: ['Handspun Eri silk', 'Organic dyed cotton warp', 'Gold-dyed weft'],
    image: '/assets/images/textiles/traditional-textiles/dokhona.jpg',
    imageUrl: '/assets/images/textiles/traditional-textiles/dokhona.jpg',
    model: '/assets/models/artifacts/dokhona.glb',
    modelUrl: '/assets/models/artifacts/dokhona.glb',
    arAvailable: true,
    vrAvailable: true,
    featured: true,
    tags: ['dokhona', 'garment', 'thaosi', 'traditional dress'],
    relatedProcesses: ['warping', 'beaming', 'weaving'],
    relatedMotifs: ['hajw-agor', 'daorai-agor', 'phul-agor'],
    sources: [
      { title: 'Bodo Women and the Loom: Gender, Space and Cultural Expression', author: 'N. Brahma', year: 2022 }
    ],
    details: {
      origin: 'Kokrajhar, Bodoland Territorial Region',
      artisanCommunity: 'Traditional Master Weavers',
      dimensions: '280 cm x 115 cm',
      period: 'Living Tradition'
    }
  },
  {
    id: 'aronai-muga',
    name: 'Aronai (Traditional Scarf of Honour)',
    bodoName: 'आर’नाइ (Aronai)',
    category: 'TEXTILES',
    description: 'A sacred ceremonial scarf woven with intricate geometric Agor motifs at both ends, presented to guests and elders as the highest cultural blessing.',
    culturalSignificance: 'Used in weddings, Bwisagu festivals, and felicitations; symbolizes pure heart, mutual respect, and warm hospitality.',
    materials: ['Golden Muga silk', 'Handspun cotton', 'Natural vegetable dyes'],
    image: '/assets/images/textiles/silk/aronai.jpg',
    imageUrl: '/assets/images/textiles/silk/aronai.jpg',
    model: '/assets/models/artifacts/aronai.glb',
    modelUrl: '/assets/models/artifacts/aronai.glb',
    arAvailable: true,
    vrAvailable: true,
    featured: true,
    tags: ['aronai', 'scarf', 'honour', 'ceremonial'],
    relatedProcesses: ['winding', 'weaving'],
    relatedMotifs: ['hajw-agor', 'muphur-aphai-agor', 'daorai-agor'],
    sources: [
      { title: 'Aronai: The Sacred Symbolism in Bodo Handloom', author: 'Assam Cultural Directorate', year: 2019 }
    ],
    details: {
      origin: 'Udalguri, Assam',
      artisanCommunity: 'Bathou Cultural Weavers Society',
      dimensions: '185 cm x 24 cm',
      period: 'Preserved Heirloom'
    }
  },
  {
    id: 'khabang-winder',
    name: 'Khabang (Bamboo Bobbin Winder)',
    bodoName: 'खाबां (Khabang)',
    category: 'TOOLS',
    description: 'A hand-cranked rotary winder made of seasoned bamboo and hardwood, used to rapidly wind yarn from hanks onto shuttle bobbins.',
    culturalSignificance: 'An indigenous mechanical masterpiece designed with friction-fit bamboo gears, operating without any metal screws or electricity.',
    materials: ['Muli bamboo', 'Jackfruit wood axle', 'Cane binding strips'],
    image: '/assets/images/tools/bobbin.jpg',
    imageUrl: '/assets/images/tools/bobbin.jpg',
    model: '/assets/models/tools/khabang.glb',
    modelUrl: '/assets/models/tools/khabang.glb',
    arAvailable: true,
    vrAvailable: true,
    featured: false,
    tags: ['khabang', 'winder', 'bobbin', 'tools'],
    relatedProcesses: ['winding', 'reeling'],
    relatedMotifs: ['dingkhia-agor'],
    sources: [
      { title: 'Indigenous Mechanics and Handloom Apparatus in the Brahmaputra Valley', author: 'H. Sarma', year: 2020 }
    ],
    details: {
      origin: 'Chirang District, Assam',
      artisanCommunity: 'Forest Artisan Collective',
      dimensions: '45 cm x 28 cm x 35 cm',
      period: 'Mid 20th Century'
    }
  },
  {
    id: 'zenther-gin',
    name: 'Zenther (Hand Cotton Gin)',
    bodoName: 'जेन्थर (Zenther)',
    category: 'TOOLS',
    description: 'A hand-operated double roller cotton gin that pinches and separates seeds from cotton lint without crushing the seed husks.',
    culturalSignificance: 'The first tool used in the traditional cotton handloom cycle following harvest time.',
    materials: ['Hard timber frame', 'Ironwood gears', 'Bamboo crank handle'],
    image: '/assets/images/tools/zenther.jpg',
    imageUrl: '/assets/images/tools/zenther.jpg',
    model: '/assets/models/tools/zenther.glb',
    modelUrl: '/assets/models/tools/zenther.glb',
    arAvailable: true,
    vrAvailable: true,
    featured: true,
    tags: ['ginning', 'cotton', 'zenther', 'tools'],
    relatedProcesses: ['ginning'],
    relatedMotifs: ['hajw-agor'],
    sources: [
      { title: 'Textile Fiber Processing in Tribal Assam', author: 'North Eastern Regional Institute of Science & Tech', year: 2017 }
    ],
    details: {
      origin: 'Baksa District, Assam',
      artisanCommunity: 'Elder Guild',
      dimensions: '52 cm x 30 cm x 38 cm',
      period: 'Late 19th Century'
    }
  },
  {
    id: 'eri-silk-cocoon',
    name: 'Endi / Eri Silk Cocoon (Ahimsa Silk)',
    bodoName: 'एरा खुन (Era Khun / Endi)',
    category: 'MATERIALS',
    description: 'The natural open-ended cocoons spun by Samia ricini silkworms feeding exclusively on castor leaves (Era bilai) across Bodoland home gardens.',
    culturalSignificance: 'Called "Ahimsa (peace) silk" because the moth emerges naturally through the open cocoon tip before spinning begins, requiring no killing.',
    materials: ['Natural Eri fibroin protein fibers', 'Castor foliage essence'],
    image: '/assets/images/cultural/heritage/eri-silk.jpg',
    imageUrl: '/assets/images/cultural/heritage/eri-silk.jpg',
    model: '/assets/models/artifacts/eri-cocoon.glb',
    modelUrl: '/assets/models/artifacts/eri-cocoon.glb',
    arAvailable: true,
    vrAvailable: true,
    featured: true,
    tags: ['eri silk', 'endi', 'cocoon', 'ahimsa', 'materials'],
    relatedProcesses: ['spinning', 'reeling', 'sizing'],
    relatedMotifs: ['daorai-agor', 'singri-agor'],
    sources: [
      { title: 'Eri Sericulture and Rural Livelihoods in BTC Assam', author: 'Central Silk Board', year: 2023 }
    ],
    details: {
      origin: 'Kokrajhar Agro-Forestry Belt',
      artisanCommunity: 'Women Sericulturists Alliance',
      dimensions: 'Variable (4 cm - 6 cm length)',
      period: 'Ancient Living Bio-Heritage'
    }
  },
  {
    id: 'traditional-bodo-loom',
    name: 'Traditional Bodo Sal (Frame Loom)',
    bodoName: 'साल (Traditional Sal Loom)',
    category: 'LOOMS',
    description: 'Four-post indigenous timber handloom complete with warp roller beam, cloth beam, serski reed batten, and foot heddles.',
    culturalSignificance: 'The epicentre of Bodo family culture; woven under the Dakhin-duari southern eaves of the homestead courtyard.',
    materials: ['Seasoned Sal timber', 'Split Muli bamboo', 'Buffalo horn shuttle guides'],
    image: '/assets/images/about/about-1.JPG',
    imageUrl: '/assets/images/about/about-1.JPG',
    model: '/assets/models/looms/Traditional-loom.glb',
    modelUrl: '/assets/models/looms/Traditional-loom.glb',
    arAvailable: true,
    vrAvailable: true,
    featured: true,
    tags: ['sal', 'loom', 'weaving', 'handloom', 'timber'],
    relatedProcesses: ['warping', 'beaming', 'drafting', 'weaving'],
    relatedMotifs: ['hajw-agor', 'daorai-agor'],
    sources: [
      { title: 'Bodo Traditional Handloom Architecture & Implements', author: 'Assam Handloom Directorate', year: 2022 }
    ],
    details: {
      origin: 'Bodoland Territorial Region, Assam',
      artisanCommunity: 'Master Weavers Collective',
      dimensions: '180 cm x 140 cm x 160 cm',
      period: 'Living Heritage'
    }
  },
  {
    id: 'makuu-shuttle',
    name: 'Makuu (Bamboo Weaving Shuttle)',
    bodoName: 'माखु (Makuu)',
    category: 'TOOLS',
    description: 'Aerodynamic bamboo boat shuttle weighted with polished brass tips that shoots the weft yarn across the warp shed.',
    culturalSignificance: 'Emblematic rhythm maker of the Bodo home; celebrated in traditional folk songs and harvest melodies.',
    materials: ['Assam golden bamboo', 'Beeswax polish', 'Brass tip fittings'],
    image: '/assets/images/about/about-1.JPG',
    imageUrl: '/assets/images/about/about-1.JPG',
    model: '/assets/models/tools/makuu.glb',
    modelUrl: '/assets/models/tools/makuu.glb',
    arAvailable: true,
    vrAvailable: true,
    featured: true,
    tags: ['makuu', 'shuttle', 'weft', 'bamboo', 'tools'],
    relatedProcesses: ['weft-winding', 'weaving'],
    relatedMotifs: ['hajw-agor', 'singri-agor'],
    sources: [
      { title: 'Material Culture of the Bodo Community', author: 'Dr. B. K. Daimary', year: 2018 }
    ],
    details: {
      origin: 'Kokrajhar, Assam',
      artisanCommunity: 'Heritage Toolmakers',
      dimensions: '32 cm x 3.5 cm x 2.8 cm',
      period: 'Living Tradition'
    }
  },
  {
    id: 'loom-paddle',
    name: 'Loom Foot Paddle (Treadle)',
    bodoName: 'गांखं / फेदेल (Paddle Treadle)',
    category: 'TOOLS',
    description: 'Hardwood foot pedal suspended from heddles, pressed rhythmically by the weaver to separate upper and lower warp threads.',
    culturalSignificance: 'Controls the alternate shed openings that allow the shuttle to pass freely during high-speed weaving.',
    materials: ['Teak wood', 'Hand-twisted jute suspension cord'],
    image: '/assets/images/about/about-1.JPG',
    imageUrl: '/assets/images/about/about-1.JPG',
    model: '/assets/models/tools/paddle.glb',
    modelUrl: '/assets/models/tools/paddle.glb',
    arAvailable: true,
    vrAvailable: true,
    featured: true,
    tags: ['paddle', 'treadle', 'shedding', 'tools', 'footwork'],
    relatedProcesses: ['shedding', 'weaving'],
    relatedMotifs: ['hajw-agor'],
    sources: [
      { title: 'Mechanics of Traditional Looms in Assam', author: 'Tribal Research Institute', year: 2021 }
    ],
    details: {
      origin: 'Baksa District, Assam',
      artisanCommunity: 'Village Woodwrights',
      dimensions: '65 cm x 15 cm x 8 cm',
      period: 'Traditional Design'
    }
  },
  {
    id: 'bobin-case',
    name: 'Bobin Case (Yarn Spool Holder)',
    bodoName: 'बबिन केस (Bobin Case)',
    category: 'TOOLS',
    description: 'Turned hardwood cylinder crafted with precision bore to safely house loaded silk bobbins without snagging fine threads.',
    culturalSignificance: 'Ensures delicate Ahimsa Eri and Muga silk threads maintain pristine tension without fraying.',
    materials: ['Rosewood', 'Beeswax finish', 'Polished cane pin'],
    image: '/assets/images/about/about-3.JPG',
    imageUrl: '/assets/images/about/about-3.JPG',
    model: '/assets/models/tools/Bobin_case.glb',
    modelUrl: '/assets/models/tools/Bobin_case.glb',
    arAvailable: true,
    vrAvailable: true,
    featured: true,
    tags: ['bobin', 'case', 'spool', 'silk', 'tools'],
    relatedProcesses: ['winding', 'weft-preparation'],
    relatedMotifs: ['daorai-agor'],
    sources: [
      { title: 'Silk Spinning and Winding Tools in Rural Assam', author: 'Assam Cultural Directorate', year: 2020 }
    ],
    details: {
      origin: 'Dotma, Kokrajhar',
      artisanCommunity: 'Sericulture Guild',
      dimensions: '16 cm x 12 cm x 12 cm',
      period: 'Mid 20th Century'
    }
  },
  {
    id: 'swrki-reed',
    name: 'Swrki (Bamboo Reed Batten)',
    bodoName: 'सोरखि (Swrki / Serski)',
    category: 'TOOLS',
    description: 'Fine split bamboo comb frame with hundreds of micro-spaced reed slits, used to beat the weft yarn into tightly woven cloth.',
    culturalSignificance: 'Determines the thread density and flawless texture of high-grade Dokhona Thaosi and ceremonial Aronai.',
    materials: ['Seasoned Bijli bamboo splits', 'Handwoven cane binding'],
    image: '/assets/images/about/about-1.JPG',
    imageUrl: '/assets/images/about/about-1.JPG',
    model: '/assets/models/tools/Swrki.glb',
    modelUrl: '/assets/models/tools/Swrki.glb',
    arAvailable: true,
    vrAvailable: true,
    featured: true,
    tags: ['swrki', 'serski', 'reed', 'batten', 'bamboo'],
    relatedProcesses: ['beating', 'warp-alignment'],
    relatedMotifs: ['dingkhia-agor', 'hajw-agor'],
    sources: [
      { title: 'The Technology of Traditional Weaving Combs', author: 'N. Brahma', year: 2021 }
    ],
    details: {
      origin: 'Chirang District, Assam',
      artisanCommunity: 'Master Bamboo Craftsmen',
      dimensions: '110 cm x 22 cm x 5 cm',
      period: 'Living Tradition'
    }
  },
  {
    id: 'mushra-tool',
    name: 'Mushra (Traditional Yarn Guide Tool)',
    bodoName: 'मुस्रा (Mushra)',
    category: 'TOOLS',
    description: 'Indigenous tensioning and thread separating implement used by master weavers while preparing the warp chain.',
    culturalSignificance: 'Ensures warp threads never tangle across tens of meters during outdoor ground warping sessions.',
    materials: ['Jackfruit wood', 'Polished bamboo tines'],
    image: '/assets/images/about/about-4.JPG',
    imageUrl: '/assets/images/about/about-4.JPG',
    model: '/assets/models/tools/mushra.glb',
    modelUrl: '/assets/models/tools/mushra.glb',
    arAvailable: true,
    vrAvailable: true,
    featured: true,
    tags: ['mushra', 'yarn guide', 'warping', 'tools'],
    relatedProcesses: ['warping', 'tensioning'],
    relatedMotifs: ['thaigir-bibar'],
    sources: [
      { title: 'Warping Methodologies in Assam Tribal Weaving', author: 'TRI Guwahati', year: 2019 }
    ],
    details: {
      origin: 'Udalguri, Assam',
      artisanCommunity: 'Traditional Weavers Council',
      dimensions: '35 cm x 28 cm x 18 cm',
      period: 'Living Tradition'
    }
  }
];

export const artifacts = INITIAL_ARTIFACTS;

export function getFeaturedArtifacts(): Artifact[] {
  return artifacts.filter((a) => a.featured);
}

export function getArtifactById(id: string): Artifact | undefined {
  return artifacts.find((a) => a.id === id);
}

export function getArtifactsByCategory(category: string): Artifact[] {
  if (category.toLowerCase() === 'all') return artifacts;
  return artifacts.filter((a) => a.category.toLowerCase() === category.toLowerCase());
}
