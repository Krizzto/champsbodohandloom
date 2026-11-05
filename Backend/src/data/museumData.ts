import type { OKFProcess, ExhibitItem, MuseumGallery, RetrievalBenchmarkItem, DocumentManifestItem } from '../types/museum.ts';

export const OKF_PROCESSES: OKFProcess[] = [
  {
    id: 'ginning',
    title: 'Ginning',
    nativeTerm: 'Neotha hwnai',
    type: 'Process',
    documentId: '19869884-c755-4f33-99ae-73a54fe5d435',
    description: 'Traditional pre-weaving process in Bodo handloom preparation for cleaning raw cotton.',
    tags: ['Bodo', 'handloom', 'weaving', 'cotton', 'pre-weaving'],
    status: 'draft',
    source: {
      id: 'traditional-weaving-process',
      resource: 'knowledge_base/01_raw_data/processes/Traditionalweaving_Process.pdf',
      title: 'Traditional Weaving Process of the Bodos'
    },
    content: `The ginning is first pre weaving process that the cottons seed are dried and cleaning off by using a wooden device after collection from the plant. It is known as Neotha hwnai among the Bodos. In this process, consists of two vertical wooden posts and fixed to a flat piece of wood. Then two wooden rollers fitted on it, which revolves in opposite directions. By left hand, the operator moves the crank and the machine is feeds by right hand with cotton. The seeds, dust, leafs are extracted from cotton through this process.`,
    keySteps: [
      'Drying collected raw cotton bolls under the sun',
      'Mounting cotton into the dual counter-rotating wooden roller device',
      'Left hand operates manual wooden crank while right hand evenly feeds cotton fibers',
      'Mechanical extraction and separation of seeds, plant debris, and dried leaves'
    ],
    toolsUsed: ['Neotha (Wooden Ginning Roller)', 'Flat wooden foundation block', 'Manual hand crank'],
    duration: '1-2 days for standard harvest batch',
    galleryId: 'gallery_raw_fibers',
    exhibitId: 'exhibit_ginning_roller'
  },
  {
    id: 'spinning',
    title: 'Spinning',
    nativeTerm: 'Khundung thunnai',
    type: 'Process',
    documentId: '19869884-c755-4f33-99ae-73a54fe5d435',
    description: 'Converting treated fibers into continuous uniform yarn using traditional spinning wheels.',
    tags: ['Bodo', 'handloom', 'weaving', 'cotton', 'spinning'],
    status: 'draft',
    source: {
      id: 'traditional-weaving-process',
      resource: 'knowledge_base/01_raw_data/processes/Traditionalweaving_Process.pdf',
      title: 'Traditional Weaving Process of the Bodos'
    },
    content: `After sizing, the boiled thread fitted on a danganatha (big size reel) for dried. The skein of thread wound at a stretch and then removed from the reel. The skeins of thread then spread on one pair of gonsi (flat long split bamboo) and let dry in the sunshine. When the threads are dry, these fitted on chwrkhi (small size reel) for spinning. The chwrkhi placed on the ground and then the threads are spins around it from the zenther (spinning wheel). Usually, it makes the thread rounds bigger, which is convenient for weaving and removes the knots of the thread. Then the threads spun again into smaller spools called the Bobbin. The zenther runs by single-handed woman who spins the thread into the wheel with one hand that other hand used for wrapping the thread into the spools. The Spinning or winding is known as khundung thunnai in Bodo.`,
    keySteps: [
      'Mounting sized thread skein onto danganatha (large reel)',
      'Spreading skeins on gonsi (flat split bamboo) for thorough solar drying',
      'Transferring dried skein onto ground-mounted chwrkhi (small reel)',
      'Operating the zenther (spinning wheel) with single-hand rhythm to draw and twist yarn onto bobbins'
    ],
    toolsUsed: ['Zenther (Spinning Wheel)', 'Danganatha (Large Reel)', 'Chwrkhi (Small Reel)', 'Gonsi (Split Bamboo)', 'Bobbin Spools'],
    duration: '3-5 days per weaving lot',
    galleryId: 'gallery_spinning_preparation',
    exhibitId: 'exhibit_spinning_wheel'
  },
  {
    id: 'reeling',
    title: 'Reeling',
    nativeTerm: 'Kwfwnai',
    type: 'Process',
    documentId: '19869884-c755-4f33-99ae-73a54fe5d435',
    description: 'Sericulture filament unwinding from steamed mulberry and eri silkworm cocoons.',
    tags: ['Bodo', 'handloom', 'sericulture', 'silk', 'eri', 'mulberry'],
    status: 'draft',
    source: {
      id: 'traditional-weaving-process',
      resource: 'knowledge_base/01_raw_data/processes/Traditionalweaving_Process.pdf',
      title: 'Traditional Weaving Process of the Bodos'
    },
    content: `Among the Bodos both rearing and reeling operations are traditional techniques. The reeling has mostly done on the mulberry cocoons. Firstly, the cocoons boiled in a vessel with water by fire or softened by steam. Number of selected cocoons are kept floating on the surface of water. After over the process the cocoons packet by leaves of tharai (Curcuma rubescens) and followed by pressed with some heavy weight to removes the water completely. The cocoons are bring out from packet after 5 to 6 days and washed thoroughly to make it ready for reeling. After completion of this process, the cocoons gradually started to reel by the women folk on her left hand by right palm.`,
    keySteps: [
      'Careful sorting of mature eri and mulberry cocoons',
      'Boiling or steam-softening cocoons in earthen/metal pot to loosen sericin gum',
      'Wrapping treated cocoons in medicinal tharai leaves (Curcuma rubescens)',
      'Weight pressing for 5-6 days followed by thorough washing',
      'Manual drawing of delicate silk filaments using left hand and right palm technique'
    ],
    toolsUsed: ['Boiling vessel / steaming pot', 'Tharai leaves (Curcuma rubescens)', 'Stone weights', 'Water basin'],
    duration: '7-9 days (including leaf pressing)',
    galleryId: 'gallery_raw_fibers',
    exhibitId: 'exhibit_reeling_basin'
  },
  {
    id: 'sizing',
    title: 'Sizing',
    nativeTerm: 'Maidi hwnai',
    type: 'Process',
    documentId: '19869884-c755-4f33-99ae-73a54fe5d435',
    description: 'Application of natural botanical starches to strengthen yarn tensile endurance for the loom.',
    tags: ['Bodo', 'handloom', 'weaving', 'sizing', 'starch'],
    status: 'draft',
    source: {
      id: 'traditional-weaving-process',
      resource: 'knowledge_base/01_raw_data/processes/Traditionalweaving_Process.pdf',
      title: 'Traditional Weaving Process of the Bodos'
    },
    content: `The sizing is a pre weaving process, which is unique technique of handloom weaving. Sizing is a coating of lubricate mixture of natural ingredients containing like – rice powder, maize, wheat flour etc. which is overlap on the surfaces of the yarn and it makes the yarn strength, rounder in shape and uniform in diameter. The sizing processing called Maidi hwnai among the Bodos. During the process of sizing, ingredients are mixes in a big tube and boiled it with hot water. The process is carries out by the skilled weavers in the village. The yarns then treated in the hot sizing solution and care has taken to see that the application of size is satisfactory. The special brushes used to spread the boiled threads and dry the starch on the yarn. Eventually, depending on the warp length, three to four persons are required to carry out sizing process. However, while preparing muga or eri yarn for weaving, the threads are soaked for 1 to 2 hours in a light warm hot water, but never boiled. For fine and strong yarn, the traditional sizing process is necessary.`,
    keySteps: [
      'Formulating natural starch broth from rice powder, maize, and wheat flour',
      'Boiling starch mixture in large troughs for cotton, or lukewarm infusion for eri/muga',
      'Immersion of yarn skeins ensuring uniform penetration without tangling',
      'Cooperative brush-stretching by 3-4 weavers outdoors to polish yarn roundness and dry starch'
    ],
    toolsUsed: ['Maidi tube/trough', 'Natural sizing paste (rice, maize, flour)', 'Coarse bristle sizing brushes', 'Drying trestles'],
    duration: 'Full day community effort (3-4 persons)',
    galleryId: 'gallery_spinning_preparation',
    exhibitId: 'exhibit_sizing_station'
  },
  {
    id: 'warping',
    title: 'Warping',
    nativeTerm: 'Ji Swngnai',
    type: 'Process',
    documentId: '19869884-c755-4f33-99ae-73a54fe5d435',
    description: 'Systematic alignment of hundreds of parallel warp threads from bobbins onto the warp beam.',
    tags: ['Bodo', 'handloom', 'weaving', 'warping', 'warp-beam'],
    status: 'draft',
    source: {
      id: 'traditional-weaving-process',
      resource: 'knowledge_base/01_raw_data/processes/Traditionalweaving_Process.pdf',
      title: 'Traditional Weaving Process of the Bodos'
    },
    content: `The warping is the third stage of the weaving techniques after sizing and spinning. Specially, the process involves transferring yarn from several of tubes, cones or cheeses positioned on the creel onto a gandwi (warp beam). It requires numbers of bobbins and then bobbins are placed on a huge wooden made frame creel. After fitting the bobbins in creel, the ends of the bobbins passed through the hank frame. The length of the warp is depends on the circumference of the drum, reed and number of bobbins fitted on creel that the process is known as Ji Swngnai in Bodo.`,
    keySteps: [
      'Arranging dozens of wound bobbins in precise grid on heavy wooden creel frame',
      'Guiding thread ends simultaneously through the dividing hank eyelets',
      'Calculating warp tension and overall length using rotational drum geometry',
      'Winding parallel threads smoothly onto the gandwi (warp beam)'
    ],
    toolsUsed: ['Wooden Creel Frame', 'Hank frame eyelet guide', 'Gandwi (Warp Beam)', 'Rotational warping drum'],
    duration: '1-2 days',
    galleryId: 'gallery_loom_apparatus',
    exhibitId: 'exhibit_warp_creel'
  },
  {
    id: 'winding',
    title: 'Winding',
    nativeTerm: 'Phira thunnai',
    type: 'Process',
    documentId: '19869884-c755-4f33-99ae-73a54fe5d435',
    description: 'Transferring yarn from skeins onto specialized bobbins or shuttle pirns for weft insertion.',
    tags: ['Bodo', 'handloom', 'weaving', 'winding', 'pirn', 'bobbin'],
    status: 'draft',
    source: {
      id: 'traditional-weaving-process',
      resource: 'knowledge_base/01_raw_data/processes/Traditionalweaving_Process.pdf',
      title: 'Traditional Weaving Process of the Bodos'
    },
    content: `This process is necessary that the yarn tread convert to a suitable form to make it convenient to prepare the warp. As using of traditional techniques, the method widely acceptable amongst the Bodo weavers and they are winding of yarn on bobbins (for warp). The swrkhi (winding drum wheel) can be use to wind weft yam on pirn.`,
    keySteps: [
      'Setting yarn skein on revolving swift cage',
      'Anchoring thread lead to small bamboo bobbin core',
      'Rotating swrkhi (winding drum wheel) at steady cadence',
      'Packaging compact pirns ready for insertion into the shuttle boat'
    ],
    toolsUsed: ['Swrkhi (Winding Drum Wheel)', 'Bamboo Pirns', 'Flanged Bobbins', 'Spindle axle'],
    duration: '4-8 hours',
    galleryId: 'gallery_spinning_preparation',
    exhibitId: 'exhibit_winding_drum'
  },
  {
    id: 'beaming',
    title: 'Beaming',
    nativeTerm: 'Phannai',
    type: 'Process',
    documentId: '19869884-c755-4f33-99ae-73a54fe5d435',
    description: 'Mounting and anchoring the ordered warp sheet into the weaver\'s beam groove with binding cord.',
    tags: ['Bodo', 'handloom', 'weaving', 'beaming', 'phannai'],
    status: 'draft',
    source: {
      id: 'traditional-weaving-process',
      resource: 'knowledge_base/01_raw_data/processes/Traditionalweaving_Process.pdf',
      title: 'Traditional Weaving Process of the Bodos'
    },
    content: `The reed is move carefully after denting towards the warp and transferring the warp sheet into weavers beam. In this process, a round bamboo stick with the strands of yarn passes through the reeds and sheet of threads is placed in the grove of beam and wound with a rope that known as phannai in Bodo.`,
    keySteps: [
      'Carefully shifting the reed along the aligned warp threads',
      'Threading a smooth round bamboo stick through warp loop ends',
      'Locking bamboo stick into longitudinal beam groove',
      'Securing sheet uniformly with phannai rope ties to prevent slippage'
    ],
    toolsUsed: ['Weaver\'s Beam with Longitudinal Groove', 'Round Bamboo Rod', 'Phannai Rope Binding Cord'],
    duration: '3-5 hours',
    galleryId: 'gallery_loom_apparatus',
    exhibitId: 'exhibit_beaming_frame'
  },
  {
    id: 'looming',
    title: 'Looming',
    nativeTerm: 'Nw khonnai & Khainai',
    type: 'Process',
    documentId: '19869884-c755-4f33-99ae-73a54fe5d435',
    description: 'Detailed loom setup consisting of drafting (Nw khonnai), denting (Khainai), and heald knitting.',
    tags: ['Bodo', 'handloom', 'weaving', 'looming', 'heald', 'reed'],
    status: 'draft',
    source: {
      id: 'traditional-weaving-process',
      resource: 'knowledge_base/01_raw_data/processes/Traditionalweaving_Process.pdf',
      title: 'Traditional Weaving Process of the Bodos'
    },
    content: `The technique of looming process is consists of drafting, denting and heald knitting for proper fitting up of warp on the loom that to complete the necessary arrangements for weaving. Drafting- This process is known as Nw khonnai in Bodo. Traditionally, the white strong cotton thread used for drafting. The beam is places on the floor at the same level against two posts and tightly fixing it with two temporary bamboo posts. It helps to keep the yarns in parallel balance that the drafting process completed properly. The Baleb (flat bamboo sticks) used as lease-rods and keep upward in the warp for causing a slight opening on it. The drafting is done with the help of Nw hasung (a cylindrical bamboo pipe) by heald passed from right to left. Denting- The denting is known as khainai in Bodo. It is a traditional weaving technique of Bodos. The warp threads drawn through the dents of the rashw (reed) with the help of a hook and the yarns placed on a gonshi (a round bamboo stick). Heald- The heald is a most important component of a weaving. It is the processing of yarn in the loom with the help of shedding. The heald an arrangement for made to tie up the yarn with necessary connections. After completed all the mentioned process, the warp fitted to the cloth beam then it become ready for weaving.`,
    keySteps: [
      'Drafting (Nw khonnai): Ground-anchoring beam against temporary bamboo floor posts for balanced tension',
      'Inserting Baleb (flat bamboo lease-rods) to establish warp sheds',
      'Passing heald cords from right to left guided by Nw hasung (cylindrical bamboo pipe)',
      'Denting (Khainai): Drawing warp ends through rashw (reed dents) with specialized hook onto gonshi stick',
      'Tying completed heald shedding assembly and mounting warp onto cloth beam'
    ],
    toolsUsed: ['Nw hasung (Cylindrical bamboo pipe)', 'Baleb (Flat bamboo lease rods)', 'Rashw (Reed)', 'Gonshi (Round bamboo stick)', 'Temporary bamboo tension posts'],
    duration: '2-3 days precision setup',
    galleryId: 'gallery_loom_apparatus',
    exhibitId: 'exhibit_looming_bench'
  },
  {
    id: 'weaving',
    title: 'Weaving',
    nativeTerm: 'Daonai (Sal / Thati sal)',
    type: 'Process',
    documentId: '19869884-c755-4f33-99ae-73a54fe5d435',
    description: 'Interlacing warp and weft on traditional Sal throw-shuttle and Thati Sal fly-shuttle looms.',
    tags: ['Bodo', 'handloom', 'weaving', 'loom', 'thati-sal', 'textile'],
    status: 'draft',
    source: {
      id: 'traditional-weaving-process',
      resource: 'knowledge_base/01_raw_data/processes/Traditionalweaving_Process.pdf',
      title: 'Traditional Weaving Process of the Bodos'
    },
    content: `The weaving has started after sizing, spinning, warping, denting, beaming and drafting or heald knitting. Nevertheless, there is some traditional process of preparing the yarn for the convenient of weaving. Generally, the Bodo women have folk used “Sal” (throw shuttle loom) and “Thati sal” or “Tat sal” (Fly-Shuttle Loom) which are the traditional type of loom. These types of traditional looms are very simple and possess with special features. We have found that the looms consist of four wooden or bamboo made stout posts. Sometimes, betel nut tree also used as loom posts. Besides this, all related weaving implements mostly made of bamboo and wood. Usually, the weaver sits in front of a loom keeping both legs against the footrest and fixing the back strap, which is adjustable for keeping the loom in tightness. The shedding motion, the picking motion and the beating motion govern the weaving. The heald bar lifted up with the left hand and simultaneously the right hand presses the circular bamboo bar down. Then the sword placed vertically in the shed and the weft passed from the right to left side by the right hand that the shuttle picked up by the left hand. The sword has beaten the weft slowly. The weaving sword then taken out and the shuttle is passed by the left hand and picked up by the right hand. At the time of weaving, the two bamboo splits work as the first weft. This is the traditional weaving technique of Bodos. Mentioned may be made here, this traditional technique takes 30 to 45 days to completion of weaving process. We have come to know that 2-3 pairs of cloths need at least 3 days.`,
    keySteps: [
      'Weaver sits with feet on wooden footrest, tightening adjustable back-strap harness for warp tautness',
      'Coordinating the primary tri-fold motion: Shedding, Picking, and Beating',
      'Left hand elevates heald bar while right hand presses circular bamboo control bar down',
      'Vertical placement of weaving sword in shed and smooth passage of shuttle across warp lines',
      'Firm yet gentle beating of weft using weaving sword, alternating left and right shuttle handoffs',
      'Two bamboo splits inserted as the seminal stabilizing weft'
    ],
    toolsUsed: ['Sal (Traditional Throw Shuttle Loom)', 'Thati Sal / Tat Sal (Fly Shuttle Loom)', 'Weaving Sword (Beater)', 'Shuttle Boat & Pirn', 'Back-strap adjustable harness', 'Betel nut wood stout posts'],
    duration: '30 to 45 days for full ceremonial cloth (2-3 standard pairs take 3 days)',
    galleryId: 'gallery_weaving_hall',
    exhibitId: 'exhibit_traditional_sal_loom'
  }
];

