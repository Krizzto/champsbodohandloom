// Backend/src/services/vectorStore.ts
// Persistent Vector Database for Bodo Cultural Heritage Knowledge System

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { embeddingService, VECTOR_DIMENSION } from './embeddingService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VECTOR_STORE_DIR = path.resolve(__dirname, '../../knowledge_base/05_vector_store');
const VECTORS_FILE = path.join(VECTOR_STORE_DIR, 'vectors.json');
const METADATA_FILE = path.join(VECTOR_STORE_DIR, 'index_metadata.json');

export interface VectorRecord {
  chunkId: string;
  documentId: string;
  fileName: string;
  sourcePath: string;
  category: string;
  sectionTitle: string;
  pageNumber?: number;
  content: string;
  contentHash: string;
  tokensEstimate: number;
  ingestionTimestamp: number;
  vector: number[];
  metadata?: Record<string, any>;
}

export interface VectorSearchResult {
  record: VectorRecord;
  similarity: number;
}

export interface VectorStoreMetadata {
  totalVectors: number;
  dimension: number;
  embeddingModel: string;
  lastUpdated: number;
  version: string;
}

export class PersistentVectorStore {
  private records: Map<string, VectorRecord> = new Map();
  private isInitialized = false;

  constructor() {
    this.ensureStorageDirectory();
    this.loadFromDisk();
  }

  private ensureStorageDirectory(): void {
    if (!fs.existsSync(VECTOR_STORE_DIR)) {
      fs.mkdirSync(VECTOR_STORE_DIR, { recursive: true });
    }
  }

  /**
   * Load vector index from disk into memory
   */
  public loadFromDisk(): void {
    this.ensureStorageDirectory();
    this.records.clear();

    if (fs.existsSync(VECTORS_FILE)) {
      try {
        const raw = fs.readFileSync(VECTORS_FILE, 'utf-8');
        const parsed: VectorRecord[] = JSON.parse(raw);
        for (const record of parsed) {
          if (record && record.chunkId && Array.isArray(record.vector)) {
            this.records.set(record.chunkId, record);
          }
        }
        console.log(`[VectorStore] Loaded ${this.records.size} persistent vectors from ${VECTORS_FILE}`);
      } catch (err) {
        console.error('[VectorStore] Error loading vectors from disk:', err);
      }
    } else {
      console.log('[VectorStore] No existing vector file found. Initializing empty persistent vector store.');
    }

    this.isInitialized = true;
  }

  /**
   * Save all vector records to disk atomically
   */
  public saveToDisk(): void {
    this.ensureStorageDirectory();
    const recordsArray = Array.from(this.records.values());

    const tmpVectorsFile = `${VECTORS_FILE}.tmp.${Date.now()}`;
    const tmpMetaFile = `${METADATA_FILE}.tmp.${Date.now()}`;

    try {
      // 1. Write vectors
      fs.writeFileSync(tmpVectorsFile, JSON.stringify(recordsArray, null, 2), 'utf-8');
      fs.renameSync(tmpVectorsFile, VECTORS_FILE);

      // 2. Write metadata
      const meta: VectorStoreMetadata = {
        totalVectors: recordsArray.length,
        dimension: VECTOR_DIMENSION,
        embeddingModel: embeddingService.modelName,
        lastUpdated: Date.now(),
        version: '1.0.0',
      };
      fs.writeFileSync(tmpMetaFile, JSON.stringify(meta, null, 2), 'utf-8');
      fs.renameSync(tmpMetaFile, METADATA_FILE);
    } catch (err) {
      console.error('[VectorStore] Error saving vectors to disk:', err);
      if (fs.existsSync(tmpVectorsFile)) fs.unlinkSync(tmpVectorsFile);
      if (fs.existsSync(tmpMetaFile)) fs.unlinkSync(tmpMetaFile);
    }
  }

  /**
   * Add or update vector records
   */
  public addVectors(newRecords: VectorRecord[]): void {
    for (const rec of newRecords) {
      this.records.set(rec.chunkId, rec);
    }
    this.saveToDisk();
  }

  /**
   * Semantic Cosine Similarity Search with optional metadata filtering
   */
  public similaritySearch(
    queryVector: number[],
    topK = 5,
    filter?: { category?: string; documentId?: string }
  ): VectorSearchResult[] {
    if (!this.isInitialized) this.loadFromDisk();

    const results: VectorSearchResult[] = [];

    for (const record of this.records.values()) {
      // Apply filters if provided
      if (filter?.category && record.category.toLowerCase() !== filter.category.toLowerCase()) {
        continue;
      }
      if (filter?.documentId && record.documentId !== filter.documentId) {
        continue;
      }

      const similarity = embeddingService.cosineSimilarity(queryVector, record.vector);
      results.push({ record, similarity });
    }

    // Sort descending by similarity
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, topK);
  }

  /**
   * Delete all vectors belonging to a specific document ID
   */
  public deleteByDocumentId(documentId: string): number {
    let deletedCount = 0;
    for (const [chunkId, record] of this.records.entries()) {
      if (record.documentId === documentId) {
        this.records.delete(chunkId);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      this.saveToDisk();
      console.log(`[VectorStore] Deleted ${deletedCount} vectors for document ${documentId}`);
    }
    return deletedCount;
  }

  /**
   * Delete a single vector record by chunk ID
   */
  public deleteByChunkId(chunkId: string): boolean {
    const deleted = this.records.delete(chunkId);
    if (deleted) {
      this.saveToDisk();
    }
    return deleted;
  }

  public getRecord(chunkId: string): VectorRecord | undefined {
    return this.records.get(chunkId);
  }

  public getAllRecords(): VectorRecord[] {
    return Array.from(this.records.values());
  }

  public count(): number {
    return this.records.size;
  }

  public clear(): void {
    this.records.clear();
    this.saveToDisk();
  }
}

export const persistentVectorStore = new PersistentVectorStore();
