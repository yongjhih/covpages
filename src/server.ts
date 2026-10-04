import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

export function startServer(targetDir: string, port = 8080): http.Server {
  const resolvedDir = path.resolve(targetDir);

  const server = http.createServer((req, res) => {
    let reqUrl = req.url || '/';
    reqUrl = reqUrl.split('?')[0]; // strip query string

    let relativePath = decodeURIComponent(reqUrl);
    if (relativePath.endsWith('/')) {
      relativePath += 'index.html';
    }

    const filePath = path.join(resolvedDir, relativePath);

    // Prevent directory traversal
    if (!filePath.startsWith(resolvedDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    if (!fs.existsSync(filePath)) {
      // Fallback to index.html for SPA-style routing if file does not exist
      const fallbackIndex = path.join(resolvedDir, 'index.html');
      if (fs.existsSync(fallbackIndex)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(fallbackIndex).pipe(res);
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const indexFile = path.join(filePath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(indexFile).pipe(res);
        return;
      }
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
    });
    fs.createReadStream(filePath).pipe(res);
  });

  server.listen(port, () => {
    console.log(`\n🚀 covpages preview server running at:`);
    console.log(`   http://localhost:${port}/`);
    console.log(`   Directory: ${resolvedDir}\n`);
  });

  return server;
}