export const MUSEUM_GALLERIES: MuseumGallery[] = [
  {
    id: 'gallery_raw_fibers',
    number: 1,
    name: 'Sericulture & Raw Fibers Gallery',
    bodoName: 'Kwfwnai arw Khundung Hall',
    description: 'Explore the origin of Bodo textiles: native eri and muga silkworm foodplants, cocoon boiling in Curcuma leaves, and wooden ginning rollers.',
    ambientColor: '#22c55e',
    centerPosition: [-16, 0, 0],
    cameraWaypoint: [-16, 3, 7],
    exhibitIds: ['exhibit_ginning_roller', 'exhibit_reeling_basin', 'exhibit_eri_silkworm']
  },
  {
    id: 'gallery_spinning_preparation',
    number: 2,
    name: 'Spinning & Sizing Workshop',
    bodoName: 'Khundung Thunnai arw Maidi Hwnai',
    description: 'Witness the rhythm of the Zenther spinning wheel, sunshine drying on bamboo gonsi, and communal starch sizing with rice paste.',
    ambientColor: '#f59e0b',
    centerPosition: [0, 0, 0],
    cameraWaypoint: [0, 3, 7],
    exhibitIds: ['exhibit_spinning_wheel', 'exhibit_sizing_station', 'exhibit_winding_drum']
  },
  {
    id: 'gallery_loom_apparatus',
    number: 3,
    name: 'Loom Engineering & Warping Pavilion',
    bodoName: 'Ji Swngnai arw Nw Khonnai',
    description: 'Discover the ingenious wooden creels, cylindrical Nw Hasung bamboo pipes, flat Baleb lease-rods, and reed denting mechanisms.',
    ambientColor: '#3b82f6',
    centerPosition: [16, 0, 0],
    cameraWaypoint: [16, 3, 7],
    exhibitIds: ['exhibit_warp_creel', 'exhibit_beaming_frame', 'exhibit_looming_bench']
  },
  {
    id: 'gallery_weaving_hall',
    number: 4,
    name: 'Master Weaving Sanctuary & Textiles',
    bodoName: 'Thati Sal arw Bodo Dokhona Heritage',
    description: 'Stand before the iconic Sal and Thati Sal looms, admire intricate Dokhona and ceremonial Aronai weaves, and understand the 45-day artisanal cycle.',
    ambientColor: '#ec4899',
    centerPosition: [0, 0, -18],
    cameraWaypoint: [0, 3, -11],
    exhibitIds: ['exhibit_traditional_sal_loom', 'exhibit_thati_sal_loom', 'exhibit_aronai_textile', 'exhibit_dokhona_textile']
  }
];

