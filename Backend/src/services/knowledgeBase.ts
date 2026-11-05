import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import type { KnowledgeChunk, SourceCitation } from '../types/graph.ts';
import { OKF_PROCESSES } from '../data/museumData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to authoritative OKF markdown folder
const OKF_DIR = path.resolve(__dirname, '../../knowledge_base/04_okf/processes');

export interface ProcessDocument {
  id: string;
  title: string;
  nativeTerm: string;
  documentId: string;
  filePath: string;
  frontmatter: Record<string, any>;
  rawMarkdown: string;
  bodyText: string;
  chunks: KnowledgeChunk[];
  toolsUsed: string[];
  keySteps: string[];
  sha256: string;
}

class KnowledgeBaseService {
  private processesMap: Map<string, ProcessDocument> = new Map();
  private allChunks: KnowledgeChunk[] = [];
  private isLoaded = false;

  constructor() {
    this.loadKnowledgeBase();
  }

  /**
   * Load and chunk all 9 OKF processes with full provenance
   */
  public loadKnowledgeBase(): void {
    this.processesMap.clear();
    this.allChunks = [];

    // 1. Try reading directly from filesystem
    let fileLoadedCount = 0;
    if (fs.existsSync(OKF_DIR)) {
      try {
        const files = fs.readdirSync(OKF_DIR).filter(f => f.endsWith('.md') && f !== 'index.md');
        for (const file of files) {
          const fullPath = path.join(OKF_DIR, file);
          const rawContent = fs.readFileSync(fullPath, 'utf-8');
          const processId = file.replace('.md', '');
          const parsed = this.parseMarkdownFile(processId, file, fullPath, rawContent);
          this.processesMap.set(processId, parsed);
          this.allChunks.push(...parsed.chunks);
          fileLoadedCount++;
        }
      } catch (err) {
        console.warn('[KnowledgeBase] Notice reading OKF directory:', err);
      }
    }

    // 2. Fallback / supplement from authoritative museumData if filesystem not accessible
    if (fileLoadedCount === 0 || this.processesMap.size === 0) {
      for (const okf of OKF_PROCESSES) {
        const parsed = this.convertOKFProcessToDoc(okf);
        this.processesMap.set(okf.id, parsed);
        this.allChunks.push(...parsed.chunks);
      }
    }

    this.isLoaded = true;
  }

  private parseMarkdownFile(processId: string, fileName: string, filePath: string, raw: string): ProcessDocument {
    const sha256 = crypto.createHash('sha256').update(raw).digest('hex');
    const frontmatterMatch = raw.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);

    const frontmatter: Record<string, any> = {};
    let body = raw;

