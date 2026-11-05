import React from 'react';
import { SearchInput } from '../ui/SearchInput';
import { Box } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onlyWith3D: boolean;
  onToggle3D: (val: boolean) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onlyWith3D,
  onToggle3D,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${className}`}>
      <div className="flex-1">
        <SearchInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClear={() => onChange('')}
          placeholder="Search by Zenther, Maku, Dokhona, Sal loom, or material..."
        />
      </div>

      <button
        type="button"
        onClick={() => onToggle3D(!onlyWith3D)}
        className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none shrink-0 ${
          onlyWith3D
            ? 'bg-[#171513] text-[#FFE600] border-[#171513] shadow-xs'
            : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
        }`}
        title="Show only artifacts with 3D model availability"
      >
        <Box className="w-4 h-4" />
        <span>3D Models Only</span>
      </button>
    </div>
  );
};
