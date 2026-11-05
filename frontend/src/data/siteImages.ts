/**
 * Centralized Site Images Configuration
 * All paths map directly to files within frontend/public/assets/images/
 * Replacing files in those folders immediately updates the website upon refresh.
 */

export const siteImages = {
  hero: '/assets/images/hero/hero-main.JPG',

  about: [
    '/assets/images/about/about-1.JPG',
    '/assets/images/about/about-3.JPG',
    '/assets/images/about/about-4.JPG',
    '/assets/images/about/about-5.JPG',
  ],

  aronai: {
    left: '/assets/images/aronai/aronai-left.jpg',
    right: '/assets/images/aronai/aronai-right.jpg',
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
  },

  textiles: {
    dokhona: '/assets/images/textiles/traditional-textiles/dokhona.jpg',
    aronai: '/assets/images/textiles/silk/aronai.jpg',
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

  people: {
    masterWeaver: '/assets/images/people/weavers/anjali-swargiary.jpg',
    interviewElder: '/assets/images/people/weavers/interview-elder.jpg',
  },
} as const;

export default siteImages;
