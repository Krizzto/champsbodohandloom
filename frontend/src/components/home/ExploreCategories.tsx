import React from 'react';
import { categories } from '../../data/categories';
import { Wrench, Layers, Grid, Sparkles, ArrowRight } from 'lucide-react';

export interface ExploreCategoriesProps {
  onSelectCategory: (categoryId: string) => void;
}

export const ExploreCategories: React.FC<ExploreCategoriesProps> = ({ onSelectCategory }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Wrench': return <Wrench className="w-5 h-5 text-amber-700" />;
      case 'Layers': return <Layers className="w-5 h-5 text-rose-700" />;
      case 'Grid': return <Grid className="w-5 h-5 text-emerald-700" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-cyan-700" />;
      default: return <Sparkles className="w-5 h-5 text-amber-700" />;
    }
  };

  // Skip "All" for category display cards
  const displayCategories = categories.filter((c) => c.id !== 'All');

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">
            Categorical Exploration
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold text-stone-900 mt-2">
            Explore by <span className="yellow-highlight">Category</span>
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-editorial italic mt-2">
            Navigate through tools, woven attire, traditional frame looms, and indigenous botanical materials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="bg-[#FAF8F5] rounded-2xl p-6 border border-stone-200 hover:border-stone-300 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                  {getIcon(cat.iconName)}
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-editorial text-stone-900 group-hover:text-[#8B2635] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-mono text-stone-500 bg-white px-2 py-0.5 rounded-full border border-stone-200">
                    {cat.count}
                  </span>
                </div>

                <p className="text-xs text-stone-600 font-editorial mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-[#171513] group-hover:text-[#8B2635] transition-colors">
                <span>View Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
