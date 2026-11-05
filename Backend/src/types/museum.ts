export interface OKFProcess {
  id: string;
  title: string;
  nativeTerm?: string;
  type: string;
  documentId: string;
  description: string;
  tags: string[];
  status: string;
  source: {
    id: string;
    resource: string;
    title: string;
  };
  content: string;
  keySteps: string[];
  toolsUsed: string[];
  duration?: string;
  galleryId: string;
  exhibitId: string;
}

export interface ExhibitItem {
  id: string;
  name: string;
  nativeName: string;
  category: 'raw_material' | 'process_station' | 'loom_apparatus' | 'finished_textile' | 'cultural_artifact';
  galleryId: string;
  position: [number, number, number]; // [x, y, z] in 3D scene
  rotation?: [number, number, number];
  color: string;
  iconName: string;
  shortDesc: string;
  fullDescription: string;
  culturalSignificance: string;
  materials: string[];
  toolsInvolved: string[];
  audioGuideScript: string;
  modelType: 'loom' | 'spinning_wheel' | 'ginning_roller' | 'reeling_basin' | 'warp_creel' | 'textile_display' | 'cocoon_tray' | 'beaming_frame';
}

export interface MuseumGallery {
  id: string;
  number: number;
  name: string;
  bodoName: string;
  description: string;
  ambientColor: string;
  centerPosition: [number, number, number];
  cameraWaypoint: [number, number, number];
  exhibitIds: string[];
}

export interface RetrievalBenchmarkItem {
  id: number;
  question: string;
  expectedConcept: string;
}

export interface BenchmarkResult {
  questionId: number;
  question: string;
  expectedConcept: string;
  predictedConcept: string;
  score: number;
  isCorrect: boolean;
  topChunks: {
    concept: string;
    text: string;
    similarity: number;
  }[];
}

export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  actionTaken?: {
    type: 'navigated' | 'retrieved_knowledge' | 'switched_gallery' | 'played_audio' | 'ran_benchmark';
    targetId?: string;
    label?: string;
  };
  suggestedPrompts?: string[];
}

export interface DocumentManifestItem {
  source: string;
  document_id: string;
  content_hash: string;
  version: number;
  modality: string;
  sectionCount: number;
}
