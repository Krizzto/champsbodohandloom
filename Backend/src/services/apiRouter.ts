import http from 'node:http';
import { docentEngine } from './docentEngine.ts';
import { knowledgeBaseService } from './knowledgeBase.ts';
import { benchmarkService } from './benchmarkService.ts';
import { ingestionPipeline } from './ingestion.ts';
import type { ExpertiseLevel } from '../types/graph.ts';

/**
 * Parses JSON body from incoming Node.js HTTP request
 */
export async function parseJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Cap at 10MB to prevent memory exhaustion
      if (body.length > 10 * 1024 * 1024) {
        reject(new Error('Request payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Malformed JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: http.ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache',
  });
  res.end(JSON.stringify(data));
}

/**
 * Handle API requests for Bodo Heritage Knowledge Base & GraphRAG Docent
 * Returns true if the route was matched and handled, false otherwise.
 */
export async function handleBackendApiRoutes(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  pathname: string
): Promise<boolean> {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return true;
  }

  // 1. POST /api/chat
  if (pathname === '/api/chat' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const question = body.question || body.query;

      if (!question || typeof question !== 'string' || !question.trim()) {
        sendJson(res, 400, { error: 'A non-empty "question" string is required in the request body.' });
        return true;
      }

      const rawExpertise = body.expertiseLevel || body.expertise;
      const expertise: ExpertiseLevel =
        typeof rawExpertise === 'string' && rawExpertise.trim().toLowerCase() === 'intermediate'
          ? 'intermediate'
          : 'basic';

      const result = await docentEngine.answerQuery(question, expertise);
      sendJson(res, 200, {
        ...result,
        expertise,
        expertiseLevel: expertise,
      });
      return true;
    } catch (err: any) {
      console.error('[API Router] Error handling /api/chat:', err);
      sendJson(res, 500, { error: err?.message || 'Internal server error while processing docent query' });
      return true;
    }
  }

  // 2. GET /api/knowledge/processes
  if (pathname === '/api/knowledge/processes' && req.method === 'GET') {
    try {
      const processes = knowledgeBaseService.getAllProcesses().map(p => ({
        id: p.id,
        title: p.title,
        nativeTerm: p.nativeTerm,
        documentId: p.documentId,
        toolsUsed: p.toolsUsed,
        keySteps: p.keySteps,
        sha256: p.sha256,
        excerpt: p.bodyText.slice(0, 160) + '...',
      }));
      sendJson(res, 200, { processes, count: processes.length });
      return true;
    } catch (err: any) {
      console.error('[API Router] Error handling /api/knowledge/processes:', err);
      sendJson(res, 500, { error: err?.message || 'Failed to retrieve processes' });
      return true;
    }
  }

  // 3. GET /api/knowledge/processes/:processId
  if (pathname.startsWith('/api/knowledge/processes/') && req.method === 'GET') {
    const processId = pathname.replace('/api/knowledge/processes/', '').trim();
    if (!processId) {
      sendJson(res, 400, { error: 'Process ID must be specified' });
      return true;
    }

    const doc = knowledgeBaseService.getProcessById(processId);
    if (!doc) {
      sendJson(res, 404, { error: `Process with ID "${processId}" not found in verified knowledge base.` });
      return true;
    }

    sendJson(res, 200, {
      process: {
        id: doc.id,
        title: doc.title,
        nativeTerm: doc.nativeTerm,
        documentId: doc.documentId,
        filePath: doc.filePath,
        frontmatter: doc.frontmatter,
        rawMarkdown: doc.rawMarkdown,
        bodyText: doc.bodyText,
        toolsUsed: doc.toolsUsed,
        keySteps: doc.keySteps,
        sha256: doc.sha256,
      },
    });
    return true;
  }

  // 4. GET /api/benchmark
  if (pathname === '/api/benchmark' && req.method === 'GET') {
    try {
      const report = await benchmarkService.runBenchmark();
      sendJson(res, 200, report);
      return true;
    } catch (err: any) {
      console.error('[API Router] Error handling /api/benchmark:', err);
      sendJson(res, 500, { error: err?.message || 'Benchmark execution failed' });
      return true;
    }
  }

  // 5. POST /api/ingest
  if (pathname === '/api/ingest' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { fileName, content, processId } = body;

      if (!fileName || !content) {
        sendJson(res, 400, { error: 'Both "fileName" and "content" are required for document ingestion.' });
        return true;
      }

      const result = ingestionPipeline.ingestDocument(fileName, content, processId);
      sendJson(res, result.success ? 200 : 400, result);
      return true;
    } catch (err: any) {
      console.error('[API Router] Error handling /api/ingest:', err);
      sendJson(res, 500, { error: err?.message || 'Document ingestion failed' });
      return true;
    }
  }

  return false;
}
