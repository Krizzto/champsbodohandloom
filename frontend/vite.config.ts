import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { handleBackendApiRoutes } from '../Backend/src/services/apiRouter.ts';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'backend-api-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = new URL(req.url || '/', 'http://localhost:3000');
            if (url.pathname === '/api/health' || url.pathname === '/healthz' || url.pathname === '/health') {
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
              });
              res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), port: 3000 }));
              return;
            }
            if (url.pathname.startsWith('/api/')) {
              try {
                const handled = await handleBackendApiRoutes(req as any, res as any, url.pathname);
                if (handled) return;
              } catch (err) {
                console.error('[Vite Dev API Middleware Error]:', err);
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true,
      strictPort: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true,
      strictPort: true,
    },
  };
});
