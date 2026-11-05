import React from 'react';
import { getFeaturedArtifacts, Artifact } from '../../data/artifacts';
import { ArtifactCard } from '../museum/ArtifactCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface FeaturedArtifactsProps {
  onNavigate: (path: string) => void;
  onSelectArtifact: (artifact: Artifact) => void;
  onOpen3D: (artifact: Artifact) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const FeaturedArtifacts: React.FC<FeaturedArtifactsProps> = ({
  onNavigate,
  onSelectArtifact,
  onOpen3D,
  favorites,
  onToggleFavorite
}) => {
  const featured = getFeaturedArtifacts().slice(0, 3);

  return (
    <section className="py-20 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and "View All" button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">
              Curated Museum Selection
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold text-stone-900 mt-2">
              Featured <span className="yellow-highlight">Artifacts</span>
            </h2>
            <p className="text-sm sm:text-base text-stone-600 font-editorial italic mt-2">
              Key traditional implements and master textiles preserved in the digital museum archive.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/museum')}
            icon={<ArrowRight className="w-4 h-4 text-[#8B2635]" />}
          >
            Browse All ({getFeaturedArtifacts().length + 5})
          </Button>
        </div>

        {/* 3-Column Artifact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((artifact: Artifact) => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              isFavorite={favorites.includes(artifact.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectArtifact}
              onOpen3D={onOpen3D}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
