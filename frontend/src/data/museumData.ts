import { Artifact, Motif, DyeingStep, ProcessStage, WeaverProfile } from '../types';
import { INITIAL_MOTIFS } from './motifs';
import { INITIAL_DYEING_STEPS } from './dyeing';

export const MOTIFS_DATA: Motif[] = INITIAL_MOTIFS;

export const ARTIFACTS_DATA: Artifact[] = [
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
    arAvailable: true,
    vrAvailable: true,
    modelUrl: '/assets/models/tools/maku.glb',
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
    arAvailable: true,
    vrAvailable: true,
    modelUrl: '/assets/models/artifacts/dokhona.glb',
    relatedProcesses: ['warping', 'beaming', 'weaving'],
    relatedMotifs: ['hajw-agor', 'daorai-agor', 'phul-agor'],
    sources: [
      { title: 'Bodo Women and the Loom: Gender, Space and Cultural Expression', author: 'N. Brahma', year: 2022 }
    ],
    details: {
      origin: 'Kokrajhar, Bodoland Territorial Region',
      artisanCommunity: 'Traditional Master Weavers',
      dimensions: '280 cm x 115 cm',
      period: 'Contemporary Masterpiece'
    }
  },
  {
    id: 'khabang-bobbin-holder',
    name: 'Khabang / Gandwi (Bobbin Winder)',
    bodoName: 'खाबां / गान्द्वि (Khabang)',
    category: 'TOOLS',
    description: 'Hand-operated bamboo bobbin winder and spinning swift used to transfer dyed hank yarn onto small reeds or bobbins that fit inside the Maku shuttle.',
    culturalSignificance: 'A central fixture of domestic Assamese verandas where songs, stories, and weaving instructions are shared between generations.',
    materials: ['Split bamboo struts', 'Hardwood spindle shaft', 'Cord tensioner'],
    image: '/assets/images/tools/bobbin.jpg',
    imageUrl: '/assets/images/tools/bobbin.jpg',
    arAvailable: true,
    vrAvailable: true,
    modelUrl: '/assets/models/tools/khabang.glb',
    relatedProcesses: ['reeling', 'winding'],
    relatedMotifs: ['gongar-agor'],
    sources: [
      { title: 'Ethno-technological Studies of Northeast Indian Looms', author: 'Assam State Museum', year: 2019 }
    ]
  },
  {
    id: 'aronai-scarf',
    name: 'Ceremonial Aronai',
    bodoName: 'आर’नाइ (Aronai)',
    category: 'TEXTILES',
    description: 'A traditional Bodo scarf adorned with geometric Agor patterns and fringed edges, presented to guests as a symbol of peace, honor, and deep respect.',
    culturalSignificance: 'Worn during the Bagurumba traditional dance and all auspicious public gatherings. Gifting an Aronai is the highest traditional mark of honor.',
    materials: ['Eri silk & fine cotton', 'Natural dyes'],
    image: '/assets/images/textiles/silk/aronai.jpg',
    imageUrl: '/assets/images/textiles/silk/aronai.jpg',
    arAvailable: true,
    vrAvailable: true,
    modelUrl: '/assets/models/artifacts/aronai.glb',
    relatedProcesses: ['weaving'],
    relatedMotifs: ['hajw-agor', 'phul-agor', 'daorai-agor'],
    sources: [
      { title: 'Aronai: The Symbol of Bodo Cultural Identity', author: 'Central Institute of Technology Kokrajhar', year: 2020 }
    ]
  },
  {
    id: 'traditional-bodo-loom',
    name: 'Bodo Throw-Shuttle Sal (Loom)',
    bodoName: 'तन्ती साल (Sal)',
    category: 'LOOMS',
    description: 'Sturdy traditional frame and pit loom constructed of bamboo and seasoned sal wood, featuring foot treadles, reed batten, and warp beam rollers.',
    culturalSignificance: 'Every traditional Bodo homestead features an active loom veranda; weaving proficiency is regarded as a vital cultural life-skill.',
    materials: ['Sal timber', 'Mature bamboo beams', 'Hemp cords', 'Ironwood pully'],
    image: '/assets/images/handloom/traditional-loom.jpg',
    imageUrl: '/assets/images/handloom/traditional-loom.jpg',
    arAvailable: true,
    vrAvailable: true,
    modelUrl: '/assets/models/looms/traditional-loom.glb',
    relatedProcesses: ['warping', 'beaming', 'looming', 'weaving'],
    relatedMotifs: ['hajw-agor', 'singri-agor'],
    sources: [
      { title: 'The Technology of Indigenous Looms in Assam', author: 'Gauhati University Folk Studies', year: 2017 }
    ]
  },
  {
    id: 'eri-silk-yarn',
    name: 'Endi / Eri Silk Cocoon & Hank',
    bodoName: 'एन्दि / एरि खौ (Eri Khou)',
    category: 'MATERIALS',
    description: 'Ahimsa (peace) silk harvested from Samia cynthia ricini caterpillars fed on castor leaves, creating durable, thermally insulating, cream-colored yarn.',
    culturalSignificance: 'Eri silk rearing and spinning is an ancient eco-friendly agro-craft practiced by Bodo families without killing the pupa.',
    materials: ['Natural Eri cocoons', 'Handspun filament', 'Rice water starch sizing'],
    image: '/assets/images/cultural/heritage/eri-silk.jpg',
    imageUrl: '/assets/images/cultural/heritage/eri-silk.jpg',
    arAvailable: true,
    vrAvailable: true,
    modelUrl: '/assets/models/artifacts/eri-cocoon.glb',
    relatedProcesses: ['ginning', 'spinning', 'reeling', 'sizing'],
    relatedMotifs: ['dingkhia-agor', 'muphur-apha']
  },
  {
    id: 'serski-reed',
    name: 'Serski (Bamboo Reed Batten)',
    bodoName: 'सेरसखि (Serski)',
    category: 'TOOLS',
    description: 'Intricately handcrafted reed comb with hundreds of paper-thin bamboo teeth bound with waxed cord, keeping warp density uniform.',
    culturalSignificance: 'Crafted exclusively by specialized village bamboo craftsmen, determining the thread count and precision of motifs.',
    materials: ['Finely shaved bamboo reeds', 'Waxed cotton binding', 'Timber frame'],
    image: '/assets/images/tools/other-tools/serski.jpg',
    imageUrl: '/assets/images/tools/other-tools/serski.jpg',
    arAvailable: true,
    vrAvailable: true,
    modelUrl: '/assets/models/tools/serski.glb',
    relatedProcesses: ['beaming', 'looming', 'weaving']
  },
  {
    id: 'natural-indigo-pot',
    name: 'Rom Dye Pot (Natural Indigo)',
    bodoName: 'रोम (Rom Dye Pot)',
    category: 'DYEING',
    description: 'Fermented natural indigo vat using Strobilanthes cusia and wild indigo leaves, steeped in wood ash alkaline lye for rich indanthrone blues.',
    culturalSignificance: 'Traditional dyers observe strict temperature and fermentation cycles passed down through oral family recipes.',
    materials: ['Terracotta crock', 'Fermented indigo paste', 'Banana stem ash water'],
    image: '/assets/images/cultural/cultural-practices/dye-basket.jpg',
    imageUrl: '/assets/images/cultural/cultural-practices/dye-basket.jpg',
    arAvailable: true,
    vrAvailable: true,
    modelUrl: '/assets/models/other/dye-pot.glb',
    relatedProcesses: ['dyeing']
  }
];

