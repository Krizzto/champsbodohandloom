/**
 * Backend integration will be implemented by the project team.
 * Do not add API logic here yet.
 *
 * This frontend will later be connected to our own backend, AI/RAG system,
 * database, and AR/VR services.
 */

import { ExpertiseLevel } from '../utils/constants';

export interface AIQueryRequest {
  query: string;
  expertise: ExpertiseLevel;
}

export interface AIQueryResponse {
  answer: string;
  sources?: string[];
  metadata?: Record<string, unknown>;
}

// Placeholder for future backend connection (to be implemented by the project team)
export async function sendAIQuery(_request: AIQueryRequest): Promise<AIQueryResponse> {
  throw new Error('Backend integration will be implemented by the project team.');
}
