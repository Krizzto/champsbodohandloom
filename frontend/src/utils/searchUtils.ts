import { Artifact } from '../data/artifacts';

export interface SearchFilterOptions {
  query?: string;
  category?: string;
  sortBy?: 'name-asc' | 'name-desc' | 'featured' | 'category';
  onlyWith3D?: boolean;
}

export function filterAndSortArtifacts(
  items: Artifact[],
  options: SearchFilterOptions
): Artifact[] {
  const { query = '', category = 'All', sortBy = 'featured', onlyWith3D = false } = options;

  let results = [...items];

  // Category filter
  if (category && category !== 'All') {
    results = results.filter((item) => item.category.toLowerCase() === category.toLowerCase());
  }

  // 3D filter
  if (onlyWith3D) {
    results = results.filter((item) => Boolean(item.model));
  }

  // Search query filter (matches name, bodoName, description, tags, materials)
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.bodoName && item.bodoName.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q) ||
        (item.culturalSignificance && item.culturalSignificance.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(q))) ||
        (item.materials && item.materials.some((m: string) => m.toLowerCase().includes(q)))
    );
  }

  // Sorting
  switch (sortBy) {
    case 'name-asc':
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      results.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'category':
      results.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case 'featured':
    default:
      results.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));
      break;
  }

  return results;
}
