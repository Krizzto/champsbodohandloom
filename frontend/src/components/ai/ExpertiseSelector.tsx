import React from 'react';
import { EXPERTISE_LEVELS, ExpertiseLevel } from '../../utils/constants';

export type { ExpertiseLevel };

export interface ExpertiseSelectorProps {
  selectedLevel: ExpertiseLevel;
  onSelect: (level: ExpertiseLevel) => void;
  className?: string;
}

export const ExpertiseSelector: React.FC<ExpertiseSelectorProps> = ({
  selectedLevel,
  onSelect,
  className = ''
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
        Expertise Level
      </label>

      <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1 rounded-xl">
        {EXPERTISE_LEVELS.map((level) => {
          const isSelected = selectedLevel === level.id;
          return (
            <button
              key={level.id}
              type="button"
              onClick={() => onSelect(level.id)}
              className={`px-3 py-2 rounded-lg text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#171513] text-[#FAF8F5] shadow-xs'
                  : 'bg-transparent hover:bg-white/60 text-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{level.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600]" />
                )}
              </div>
              <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                {level.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