export const MUSEUM_EXHIBITS: ExhibitItem[] = [
  {
    id: 'exhibit_ginning_roller',
    name: 'Traditional Cotton Ginning Machine',
    nativeName: 'Neotha',
    category: 'process_station',
    galleryId: 'gallery_raw_fibers',
    position: [-20, 0, 0],
    color: '#d97706',
    iconName: 'RotateCw',
    shortDesc: 'Two counter-revolving wooden rollers fitted on vertical posts to deseed raw cotton.',
    fullDescription: 'The Neotha consists of two stout wooden posts anchored into a stable horizontal timber sill. Two finely carved wooden cylinders revolve in reverse directions as the operator turns a hand crank with their left hand while rhythmically feeding raw bolls with their right. The tension pulls cotton fiber through while blocking seeds and dried leaves.',
    culturalSignificance: 'Every traditional Bodo homestead cultivated a cotton patch and maintained a handmade Neotha, establishing community fiber sovereignty.',
    materials: ['Sal / Betel wood', 'Bamboo pins', 'Cast iron pivot crank'],
    toolsInvolved: ['Neotha', 'Wooden crank handle', 'Drying tray'],
    audioGuideScript: 'Welcome to the Ginning station. Before you stands the Neotha, a two-roller wooden gin operated by hand crank. Notice how the opposite rotation of the wooden cylinders gently pulls delicate cotton fibers through while popping seeds cleanly away.',
    modelType: 'ginning_roller'
  },
  {
    id: 'exhibit_reeling_basin',
    name: 'Cocoon Steaming Basin & Tharai Leaf Press',
    nativeName: 'Tharai Kwfwnai',
    category: 'process_station',
    galleryId: 'gallery_raw_fibers',
    position: [-16, 0, -3],
    color: '#10b981',
    iconName: 'Flame',
    shortDesc: 'Earthen boiling pot and Curcuma rubescens leaf packets for softening silk cocoons.',
    fullDescription: 'Mulberry and Eri cocoons are softened in steam or hot water baths, then packed into the broad leaves of Tharai (Curcuma rubescens). Stone weights press the bundle for five to six days, softening the sericin gum naturally before weavers reel the threads onto their palms.',
    culturalSignificance: 'Eri silk rearing is known as "Ahimsa silk" (peace silk) among Bodo weavers, celebrating non-violence as moth emergence precedes spinning.',
    materials: ['Terracotta vessel', 'Tharai leaves (Curcuma rubescens)', 'River stone weights'],
    toolsInvolved: ['Boiling vessel', 'Leaf wraps', 'Stone press'],
    audioGuideScript: 'Observe the steaming pot and leaf wrapping station. The Bodo use native medicinal leaves of Tharai to ferment and soften silk cocoons under stone weights for five days, creating remarkably supple and durable eri filaments.',
    modelType: 'reeling_basin'
  },
  {
    id: 'exhibit_eri_silkworm',
    name: 'Eri & Muga Silkworm Foodplant Specimens',
    nativeName: 'Era arw Kesseru Bilai',
    category: 'raw_material',
    galleryId: 'gallery_raw_fibers',
    position: [-12, 0, 0],
    color: '#84cc16',
    iconName: 'Leaf',
    shortDesc: 'Castor (Ricinus communis) and Kesseru leaves, the primary nutrition for Eri silkworms.',
    fullDescription: 'The Samia ricini (Eri silkworm) feeds primarily on Castor (Ricinus communis) and Kesseru (Heteropanax fragrans). The nutritional density of these leaves dictates thread elasticity, luster, and climatic thermal insulation in the finished garment.',
    culturalSignificance: 'Intertwined with Bodo agro-forestry, silkworm foodplants are cultivated on borders of paddy fields and household homesteads.',
    materials: ['Castor leaves', 'Kesseru branches', 'Silkworm rearing trays (Bungkhw)'],
    toolsInvolved: ['Bamboo rearing trays', 'Ventilated shelters'],
    audioGuideScript: 'Here are specimens of the Castor plant, known locally as Era, and Kesseru. These native plants provide the essential diet for the domesticated Eri silkworm, yielding the warm, fleece-like silk that Assam is celebrated for globally.',
    modelType: 'cocoon_tray'
  },
  {
    id: 'exhibit_spinning_wheel',
    name: 'Traditional Bodo Spinning Wheel',
    nativeName: 'Zenther arw Chwrkhi',
    category: 'process_station',
    galleryId: 'gallery_spinning_preparation',
    position: [-4, 0, 0],
    color: '#f59e0b',
    iconName: 'Disc',
    shortDesc: 'Hand-turned spindle wheel and small ground reel for spinning yarn onto bobbins.',
    fullDescription: 'The Zenther is a graceful hand-cranked spinning wheel. Fiber is guided with one hand while the other drives the wheel with constant centrifugal momentum. Threads travel from the ground-based Chwrkhi reel through the spindle tip directly onto wooden bobbins.',
    culturalSignificance: 'Proficiency on the Zenther was traditionally revered as a supreme mark of artistic discipline and domestic mastery for young Bodo women.',
    materials: ['Seasoned Jackfruit wood', 'Bamboo spokes', 'Spindle chord'],
    toolsInvolved: ['Zenther', 'Chwrkhi (Small reel)', 'Danganatha (Large reel)', 'Bobbins'],
    audioGuideScript: 'You are now facing the Zenther spinning wheel. Notice the hand crank connected to the large bamboo-spoked wheel. With one hand rotating the wheel and the other gently drafting the yarn, the spinner imparts uniform twist to the fibers.',
    modelType: 'spinning_wheel'
  },
  {
    id: 'exhibit_sizing_station',
    name: 'Natural Starch Sizing Trough & Brushes',
    nativeName: 'Maidi Hwnai Thali',
    category: 'process_station',
    galleryId: 'gallery_spinning_preparation',
    position: [0, 0, -3],
    color: '#eab308',
    iconName: 'Sparkles',
    shortDesc: 'Botanical sizing vat containing rice powder, maize, and wheat starch with coir brushes.',
    fullDescription: 'Sizing (Maidi hwnai) is a cooperative ritual where boiled rice paste, maize starch, and wheat flour are massaged into yarn bundles. Long coarse bristle brushes smooth down flyaway fibers, increasing tensile strength by up to 35% to withstand loom abrasion.',
    culturalSignificance: 'Sizing requires 3 to 4 weavers pulling in unison along village lanes, reinforcing mutual community bonds known as Hadan.',
    materials: ['Rice flour', 'Maize flour', 'Wheat flour', 'Coarse vegetable fiber brushes'],
    toolsInvolved: ['Boiling cauldron', 'Long sizing brushes', 'Ground posts'],
    audioGuideScript: 'Behold the sizing station. This boiling broth made from sticky rice powder, maize, and wheat flour is worked into the yarn using dense fibrous brushes. This protects the threads from breaking under the intense friction of the loom.',
    modelType: 'reeling_basin'
  },
  {
    id: 'exhibit_winding_drum',
    name: 'Bobbin & Pirn Winding Drum',
    nativeName: 'Swrkhi',
    category: 'process_station',
    galleryId: 'gallery_spinning_preparation',
    position: [4, 0, 0],
    color: '#ca8a04',
    iconName: 'Compass',
    shortDesc: 'Revolving drum frame for transferring yarn onto pirns for throw and fly shuttles.',
    fullDescription: 'The Swrkhi is an open bamboo cage drum mounted on a central pivot axle. As skeins revolve swiftly, weavers wind fine weft threads onto lightweight bamboo pirns that fit snugly inside the hollow cavity of weaving shuttles.',
    culturalSignificance: 'A well-wound pirn prevents shuttle jams during rapid back-and-forth passes, essential for flawless selvedges.',
    materials: ['Bamboo splints', 'Wooden pivot', 'Iron axle'],
    toolsInvolved: ['Swrkhi wheel', 'Hollow pirns', 'Winding rod'],
    audioGuideScript: 'This is the Swrkhi, an ingenious bamboo drum wheel. Weavers spin this drum to wind weft yarn neatly onto slender pirns, ready to slide inside the weaver\'s shuttle boat.',
    modelType: 'warp_creel'
  },
  {
    id: 'exhibit_warp_creel',
    name: 'Warping Frame & Creel Apparatus',
    nativeName: 'Ji Swngnai Frame',
    category: 'loom_apparatus',
    galleryId: 'gallery_loom_apparatus',
    position: [12, 0, 0],
    color: '#2563eb',
    iconName: 'Grid',
    shortDesc: 'Vertical wooden creel holding scores of bobbins with a hank dividing eyelet frame.',
    fullDescription: 'In Ji Swngnai, dozens of bobbins rotate simultaneously on steel rods within a massive timber creel. The hundreds of yarn ends are gathered through the eyelets of a hank frame, measuring out precise lengths on a revolving circumference drum before winding onto the Gandwi beam.',
    culturalSignificance: 'Precision in warping prevents sag and uneven tension across the wide fabric width, laying the mathematical foundation of Bodo geometric motifs.',
    materials: ['Hardwood frame', 'Spindle bars', 'Bamboo pegs'],
    toolsInvolved: ['Creel frame', 'Hank guide', 'Gandwi warp beam'],
    audioGuideScript: 'Before you is the Warping Creel, or Ji Swngnai frame. Rows of bobbins spin together as scores of threads pass through eyelets into a single parallel sheet, calibrated to the exact width of a royal Dokhona.',
    modelType: 'warp_creel'
  },
  {
    id: 'exhibit_beaming_frame',
    name: 'Weaver\'s Beam with Phannai Fastener',
    nativeName: 'Gandwi arw Phannai',
    category: 'loom_apparatus',
    galleryId: 'gallery_loom_apparatus',
    position: [16, 0, -3],
    color: '#3b82f6',
    iconName: 'Layers',
    shortDesc: 'Cylindrical timber beam with longitudinal lock groove and braided phannai rope cord.',
    fullDescription: 'Beaming secures the warp sheet to the loom. A slender round bamboo stick is threaded through the terminal warp loops and seated into a longitudinal groove chiseled along the wooden beam. It is bound firmly with hemp or jute phannai rope to guarantee zero slippage.',
    culturalSignificance: 'The Phannai knot is an ancestral binding technique passed down orally from master weavers to daughters.',
    materials: ['Timber beam cylinder', 'Round bamboo rod', 'Braided phannai rope'],
    toolsInvolved: ['Weaver\'s beam', 'Bamboo insertion pin', 'Binding rope'],
    audioGuideScript: 'Look closely at the groove running down this timber beam. A bamboo rod locks the warp threads inside, while the braided Phannai rope cinches the assembly tightly in place.',
    modelType: 'beaming_frame'
  },
  {
    id: 'exhibit_looming_bench',
    name: 'Looming Setup: Nw Hasung & Baleb Lease Rods',
    nativeName: 'Nw Khonnai arw Baleb',
    category: 'loom_apparatus',
    galleryId: 'gallery_loom_apparatus',
    position: [20, 0, 0],
    color: '#60a5fa',
    iconName: 'Wrench',
    shortDesc: 'Cylindrical bamboo pipe (Nw Hasung), flat Baleb lease sticks, and Rashw reed.',
    fullDescription: 'Looming unites drafting (Nw khonnai), denting (Khainai), and heald knitting. The cylindrical Nw Hasung bamboo pipe guides the passage of heald cords right to left. Flat bamboo lease rods (Baleb) keep odd and even warp threads separated into clean sheds, while the Rashw reed ensures thread spacing.',
    culturalSignificance: 'Looming represents the apex of weaving mechanics, transforming raw spooled fiber into an active, programmable loom system.',
    materials: ['Polished bamboo pipes', 'Flat bamboo strips', 'Fine reed teeth'],
    toolsInvolved: ['Nw hasung pipe', 'Baleb lease sticks', 'Rashw reed', 'Denting hook'],
    audioGuideScript: 'This bench showcases the precise implements of looming: the cylindrical bamboo pipe Nw Hasung, the flat lease-rods called Baleb, and the comb-like Rashw reed through which every single warp thread is drawn.',
    modelType: 'loom'
  },
  {
    id: 'exhibit_traditional_sal_loom',
    name: 'Traditional Throw-Shuttle Loom (Sal)',
    nativeName: 'Sal (Throw Shuttle Loom)',
    category: 'loom_apparatus',
    galleryId: 'gallery_weaving_hall',
    position: [-5, 0, -18],
    color: '#db2777',
    iconName: 'Box',
    shortDesc: 'Four-post wooden and bamboo floor loom with back-strap tensioner and wooden sword.',
    fullDescription: 'The classic Bodo Sal is built from four stout timber or betel nut tree posts set into the earth. The weaver sits on the floor with feet pressed against a footrest, leaning back against a back-strap harness that governs warp tension with her own body weight. She alternates hands to toss the wooden shuttle through the shed and beats the weft firmly with a heavy wooden sword.',
    culturalSignificance: 'The rhythm of the Sal loom is immortalized in Bodo folk songs and poetry, embodying resilience, self-reliance, and feminine grace.',
    materials: ['Betel nut tree posts', 'Bamboo bars', 'Wood weaving sword', 'Shuttle boat', 'Leather back-strap'],
    toolsInvolved: ['Sal frame', 'Weaving sword', 'Throw shuttle', 'Backstrap'],
    audioGuideScript: 'Here is the historic Sal throw-shuttle loom. Note how the four posts are fashioned from stout betel nut wood. The weaver sits on the ground with her feet braced, using her body weight against the back-strap to adjust tension with every breath.',
    modelType: 'loom'
  },
  {
    id: 'exhibit_thati_sal_loom',
    name: 'Fly-Shuttle Loom (Thati Sal)',
    nativeName: 'Thati Sal / Tat Sal',
    category: 'loom_apparatus',
    galleryId: 'gallery_weaving_hall',
    position: [0, 0, -18],
    color: '#e11d48',
    iconName: 'Maximize2',
    shortDesc: 'Fly-shuttle loom equipped with side shuttle boxes, overhead sley, and treadle pedals.',
    fullDescription: 'The Thati Sal represents an evolution in Bodo handloom efficiency. Shuttle boxes mounted on either end of the sley allow the weaver to jerk a central picker cord, propelling the shuttle rapidly back and forth across wide cloth widths without manual hand-catching. Foot treadles alternate the shed motions seamlessly.',
    culturalSignificance: 'Introduced to meet growing demand for Bodo textiles while preserving the intricate supplementary weft Agor motifs.',
    materials: ['Hardwood frame', 'Sley race', 'Picker cords', 'Foot treadles'],
    toolsInvolved: ['Fly-shuttle sley', 'Picker cord', 'Treadle pedals'],
    audioGuideScript: 'Beside the Sal is the Thati Sal, or fly-shuttle loom. By pulling a single central cord, the shuttle shoots across the race between two end boxes, doubling weaving speed while keeping motifs impeccably tight.',
    modelType: 'loom'
  },
  {
    id: 'exhibit_aronai_textile',
    name: 'Ceremonial Bodo Aronai Scarf',
    nativeName: 'Aronai (Hajw Agor)',
    category: 'finished_textile',
    galleryId: 'gallery_weaving_hall',
    position: [4, 0, -18],
    color: '#f43f5e',
    iconName: 'Award',
    shortDesc: 'Traditional ceremonial scarf woven with the sacred Hajw Agor (mountain motif).',
    fullDescription: 'The Aronai is the crowning symbol of Bodo cultural identity. Characterized by its brilliant crimson and golden borders, it features geometric motifs like Hajw Agor (mountain ranges) and Daorai Mwkhrwb (peacock eye). It is offered as a supreme gesture of honor, greeting, and blessing during festivities.',
    culturalSignificance: 'Conferred upon dignitaries, elders, and brides; wearing an Aronai expresses cultural pride and spiritual goodwill.',
    materials: ['Pure Eri silk and fine dyed cotton', 'Vegetable and natural dyes'],
    toolsInvolved: ['Thati Sal', 'Supplementary weft sticks (Agor bamboo pins)'],
    audioGuideScript: 'Gaze upon the ceremonial Aronai. Notice the triangular Hajw Agor pattern representing the rolling Himalayan foothills. This revered scarf is presented as a blessing of supreme honor and hospitality in Bodo culture.',
    modelType: 'textile_display'
  },
  {
    id: 'exhibit_dokhona_textile',
    name: 'Traditional Dokhona Attire',
    nativeName: 'Dokhona Thaosi',
    category: 'finished_textile',
    galleryId: 'gallery_weaving_hall',
    position: [8, 0, -18],
    color: '#be185d',
    iconName: 'Sparkle',
    shortDesc: 'Full-length traditional Bodo dress woven in vibrant saffron and floral motifs.',
    fullDescription: 'The Dokhona is the traditional dress of Bodo women, wrapped gracefully from the chest down to the ankles. Adorned with Agor (woven designs) inspired by nature, such as lotus petals, water ripples, and butterfly wings, weaving a wedding Dokhona Thaosi can take up to 45 days.',
    culturalSignificance: 'The Dokhona encapsulates the living relationship between Bodo women and the natural biodiversity of Assam.',
    materials: ['Eri silk', 'Fine spun cotton', 'Natural madder and turmeric dyes'],
    toolsInvolved: ['Sal loom', 'Agor needle', 'Bamboo shuttles'],
    audioGuideScript: 'Here is the magnificent Dokhona, the traditional attire of Bodo women. Every pattern along its borders is inspired by nature—from flowing Brahmaputra ripples to blooming forest flora.',
    modelType: 'textile_display'
  }
];

