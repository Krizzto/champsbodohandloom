/**
 * Centralized Image Asset Registry for Bodo Handloom Digital Museum
 * Every image path directly reflects the clean directory hierarchy under public/assets/images/
 * 
 * Replace any physical file in public/assets/images/... with the corresponding filename
 * and it will immediately reflect across the application upon refresh.
 */

export const IMAGE_ASSETS = {
  about: [
    '/assets/images/about/about-1.JPG',
    '/assets/images/about/about-3.JPG',
    '/assets/images/about/about-4.JPG',
    '/assets/images/about/about-5.JPG',
  ],
  hero: {
    main: '/assets/images/hero/hero-main.JPG',
    secondary: '/assets/images/hero/hero-secondary.jpg',
    mobile: '/assets/images/hero/hero-mobile.jpg',
  },
  handloom: {
    main: '/assets/images/handloom/handloom-main.jpg',
    traditionalLoom: '/assets/images/handloom/traditional-loom.jpg',
    process: '/assets/images/handloom/handloom-process.jpg',
  },
  weaving: {
    main: '/assets/images/weaving/weaving-main.jpg',
    process: '/assets/images/weaving/weaving-process.jpg',
    yarn: '/assets/images/weaving/yarn.jpg',
    detail: '/assets/images/weaving/weaving-detail.jpg',
  },
  tools: {
    zenther: '/assets/images/tools/zenther.jpg',
    bobbin: '/assets/images/tools/bobbin.jpg',
    chwrkhi: '/assets/images/tools/chwrkhi.jpg',
    tharai: '/assets/images/tools/tharai.jpg',
    maku: '/assets/images/tools/maku.jpg',
    otherToolsDir: '/assets/images/tools/other-tools/',
  },
  textiles: {
    dokhona: '/assets/images/textiles/traditional-textiles/dokhona.jpg',
    aronai: '/assets/images/textiles/silk/aronai.jpg',
    traditionalTextilesDir: '/assets/images/textiles/traditional-textiles/',
    silkDir: '/assets/images/textiles/silk/',
    cottonDir: '/assets/images/textiles/cotton/',
    finishedProductsDir: '/assets/images/textiles/finished-products/',
  },
  motifs: {
    motif01: '/assets/images/motifs/motif-01.jpg',
    motif02: '/assets/images/motifs/motif-02.jpg',
    motif03: '/assets/images/motifs/motif-03.jpg',
    motif04: '/assets/images/motifs/motif-04.jpg',
    motif05: '/assets/images/motifs/motif-05.jpg',
    motif06: '/assets/images/motifs/motif-06.jpg',
    motif07: '/assets/images/motifs/motif-07.jpg',
    motif08: '/assets/images/motifs/motif-08.jpg',
  },
  cultural: {
    dyeBasket: '/assets/images/cultural/cultural-practices/dye-basket.jpg',
    eriSilk: '/assets/images/cultural/heritage/eri-silk.jpg',
    terracottaYarn: '/assets/images/cultural/heritage/terracotta-yarn.jpg',
    practicesDir: '/assets/images/cultural/cultural-practices/',
    dressDir: '/assets/images/cultural/traditional-dress/',
    festivalsDir: '/assets/images/cultural/festivals/',
    heritageDir: '/assets/images/cultural/heritage/',
  },
  people: {
    masterWeaver: '/assets/images/people/weavers/anjali-swargiary.jpg',
    interviewElder: '/assets/images/people/weavers/interview-elder.jpg',
    weaversDir: '/assets/images/people/weavers/',
    artisansDir: '/assets/images/people/artisans/',
    communityDir: '/assets/images/people/community/',
  },
  process: {
    ginning: '/assets/images/process/ginning.jpg',
    spinning: '/assets/images/process/spinning.jpg',
    reeling: '/assets/images/process/reeling.jpg',
    sizing: '/assets/images/process/sizing.jpg',
    winding: '/assets/images/process/winding.jpg',
    warping: '/assets/images/process/warping.jpg',
    beaming: '/assets/images/process/beaming.jpg',
    looming: '/assets/images/process/looming.jpg',
    weaving: '/assets/images/process/weaving.jpg',
  },
  ui: {
    patternsDir: '/assets/images/ui/patterns/',
    backgroundsDir: '/assets/images/ui/backgrounds/',
    iconsDir: '/assets/images/ui/icons/',
    decorativeDir: '/assets/images/ui/decorative/',
  },
  models: {
    zenther: '/assets/models/tools/zenther.glb',
    maku: '/assets/models/tools/maku.glb',
    khabang: '/assets/models/tools/khabang.glb',
    traditionalLoom: '/assets/models/looms/traditional-loom.glb',
    dokhona: '/assets/models/artifacts/dokhona.glb',
    aronai: '/assets/models/artifacts/aronai.glb',
    eriCocoon: '/assets/models/artifacts/eri-cocoon.glb',
  }
} as const;