    if (frontmatterMatch) {
      const yamlStr = frontmatterMatch[1];
      body = frontmatterMatch[2].trim();

      yamlStr.split('\n').forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0) {
          const k = line.slice(0, colonIdx).trim();
          const v = line.slice(colonIdx + 1).trim();
          if (k && v) {
            frontmatter[k] = v.replace(/^['"]|['"]$/g, '');
          }
        }
      });
    }

    const fallbackOKF = OKF_PROCESSES.find(p => p.id === processId);
    const title = frontmatter.title || fallbackOKF?.title || processId;
    const nativeTerm = fallbackOKF?.nativeTerm || '';
    const documentId = frontmatter.document_id || fallbackOKF?.documentId || `doc-${processId}`;
    const toolsUsed = fallbackOKF?.toolsUsed || [];
    const keySteps = fallbackOKF?.keySteps || [];

    // Semantic chunking: split body by paragraphs or sections
    const paragraphs = body
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 25);

    const chunks: KnowledgeChunk[] = paragraphs.map((para, idx) => ({
      chunkId: `${processId}_chunk_${String(idx + 1).padStart(2, '0')}`,
      documentId,
      documentName: fileName,
      filePath,
      processId,
      processName: title,
      sectionHeading: para.startsWith('#') ? para.split('\n')[0].replace(/^#+\s*/, '') : `${title} Mechanics`,
      text: para.replace(/^#+\s*.*?\n/, '').trim() || para,
      sha256: crypto.createHash('sha256').update(para).digest('hex'),
      tokensEstimate: Math.ceil(para.split(/\s+/).length * 1.3),
      verificationStatus: 'human_verified',
      ingestionTimestamp: Date.now(),
    }));

    // If body had no large paragraphs, create a single chunk
    if (chunks.length === 0) {
      chunks.push({
        chunkId: `${processId}_chunk_01`,
        documentId,
        documentName: fileName,
        filePath,
        processId,
        processName: title,
        sectionHeading: `${title} Overview`,
        text: body || fallbackOKF?.content || '',
        sha256,
        tokensEstimate: Math.ceil(body.split(/\s+/).length * 1.3),
        verificationStatus: 'human_verified',
        ingestionTimestamp: Date.now(),
      });
    }

    return {
      id: processId,
      title,
      nativeTerm,
      documentId,
      filePath,
      frontmatter,
      rawMarkdown: raw,
      bodyText: body,
      chunks,
      toolsUsed,
      keySteps,
      sha256,
    };
  }

  private convertOKFProcessToDoc(okf: (typeof OKF_PROCESSES)[0]): ProcessDocument {
    const raw = `---
type: ${okf.type}
title: ${okf.title}
document_id: ${okf.documentId}
native_term: ${okf.nativeTerm || ''}
status: ${okf.status}
---

# ${okf.title} (${okf.nativeTerm || ''})

${okf.content}
`;
    const sha256 = crypto.createHash('sha256').update(raw).digest('hex');

    const chunks: KnowledgeChunk[] = [
      {
        chunkId: `${okf.id}_chunk_01`,
        documentId: okf.documentId,
        documentName: `${okf.id}.md`,
        filePath: `knowledge_base/04_okf/processes/${okf.id}.md`,
        processId: okf.id,
        processName: okf.title,
        sectionHeading: `${okf.title} Technical Mechanics`,
        text: okf.content,
        sha256,
        tokensEstimate: Math.ceil(okf.content.split(/\s+/).length * 1.3),
        verificationStatus: 'human_verified',
        ingestionTimestamp: Date.now(),
      },
    ];

    return {
      id: okf.id,
      title: okf.title,
      nativeTerm: okf.nativeTerm || '',
      documentId: okf.documentId,
      filePath: `knowledge_base/04_okf/processes/${okf.id}.md`,
      frontmatter: {
        type: okf.type,
        title: okf.title,
        document_id: okf.documentId,
      },
      rawMarkdown: raw,
      bodyText: okf.content,
      chunks,
      toolsUsed: okf.toolsUsed,
      keySteps: okf.keySteps,
      sha256,
    };
  }

  public getAllProcesses(): ProcessDocument[] {
    if (!this.isLoaded) this.loadKnowledgeBase();
    return Array.from(this.processesMap.values());
  }

  public getProcessById(id: string): ProcessDocument | undefined {
    if (!this.isLoaded) this.loadKnowledgeBase();
    return this.processesMap.get(id.toLowerCase());
  }

  public getAllChunks(): KnowledgeChunk[] {
    if (!this.isLoaded) this.loadKnowledgeBase();
    return this.allChunks;
  }

  public addChunks(chunks: KnowledgeChunk[]): void {
    if (!this.isLoaded) this.loadKnowledgeBase();
    this.allChunks.push(...chunks);
  }

  /**
   * Document-level keyword & semantic similarity retrieval
   */
  public queryDocumentChunks(query: string, topK = 5): { chunk: KnowledgeChunk; score: number }[] {
    if (!this.isLoaded) this.loadKnowledgeBase();

    const lowerQuery = query.toLowerCase();
    const queryTokens = lowerQuery.split(/\W+/).filter(t => t.length > 2);

    const scored = this.allChunks.map(chunk => {
      let score = 0;
      const titleNorm = chunk.processName.toLowerCase();
      const textNorm = chunk.text.toLowerCase();
      const headingNorm = chunk.sectionHeading.toLowerCase();

      // Exact title match bonus
      if (lowerQuery.includes(titleNorm)) score += 6.0;
      if (lowerQuery.includes(chunk.processId)) score += 5.0;

      // Token overlap
      queryTokens.forEach(token => {
        if (titleNorm.includes(token)) score += 3.5;
        if (headingNorm.includes(token)) score += 2.5;

        const count = textNorm.split(token).length - 1;
        if (count > 0) {
          score += Math.min(count, 4) * 0.9;
        }
      });

      // Domain terminology associations
      if (chunk.processId === 'ginning' && (lowerQuery.includes('seed') || lowerQuery.includes('dirt') || lowerQuery.includes('cleaned') || lowerQuery.includes('neotha'))) {
        score += 5.0;
      }
      if (chunk.processId === 'spinning' && (lowerQuery.includes('yarn') || lowerQuery.includes('spun') || lowerQuery.includes('zenther') || lowerQuery.includes('takhri'))) {
        score += 5.0;
      }
      if (chunk.processId === 'reeling' && (lowerQuery.includes('cocoon') || lowerQuery.includes('steamed') || lowerQuery.includes('tharai') || lowerQuery.includes('boiled'))) {
        score += 5.0;
      }
      if (chunk.processId === 'sizing' && (lowerQuery.includes('rice powder') || lowerQuery.includes('wheat flour') || lowerQuery.includes('coated') || lowerQuery.includes('maidi') || lowerQuery.includes('maad'))) {
        score += 5.5;
      }
      if (chunk.processId === 'winding' && (lowerQuery.includes('bobbin') || lowerQuery.includes('pirn') || lowerQuery.includes('swrkhi') || lowerQuery.includes('transferred'))) {
        score += 5.0;
      }
      if (chunk.processId === 'warping' && (lowerQuery.includes('bobbins') || lowerQuery.includes('creel') || lowerQuery.includes('gandwi') || lowerQuery.includes('lease'))) {
        score += 5.0;
      }
      if (chunk.processId === 'beaming' && (lowerQuery.includes('beam') || lowerQuery.includes('groove') || lowerQuery.includes('phannai') || lowerQuery.includes('warp sheet'))) {
        score += 5.0;
      }
      if (chunk.processId === 'looming' && (lowerQuery.includes('baleb') || lowerQuery.includes('drafting') || lowerQuery.includes('denting') || lowerQuery.includes('nw khonnai') || lowerQuery.includes('posts on the floor'))) {
        score += 5.5;
      }
      if (chunk.processId === 'weaving' && (lowerQuery.includes('sal') || lowerQuery.includes('shuttle') || lowerQuery.includes('days') || lowerQuery.includes('long does') || lowerQuery.includes('motion') || lowerQuery.includes('heald bar'))) {
        score += 5.0;
      }

      return {
        chunk,
        score: Math.round(score * 10) / 10,
      };
    });

    return scored
      .filter(item => item.score > 0.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
