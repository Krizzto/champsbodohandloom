import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'featured' | 'name-asc' | 'name-desc' | 'category';

export interface SortControlProps {
  sortBy: SortOption;
  onChange: (sort: SortOption) => void;
  resultsCount: number;
}

export const SortControl: React.FC<SortControlProps> = ({
  sortBy,
  onChange,
  resultsCount
}) => {
  return (
    <div className="flex items-center justify-between text-xs text-stone-600 pb-2">
      <span className="font-editorial">
        Showing <span className="font-bold text-stone-900">{resultsCount}</span> artifact{resultsCount === 1 ? '' : 's'}
      </span>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
        <label htmlFor="sort-select" className="font-semibold text-stone-700">Sort:</label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#171513] cursor-pointer"
        >
          <option value="featured">Featured First</option>
          <option value="name-asc">Name (A to Z)</option>
          <option value="name-desc">Name (Z to A)</option>
          <option value="category">By Category</option>
        </select>
      </div>
    </div>
  );
};
