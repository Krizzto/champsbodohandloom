import React from 'react';
import { WeavingCluster } from '../../data/culturalData';
import { MapPin } from 'lucide-react';

export interface InteractiveHotspotProps {
  cluster: WeavingCluster;
  isSelected: boolean;
  onSelect: (cluster: WeavingCluster) => void;
}

export const InteractiveHotspot: React.FC<InteractiveHotspotProps> = ({
  cluster,
  isSelected,
  onSelect
}) => {
  return (
    <div
      style={{ left: `${cluster.coordinates.x}%`, top: `${cluster.coordinates.y}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
    >
      <button
        type="button"
        onClick={() => onSelect(cluster)}
        className="group relative flex items-center justify-center cursor-pointer"
        aria-label={`View cluster: ${cluster.district}`}
      >
        {/* Pulsing beacon */}
        <span
          className={`absolute w-8 h-8 rounded-full animate-ping opacity-60 ${
            isSelected ? 'bg-[#FFE600]' : 'bg-[#8B2635]'
          }`}
        />

        {/* Core pin button */}
        <div
          className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-115 ${
            isSelected
              ? 'bg-[#171513] text-[#FFE600] ring-3 ring-[#FFE600]'
              : 'bg-[#8B2635] text-white hover:bg-[#6A1A26]'
          }`}
        >
          <MapPin className="w-4 h-4" />
        </div>

        {/* Hover label */}
        <div className="absolute top-10 whitespace-nowrap px-2.5 py-1 rounded-md bg-[#171513] text-white text-[10px] font-bold tracking-wide shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          {cluster.district}
        </div>
      </button>
    </div>
  );
};
