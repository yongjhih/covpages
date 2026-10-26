import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { renderWebsiteHtml } from '../src/website/render.js';
import { buildWebsite } from '../src/website/index.js';

describe('Project Website Generator', () => {
  it('renders complete GitHub-styled project website HTML in English', () => {
    const html = renderWebsiteHtml({
      repo: 'yongjhih/covpages',
      badgeUrl: 'badges/overall.svg',
      liveDemoUrl: 'covpages/',
    });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en"');
    expect(html).toContain('Git-Native Code Coverage');
    expect(html).toContain('GitHub Pages');
    expect(html).toContain('Interactive Badge Generator');
    expect(html).toContain('Storage & Bandwidth Benchmarks');
    expect(html).toContain('+React & Component Reusability');
    expect(html).toContain('covpages/');
    expect(html).toContain('badges/overall.svg');
    expect(html).toContain('id="lang-toggle"');
    expect(html).toContain('繁體中文');
  });

  it('renders complete GitHub-styled project website HTML in Traditional Chinese', () => {
    const html = renderWebsiteHtml({
      repo: 'yongjhih/covpages',
      badgeUrl: '../badges/overall.svg',
      liveDemoUrl: '../covpages/',
      lang: 'zh-TW',
      baseUrl: '../',
    });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="zh-TW"');
    expect(html).toContain('專為 GitHub Pages 打造的原生 Git 測試覆蓋率報告');
    expect(html).toContain('互動式徽章生成器');
    expect(html).toContain('儲存空間與頻寬評測');
    expect(html).toContain('+React 與組件複用');
    expect(html).toContain('為什麼選擇 Covpages？');
    expect(html).toContain('總持有成本 (TCO)');
    expect(html).toContain('快速上手與設定');
    expect(html).toContain('Ask AI 智慧助理');
    expect(html).toContain('id="lang-toggle"');
    expect(html).toContain('English');
  });

  it('builds both English and Chinese website files into output directory', () => {
    const tmpDir = path.join(os.tmpdir(), `covpages-website-test-${Date.now()}`);
    try {
      buildWebsite(tmpDir, { repo: 'yongjhih/covpages' });

      expect(fs.existsSync(path.join(tmpDir, 'index.html'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, 'zh', 'index.html'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, 'index.zh-TW.html'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, 'mcp.html'))).toBe(true);

      const enHtml = fs.readFileSync(path.join(tmpDir, 'index.html'), 'utf8');
      expect(enHtml).toContain('Git-Native Code Coverage');

      const zhHtml = fs.readFileSync(path.join(tmpDir, 'zh', 'index.html'), 'utf8');
      expect(zhHtml).toContain('專為 GitHub Pages 打造的原生 Git 測試覆蓋率報告');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
