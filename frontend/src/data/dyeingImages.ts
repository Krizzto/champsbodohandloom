import { DyeingImageRecord } from '../types';

/**
 * Initial authoritative Bodo handloom dyeing image registry:
 * - Maps to public/assets/images/dyeing/ folder
 * - Supports instant preview when physical files are placed or uploaded in Content Editor
 * - Provides rich cultural context, captions, traditional colours, and tags
 */
export const INITIAL_DYEING_IMAGES: DyeingImageRecord[] = [
  {
    id: 'dye-img-01-undyed',
    filename: 'undyed-raw-yarn.jpg',
    url: '/assets/images/dyeing/undyed-raw-yarn.jpg',
    title: 'Undyed Yarn & Raw Natural Threads',
    caption: 'Natural unbleached short-staple cotton and golden Ahimsa Eri silk threads prepared for mordanting',
    culturalDescription:
      'Pure handspun silk and local cotton hanks wound onto bamboo spools. Before colour application, the raw fibers retain their natural warm ecru tone and natural plant sericin.',
    category: 'Dyeing',
    order: 1,
    published: true,
    aspectRatio: 'square',
    tags: ['Undyed', 'Raw Yarn', 'Eri Silk', 'Cotton', 'Preparation'],
  },
  {
    id: 'dye-img-02-turmeric',
    filename: 'turmeric-yellow-yarn.jpg',
    url: '/assets/images/dyeing/turmeric-yellow-yarn.jpg',
    title: 'Yellow Turmeric-Dyed Silk Skein',
    caption: 'Luminous golden-yellow yarn dyed with wild forest turmeric (Haldi)',
    culturalDescription:
      'Turmeric produces the iconic Bodo yellow that forms the luminous foundation of festive Dokhona Thaosi dresses and sacred celebratory garments.',
    category: 'Dyeing',
    order: 2,
    published: true,
    aspectRatio: 'square',
    tags: ['Turmeric', 'Yellow', 'Sacred', 'Dokhona', 'Golden'],
  },
  {
    id: 'dye-img-03-madder-red',
    filename: 'madder-reddish-yarn.jpg',
    url: '/assets/images/dyeing/madder-reddish-yarn.jpg',
    title: 'Natural Red & Terracotta Dyed Threads',
    caption: 'Warm earthy red and reddish-yellow yarn extracted from wild forest madder roots and tree bark',
    culturalDescription:
      'Natural red is traditionally extracted by boiling crushed madder roots and tree bark with alum. Red symbolizes courage, vitality, and maternal fertility in Bodo textile lore.',
    category: 'Dyeing',
    order: 3,
    published: true,
    aspectRatio: 'square',
    tags: ['Red', 'Madder', 'Terracotta', 'Roots', 'Bark'],
  },
  {
    id: 'dye-img-04-indigo',
    filename: 'indigo-blue-yarn.jpg',
    url: '/assets/images/dyeing/indigo-blue-yarn.jpg',
    title: 'Indigo & Blue-Dyed Cotton Yarn',
    caption: 'Fermented natural wild indigo vat dye yielding deep sky and river blues',
    culturalDescription:
      'Wild indigo leaves are fermented in large earthenware pots with alkaline wood-ash water. Repeated dips and air-oxidation oxidize the soluble dye into permanent deep blue.',
    category: 'Dyeing',
    order: 4,
    published: true,
    aspectRatio: 'square',
    tags: ['Indigo', 'Blue', 'Fermentation', 'Vat', 'Natural Indigo'],
  },
  {
    id: 'dye-img-05-green-black',
    filename: 'green-black-dyed-threads.jpg',
    url: '/assets/images/dyeing/green-black-dyed-threads.jpg',
    title: 'Forest Green & Iron-Black Dyed Threads',
    caption: 'Botanical olive green and tannin-rich mud-dyed iron black yarn skeins',
    culturalDescription:
      'Green is achieved by overdyeing yellow turmeric skeins in an indigo vat. Deep iron-black is obtained by steeping tannin-rich bark decoctions with iron-rich alluvial river marsh mud.',
    category: 'Dyeing',
    order: 5,
    published: true,
    aspectRatio: 'square',
    tags: ['Green', 'Black', 'Tannin', 'Mud Dye', 'Overdyeing'],
  },
  {
    id: 'dye-img-06-botanicals',
    filename: 'dye-sources-barks-leaves-roots.jpg',
    url: '/assets/images/dyeing/dye-sources-barks-leaves-roots.jpg',
    title: 'Natural Dye Sources: Bark, Leaves & Roots',
    caption: 'Forest-gathered botanical colour sources: dried tree barks, medicinal leaves, and rhizome roots',
    culturalDescription:
      'Elder Bodo women forage perennial forest plants sustainably. The harvested barks, leaves, and roots are chopped, pounded in wooden mortars (Khun-gai), and boiled to release concentrated pigments.',
    category: 'Dyeing',
    order: 6,
    published: true,
    aspectRatio: 'square',
    tags: ['Botanicals', 'Barks', 'Leaves', 'Roots', 'Forest Foraging'],
  },
  {
    id: 'dye-img-07-alum-mordant',
    filename: 'alum-fitkaari-mordant.jpg',
    url: '/assets/images/dyeing/alum-fitkaari-mordant.jpg',
    title: 'Alum (Fitkaari) & Mineral Mordants',
    caption: 'Purified mineral alum crystals dissolved into boiling water for fiber mordanting',
    culturalDescription:
      'Alum acts as a non-toxic natural mordant, creating chemical affinity between silk/cotton fibers and botanical dyes for exceptional light- and wash-fastness.',
    category: 'Dyeing',
    order: 7,
    published: true,
    aspectRatio: 'square',
    tags: ['Alum', 'Fitkaari', 'Mordant', 'Fixative', 'Crystals'],
  },
  {
    id: 'dye-img-08-vessel-pot',
    filename: 'traditional-dyeing-vessel.jpg',
    url: '/assets/images/dyeing/traditional-dyeing-vessel.jpg',
    title: 'Traditional Dyeing Cauldrons & Hearths',
    caption: 'Earthen and cast vessels on wood-fired hearths with bamboo stirring tongs',
    culturalDescription:
      'Even temperature maintenance over a gentle wood hearth allows pigments to penetrate into yarn core rather than remaining as superficial surface stains.',
    category: 'Dyeing',
    order: 8,
    published: true,
    aspectRatio: 'square',
    tags: ['Vessel', 'Cauldron', 'Hearth', 'Equipment', 'Processes'],
  },
  {
    id: 'dye-img-09-drying-racks',
    filename: 'drying-yarn-bamboo-racks.jpg',
    url: '/assets/images/dyeing/drying-yarn-bamboo-racks.jpg',
    title: 'Drying Yarn on Shaded Bamboo Veranda Racks',
    caption: 'Dyed skeins gently suspended on bamboo poles in well-ventilated, shaded courtyard verandas',
    culturalDescription:
      'Direct sunlight bleaches delicate organic pigments. Bodo weavers cure their freshly rinsed dyed hanks under breezy shaded verandas until fully dry and supple.',
    category: 'Dyeing',
    order: 9,
    published: true,
    aspectRatio: 'square',
    tags: ['Drying', 'Bamboo Racks', 'Shaded Veranda', 'Finished Skeins'],
  },
];
