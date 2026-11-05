import React, { useState } from 'react';
import { weavingClusters, WeavingCluster } from '../../data/culturalData';
import { InteractiveHotspot } from './InteractiveHotspot';
import { MapPin, Sparkles, Navigation } from 'lucide-react';

export const CulturalMap: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<WeavingCluster>(weavingClusters[0]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">
            Geographic Centers of Excellence
          </span>
          <h3 className="text-2xl font-bold font-editorial text-stone-900 mt-1">
            Bodoland Weaving Clusters
          </h3>
          <p className="text-xs text-stone-600 font-editorial">
            Click any beacon on the cultural map to inspect regional specialties and master craftsman traditions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {weavingClusters.map((cluster) => {
            const isSelected = cluster.id === selectedCluster.id;
            return (
              <button
                key={cluster.id}
                type="button"
                onClick={() => setSelectedCluster(cluster)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#171513] text-[#FAF8F5] border-[#171513] shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {cluster.district}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative w-full h-[320px] sm:h-[400px] bg-[#FAF8F5] rounded-xl overflow-hidden border border-stone-200 shadow-inner">
        {/* Stylized Topographic River & Ridge Geometry */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Subtle River Brahmaputra & Foothill contours */}
          <path
            d="M 0,440 Q 250,420 500,450 T 1000,430"
            fill="none"
            stroke="#185ADB"
            strokeWidth="12"
            opacity="0.15"
          />
          <path
            d="M 0,120 Q 300,100 600,130 T 1000,90"
            fill="none"
            stroke="#2B6E44"
            strokeWidth="3"
            strokeDasharray="6 6"
            opacity="0.25"
          />
          {/* Mountain silhouettes */}
          <polygon points="100,120 200,60 300,120" fill="#2B6E44" opacity="0.08" />
          <polygon points="250,130 400,50 550,130" fill="#2B6E44" opacity="0.08" />
          <polygon points="500,120 650,40 800,120" fill="#2B6E44" opacity="0.08" />
          <polygon points="750,130 880,70 1000,130" fill="#2B6E44" opacity="0.08" />

          {/* District Boundary Lines */}
          <line x1="370" y1="50" x2="370" y2="450" stroke="#171513" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
          <line x1="570" y1="50" x2="570" y2="450" stroke="#171513" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
          <line x1="770" y1="50" x2="770" y2="450" stroke="#171513" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />

          {/* District Labels inside Map */}
          <text x="220" y="470" fill="#171513" opacity="0.4" fontSize="14" fontWeight="bold" fontFamily="var(--font-heading)" textAnchor="middle">
            KOKRAJHAR
          </text>
          <text x="470" y="470" fill="#171513" opacity="0.4" fontSize="14" fontWeight="bold" fontFamily="var(--font-heading)" textAnchor="middle">
            CHIRANG
          </text>
          <text x="670" y="470" fill="#171513" opacity="0.4" fontSize="14" fontWeight="bold" fontFamily="var(--font-heading)" textAnchor="middle">
            BAKSA
          </text>
          <text x="880" y="470" fill="#171513" opacity="0.4" fontSize="14" fontWeight="bold" fontFamily="var(--font-heading)" textAnchor="middle">
            UDALGURI
          </text>
        </svg>

        {/* Hotspot Beacons */}
        {weavingClusters.map((cluster) => (
          <InteractiveHotspot
            key={cluster.id}
            cluster={cluster}
            isSelected={cluster.id === selectedCluster.id}
            onSelect={setSelectedCluster}
          />
        ))}

        {/* Compass Legend */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-white/90 rounded-md border border-stone-200 text-[11px] text-stone-600 font-editorial">
          <Navigation className="w-3.5 h-3.5 text-[#8B2635]" />
          <span>Sub-Himalayan Footprint, Assam</span>
        </div>
      </div>

      {/* Selected Cluster Provenance Card */}
      <div className="p-5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B2635]" />
            <h4 className="text-lg font-bold font-editorial text-stone-900">
              {selectedCluster.district} District
            </h4>
            <span className="text-xs text-stone-500 italic">({selectedCluster.center})</span>
          </div>
          <span className="text-xs font-semibold text-[#8B2635] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            {selectedCluster.specialty}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-stone-700 font-editorial leading-relaxed">
          {selectedCluster.description}
        </p>
      </div>
    </div>
  );
};
