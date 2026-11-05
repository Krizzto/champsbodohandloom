import React from 'react';
import { Artifact } from '../../data/artifacts';
import { Box, Heart, ArrowUpRight, Compass } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { HeritageImage } from '../ui/HeritageImage';

export interface ArtifactCardProps {
  artifact: Artifact;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onSelect?: (artifact: Artifact) => void;
  onOpen3D?: (artifact: Artifact) => void;
  onOpenAR?: (artifact: Artifact) => void;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({
  artifact,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
  onOpen3D,
  onOpenAR,
}) => {
  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'Tools': return 'amber';
      case 'Textiles': return 'rose';
      case 'Looms': return 'emerald';
      case 'Materials': return 'cyan';
      default: return 'default';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-stone-300 transition-all flex flex-col justify-between">
      {/* Visual / Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100 border-b border-stone-200">
        <HeritageImage
          src={artifact.image || artifact.imageUrl || `/assets/images/tools/${artifact.id}.jpg`}
          imageKey={`artifact-photo-${artifact.id}`}
          alt={artifact.name}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          fallbackText={`${artifact.name} photo coming soon`}
          showChangeButton={false}
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={getCategoryBadgeVariant(artifact.category)}>
            {artifact.category}
          </Badge>
        </div>

        {/* Favorite & 3D Badges */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {artifact.model && (
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#171513]/85 text-white backdrop-blur-xs text-[10px] font-bold"
              title="3D Model Available"
            >
              <Box className="w-3 h-3 text-[#FFE600]" />
              <span>3D</span>
            </span>
          )}

          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(artifact.id);
              }}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-1.5 rounded-full backdrop-blur-md shadow-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-white/80 hover:bg-white text-stone-400 hover:text-rose-600 border border-stone-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3
              onClick={() => onSelect && onSelect(artifact)}
              className="text-base sm:text-lg font-bold font-editorial text-stone-900 group-hover:text-[#8B2635] transition-colors cursor-pointer"
            >
              {artifact.name}
            </h3>
          </div>
          {artifact.bodoName && (
            <p className="text-xs text-stone-500 font-medium mt-0.5">{artifact.bodoName}</p>
          )}

          <p className="text-xs text-stone-600 font-editorial line-clamp-2 mt-2 leading-relaxed">
            {artifact.description}
          </p>
        </div>

        {/* Materials Chips */}
        {artifact.materials && artifact.materials.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {artifact.materials.slice(0, 3).map((mat: string, i: number) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-[#FAF8F5] text-stone-600 text-[10px] font-medium border border-stone-200"
              >
                {mat}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2">
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(artifact)}
              className="inline-flex items-center gap-1 text-xs font-bold text-stone-800 hover:text-[#8B2635] transition-colors cursor-pointer"
            >
              <span>Provenance</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {(artifact.model || artifact.modelUrl || artifact.modelId) && onOpen3D && (
              <button
                type="button"
                onClick={() => onOpen3D(artifact)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#171513] hover:bg-[#2C2825] text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Box className="w-3 h-3 text-[#FFE600]" />
                <span>VIEW 3D</span>
              </button>
            )}

            {artifact.arAvailable && onOpenAR && (
              <button
                type="button"
                onClick={() => onOpenAR(artifact)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                title="View in Mobile WebXR AR"
              >
                <Compass className="w-3 h-3 text-[#0F4C81]" />
                <span>VIEW IN AR</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
