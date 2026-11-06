// Backend/src/services/ingestion.ts
// Complete Document Ingestion Pipeline with Persistent Vector Store & Hybrid GraphRAG Integration

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { documentExtractor, type ExtractionResult } from './documentExtractor.ts';
import { embeddingService } from './embeddingService.ts';
import { persistentVectorStore, type VectorRecord } from './vectorStore.ts';
import { documentRegistry, type RegisteredDocument, type IngestionBatchRecord } from './documentRegistry.ts';
import { graphStore } from './graphStore.ts';
import { knowledgeBaseService } from './knowledgeBase.ts';
import type { KnowledgeChunk, GraphNode } from '../types/graph.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KB_DIR = path.resolve(__dirname, '../../knowledge_base');
const RAW_DATA_DIR = path.join(KB_DIR, '01_raw_data');
const PROCESSED_TEXT_DIR = path.join(KB_DIR, '02_processed_data/extracted_text');
const REPORTS_DIR = path.join(KB_DIR, '02_processed_data/processing_reports');
const CHUNKS_DIR = path.join(KB_DIR, '03_chunks');
const OKF_DIR = path.join(KB_DIR, '04_okf/processes');

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export interface SingleIngestionResult {
  success: boolean;
  documentId: string;
  fileName: string;
  fileType: string;
  category: string;
  fileHash: string;
  status: 'indexed' | 'skipped_duplicate' | 'error' | 'ocr_required';
  isDuplicate: boolean;
  needsOcr: boolean;
  chunksCount: number;
  vectorsCount: number;
  entitiesExtracted: number;
  pageCount?: number;
  message: string;
  errorMessage?: string;
}

export interface BulkIngestionResult {
  success: boolean;
  batchId: string;
  filesScanned: number;
  filesProcessed: number;
  filesSkipped: number;
  filesFailed: number;
  totalChunksCreated: number;
  totalVectorsStored: number;
  durationMs: number;
  results: SingleIngestionResult[];
}

