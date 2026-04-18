import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { vendorMcpWeb, renderMcpHtml, buildMcpPage, generateCoveragePages } from '../src/index.js';
import { runCli } from '../src/cli.js';

describe('MCP Page & ai-proxy integration', () => {
  const tmpDir = path.resolve('node_modules/.tmp-mcp-test');

  beforeEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('vendors all 7 WebMCP client modules into targetDir/web', () => {
    const vendored = vendorMcpWeb(tmpDir);
    expect(vendored).toContain('ui.mjs');
    expect(vendored).toContain('client.mjs');
    expect(vendored).toContain('dispatch.mjs');
    expect(vendored).toContain('handshake.mjs');
    expect(vendored).toContain('model-context.mjs');
    expect(vendored).toContain('url.mjs');
    expect(vendored).toContain('index.mjs');

    const webDir = path.join(tmpDir, 'web');
    expect(fs.existsSync(path.join(webDir, 'ui.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(webDir, 'client.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(webDir, 'dispatch.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(webDir, 'handshake.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(webDir, 'model-context.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(webDir, 'url.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(webDir, 'index.mjs'))).toBe(true);
  });

  it('renders compliant mcp.html for project scope without localStorage leaks', () => {
    const html = renderMcpHtml({ repo: 'test/repo', title: 'Test Project MCP', scope: 'project' });
    expect(html).toContain('<!doctype html>');
    expect(html).toContain('Test Project MCP');
    expect(html).toContain('./web/ui.mjs');
    expect(html).toContain('get_cli_help');
    expect(html).toContain('get_framework_preset');
    expect(html).toContain('consult_setup');
    expect(html).toContain('get_documentation');
    expect(html).toContain('navigate_to');
    expect(html).toContain('readOnlyHint: true');
    expect(html).toContain('ask-ai-drawer');

    // Security check: Must never touch localStorage for mcp-key
    expect(/localStorage\.setItem\([^)]*mcp-key/i.test(html)).toBe(false);
  });

  it('renders compliant mcp.html for coverage scope with find_high_value_targets', () => {
    const html = renderMcpHtml({ repo: 'test/repo', title: 'Test Coverage MCP', scope: 'coverage' });
    expect(html).toContain('<!doctype html>');
    expect(html).toContain('Test Coverage MCP');
    expect(html).toContain('./web/ui.mjs');
    expect(html).toContain('find_high_value_targets');
    expect(html).toContain('get_coverage_summary');
    expect(html).toContain('list_coverage_files');
    expect(html).toContain('get_file_coverage');
    expect(html).toContain('get_coverage_trends');
    expect(html).toContain('get_badge_code');
    expect(html).toContain('readOnlyHint: true');
    expect(html).toContain('ask-ai-drawer');

    // Security check: Must never touch localStorage for mcp-key
    expect(/localStorage\.setItem\([^)]*mcp-key/i.test(html)).toBe(false);
  });

  it('builds mcp.html and vendors web modules via buildMcpPage', () => {
    const res = buildMcpPage(tmpDir, { repo: 'test/repo' });
    expect(fs.existsSync(res.mcpHtmlPath)).toBe(true);
    expect(res.vendoredFiles.length).toBe(7);
    expect(fs.existsSync(path.join(tmpDir, 'web', 'ui.mjs'))).toBe(true);
  });

  it('generates MCP files via covpages mcp command', async () => {
    await runCli(['mcp', tmpDir]);
    expect(fs.existsSync(path.join(tmpDir, 'mcp.html'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'web', 'model-context.mjs'))).toBe(true);
  });

  it('generates MCP files during coverage generation with --mcp flag', () => {
    const fixturePath = path.resolve('test/fixtures/commit1.lcov');
    generateCoveragePages({
      inputs: [fixturePath],
      outputDir: tmpDir,
      mcp: true,
      repoName: 'test-mcp-gen',
    });

    expect(fs.existsSync(path.join(tmpDir, 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'covpages-data.json'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'mcp.html'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'web', 'ui.mjs'))).toBe(true);
  });

  it('passes all 3 ai-proxy doctor checks on generated site', async () => {
    buildMcpPage(tmpDir, { repo: 'yongjhih/covpages' });

    const aiProxyBin = '/Users/yongjhih/works/ai-proxy/bin/ai-proxy.mjs';
    if (fs.existsSync(aiProxyBin)) {
      const { spawnSync } = await import('node:child_process');
      const res = spawnSync(process.execPath, [aiProxyBin, 'doctor', '--dir', tmpDir], {
        encoding: 'utf8',
      });
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('"ok": true');
      expect(res.stdout).toContain('mcp_page_exists');
      expect(res.stdout).toContain('vendored_web_modules');
      expect(res.stdout).toContain('mcp_page_wiring');
    }
  });

  it('contains valid inline JavaScript for URL auto-detection', () => {
    const html = renderMcpHtml({ repo: 'yongjhih/covpages' });
    const scriptMatches = [...html.matchAll(/<script(?![^>]*type="module")>([\s\S]*?)<\/script>/gi)];
    expect(scriptMatches.length).toBeGreaterThan(0);

    for (const match of scriptMatches) {
      const code = match[1];
      expect(() => new Function(code)).not.toThrow();
    }
  });

  it('correctly derives short URL and site name in simulated environment', () => {
    const html = renderMcpHtml({ repo: 'yongjhih/covpages' });
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
    const autoDetectScript = scripts.find((s) => s[1].includes('Auto-detect'));
    expect(autoDetectScript).toBeTruthy();
    const scriptBody = autoDetectScript![1];

    const runScriptWithUrl = (href: string) => {
      let resultText = '';
      const fakeDom = {
        querySelectorAll: (selector: string) => {
          if (selector === '[data-replace-base-url="true"]') {
            return [{
              set textContent(val: string) {
                resultText = val;
              },
              get textContent() {
                return resultText;
              }
            }];
          }
          return [];
        },
        getElementById: () => null,
        documentElement: { getAttribute: () => 'auto', setAttribute: () => {} },
      };
      const fakeWindow = {
        location: { href },
        localStorage: { getItem: () => null, setItem: () => {} },
      };

      const fn = new Function('window', 'document', scriptBody);
      fn(fakeWindow, fakeDom);
      return resultText;
    };

    expect(runScriptWithUrl('https://yongjhih.github.io/covpages/mcp.html'))
      .toBe('npx ai-proxy add https://yongjhih.github.io/covpages/mcp --name covpages');

    expect(runScriptWithUrl('https://yongjhih.github.io/covpages/mcp'))
      .toBe('npx ai-proxy add https://yongjhih.github.io/covpages/mcp --name covpages');

    expect(runScriptWithUrl('https://yongjhih.github.io/covpages/covpages/mcp.html'))
      .toBe('npx ai-proxy add https://yongjhih.github.io/covpages/covpages/mcp --name covpages-covpages');

    expect(runScriptWithUrl('https://yongjhih.github.io/covpages/covpages/mcp'))
      .toBe('npx ai-proxy add https://yongjhih.github.io/covpages/covpages/mcp --name covpages-covpages');
  });
});
