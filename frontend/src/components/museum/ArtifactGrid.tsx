import React from 'react';
import { Artifact } from '../../data/artifacts';
import { ArtifactCard } from './ArtifactCard';
import { EmptyState } from '../ui/EmptyState';

export interface ArtifactGridProps {
  artifacts: Artifact[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectArtifact: (artifact: Artifact) => void;
  onOpen3D: (artifact: Artifact) => void;
  onResetFilters?: () => void;
}

export const ArtifactGrid: React.FC<ArtifactGridProps> = ({
  artifacts,
  favorites,
  onToggleFavorite,
  onSelectArtifact,
  onOpen3D,
  onResetFilters
}) => {
  if (artifacts.length === 0) {
    return (
      <EmptyState
        title="No matching artifacts in this archive query"
        description="Try clearing your search terms or selecting 'All Artifacts' to browse the complete catalog."
        actionLabel={onResetFilters ? 'Reset All Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {artifacts.map((artifact) => (
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
  );
};
