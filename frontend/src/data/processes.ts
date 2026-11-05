import { ProcessStage } from '../types';

export type ProcessStep = ProcessStage;

export const INITIAL_PROCESSES: ProcessStage[] = [
  {
    id: 'ginning',
    stepNumber: 1,
    name: 'Ginning',
    bodoName: 'खुन सायनाय (Khun Saynay / Zenther)',
    shortDesc: 'Separating raw cotton seeds from fluffy lint fibers using traditional wooden rollers.',
    detailedProcess: 'Harvested organic cotton bolls are hand-fed through contra-rotating hardwood rollers. The seeds are stripped cleanly without crushing the natural fiber crimp.',
    tools: ['Zenther (Hand roller gin)', 'Cane collection basket', 'Wooden pestle'],
    materials: ['Fresh indigenous seed cotton'],
    culturalImportance: 'Marks the commencement of the autumn-winter textile cycle across rural Bodoland courtyards.',
    image: '/assets/images/process/ginning.jpg',
    modelType: 'spindle'
  },
  {
    id: 'spinning',
    stepNumber: 2,
    name: 'Spinning',
    bodoName: 'खुन बांनाय (Khun Bangnay / Takhri)',
    shortDesc: 'Teasing cotton slivers and degummed Eri cocoons into continuous handspun yarn with the drop spindle.',
    detailedProcess: 'Using the drop spindle (Takhri) or portable wheel, the spinner imparts balanced rotational twist while drafting uniform strands with rhythmic dexterity.',
    tools: ['Takhri (Drop spindle)', 'Clay whorl', 'Wooden spinning wheel'],
    materials: ['Carded cotton slivers', 'Degummed Eri silk hanks'],
    culturalImportance: 'Accompanied by traditional folk songs; spinning sessions strengthen intergenerational community storytelling.',
    image: '/assets/images/process/spinning.jpg',
    modelType: 'spindle'
  },
  {
    id: 'reeling',
    stepNumber: 3,
    name: 'Reeling',
    bodoName: 'खौ सायनाय (Khou Saynay)',
    shortDesc: 'Unwinding continuous filaments from degummed cocoons into neat, even skeins.',
    detailedProcess: 'Eri silk filaments are drawn onto bamboo cross-reels, ensuring tension uniformity before immersion in botanical dye baths.',
    tools: ['Reeling swift', 'Warm water basin', 'Bamboo guiding rods'],
    materials: ['Ahimsa Eri silk cocoons', 'Banana ash water'],
    culturalImportance: 'Upholds Ahimsa principles where pupae emerge unharmed before processing.',
    image: '/assets/images/process/reeling.jpg',
    modelType: 'bobbin'
  },
  {
    id: 'sizing',
    stepNumber: 4,
    name: 'Sizing',
    bodoName: 'जां होनाय (Jang Honay)',
    shortDesc: 'Treating the delicate yarn with natural rice gruel paste (Maad) to boost tensile strength.',
    detailedProcess: 'Stretched yarn bundles are brushed with boiled rice starch using stiff palm-fiber brushes, smoothing surface fuzz and preventing warp breakage on the loom.',
    tools: ['Natural bristle sizing brush', 'Rice water trough', 'Tensioning stakes'],
    materials: ['Boiled rice water (Maad)', 'Pure spring water'],
    culturalImportance: 'A crucial indigenous chemical treatment that gives Bodo handloom its celebrated crispness and longevity.',
    image: '/assets/images/process/sizing.jpg',
    modelType: 'shuttle'
  },
  {
    id: 'winding',
    stepNumber: 5,
    name: 'Winding',
    bodoName: 'खाबां होनाय (Khabang Honay)',
    shortDesc: 'Transferring yarn from hanks onto bobbins and shuttles ready for warping and weft insertion.',
    detailedProcess: 'Using the swift and Khabang winder, yarn is transferred smoothly onto small bamboo reeds that nest inside the Maku shuttle cavity.',
    tools: ['Khabang bobbin winder', 'Bamboo swift (Gandwi)', 'Bobbin reeds'],
    materials: ['Sized, dyed yarn hanks'],
    culturalImportance: 'A meditative daily task performed on breezy verandas while watching children play.',
    image: '/assets/images/process/winding.jpg',
    modelType: 'bobbin'
  },
  {
    id: 'warping',
    stepNumber: 6,
    name: 'Warping',
    bodoName: 'जां दिनाय (Jang Dinay)',
    shortDesc: 'Arranging hundreds of parallel longitudinal warp threads to exact length and tension.',
    detailedProcess: 'Threads are wound around wooden boundary pegs driven into the clay courtyard, forming the cross (lease) that keeps individual threads in strict mathematical order.',
    tools: ['Jang Khunti (Warping pegs)', 'Guide reed', 'Cross sticks'],
    materials: ['Prepared warp thread bundles'],
    culturalImportance: 'A cooperative team effort requiring 3 to 4 women singing counting chants to ensure identical tension.',
    image: '/assets/images/process/warping.jpg',
    modelType: 'loom'
  },
  {
    id: 'beaming',
    stepNumber: 7,
    name: 'Beaming',
    bodoName: 'जां खुनथियाव बोनाय (Jang Khunthiyaw Bonay)',
    shortDesc: 'Winding the entire warp sheet onto the loom rear beam with uniform tension.',
    detailedProcess: 'The warp array is rolled slowly onto the timber beam while inserting split bamboo laths to prevent threads from cutting into underlying layers.',
    tools: ['Warp roller beam', 'Bamboo separator slats', 'Tension weights'],
    materials: ['Stretched warp array'],
    culturalImportance: 'Guarantees the finished Dokhona hangs straight and even without puckering or selvage distortion.',
    image: '/assets/images/process/beaming.jpg',
    modelType: 'loom'
  },
  {
    id: 'looming',
    stepNumber: 8,
    name: 'Looming & Drafting',
    bodoName: 'सेरसखियाव सोहोनाय (Serskiyaw Sohonay)',
    shortDesc: 'Threading each warp thread individually through string heddles and the bamboo Serski reed.',
    detailedProcess: 'With pinpoint hand-eye coordination, each individual thread is drawn through heddle loops and reed dents, programming the geometric motif capability of the loom.',
    tools: ['Threading hook', 'Serski reed comb', 'String heddles (Bai)'],
    materials: ['Waxed heddle cords'],
    culturalImportance: 'Sets the foundational mathematical blueprint for all sacred Agor patterns.',
    image: '/assets/images/process/looming.jpg',
    modelType: 'loom'
  },
  {
    id: 'weaving',
    stepNumber: 9,
    name: 'Weaving',
    bodoName: 'दिरनाय (Dirnay)',
    shortDesc: 'Interlacing warp and weft by pressing treadles, throwing the Maku shuttle, and beating the reed.',
    detailedProcess: 'The weaver alternates foot treadles to open the shed, shoots the Maku across, and beats the batten firmly forward, locking in the extra-weft Agor motifs.',
    tools: ['Maku shuttle', 'Treadle pedals', 'Serski batten', 'Agor pattern sticks'],
    materials: ['Base warp and weft threads', 'Contrast golden extra-weft yarn'],
    culturalImportance: 'The culmination of Bodo feminine artistic mastery, producing fabrics renowned across Northeast India.',
    image: '/assets/images/process/weaving.jpg',
    modelType: 'textile'
  }
];

export const processes = INITIAL_PROCESSES;