export const DYEING_STEPS: DyeingStep[] = INITIAL_DYEING_STEPS;

export const PROCESS_STAGES: ProcessStage[] = [
  {
    id: 'ginning',
    stepNumber: 1,
    name: 'Ginning',
    bodoName: 'खुन सायनाय (Khun Saynay)',
    shortDesc: 'Separating raw cotton seeds from fluffy lint fibers using traditional wooden rollers.',
    detailedProcess: 'Freshly harvested cotton bolls are hand-fed into the wooden Janthwr roller gin. The contra-rotating rollers squeeze out hard seeds while pulling clean white lint through.',
    tools: ['Janthwr (Hand roller gin)', 'Cane basket', 'Wooden mallet'],
    materials: ['Indigenous raw short-staple cotton'],
    culturalImportance: 'Marks the start of the post-monsoon textile preparation cycle in rural Bodo households.',
    modelType: 'spindle'
  },
  {
    id: 'spinning',
    stepNumber: 2,
    name: 'Spinning',
    bodoName: 'खुन बांनाय (Khun Bangnay)',
    shortDesc: 'Drawing out slivers of cotton or Eri silk cocoons and twisting them into fine continuous yarn.',
    detailedProcess: 'Using the drop spindle (Takhri) or portable wooden spinning charkha, weavers tease fibers outward with one hand while rotating the balanced whorl with the other.',
    tools: ['Takhri (Drop spindle)', 'Wooden charkha', 'Clay whorl'],
    materials: ['Boiled Eri silk cocoons', 'Cotton slivers'],
    culturalImportance: 'Spinning songs and rhythmic foot tapping form the oral soundtrack of village community gatherings.',
    modelType: 'spindle'
  },
  {
    id: 'reeling',
    stepNumber: 3,
    name: 'Reeling',
    bodoName: 'खौ सायनाय (Khou Saynay)',
    shortDesc: 'Unwinding continuous filaments from degummed cocoons into neat, even hanks.',
    detailedProcess: 'Eri silk filaments are drawn onto bamboo cross-reels, creating measured skeins suitable for immersion in natural dye vats.',
    tools: ['Reeling swift', 'Warm water basin', 'Bamboo rod'],
    materials: ['Ahimsa Eri silk', 'Alkaline ash water'],
    culturalImportance: 'Practiced without boiling the pupa alive, upholding indigenous ecological reverence.',
    modelType: 'bobbin'
  },
  {
    id: 'sizing',
    stepNumber: 4,
    name: 'Sizing',
    bodoName: 'जां होनाय (Jang Honay)',
    shortDesc: 'Treating the yarn with natural rice gruel paste to increase tensile strength and smooth friction.',
    detailedProcess: 'The stretched yarn is brushed with strained rice starch (Maad) using a specialized brush made of stiff natural palm or bamboo fibers.',
    tools: ['Rice water trough', 'Natural bristle sizing brush', 'Tension pegs'],
    materials: ['Boiled rice water (Maad)', 'Pure water'],
    culturalImportance: 'Prevents warp breakage during high-speed shed changes on the loom.',
    modelType: 'shuttle'
  },
  {
    id: 'winding',
    stepNumber: 5,
    name: 'Winding',
    bodoName: 'खाबां होनाय (Khabang Honay)',
    shortDesc: 'Transferring yarn from hanks onto bobbins and shuttles ready for warping and weft insertion.',
    detailedProcess: 'The swift rotates smoothly as the weaver guides the thread onto bamboo bobbins (Khabang) with effortless cadence.',
    tools: ['Khabang winder', 'Bamboo bobbin rods'],
    materials: ['Sized dyed yarn'],
    culturalImportance: 'A calming meditative task often performed while watching children play on the courtyard.',
    modelType: 'bobbin'
  },
  {
    id: 'warping',
    stepNumber: 6,
    name: 'Warping',
    bodoName: 'जां दिनाय (Jang Dinay)',
    shortDesc: 'Arranging hundreds of parallel warp threads at precise length and tension.',
    detailedProcess: 'Warp threads are walked around boundary pegs driven into the clean clay courtyard, creating the cross (lease) that keeps threads organized.',
    tools: ['Warping pegs (Jang Khunti)', 'Guide reed', 'Cross sticks'],
    materials: ['Dyed warp thread bundle'],
    culturalImportance: 'Requires coordinated team effort by 3–4 women singing traditional counting chants.',
    modelType: 'loom'
  },
  {
    id: 'beaming',
    stepNumber: 7,
    name: 'Beaming',
    bodoName: 'जां खुनथियाव बोनाय (Beaming onto Rollers)',
    shortDesc: 'Winding the entire warp array onto the loom rear beam with uniform tension.',
    detailedProcess: 'The warp sheet is rolled slowly onto the timber beam while inserting split bamboo laths to prevent threads from biting into lower layers.',
    tools: ['Warp roller beam', 'Bamboo separator slats', 'Tension weights'],
    materials: ['Prepared warp sheet'],
    culturalImportance: 'Crucial for ensuring the finished Dokhona hangs straight and even without puckering.',
    modelType: 'loom'
  },
  {
    id: 'looming',
    stepNumber: 8,
    name: 'Looming & Drafting',
    bodoName: 'सेरसखियाव सोहोनाय (Threading Heddles & Reed)',
    shortDesc: 'Threading each warp yarn individually through heddle eyes and reed dents.',
    detailedProcess: 'With needle-like precision, every individual thread is passed through the string heddle loops and the bamboo Serski reed.',
    tools: ['Threading hook', 'Serski reed', 'Heddle frames (Bai)'],
    materials: ['Waxed heddle cords'],
    culturalImportance: 'Sets the foundational mathematical blueprint for all Agor motifs.',
    modelType: 'loom'
  },
  {
    id: 'weaving',
    stepNumber: 9,
    name: 'Weaving',
    bodoName: 'दिरनाय (Dirnay)',
    shortDesc: 'Interlacing warp and weft by rhythmically pressing treadles, throwing the shuttle, and beating the reed.',
    detailedProcess: 'The weaver alternates foot treadles to open the shed, shoots the Maku shuttle across, and beats the Serski batten forward to lock the weft.',
    tools: ['Maku shuttle', 'Treadle pedals', 'Serski batten', 'Pattern sticks'],
    materials: ['Warp & weft threads', 'Contrasting Agor extra weft'],
    culturalImportance: 'The pinnacle of Bodo artistic mastery, producing fabrics prized across Assam.',
    modelType: 'textile'
  },
  {
    id: 'finished-textile',
    stepNumber: 10,
    name: 'Finished Textile',
    bodoName: 'जोबनाय आगोरा (Jomnay Agora)',
    shortDesc: 'Inspecting, rolling, and trimming selvage tassels of the completed Dokhona or Aronai.',
    detailedProcess: 'The cloth is detached from the front cloth beam, inspected in natural daylight for uniform motif alignment, and fringe edges are hand-braided.',
    tools: ['Brass scissors', 'Inspection board'],
    materials: ['Finished handwoven Dokhona / Aronai'],
    culturalImportance: 'A triumphant moment celebrated with offerings and blessing the loom for the next creation.',
    modelType: 'textile'
  }
];

