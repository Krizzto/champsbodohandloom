import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

// Determine static build directory
const DIST_DIR = fs.existsSync(path.join(__dirname, 'dist'))
  ? path.join(__dirname, 'dist')
  : path.join(__dirname, 'frontend', 'dist');

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8',
};

function sendFile(res: http.ServerResponse, filePath: string, reqPath: string) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return false;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const headers: Record<string, string | number> = {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'X-Content-Type-Options': 'nosniff',
    };

    // Cache hashed assets long-term, keep HTML fresh
    if (reqPath.startsWith('/assets/')) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else {
      headers['Cache-Control'] = 'no-cache';
    }

    res.writeHead(200, headers);
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
    return true;
  } catch {
    return false;
  }
}

import { handleBackendApiRoutes } from './Backend/src/services/apiRouter.ts';

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  // Health checks for Cloud Run
  if (pathname === '/api/health' || pathname === '/healthz' || pathname === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), port: PORT }));
    return;
  }

  // Handle Backend GraphRAG & AI Docent API routes
  if (pathname.startsWith('/api/')) {
    const handled = await handleBackendApiRoutes(req, res, pathname);
    if (handled) return;
  }

  // Handle static file requests
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const candidateFile = path.join(DIST_DIR, safePath);

  // Check if requested path corresponds to an existing static file
  if (fs.existsSync(candidateFile) && fs.statSync(candidateFile).isFile()) {
    if (sendFile(res, candidateFile, pathname)) {
      return;
    }
  }

  // Check index.html fallback in subdirectories
  const candidateIndex = path.join(candidateFile, 'index.html');
  if (fs.existsSync(candidateIndex) && fs.statSync(candidateIndex).isFile()) {
    if (sendFile(res, candidateIndex, pathname)) {
      return;
    }
  }

  // Single-Page Application (SPA) fallback to root index.html for GET / HEAD requests
  const fallbackIndex = path.join(DIST_DIR, 'index.html');
  if ((req.method === 'GET' || req.method === 'HEAD') && fs.existsSync(fallbackIndex)) {
    sendFile(res, fallbackIndex, '/');
    return;
  }

  // Not found
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, HOST, () => {
  console.log(`[Bodo VR Museum] Production server listening on http://${HOST}:${PORT}`);
  console.log(`[Bodo VR Museum] Serving static assets from: ${DIST_DIR}`);
});

// Graceful shutdown on Cloud Run SIGTERM / SIGINT
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});