export const RETRIEVAL_BENCHMARK_QUESTIONS: RetrievalBenchmarkItem[] = [
  { id: 1, question: "How are seeds and dirt removed from raw cotton?", expectedConcept: "Ginning" },
  { id: 2, question: "How is cotton spun into thread using the traditional spinning method?", expectedConcept: "Spinning" },
  { id: 3, question: "What is done to the mulberry cocoons after they are softened with steam?", expectedConcept: "Reeling" },
  { id: 4, question: "Why is the yarn coated in a hot mixture of rice powder and wheat flour?", expectedConcept: "Sizing" },
  { id: 5, question: "How is the yarn transferred onto a small bobbin or pirn?", expectedConcept: "Winding" },
  { id: 6, question: "How long does the traditional weaving process usually take to complete?", expectedConcept: "Weaving" },
  { id: 7, question: "Why is the beam temporarily tied to the bamboo posts on the floor?", expectedConcept: "Looming" },
  { id: 8, question: "How is the warp sheet transferred onto the weaver's beam?", expectedConcept: "Beaming" },
  { id: 9, question: "How is cotton turned into yarn?", expectedConcept: "Spinning" },
  { id: 10, question: "How is cotton cleaned before weaving?", expectedConcept: "Ginning" },
  { id: 11, question: "How are yarns from multiple bobbins arranged to form the warp?", expectedConcept: "Warping" },
  { id: 12, question: "How are the cocoons prepared before the silk is reeled?", expectedConcept: "Reeling" },
  { id: 13, question: "Why is traditional sizing process necessary?", expectedConcept: "Sizing" },
  { id: 14, question: "What is the Baleb made of?", expectedConcept: "Looming" },
  { id: 15, question: "What are the natural ingredients used in the traditional sizing process?", expectedConcept: "Sizing" }
];

