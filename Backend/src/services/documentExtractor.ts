// Backend/src/services/documentExtractor.ts
// Robust document text extractor for PDF, DOCX, TXT, Markdown, and JSON with OCR detection

import path from 'node:path';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractionResult {
  success: boolean;
  text: string;
  pages: ExtractedPage[];
  pageCount: number;
  fileType: 'pdf' | 'docx' | 'txt' | 'md' | 'json';
  characterCount: number;
  needsOcr: boolean;
  errorMessage?: string;
}

export class DocumentExtractor {
  /**
   * Determine supported file extension
   */
  public getFileType(fileName: string): 'pdf' | 'docx' | 'txt' | 'md' | 'json' | 'unsupported' {
    const ext = path.extname(fileName).toLowerCase();
    switch (ext) {
      case '.pdf':
        return 'pdf';
      case '.docx':
        return 'docx';
      case '.txt':
        return 'txt';
      case '.md':
      case '.markdown':
        return 'md';
      case '.json':
        return 'json';
      default:
        return 'unsupported';
    }
  }

  /**
   * Extract text and page metadata from binary or string buffer
   */
  public async extract(fileName: string, buffer: Buffer): Promise<ExtractionResult> {
    const fileType = this.getFileType(fileName);
    if (fileType === 'unsupported') {
      return {
        success: false,
        text: '',
        pages: [],
        pageCount: 0,
        fileType: 'txt',
        characterCount: 0,
        needsOcr: false,
        errorMessage: `Unsupported file type "${path.extname(fileName)}". Supported formats: PDF, DOCX, TXT, MD, JSON.`,
      };
    }

    try {
      switch (fileType) {
        case 'pdf':
          return await this.extractPdf(buffer);
        case 'docx':
          return await this.extractDocx(buffer);
        case 'md':
        case 'txt':
          return this.extractPlainText(buffer, fileType);
        case 'json':
          return this.extractJson(buffer);
      }
    } catch (err: any) {
      return {
        success: false,
        text: '',
        pages: [],
        pageCount: 0,
        fileType,
        characterCount: 0,
        needsOcr: false,
        errorMessage: `Text extraction failed for "${fileName}": ${err?.message || String(err)}`,
      };
    }
  }

  /**
   * Extract text from PDF using PDFParse with page tracking and OCR detection
   */
  private async extractPdf(buffer: Buffer): Promise<ExtractionResult> {
    try {
      const uint8 = new Uint8Array(buffer);
      const parser = new PDFParse({ data: uint8 });
      await parser.load();

      const textRes = await parser.getText();
      const rawText = textRes.text || '';
      const trimmedText = rawText.trim();

      // Detect scanned PDF with no digital text layer
      if (trimmedText.length < 25) {
        const pageCount = Array.isArray(textRes.pages) ? textRes.pages.length : 1;
        return {
          success: false,
          text: '',
          pages: [],
          pageCount,
          fileType: 'pdf',
          characterCount: 0,
          needsOcr: true,
          errorMessage: 'This PDF contains no extractable text layer (appears to be a scanned document or bitmap image). Optical Character Recognition (OCR) is required.',
        };
      }

      // Preserve per-page text
      const pages: ExtractedPage[] = [];
      if (Array.isArray(textRes.pages) && textRes.pages.length > 0) {
        textRes.pages.forEach((p: any, idx: number) => {
          const pageNum = typeof p.num === 'number' ? p.num : idx + 1;
          const pageText = typeof p.text === 'string' ? p.text.trim() : '';
          pages.push({ pageNumber: pageNum, text: pageText });
        });
      } else {
        pages.push({ pageNumber: 1, text: trimmedText });
      }

      return {
        success: true,
        text: trimmedText,
        pages,
        pageCount: pages.length,
        fileType: 'pdf',
        characterCount: trimmedText.length,
        needsOcr: false,
      };
    } catch (err: any) {
      return {
        success: false,
        text: '',
        pages: [],
        pageCount: 0,
        fileType: 'pdf',
        characterCount: 0,
        needsOcr: false,
        errorMessage: `PDF extraction error: ${err?.message || String(err)}`,
      };
    }
  }

  /**
   * Extract text from Microsoft Word (.docx) files using mammoth
   */
  private async extractDocx(buffer: Buffer): Promise<ExtractionResult> {
    const result = await mammoth.extractRawText({ buffer });
    const text = (result.value || '').trim();

    if (text.length < 10) {
      return {
        success: false,
        text: '',
        pages: [],
        pageCount: 0,
        fileType: 'docx',
        characterCount: 0,
        needsOcr: false,
        errorMessage: 'DOCX document contains no readable text content.',
      };
    }

    return {
      success: true,
      text,
      pages: [{ pageNumber: 1, text }],
      pageCount: 1,
      fileType: 'docx',
      characterCount: text.length,
      needsOcr: false,
    };
  }

  /**
   * Extract plain text and markdown
   */
  private extractPlainText(buffer: Buffer, fileType: 'txt' | 'md'): ExtractionResult {
    const text = buffer.toString('utf-8').trim();
    if (text.length === 0) {
      return {
        success: false,
        text: '',
        pages: [],
        pageCount: 0,
        fileType,
        characterCount: 0,
        needsOcr: false,
        errorMessage: 'Document is completely empty.',
      };
    }

    // Rough page estimate (300 words / ~1800 chars per standard printed page)
    const pageCount = Math.max(1, Math.ceil(text.length / 1800));
    const pages: ExtractedPage[] = [];

    // Split roughly by page chunks for reference
    for (let i = 0; i < pageCount; i++) {
      const slice = text.slice(i * 1800, (i + 1) * 1800);
      pages.push({ pageNumber: i + 1, text: slice });
    }

    return {
      success: true,
      text,
      pages,
      pageCount,
      fileType,
      characterCount: text.length,
      needsOcr: false,
    };
  }

  /**
   * Extract text from JSON documents
   */
  private extractJson(buffer: Buffer): ExtractionResult {
    const raw = buffer.toString('utf-8');
    try {
      const parsed = JSON.parse(raw);
      const textParts: string[] = [];

      const walk = (obj: any) => {
        if (!obj) return;
        if (typeof obj === 'string') {
          textParts.push(obj);
        } else if (Array.isArray(obj)) {
          obj.forEach(walk);
        } else if (typeof obj === 'object') {
          Object.values(obj).forEach(walk);
        }
      };

      walk(parsed);
      const combined = textParts.join('\n\n').trim();

      return {
        success: true,
        text: combined || raw,
        pages: [{ pageNumber: 1, text: combined || raw }],
        pageCount: 1,
        fileType: 'json',
        characterCount: (combined || raw).length,
        needsOcr: false,
      };
    } catch {
      return {
        success: false,
        text: '',
        pages: [],
        pageCount: 0,
        fileType: 'json',
        characterCount: 0,
        needsOcr: false,
        errorMessage: 'Invalid JSON syntax.',
      };
    }
  }
}

export const documentExtractor = new DocumentExtractor();