export class IngestionPipeline {
  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    const dirs = [
      RAW_DATA_DIR,
      path.join(RAW_DATA_DIR, 'handloom'),
      path.join(RAW_DATA_DIR, 'natural_dyeing'),
      path.join(RAW_DATA_DIR, 'motifs'),
      path.join(RAW_DATA_DIR, 'oral_history'),
      path.join(RAW_DATA_DIR, 'research_papers'),
      path.join(RAW_DATA_DIR, 'field_notes'),
      PROCESSED_TEXT_DIR,
      REPORTS_DIR,
      CHUNKS_DIR,
      OKF_DIR,
    ];
    for (const d of dirs) {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    }
  }

  /**
   * Method A: Ingest single document from website upload or API
   */
  public async ingestUploadedFile(
    fileName: string,
    fileBuffer: Buffer,
    category = 'research_papers',
    targetSubfolder?: string
  ): Promise<SingleIngestionResult> {
    const t0 = Date.now();

    // 1. Validate File Size
    if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        documentId: '',
        fileName,
        fileType: path.extname(fileName).slice(1),
        category,
        fileHash: '',
        status: 'error',
        isDuplicate: false,
        needsOcr: false,
        chunksCount: 0,
        vectorsCount: 0,
        entitiesExtracted: 0,
        message: `File exceeds maximum allowed size of 25MB (${(fileBuffer.length / (1024 * 1024)).toFixed(1)}MB).`,
        errorMessage: 'File size limit exceeded',
      };
    }

    // 2. Compute SHA-256 Hash
    const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // 3. Duplicate Detection
    const existingDoc = documentRegistry.getDocumentByHash(sha256);
    if (existingDoc && existingDoc.status === 'indexed') {
      return {
        success: true,
        documentId: existingDoc.documentId,
        fileName,
        fileType: existingDoc.fileType,
        category: existingDoc.category,
        fileHash: sha256,
        status: 'skipped_duplicate',
        isDuplicate: true,
        needsOcr: false,
        chunksCount: existingDoc.chunksCount,
        vectorsCount: existingDoc.embeddingsCount,
        entitiesExtracted: existingDoc.entitiesExtractedCount,
        pageCount: existingDoc.pageCount,
        message: `File "${fileName}" already exists in the verified knowledge base (matching SHA-256 hash). Skipped duplicate re-ingestion.`,
      };
    }

    // 4. Save Original Source Document to 01_raw_data/<category>/
    const subDir = targetSubfolder || category;
    const destDir = path.join(RAW_DATA_DIR, subDir);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const savedPath = path.join(destDir, fileName);
    fs.writeFileSync(savedPath, fileBuffer);

    // 5. Text Extraction
    const extraction: ExtractionResult = await documentExtractor.extract(fileName, fileBuffer);

    // Handle Scanned PDF requiring OCR
    if (extraction.needsOcr) {
      const docId = `doc-${crypto.randomUUID()}`;
      documentRegistry.registerDocument({
        documentId: docId,
        fileName,
        originalPath: path.relative(KB_DIR, savedPath),
        fileType: extraction.fileType,
        sha256,
        category,
        fileSize: fileBuffer.length,
        pageCount: extraction.pageCount,
        ingestedAt: Date.now(),
        status: 'ocr_required',
        extractionStatus: 'empty_text_ocr_required',
        chunksCount: 0,
        embeddingsCount: 0,
        entitiesExtractedCount: 0,
        indexingVersion: '1.0.0',
        errorMessage: extraction.errorMessage,
      });

      return {
        success: false,
        documentId: docId,
        fileName,
        fileType: extraction.fileType,
        category,
        fileHash: sha256,
        status: 'ocr_required',
        isDuplicate: false,
        needsOcr: true,
        chunksCount: 0,
        vectorsCount: 0,
        entitiesExtracted: 0,
        pageCount: extraction.pageCount,
        message: 'This PDF contains no extractable text layer (appears to be a scanned document or bitmap image). OCR processing is required.',
        errorMessage: extraction.errorMessage,
      };
    }

    if (!extraction.success) {
      return {
        success: false,
        documentId: '',
        fileName,
        fileType: extraction.fileType,
        category,
        fileHash: sha256,
        status: 'error',
        isDuplicate: false,
        needsOcr: false,
        chunksCount: 0,
        vectorsCount: 0,
        entitiesExtracted: 0,
        message: extraction.errorMessage || 'Failed to extract text from document.',
        errorMessage: extraction.errorMessage,
      };
    }

    // 6. Save Extracted Text in 02_processed_data/extracted_text/
    const docId = `doc-${crypto.randomUUID()}`;
    const extractedTextFile = path.join(PROCESSED_TEXT_DIR, `${docId}.txt`);
    fs.writeFileSync(extractedTextFile, extraction.text, 'utf-8');

    // 7. Meaningful Semantic Chunking
    const chunks = this.createChunks(docId, fileName, savedPath, category, extraction);

    // 8. Generate 384-dimensional Dense Vector Embeddings
    const textsToEmbed = chunks.map(c => `${c.sectionHeading}\n${c.text}`);
    const vectors = await embeddingService.embedBatch(textsToEmbed);

    const vectorRecords: VectorRecord[] = chunks.map((c, i) => ({
      chunkId: c.chunkId,
      documentId: c.documentId,
      fileName: c.documentName,
      sourcePath: c.filePath,
      category,
      sectionTitle: c.sectionHeading,
      pageNumber: c.pageNumber,
      content: c.text,
      contentHash: c.sha256,
      tokensEstimate: c.tokensEstimate,
      ingestionTimestamp: c.ingestionTimestamp || Date.now(),
      vector: vectors[i],
      metadata: {
        processId: c.processId,
        processName: c.processName,
      },
    }));

    // 9. Persist in Vector Store
    persistentVectorStore.addVectors(vectorRecords);

    // 10. Register Chunks in KnowledgeBaseService for immediate retrieval
    knowledgeBaseService.addChunks(chunks);

    // 11. Save Chunks JSON artifact in 03_chunks/
    const chunksArtifactFile = path.join(CHUNKS_DIR, `${docId}_chunks.json`);
    fs.writeFileSync(chunksArtifactFile, JSON.stringify(chunks, null, 2), 'utf-8');

    // 12. Candidate Entity Extraction (Preserving human_verified rule)
    const entities = this.extractCandidateEntities(docId, fileName, extraction.text);
    for (const ent of entities) {
      graphStore.addNode(ent);
    }

    // 13. Register in Persistent Document Registry
    const regDoc: RegisteredDocument = {
      documentId: docId,
      fileName,
      originalPath: path.relative(KB_DIR, savedPath),
      fileType: extraction.fileType,
      sha256,
      category,
      fileSize: fileBuffer.length,
      pageCount: extraction.pageCount,
      ingestedAt: Date.now(),
      status: 'indexed',
      extractionStatus: 'success',
      chunksCount: chunks.length,
      embeddingsCount: vectorRecords.length,
      entitiesExtractedCount: entities.length,
      indexingVersion: '1.0.0',
    };
    documentRegistry.registerDocument(regDoc);

    const duration = Date.now() - t0;
    console.log(`[IngestionPipeline] Document "${fileName}" indexed in ${duration}ms (${chunks.length} chunks, ${vectorRecords.length} vectors).`);

    return {
      success: true,
      documentId: docId,
      fileName,
      fileType: extraction.fileType,
      category,
      fileHash: sha256,
      status: 'indexed',
      isDuplicate: false,
      needsOcr: false,
      chunksCount: chunks.length,
      vectorsCount: vectorRecords.length,
      entitiesExtracted: entities.length,
      pageCount: extraction.pageCount,
      message: `Document "${fileName}" successfully processed into ${chunks.length} chunks and ${vectorRecords.length} vectors.`,
    };
  }

  /**
   * Method B: Bulk Folder Ingestion
   * Recursively scans 01_raw_data/ and 04_okf/processes/, discovers new & modified files, skips unchanged
   */
  public async bulkIngestFolders(): Promise<BulkIngestionResult> {
    const t0 = Date.now();
    const batchId = `batch-${Date.now()}`;
    const results: SingleIngestionResult[] = [];

    // 1. Gather all candidate file paths recursively
    const rawFiles = this.findSupportedFilesRecursive(RAW_DATA_DIR);
    const okfFiles = this.findSupportedFilesRecursive(OKF_DIR);
    const allFiles = [...rawFiles, ...okfFiles];

    let processedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    let totalChunks = 0;
    let totalVectors = 0;

    for (const filePath of allFiles) {
      const fileName = path.basename(filePath);
      const buffer = fs.readFileSync(filePath);
      const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

      // Determine category from relative subfolder
      const relDir = path.relative(RAW_DATA_DIR, path.dirname(filePath));
      const category = relDir && !relDir.startsWith('..') ? relDir : 'general_heritage';

      // Check if unchanged
      const existing = documentRegistry.getDocumentByHash(sha256);
      if (existing && existing.status === 'indexed') {
        skippedCount++;
        results.push({
          success: true,
          documentId: existing.documentId,
          fileName,
          fileType: existing.fileType,
          category: existing.category,
          fileHash: sha256,
          status: 'skipped_duplicate',
          isDuplicate: true,
          needsOcr: false,
          chunksCount: existing.chunksCount,
          vectorsCount: existing.embeddingsCount,
          entitiesExtracted: existing.entitiesExtractedCount,
          pageCount: existing.pageCount,
          message: `Unchanged: "${fileName}" (SHA-256 match). Skipped.`,
        });
        continue;
      }

      // If document was modified (same relative path, but different hash), clear old vectors
      const existingByPath = documentRegistry.getDocumentByPath(path.relative(KB_DIR, filePath));
      if (existingByPath && existingByPath.sha256 !== sha256) {
        persistentVectorStore.deleteByDocumentId(existingByPath.documentId);
        documentRegistry.deleteDocument(existingByPath.documentId);
        console.log(`[IngestionPipeline] Detected modification in "${fileName}". Cleared stale index records.`);
      }

      // Ingest
      try {
        const singleRes = await this.ingestUploadedFile(fileName, buffer, category, path.dirname(filePath));
        results.push(singleRes);

        if (singleRes.success && singleRes.status === 'indexed') {
          processedCount++;
          totalChunks += singleRes.chunksCount;
          totalVectors += singleRes.vectorsCount;
        } else if (singleRes.status === 'skipped_duplicate') {
          skippedCount++;
        } else {
          failedCount++;
        }
      } catch (err: any) {
        failedCount++;
        results.push({
          success: false,
          documentId: '',
          fileName,
          fileType: path.extname(fileName).slice(1),
          category,
          fileHash: sha256,
          status: 'error',
          isDuplicate: false,
          needsOcr: false,
          chunksCount: 0,
          vectorsCount: 0,
          entitiesExtracted: 0,
          message: `Ingestion failed: ${err?.message || String(err)}`,
          errorMessage: err?.message,
        });
      }
    }

    const durationMs = Date.now() - t0;

    // Log Batch Record
    const batchRecord: IngestionBatchRecord = {
      batchId,
      triggerType: 'bulk_folder',
      timestamp: Date.now(),
      filesProcessed: processedCount,
      filesSkipped: skippedCount,
      filesFailed: failedCount,
      totalChunks,
      totalVectors,
      durationMs,
      details: results.map(r => `${r.fileName}: ${r.status} (${r.chunksCount} chunks)`),
    };
    documentRegistry.logBatch(batchRecord);

    // Save report in 02_processed_data/processing_reports/
    const reportPath = path.join(REPORTS_DIR, `${batchId}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(batchRecord, null, 2), 'utf-8');

    return {
      success: true,
      batchId,
      filesScanned: allFiles.length,
      filesProcessed: processedCount,
      filesSkipped: skippedCount,
      filesFailed: failedCount,
      totalChunksCreated: totalChunks,
      totalVectorsStored: totalVectors,
      durationMs,
      results,
    };
  }

  /**
   * Reindex all documents from scratch
   */
  public async reindexAll(): Promise<BulkIngestionResult> {
    console.log('[IngestionPipeline] Starting complete Knowledge Base reindex...');
    persistentVectorStore.clear();
    documentRegistry.loadFromDisk();
    return this.bulkIngestFolders();
  }

  /**
   * Create meaningful, heading-aware semantic chunks preserving page references and metadata
   */
  private createChunks(
    documentId: string,
    fileName: string,
    filePath: string,
    category: string,
    extraction: ExtractionResult
  ): KnowledgeChunk[] {
    const chunks: KnowledgeChunk[] = [];
    const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    // If page-level information is available, chunk page-by-page and heading-by-heading
    if (extraction.pages.length > 0) {
      let chunkSeq = 1;

      for (const page of extraction.pages) {
        const pageText = page.text.trim();
        if (!pageText) continue;

        // Split by section headers or double newlines
        const sections = this.splitIntoSections(pageText);

        for (const sec of sections) {
          if (sec.content.length < 25) continue;

          const chunkId = `${documentId}_p${page.pageNumber}_c${String(chunkSeq++).padStart(2, '0')}`;
          const tokensEstimate = Math.ceil(sec.content.split(/\s+/).length * 1.3);

          chunks.push({
            chunkId,
            documentId,
            documentName: fileName,
            filePath: path.relative(KB_DIR, filePath),
            processId: baseName.toLowerCase().replace(/\s+/g, '_'),
            processName: baseName,
            sectionHeading: sec.heading || `Page ${page.pageNumber} · Section ${chunkSeq - 1}`,
            text: sec.content,
            sha256: crypto.createHash('sha256').update(sec.content).digest('hex'),
            tokensEstimate,
            pageNumber: page.pageNumber,
            verificationStatus: 'pending',
            ingestionTimestamp: Date.now(),
          });
        }
      }
    }

    // Fallback if pages resulted in 0 chunks
    if (chunks.length === 0) {
      const paragraphs = extraction.text.split(/\n\s*\n/).filter(p => p.trim().length > 25);
      paragraphs.forEach((para, idx) => {
        const chunkId = `${documentId}_chunk_${String(idx + 1).padStart(2, '0')}`;
        chunks.push({
          chunkId,
          documentId,
          documentName: fileName,
          filePath: path.relative(KB_DIR, filePath),
          processId: baseName.toLowerCase().replace(/\s+/g, '_'),
          processName: baseName,
          sectionHeading: `Section ${idx + 1}`,
          text: para.trim(),
          sha256: crypto.createHash('sha256').update(para).digest('hex'),
          tokensEstimate: Math.ceil(para.split(/\s+/).length * 1.3),
          pageNumber: 1,
          verificationStatus: 'pending',
          ingestionTimestamp: Date.now(),
        });
      });
    }

    return chunks;
  }

  /**
   * Helper to split text by headings (e.g. "1. Ginning", "### Section", etc.)
   */
  private splitIntoSections(text: string): { heading: string; content: string }[] {
    const lines = text.split('\n');
    const sections: { heading: string; content: string }[] = [];

    let currentHeading = '';
    let currentLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      // Match markdown headers (# Header) or numbered steps (1. Step) or all-caps short titles
      const isHeader =
        /^#{1,4}\s+.+/.test(trimmed) ||
        /^\d+\.\s+[A-Z].+/.test(trimmed) ||
        (/^[A-Z\s]{4,35}$/.test(trimmed) && trimmed.length < 35);

      if (isHeader) {
        if (currentLines.length > 0) {
          sections.push({
            heading: currentHeading || 'Introduction',
            content: currentLines.join('\n').trim(),
          });
          currentLines = [];
        }
        currentHeading = trimmed.replace(/^#{1,4}\s*/, '');
      } else {
        currentLines.push(line);
      }
    }

    if (currentLines.length > 0) {
      sections.push({
        heading: currentHeading || 'Main Content',
        content: currentLines.join('\n').trim(),
      });
    }

    return sections;
  }

  /**
   * Helper to find all supported files recursively in a directory
   */
  private findSupportedFilesRecursive(dir: string): string[] {
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        results.push(...this.findSupportedFilesRecursive(fullPath));
      } else if (item.isFile()) {
        const type = documentExtractor.getFileType(item.name);
        if (type !== 'unsupported' && item.name !== 'index.md') {
          results.push(fullPath);
        }
      }
    }
    return results;
  }

  /**
   * Extract candidate Bodo cultural entities (marked with 'pending' verification status)
   */
  private extractCandidateEntities(documentId: string, fileName: string, text: string): GraphNode[] {
    const lower = text.toLowerCase();
    const candidateEntities: GraphNode[] = [];

    const bodoDomainKeywords = [
      { name: 'Neotha', type: 'Tool' as const, native: 'Zenther roller' },
      { name: 'Zenther', type: 'Tool' as const, native: 'Spinning apparatus' },
      { name: 'Takhri', type: 'Tool' as const, native: 'Drop Spindle' },
      { name: 'Chwrkhi', type: 'Tool' as const, native: 'Spinning Wheel' },
      { name: 'Khabang', type: 'Tool' as const, native: 'Bobbin / Pirn' },
      { name: 'Gandwi', type: 'Tool' as const, native: 'Warp Roller' },
      { name: 'Baleb', type: 'Tool' as const, native: 'Heald Loops' },
      { name: 'Rashw', type: 'Tool' as const, native: 'Reed Batten' },
      { name: 'Maku', type: 'Tool' as const, native: 'Boat Shuttle' },
      { name: 'Chontha', type: 'Tool' as const, native: 'Weaving Sword' },
      { name: 'Sal', type: 'Tool' as const, native: 'Throw-Shuttle Loom' },
      { name: 'Thati Sal', type: 'Tool' as const, native: 'Fly-Shuttle Loom' },
      { name: 'Maad', type: 'Material' as const, native: 'Rice starch paste' },
      { name: 'Eri Silk', type: 'Material' as const, native: 'Ahimsa peace silk' },
      { name: 'Hajw Agor', type: 'Textile' as const, native: 'Mountain peak motif' },
      { name: 'Daorai Mwkhrwb', type: 'Textile' as const, native: 'Peacock eye motif' },
      { name: 'Dokhona', type: 'Textile' as const, native: 'Traditional Bodo dress' },
      { name: 'Aronai', type: 'Textile' as const, native: 'Ceremonial scarf' },
    ];

    bodoDomainKeywords.forEach(kw => {
      if (lower.includes(kw.name.toLowerCase())) {
        const nodeId = `uploaded_${kw.name.toLowerCase().replace(/\s+/g, '_')}`;
        candidateEntities.push({
          id: nodeId,
          type: kw.type,
          name: kw.name,
          nativeName: kw.native,
          properties: { sourceFile: fileName },
          verificationStatus: 'pending', // Pending verification per strict grounding rule
          sourceDocumentId: documentId,
          evidenceText: `Extracted from uploaded document ${fileName}`,
          createdAt: Date.now(),
        });
      }
    });

    return candidateEntities;
  }
}

export const ingestionPipeline = new IngestionPipeline();
