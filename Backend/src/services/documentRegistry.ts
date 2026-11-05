// Backend/src/services/documentRegistry.ts
// Persistent document registry and ingestion history for Bodo Cultural Heritage Knowledge System

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const METADATA_DIR = path.resolve(__dirname, '../../knowledge_base/07_metadata');
const REGISTRY_FILE = path.join(METADATA_DIR, 'document_registry.json');
const HISTORY_FILE = path.join(METADATA_DIR, 'ingestion_history.json');

export interface RegisteredDocument {
  documentId: string;
  fileName: string;
  originalPath: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'md' | 'json';
  sha256: string;
  category: string;
  fileSize: number;
  pageCount?: number;
  ingestedAt: number;
  status: 'indexed' | 'skipped_duplicate' | 'error' | 'ocr_required' | 'inactive';
  extractionStatus: 'success' | 'empty_text_ocr_required' | 'error';
  chunksCount: number;
  embeddingsCount: number;
  entitiesExtractedCount: number;
  indexingVersion: string;
  errorMessage?: string;
}

export interface IngestionBatchRecord {
  batchId: string;
  triggerType: 'website_upload' | 'bulk_folder' | 'reindex';
  timestamp: number;
  filesProcessed: number;
  filesSkipped: number;
  filesFailed: number;
  totalChunks: number;
  totalVectors: number;
  durationMs: number;
  details?: string[];
}

export class DocumentRegistry {
  private documents: Map<string, RegisteredDocument> = new Map();
  private hashToDocId: Map<string, string> = new Map();
  private history: IngestionBatchRecord[] = [];

  constructor() {
    this.ensureStorageDirectory();
    this.loadFromDisk();
  }

  private ensureStorageDirectory(): void {
    if (!fs.existsSync(METADATA_DIR)) {
      fs.mkdirSync(METADATA_DIR, { recursive: true });
    }
  }

  public loadFromDisk(): void {
    this.ensureStorageDirectory();
    this.documents.clear();
    this.hashToDocId.clear();
    this.history = [];

    // 1. Load Document Registry
    if (fs.existsSync(REGISTRY_FILE)) {
      try {
        const raw = fs.readFileSync(REGISTRY_FILE, 'utf-8');
        const list: RegisteredDocument[] = JSON.parse(raw);
        for (const doc of list) {
          if (doc && doc.documentId) {
            this.documents.set(doc.documentId, doc);
            if (doc.sha256) {
              this.hashToDocId.set(doc.sha256, doc.documentId);
            }
          }
        }
      } catch (err) {
        console.error('[DocumentRegistry] Error reading registry file:', err);
      }
    }

    // 2. Load Ingestion History
    if (fs.existsSync(HISTORY_FILE)) {
      try {
        const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
        this.history = JSON.parse(raw);
      } catch (err) {
        console.error('[DocumentRegistry] Error reading history file:', err);
      }
    }
  }

  public saveToDisk(): void {
    this.ensureStorageDirectory();

    const tmpRegistry = `${REGISTRY_FILE}.tmp.${Date.now()}`;
    const tmpHistory = `${HISTORY_FILE}.tmp.${Date.now()}`;

    try {
      const docList = Array.from(this.documents.values());
      fs.writeFileSync(tmpRegistry, JSON.stringify(docList, null, 2), 'utf-8');
      fs.renameSync(tmpRegistry, REGISTRY_FILE);

      fs.writeFileSync(tmpHistory, JSON.stringify(this.history, null, 2), 'utf-8');
      fs.renameSync(tmpHistory, HISTORY_FILE);
    } catch (err) {
      console.error('[DocumentRegistry] Error saving registry to disk:', err);
      if (fs.existsSync(tmpRegistry)) fs.unlinkSync(tmpRegistry);
      if (fs.existsSync(tmpHistory)) fs.unlinkSync(tmpHistory);
    }
  }

  public registerDocument(doc: RegisteredDocument): void {
    this.documents.set(doc.documentId, doc);
    if (doc.sha256) {
      this.hashToDocId.set(doc.sha256, doc.documentId);
    }
    this.saveToDisk();
  }

  public getDocument(documentId: string): RegisteredDocument | undefined {
    return this.documents.get(documentId);
  }

  public getDocumentByHash(sha256: string): RegisteredDocument | undefined {
    const docId = this.hashToDocId.get(sha256);
    return docId ? this.documents.get(docId) : undefined;
  }

  public getDocumentByPath(originalPath: string): RegisteredDocument | undefined {
    for (const doc of this.documents.values()) {
      if (doc.originalPath === originalPath) return doc;
    }
    return undefined;
  }

  public getAllDocuments(): RegisteredDocument[] {
    return Array.from(this.documents.values());
  }

  public deleteDocument(documentId: string): boolean {
    const doc = this.documents.get(documentId);
    if (!doc) return false;

    if (doc.sha256) {
      this.hashToDocId.delete(doc.sha256);
    }
    this.documents.delete(documentId);
    this.saveToDisk();
    return true;
  }

  public logBatch(record: IngestionBatchRecord): void {
    this.history.unshift(record); // prepend latest
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
    }
    this.saveToDisk();
  }

  public getHistory(): IngestionBatchRecord[] {
    return this.history;
  }
}

export const documentRegistry = new DocumentRegistry();
