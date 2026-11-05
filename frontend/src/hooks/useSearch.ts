import { useState, useMemo } from 'react';
import { artifacts, Artifact } from '../data/artifacts';
import { filterAndSortArtifacts, SearchFilterOptions } from '../utils/searchUtils';

export function useSearch(initialCategory: string = 'All') {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc' | 'category'>('featured');
  const [onlyWith3D, setOnlyWith3D] = useState(false);

  const filteredArtifacts = useMemo(() => {
    const options: SearchFilterOptions = {
      query,
      category: selectedCategory,
      sortBy,
      onlyWith3D
    };
    return filterAndSortArtifacts(artifacts, options);
  }, [query, selectedCategory, sortBy, onlyWith3D]);

  const resetFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
    setOnlyWith3D(false);
  };

  return {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    onlyWith3D,
    setOnlyWith3D,
    filteredArtifacts,
    totalCount: artifacts.length,
    resultsCount: filteredArtifacts.length,
    resetFilters
  };
}
