export interface Category {
  id: string;
  name: string;
  count: number;
  description: string;
  iconName: string;
  badgeColor: string;
}

export const categories: Category[] = [
  {
    id: 'All',
    name: 'All Artifacts',
    count: 10,
    description: 'The entire preserved archive of Bodo handloom tools, textiles, looms, and materials.',
    iconName: 'Archive',
    badgeColor: 'bg-stone-100 text-stone-800 border-stone-200'
  },
  {
    id: 'Tools',
    name: 'Handloom Tools',
    count: 5,
    description: 'Implements for ginning, spinning, bobbin winding, shuttle throwing, and reed beating.',
    iconName: 'Wrench',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
  },
  {
    id: 'Textiles',
    name: 'Woven Textiles',
    count: 2,
    description: 'Masterpiece fabrics including Dokhona Thaosi dresses, ceremonial Aronai scarves, and wraps.',
    iconName: 'Layers',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-200'
  },
  {
    id: 'Looms',
    name: 'Looms & Frames',
    count: 1,
    description: 'Traditional Sal timber looms, frame construction, heddles, and tensioning apparatus.',
    iconName: 'Grid',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
  },
  {
    id: 'Materials',
    name: 'Fibers & Dyes',
    count: 2,
    description: 'Ahimsa Eri (Endi) cocoons, handspun short-staple cotton, and organic forest botanical pigments.',
    iconName: 'Sparkles',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200'
  }
];
