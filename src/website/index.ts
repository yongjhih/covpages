import fs from 'node:fs';
import path from 'node:path';
import { renderWebsiteHtml } from './render.js';
import { buildMcpPage } from '../mcp/index.js';

export * from './render.js';

export function buildWebsite(outputDir: string, options: { repo?: string } = {}) {
  const repo = options.repo || 'yongjhih/covpages';
  const html = renderWebsiteHtml({
    repo,
    badgeUrl: 'badges/overall.svg',
    liveDemoUrl: 'covpages/',
  });

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8');

  // Vendor WebMCP modules and render mcp.html
  buildMcpPage(outputDir, {
    repo,
    title: 'Covpages WebMCP Tools',
  });
}
