import React from 'react';
import { categories } from '../../data/categories';

export interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar select-none ${className}`}>
      {categories.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              isSelected
                ? 'bg-[#171513] text-[#FAF8F5] border-[#171513] shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 shadow-2xs'
            }`}
          >
            <span>{cat.name}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isSelected ? 'bg-[#FFE600] text-[#171513] font-bold' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