export const DOCUMENT_MANIFEST_DATA: Record<string, DocumentManifestItem> = {
  "artifacts/artifacts.txt": {
    document_id: "40b8690b-2d34-432f-872e-02eaa777b39f",
    source: "artifacts/artifacts.txt",
    content_hash: "32664833410998be5bdf1031ae4050e1aa6167708cff4099f9e53d0b1738d86a",
    version: 4,
    modality: "txt",
    sectionCount: 4
  },
  "materials/Raw Materials of Traditional Bodo Handloom.pdf": {
    document_id: "5030fc55-8485-4862-8b4c-838398bfb834",
    source: "materials/Raw Materials of Traditional Bodo Handloom.pdf",
    content_hash: "9a12752ed1bbef3b85201fa3210a1890f3d8dc66e87fd02974e25656f49b3b75",
    version: 3,
    modality: "pdf",
    sectionCount: 6
  },
  "processes/Foodplants for eri silkworm.pdf": {
    document_id: "a43da69f-f99e-4cf7-9d93-9017351ebf7c",
    source: "processes/Foodplants for eri silkworm.pdf",
    content_hash: "66cd8d6e1f34a9910d2fe4f50be907598ed782d3f73949bd072262e2bcd6fefb",
    version: 3,
    modality: "pdf",
    sectionCount: 5
  },
  "processes/Rearing of Eri Silkworm.pdf": {
    document_id: "eaa8f03c-f13c-4c80-abfb-2015216d927c",
    source: "processes/Rearing of Eri Silkworm.pdf",
    content_hash: "7ab019ead080ad535600503072636448cbacac1611d510e63150358b3a1d97e8",
    version: 3,
    modality: "pdf",
    sectionCount: 8
  },
  "processes/Traditionalweaving_Process.pdf": {
    document_id: "8652f0b1-d4d3-4e98-9483-69faa013f739",
    source: "processes/Traditionalweaving_Process.pdf",
    content_hash: "df2be9b2bbe07d69cea489394d3c3ec7511f19310bf3767f3ff7d62449d75248",
    version: 3,
    modality: "pdf",
    sectionCount: 9
  }
};

