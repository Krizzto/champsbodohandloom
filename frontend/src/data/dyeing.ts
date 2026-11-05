import { DyeingStep } from '../types';

export const INITIAL_DYEING_STEPS: DyeingStep[] = [
  {
    id: 'stage-1-preparation',
    stage: 'Stage 1 of 5',
    title: 'Preparation of Yarn for Dyeing',
    bodoTitle: 'खुन साजायनाय (Mordanting with Alum)',
    description:
      'Alum (Fitkaari) is dissolved in a pot of boiling water, and the natural yarn is thoroughly immersed in the solution. This is the essential mordanting preparation stage before dyeing. Alum acts as a mordant and helps the yarn fibres bond more effectively with the natural dye. At this preparatory stage, no colour is applied to the yarn.',
    ingredients: ['Natural un-dyed yarn', 'Alum (Fitkaari)', 'Boiling water'],
    toolsUsed: ['Boiling vessel / pot', 'Stirring rod', 'Heat source'],
    botanicalSource: 'Alum (Fitkaari) mineral mordant solution',
    colorOutcome: 'Mordanted natural yarn fibres primed to bond with dye',
    colorHex: '#E5DFD5',
    traditionalWisdom:
      'Alum acts as a mordant and helps the yarn fibres bond more effectively with the natural dye. Priming the yarn in boiling alum water ensures lasting wash-fastness.',
    image: '/assets/images/cultural/cultural-practices/preparation.jpg',
    order: 1,
    materials: ['Natural yarn', 'Alum (Fitkaari)', 'Water'],
    processFlow: [
      'Alum (Fitkaari) is dissolved in a pot of boiling water',
      'The yarn is immersed in the alum solution',
      'This is the mordanting stage before dyeing',
      'Alum helps yarn fibres bond effectively with natural dye',
    ],
  },
  {
    id: 'stage-2-extraction',
    stage: 'Stage 2 of 5',
    title: 'Extraction of Dyes',
    bodoTitle: 'गाब दिहुन्नाय (Boiling Natural Materials)',
    description:
      'Natural colouring materials are gathered from surrounding forests and groves—including barks, leaves, roots, and other natural botanical sources. The materials are placed in water and boiled vigorously. Prolonged boiling releases the natural pigments from the plant tissues, yielding a concentrated dye bath or "potion". No yarn is dyed during this extraction stage.',
    ingredients: ['Tree barks', 'Leaves', 'Roots', 'Other natural plant sources', 'Water'],
    toolsUsed: ['Boiling vessel / cauldron', 'Firewood hearth', 'Botanical gathering basket'],
    botanicalSource: 'Natural materials: barks, leaves, roots, and botanicals',
    colorOutcome: 'Concentrated dye bath ("potion") rich with extracted pigments',
    colorHex: '#C05A2C',
    traditionalWisdom:
      'Boiling natural materials in water releases their concentrated botanical pigments into a rich dye potion before any yarn is introduced.',
    image: '/assets/images/cultural/cultural-practices/dye-basket.jpg',
    order: 2,
    materials: ['Barks', 'Leaves', 'Roots', 'Natural colouring sources'],
    processFlow: [
      'Natural colouring materials are gathered (barks, leaves, roots)',
      'The materials are boiled in water over heat',
      'Boiling releases the natural pigments from the materials',
      'The result is a concentrated dye bath / "potion"',
    ],
  },
  {
    id: 'stage-3-straining',
    stage: 'Stage 3 of 5',
    title: 'Straining the Dyed Potion',
    bodoTitle: 'गाब सानस्रिनाय (Filtering & Treating Dye Liquid)',
    description:
      'The extracted dye liquid is separated and prepared before the yarn is introduced. The dye liquid is strained to remove solid plant debris and bark fragments, then treated to reach its required colour strength. Additional natural materials or repeated boiling may be used to deepen and stabilize the colour of the liquid. The dye bath is thoroughly prepared and made rich before the yarn enters it.',
    ingredients: ['Extracted dye liquid', 'Additional natural materials (to adjust strength)', 'Water'],
    toolsUsed: ['Straining cloth / Fine sieve', 'Treatment pot', 'Settling container'],
    botanicalSource: 'Treated and filtered concentrated dye liquid',
    colorOutcome: 'Clear, debris-free, stabilized dye bath of required colour strength',
    colorHex: '#8B2635',
    traditionalWisdom:
      'Treating and straining the dye liquid ensures the dye bath reaches its optimal strength and produces an even, clean color on the thread without sediment blotches.',
    image: '/assets/images/cultural/cultural-practices/preparation.jpg',
    order: 3,
    materials: ['Extracted dye potion', 'Straining sieve / cloth'],
    processFlow: [
      'Extracted dye liquid is prepared before yarn is introduced',
      'Solid plant residues are strained out',
      'Dye liquid is treated to reach required colour strength',
      'Additional natural materials or repeated boiling deepen and stabilize the bath',
    ],
  },
  {
    id: 'stage-4-application',
    stage: 'Stage 4 of 5',
    title: 'Application of Dyes to the Yarn',
    bodoTitle: 'खुन गाब होनाय (Immersion, Simmering & Turning)',
    description:
      'This is where the prepared dye bath is actually applied to the yarn. The mordanted yarn enters the dye bath and is kept simmering and soaking while being continuously turned and pressed with wooden rods. These physical actions ensure uniform colour absorption into every fibre. Longer or repeated applications produce richer, deeper shades.',
    ingredients: ['Mordanted natural yarn', 'Prepared rich dye bath'],
    toolsUsed: ['Simmering dye vessel', 'Turning rods / Bamboo tongs', 'Low-heat hearth'],
    botanicalSource: 'Natural dye penetration into mordanted yarn fibres',
    colorOutcome: 'Uniformly coloured yarn in desired shade (Red, Yellow, Reddish yellow, Green, Black, Blue)',
    colorHex: '#A64B2A',
    traditionalWisdom:
      'Repeated turning and pressing during simmering guarantees even colour absorption. Longer or repeated applications create deeper, richer shades.',
    image: '/assets/images/weaving/weaving-process.jpg',
    order: 4,
    materials: ['Mordanted yarn', 'Prepared dye bath'],
    processFlow: [
      'Prepared dye bath receives the mordanted yarn',
      'Continued simmering and soaking over heat',
      'Repeated turning and pressing for uniform colour absorption',
      'Longer or repeated application produces a richer, deeper shade',
    ],
  },
  {
    id: 'stage-5-drying',
    stage: 'Stage 5 of 5',
    title: 'Drying the Dyed Yarn',
    bodoTitle: 'खुन रानहोनाय (Shade Drying for Weaving)',
    description:
      'Once the yarn reaches the desired colour, it is removed from the dye bath and hung to dry. Drying is generally done in a shaded or well-ventilated area to prevent uneven fading caused by direct sunlight. Once completely dry, the vibrant, colourfast yarn is ready for use on traditional Bodo handlooms.',
    ingredients: ['Dyed wet yarn hanks', 'Ambient shaded air'],
    toolsUsed: ['Horizontal drying poles / Bamboo racks', 'Shaded veranda / Drying shed'],
    botanicalSource: 'Gentle shade evaporation and natural curing',
    colorOutcome: 'Dry, colourfast, radiant yarn ready for weaving on the handloom',
    colorHex: '#D4A373',
    traditionalWisdom:
      'Drying in a shaded, well-ventilated space prevents direct sunlight from causing uneven fading, locking in durable, radiant colours for weaving.',
    image: '/assets/images/weaving/yarn.jpg',
    order: 5,
    materials: ['Dyed yarn hanks', 'Bamboo drying racks'],
    processFlow: [
      'Dyed yarn is removed from the dye bath once desired colour is reached',
      'Hung to dry on bamboo poles',
      'Drying in a shaded or well-ventilated area prevents uneven sun fading',
      'The dried yarn is ready for use in weaving',
    ],
  },
];
