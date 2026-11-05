import React from 'react';
import { Search, FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: 'search' | 'folder';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No artifacts found',
  description = 'Try adjusting your search query, clearing filters, or exploring other categories.',
  actionLabel,
  onAction,
  icon = 'search'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-stone-300 max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-500">
        {icon === 'search' ? <Search className="w-6 h-6" /> : <FolderOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-lg font-bold font-editorial text-stone-900">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-600 font-editorial mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
