import fs from 'node:fs';
import path from 'node:path';
import { renderWebsiteHtml } from './render.js';
import { buildMcpPage } from '../mcp/index.js';

export * from './render.js';

export function buildWebsite(outputDir: string, options: { repo?: string } = {}) {
  const repo = options.repo || 'yongjhih/covpages';

  // 1. English project website (index.html)
  const htmlEn = renderWebsiteHtml({
    repo,
    badgeUrl: 'badges/overall.svg',
    liveDemoUrl: 'covpages/',
    lang: 'en',
    baseUrl: './',
  });

  // 2. Traditional Chinese project website in zh/ (zh/index.html)
  const htmlZh = renderWebsiteHtml({
    repo,
    badgeUrl: '../badges/overall.svg',
    liveDemoUrl: '../covpages/',
    lang: 'zh-TW',
    baseUrl: '../',
  });

  // 3. Root Chinese alias for direct file access (index.zh-TW.html)
  const htmlZhRoot = renderWebsiteHtml({
    repo,
    badgeUrl: 'badges/overall.svg',
    liveDemoUrl: 'covpages/',
    lang: 'zh-TW',
    baseUrl: './',
  });

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), htmlEn, 'utf8');

  const zhDir = path.join(outputDir, 'zh');
  fs.mkdirSync(zhDir, { recursive: true });
  fs.writeFileSync(path.join(zhDir, 'index.html'), htmlZh, 'utf8');
  fs.writeFileSync(path.join(outputDir, 'index.zh-TW.html'), htmlZhRoot, 'utf8');

  // Vendor WebMCP modules and render mcp.html
  buildMcpPage(outputDir, {
    repo,
    title: 'Covpages CLI & Project WebMCP Tools',
    scope: 'project',
  });
}
