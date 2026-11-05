export const APP_NAME = 'Bodo Handloom Cultural Heritage Digital Museum';
export const APP_SHORT_NAME = 'Bodo Museum';
export const APP_TAGLINE = 'Living Digital Archive of Indigenous Weaving, Sacred Agor Geometry, and Master Artisans of Northeast India';

export const LOCAL_STORAGE_KEYS = {
  FAVORITES: 'bodo_museum_favorites_v1',
  RECENTLY_VIEWED: 'bodo_museum_recent_v1',
  EXPERTISE_LEVEL: 'bodo_museum_ai_expertise_v1',
  ACTIVE_THEME: 'bodo_museum_theme_v1'
} as const;

export const DEFAULT_EXPERTISE = 'basic' as const;

export type ExpertiseLevel = 'basic' | 'intermediate';

export const EXPERTISE_LEVELS = [
  {
    id: 'basic' as const,
    label: 'Basic',
    subtitle: 'Simple explanations',
    description: 'Concise, accessible explanations suitable for all visitors'
  },
  {
    id: 'intermediate' as const,
    label: 'Intermediate',
    subtitle: 'Detailed explanations',
    description: 'In-depth cultural, technical, and structural explanations'
  }
] as const;

export const SUGGESTED_QUESTIONS = [
  'What is Bodo handloom?',
  'What are the traditional weaving tools?',
  'What is Zenther?',
  'What are common Bodo handloom motifs?'
] as const;