export const WEAVER_PROFILE: WeaverProfile = {
  id: 'anjali-swargiary',
  name: 'Anjali Swargiary',
  bodoTitle: 'माष्टार दिरगिरि (Master Weaver & Living Heritage Bearer)',
  location: 'Dotma Village, Kokrajhar District',
  district: 'Bodoland Territorial Region, Assam',
  experience: '38 Years of Living Craftsmanship',
  specialization: 'Eri Silk Dokhona Thaosi, Traditional Natural Indigo Dyeing, Rare Hajw & Daorai Agor Motifs',
  traditionalKnowledge: 'Learned the art of the loom from her maternal grandmother at age 9. She possesses encyclopedic knowledge of over 40 traditional Bodo Agor motifs and seasonal forest botanical dyes. She has trained more than 120 young women across Bodoland to preserve indigenous handloom heritage.',
  interviewQuote: '"When my shuttle glides across the loom, I am not merely weaving threads—I am carrying the voices of our ancestors, the rivers of Bodoland, and the sacred beauty of our hills into every golden motif."',
  audioDuration: '04:42',
  masterpieces: ['Heirloom Wedding Dokhona Thaosi (1998)', 'Golden Muga Aronai with Daorai Agor (2012)', 'Sacred Forest Fern Chadar (2023)']
};
