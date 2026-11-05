/**
 * GraphRAG and Knowledge Base Type Definitions
 * Preserved inside Backend/src/types/graph.ts
 */

export type NodeType =
  | 'Process'
  | 'Tool'
  | 'Material'
  | 'Technique'
  | 'Textile'
  | 'Motif'
  | 'CulturalPractice'
  | 'Source'
  | 'DocumentChunk'
  | 'Exhibit';

export type RelationshipType =
  | 'USES_TOOL'
  | 'USES_MATERIAL'
  | 'FOLLOWED_BY'
  | 'PRODUCES'
  | 'PART_OF'
  | 'APPLIED_TO'
  | 'RELATED_TO'
  | 'SUPPORTED_BY'
  | 'EXTRACTED_FROM'
  | 'REPRESENTED_BY_EXHIBIT';

export type VerificationStatus = 'pending' | 'human_verified' | 'rejected';

export type ExpertiseLevel = 'basic' | 'intermediate';

export interface GraphNode {
  id: string;
  type: NodeType;
  name: string;
  nativeName?: string;
  properties: Record<string, any>;
  verificationStatus: VerificationStatus;
  sourceDocumentId?: string;
  sourceChunkId?: string;
  evidenceText?: string;
  createdAt: number;
}

export interface GraphEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationship: RelationshipType;
  properties?: Record<string, any>;
  verificationStatus: VerificationStatus;
  sourceDocumentId: string;
  sourceChunkId?: string;
  evidenceText: string;
  createdAt: number;
}

export interface KnowledgeChunk {
  chunkId: string;
  documentId: string;
  documentName: string;
  filePath: string;
  processId: string;
  processName: string;
  sectionHeading: string;
  text: string;
  sha256: string;
  tokensEstimate: number;
  verificationStatus: VerificationStatus;
  ingestionTimestamp: number;
}

export interface SourceCitation {
  documentId: string;
  documentName: string;
  chunkId: string;
  heading: string;
  excerpt: string;
  processName?: string;
  relevanceScore: number;
}

export interface NavigationAction {
  type: 'navigate_to_exhibit';
  exhibitId: string;
  exhibitName: string;
  nativeName: string;
  galleryId: string;
  galleryName: string;
  targetPosition: [number, number, number];
  reason: string;
}

export interface HybridEvidence {
  documentChunks: KnowledgeChunk[];
  graphEntities: GraphNode[];
  graphRelationships: GraphEdge[];
  relevanceScore: number;
  citations: SourceCitation[];
}

export interface GroundedDocentResponse {
  answer: string;
  expertise: ExpertiseLevel;
  expertiseLevel?: ExpertiseLevel;
  sources: SourceCitation[];
  evidenceSufficient: boolean;
  insufficientEvidence?: boolean;
  uncertaintyAcknowledged?: boolean;
  navigation: NavigationAction | null;
  navigationAction?: NavigationAction | null;
  graphContext?: {
    entities: GraphNode[];
    relationships: GraphEdge[];
  };
  graphContextSummary?: string[];
  suggestedFollowUps?: string[];
}