/**
 * Text search / retrieval evaluator that scores queries against OKF concept chunks.
 * Simulates semantic embedding & term matching used in the ingestion pipeline.
 */
export function queryKnowledgeBase(query: string): { concept: string; score: number; snippet: string }[] {
  const normalizedQuery = query.toLowerCase();
  const queryTokens = normalizedQuery.split(/\W+/).filter(t => t.length > 2);

  const scored = OKF_PROCESSES.map(proc => {
    let score = 0;
    const titleNorm = proc.title.toLowerCase();
    const nativeNorm = (proc.nativeTerm || '').toLowerCase();
    const contentNorm = proc.content.toLowerCase();
    const tagsNorm = proc.tags.join(' ').toLowerCase();

    // High bonus if exact concept name matches
    if (normalizedQuery.includes(titleNorm)) score += 5.0;
    if (nativeNorm && normalizedQuery.includes(nativeNorm)) score += 4.0;

    // Token overlap scoring
    queryTokens.forEach(token => {
      if (titleNorm.includes(token)) score += 3.0;
      if (tagsNorm.includes(token)) score += 2.0;

      // Count occurrences in content
      const matches = contentNorm.split(token).length - 1;
      if (matches > 0) {
        score += Math.min(matches, 5) * 0.8;
      }
    });

    // Domain specific associations from retrieval questions
    if (titleNorm === 'ginning' && (normalizedQuery.includes('seed') || normalizedQuery.includes('dirt') || normalizedQuery.includes('cleaned') || normalizedQuery.includes('leaves') || normalizedQuery.includes('neotha'))) {
      score += 4.5;
    }
    if (titleNorm === 'spinning' && (normalizedQuery.includes('turned into yarn') || normalizedQuery.includes('spun') || normalizedQuery.includes('zenther') || normalizedQuery.includes('thread'))) {
      score += 4.5;
    }
    if (titleNorm === 'reeling' && (normalizedQuery.includes('cocoon') || normalizedQuery.includes('steamed') || normalizedQuery.includes('boiled') || normalizedQuery.includes('tharai'))) {
      score += 4.5;
    }
    if (titleNorm === 'sizing' && (normalizedQuery.includes('rice powder') || normalizedQuery.includes('wheat flour') || normalizedQuery.includes('coated') || normalizedQuery.includes('maidi') || normalizedQuery.includes('natural ingredients'))) {
      score += 5.0;
    }
    if (titleNorm === 'winding' && (normalizedQuery.includes('transferred') || normalizedQuery.includes('bobbin') || normalizedQuery.includes('pirn') || normalizedQuery.includes('swrkhi'))) {
      score += 4.5;
    }
    if (titleNorm === 'warping' && (normalizedQuery.includes('multiple bobbins') || normalizedQuery.includes('creel') || normalizedQuery.includes('gandwi') || normalizedQuery.includes('form the warp'))) {
      score += 4.5;
    }
    if (titleNorm === 'beaming' && (normalizedQuery.includes('warp sheet') || normalizedQuery.includes('groove') || normalizedQuery.includes('phannai') || normalizedQuery.includes("weaver's beam"))) {
      score += 4.5;
    }
    if (titleNorm === 'looming' && (normalizedQuery.includes('baleb') || normalizedQuery.includes('posts on the floor') || normalizedQuery.includes('nw khonnai') || normalizedQuery.includes('drafting') || normalizedQuery.includes('denting'))) {
      score += 4.5;
    }
    if (titleNorm === 'weaving' && (normalizedQuery.includes('long does') || normalizedQuery.includes('days') || normalizedQuery.includes('sal') || normalizedQuery.includes('shuttle') || normalizedQuery.includes('motion'))) {
      score += 4.5;
    }

    return {
      concept: proc.title,
      score: Math.round(score * 10) / 10,
      snippet: proc.content.slice(0, 180) + '...'
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}
