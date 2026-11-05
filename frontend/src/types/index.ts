export interface Source {
  id?: string;
  title: string;
  author?: string;
  year?: string | number;
  url?: string;
}

export interface PhysicalDimensions {
  width: number;
  height: number;
  depth: number;
  unit: 'm' | 'cm' | 'mm';
}

export interface Model3D {
  id: string;
  artifactId?: string;
  name: string;
  description?: string;
  type: 'glb' | 'gltf';
  url: string; // Object URL, Blob URL, or static path (/assets/models/...)
  fileName?: string;
  fileSize?: number;
  uploadedAt?: string;
  storageType: 'static' | 'indexeddb' | 'external';
  arEnabled: boolean;
  transform?: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
  };
  physicalDimensions?: PhysicalDimensions;
  thumbnail?: string;
}

export interface Artifact {
  id: string;
  name: string;
  bodoName?: string;
  category: 'TOOLS' | 'TEXTILES' | 'MOTIFS' | 'DYEING' | 'LOOMS' | 'MATERIALS' | string;
  description: string;
  culturalSignificance?: string;
  materials?: string[];
  imageUrl?: string;
  image?: string;
  modelUrl?: string;
  model?: string;
  modelId?: string;
  usdzUrl?: string;
  arAvailable?: boolean;
  vrAvailable?: boolean;
  physicalDimensions?: PhysicalDimensions;
  relatedProcesses?: string[];
  relatedMotifs?: string[];
  sources?: Source[];
  details?: {
    origin?: string;
    artisanCommunity?: string;
    dimensions?: string;
    period?: string;
  };
  tags?: string[];
  featured?: boolean;
  usage?: string;
  dimensions?: string;
  origin?: string;
  period?: string;
}

export interface Motif {
  id: string;
  name: string;
  bodoName: string;
  translation: string;
  meaning: string;
  culturalSignificance: string;
  textileAssociation: string;
  colorway: {
    bg: string;
    pattern: string;
    accent: string;
  };
  symbolism: string[];
  image?: string;
  imageUrl?: string;
  modelUrl?: string;
  description?: string;
  wovenIn?: string;
}

export interface DyeingStep {
  id: string;
  stage: string;
  title: string;
  subtitle?: string;
  bodoTitle?: string;
  description: string;
  ingredients: string[];
  toolsUsed: string[];
  botanicalSource: string;
  colorOutcome: string;
  colorHex: string;
  traditionalWisdom: string;
  craftPrinciple?: string;
  image?: string;
  imageUrl?: string;
  order?: number;
  materials?: string[];
  processFlow?: string[];
  sourceType?: 'source-document' | 'editor-entered';
}

export interface DyeingProcessMetadata {
  sourceDocumentName?: string;
  sourceDocumentId?: string;
  uploadDate?: string;
  lastUpdated?: string;
  contentEditor?: string;
  referenceInfo?: string;
  version?: number;
}

export interface ProcessStage {
  id: string;
  stepNumber: number;
  name: string;
  bodoName: string;
  shortDesc: string;
  detailedProcess: string;
  tools: string[];
  materials: string[];
  culturalImportance: string;
  image?: string;
  imageUrl?: string;
  modelType?: 'bobbin' | 'loom' | 'shuttle' | 'spindle' | 'textile';
}

export interface InterviewChapter {
  id: string;
  order: number;
  title: string;
  bodoTitle?: string;
  timestamp: number; // in seconds
  timestampFormatted: string; // e.g. "00:45"
  summary?: string;
}

export interface InterviewTranscriptLine {
  id: string;
  speaker: 'MASTER WEAVER' | 'INTERVIEWER' | string;
  speakerName?: string;
  bodoText?: string;
  englishText: string;
  timestamp: number; // in seconds
  timestampFormatted: string; // e.g. "00:15"
}

export interface InterviewVideoData {
  videoSrc?: string;
  posterImage?: string;
  duration?: number; // total duration in seconds, e.g. 282
  durationFormatted?: string; // e.g. "04:42"
  title?: string;
  subtitle?: string;
  location?: string;
  recordingDate?: string;
  interviewer?: string;
  chapters?: InterviewChapter[];
  transcript?: InterviewTranscriptLine[];
  subtitles?: {
    en?: string;
    brx?: string; // Bodo
    as?: string; // Assamese
  };
}

export interface WeaverProfile {
  id: string;
  name: string;
  bodoTitle: string;
  location: string;
  district: string;
  experience: string;
  specialization: string;
  traditionalKnowledge: string;
  interviewQuote: string;
  audioDuration: string;
  masterpieces: string[];
  image?: string;
  photo?: string;
  gallery?: string[];
  videoData?: InterviewVideoData;
  achievements?: string[];
  techniques?: string[];
}

export interface NavigationAction {
  type: 'NAVIGATE_TO_EXHIBIT' | 'CAMERA_FLYTO';
  exhibitId: string;
  exhibitName: string;
  coordinates: [number, number, number];
  rotation?: [number, number, number];
  targetRoom?: string;
  zoomLevel?: number;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: Source[];
  relatedArtifacts?: string[];
  relatedProcesses?: string[];
  navigation?: NavigationAction | null;
  graphContextSummary?: string[];
  insufficientEvidence?: boolean;
  suggestedAction?: {
    label: string;
    type: '3d' | 'ar' | 'process' | 'motif';
    targetId: string;
  };
}

export interface DyeingImageRecord {
  id: string;
  filename: string;
  url: string; // e.g. '/assets/images/dyeing/turmeric-yellow-yarn.jpg' or base64 data URL
  title: string;
  caption?: string;
  culturalDescription?: string;
  category: 'Dyeing';
  order: number;
  published: boolean;
  aspectRatio?: string;
  tags?: string[];
  uploadedAt?: string;
  fileSize?: number;
  isCustomBlob?: boolean;
}

export interface DocumentaryVideo {
  id: string;
  title: string;
  description: string;
  videoSrc: string; // Blob storage ID, direct URL, YouTube, or Vimeo
  videoType: 'file' | 'youtube' | 'vimeo' | 'direct';
  thumbnailUrl?: string;
  category: string;
  duration?: number; // seconds
  durationFormatted: string; // e.g. "06:45"
  artisanName?: string;
  featured?: boolean;
  published: boolean;
  uploadDate: string; // e.g. "2024-11-05"
  tags?: string[];
}

