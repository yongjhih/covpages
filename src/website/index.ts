import fs from 'node:fs';
import path from 'node:path';
import { renderWebsiteHtml } from './render.js';

export * from './render.js';

export function buildWebsite(outputDir: string, options: { repo?: string } = {}) {
  const html = renderWebsiteHtml({
    repo: options.repo || 'yongjhih/covpages',
    badgeUrl: 'badges/overall.svg',
    liveDemoUrl: 'covpages/',
  });

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8');
}
