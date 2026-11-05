export interface CollageImageItem {
  id: string;
  title: string;
  url?: string;
  customBlob?: string;
  type: 'weaver-loom' | 'elder-spinning' | 'outdoor-group' | 'bobbins-basket' | 'warp-court' | 'wooden-bobbin';
}

export interface DyeingGalleryItem {
  id: string;
  title: string;
  url?: string;
  customBlob?: string;
  type: 'dye-basket' | 'mustard-yarn' | 'yellow-yarn' | 'wooden-bobbin' | 'terracotta-yarn';
}

export interface SiteContent {
  hero: {
    titlePrefix: string;
    titleMain: string;
    highlightWord: string;
    tagline: string;
    buttonText: string;
    arButtonText: string;
    vrButtonText: string;
    models3DButtonText: string;
    aiButtonText: string;
    imageUrl?: string;
    customImageKey?: string;
  };
  about: {
    kicker: string;
    heading: string;
    highlightWord: string;
    description: string;
    fieldPhotoCaption: string;
    mainImageUrl?: string;
    collageImages: CollageImageItem[];
  };
  agorSection: {
    heading: string;
    highlightWord: string;
    subtitle: string;
    description: string;
    symbolismQuote: string;
    centralTextileInscription: string;
    centralTextileFooter: string;
  };
  dyeingSection: {
    heading: string;
    highlightWord: string;
    subtitle: string;
    description: string;
    galleryImages: DyeingGalleryItem[];
    sourceDocumentName?: string;
    sourceDocumentId?: string;
    uploadDate?: string;
    lastUpdated?: string;
    contentEditor?: string;
    referenceInfo?: string;
    version?: number;
  };
  weaverSection: {
    heading: string;
    highlightWord: string;
    subtitle: string;
  };
  processSection: {
    heading: string;
    highlightWord: string;
    subtitle: string;
  };
  museumSection: {
    heading: string;
    highlightWord: string;
    subtitle: string;
  };
  vrSection: {
    heading: string;
    highlightWord: string;
    subtitle: string;
    buttonText: string;
  };
}

export const INITIAL_SITE_CONTENT: SiteContent = {
  hero: {
    titlePrefix: 'Welcome to',
    titleMain: 'Bodo handloom',
    highlightWord: 'heritage',
    tagline: 'Living digital archive of indigenous textiles, sacred Agor geometry, and living master craftswomen of Northeast India.',
    buttonText: 'EXPLORE',
    arButtonText: 'VIEW IN AR',
    vrButtonText: 'ENTER VR MUSEUM',
    models3DButtonText: '3D ARTIFACTS',
    aiButtonText: 'chat with assistant',
    imageUrl: '/assets/images/hero/hero-main.JPG',
    customImageKey: 'hero-loom',
  },
  about: {
    kicker: 'About the Project',
    heading: 'Bodo Handloom',
    highlightWord: 'Handloom',
    description:
      'Bodo handloom is an important part of the cultural heritage of the Bodo community of Northeast India, particularly in Assam. It is more than a method of producing textiles; it represents traditional knowledge, craftsmanship, cultural identity, and the transmission of skills from one generation to another.',
    fieldPhotoCaption: 'Field documentation: Ethnographic recording of living weaving traditions in Bodoland, Assam.',
    mainImageUrl: '/assets/images/people/weavers/interview-elder.jpg',
    collageImages: [
      { id: 'c-1', title: 'Weaver at Handloom', type: 'weaver-loom', url: '/assets/images/weaving/weaving-main.jpg' },
      { id: 'c-2', title: 'Elder Sorting Silk', type: 'elder-spinning', url: '/assets/images/process/spinning.jpg' },
      { id: 'c-3', title: 'Community Warping', type: 'outdoor-group', url: '/assets/images/process/warping.jpg' },
      { id: 'c-4', title: 'Spools & Bobbins Basket', type: 'bobbins-basket', url: '/assets/images/tools/bobbin.jpg' },
      { id: 'c-5', title: 'Courtyard Warp Frame', type: 'warp-court', url: '/assets/images/handloom/handloom-process.jpg' },
      { id: 'c-6', title: 'Bamboo Spindle Tools', type: 'wooden-bobbin', url: '/assets/images/tools/other-tools/wooden-bobbin.jpg' },
    ],
  },
  agorSection: {
    heading: 'Collection of',
    highlightWord: 'agor',
    subtitle: '(Patterns and motifs...)',
    description:
      'Traditional patterns and motifs represent cultural identity, meaning, craftsmanship, and visual heritage.',
    symbolismQuote: 'symbolizing respect, cultural pride, and identity',
    centralTextileInscription: 'Finely woven motifs, crafted with tradition by Bodo women.',
    centralTextileFooter: 'BODOLAND, ASSAM, INDIA.',
  },
  dyeingSection: {
    heading: 'Collection of',
    highlightWord: 'dyeing',
    subtitle: 'One of the most important creative and lucrative arts of the Bodos is colouring the thread.',
    description:
      'Bodo handloom traditionally uses colourful yarn, and yarn may be dyed using natural or synthetic colours. Documented materials include yarn, alum (fitkaari) as a mordant, and colours obtained from natural materials such as barks, leaves, and roots to produce vivid shades including red, yellow, reddish yellow, green, black, and blue.',
    galleryImages: [
      { id: 'd-1', title: 'Raw Turmeric & Mordant Basket', type: 'dye-basket', url: '/assets/images/cultural/cultural-practices/dye-basket.jpg' },
      { id: 'd-2', title: 'Mustard Yellow Vegetable Dye Hank', type: 'mustard-yarn', url: '/assets/images/weaving/yarn.jpg' },
      { id: 'd-3', title: 'Luminous Turmeric Silk Skein', type: 'yellow-yarn', url: '/assets/images/weaving/weaving-detail.jpg' },
      { id: 'd-4', title: 'Traditional Wooden Bobbin', type: 'wooden-bobbin', url: '/assets/images/tools/bobbin.jpg' },
      { id: 'd-5', title: 'Terracotta Madder Root Skein', type: 'terracotta-yarn', url: '/assets/images/cultural/heritage/terracotta-yarn.jpg' },
    ],
    sourceDocumentName: 'Dyeing — Bodo Knowledge Repository.pdf',
    sourceDocumentId: 'BOD-DYE-2024-V1',
    uploadDate: '2024-10-05',
    lastUpdated: '2024-10-05',
    contentEditor: 'Bodo Cultural Heritage Guild',
    referenceInfo: 'Authoritative Bodo Knowledge Repository Document on Thread Colouring & Mordanting',
    version: 1,
  },
  weaverSection: {
    heading: 'Meet the',
    highlightWord: 'weaver',
    subtitle: 'Oral Heritage & Master Artisan Archive',
  },
  processSection: {
    heading: 'The Journey of a',
    highlightWord: 'thread',
    subtitle:
      'An indigenous cyclical journey from raw short-staple cotton and Ahimsa Eri cocoons to the majestic ceremonial Dokhona.',
  },
  museumSection: {
    heading: 'Enter the',
    highlightWord: 'digital museum',
    subtitle:
      'Accession records, 3D laser photogrammetry reconstructions, and living knowledge archives from Bodoland.',
  },
  vrSection: {
    heading: 'Enter the',
    highlightWord: 'VR museum',
    subtitle: 'Step inside a digital reconstruction of Bodo handloom heritage.',
    buttonText: 'ENTER VR',
  },
};
