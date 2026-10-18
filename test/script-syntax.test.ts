import { describe, it, expect } from 'vitest';
import { APP_JS } from '../src/templates/app.js.js';
import { ASK_AI_CLIENT_SCRIPT } from '../src/templates/ask-ai.js';
import { PRISM_JS } from '../src/templates/prism.bundle.js';
import { renderIndexHtml, render404Html } from '../src/templates/index.html.js';
import { renderWebsiteHtml } from '../src/website/render.js';
import { renderMcpHtml } from '../src/mcp/render.js';

/**
 * The client app is authored inside a TypeScript template literal, where a
 * single backslash (e.g. `/\/$/`) is silently consumed and produces invalid JS.
 * These tests guarantee every emitted inline script is syntactically valid.
 */
function extractScripts(html: string): string[] {
  const out: string[] = [];
  const re = /<script(?![^>]*type="module")>([\s\S]*?)<\/script>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

function assertParses(code: string, label: string) {
  expect(() => new Function(code), label).not.toThrow();
}

describe('Emitted client scripts are valid JavaScript', () => {
  it('APP_JS parses', () => assertParses(APP_JS, 'APP_JS'));
  it('PRISM_JS parses', () => assertParses(PRISM_JS, 'PRISM_JS'));
  it('ASK_AI_CLIENT_SCRIPT parses', () => assertParses(ASK_AI_CLIENT_SCRIPT, 'ASK_AI_CLIENT_SCRIPT'));

  it('all inline scripts in the report index.html parse', () => {
    const scripts = extractScripts(renderIndexHtml(null).html);
    expect(scripts.length).toBeGreaterThan(0);
    scripts.forEach((s, i) => assertParses(s, `index.html script #${i}`));
  });

  it('404.html redirect script parses', () => {
    extractScripts(render404Html()).forEach((s, i) => assertParses(s, `404 script #${i}`));
  });

  it('project website inline script parses', () => {
    extractScripts(renderWebsiteHtml()).forEach((s, i) => assertParses(s, `website script #${i}`));
  });

  it('all module scripts in mcp.html (both project and coverage) parse without syntax errors', () => {
    for (const scope of ['project', 'coverage'] as const) {
      const html = renderMcpHtml({ repo: 'yongjhih/covpages', scope });
      const matches = [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/gi)];
      expect(matches.length).toBeGreaterThan(0);
      for (const m of matches) {
        const codeWithoutImports = m[1].replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '// import');
        assertParses(codeWithoutImports, `mcp.html (${scope}) module script`);
      }
    }
  });

  it('renderTrendChart decimates x-axis SHA labels to prevent overlap on dense history', () => {
    const match = APP_JS.match(/  function renderTrendChart\(title, points, metricKey = 'linesPct'\) \{[\s\S]*?\n  \}/);
    expect(match).not.toBeNull();

    const points = Array.from({ length: 21 }, (_, i) => {
      const shortSha = `${(i + 1).toString(16).padStart(7, 'a')}`;
      return {
        sha: `${shortSha}0000000`,
        shortSha,
        date: `2026-10-${String((i % 28) + 1).padStart(2, '0')}`,
        message: `commit ${i + 1}`,
        linesPct: 75 + (i % 5),
        functionsPct: 80,
        branchesPct: 70,
        linesCovered: 75,
        linesTotal: 100,
      };
    });

    const fn = new Function(
      'escapeHtml',
      `const state = { selectedCommitSha: '${points[20].sha}' }; const icons = { graph: '' };\n${match![0]}\nreturn renderTrendChart;`,
    )((s: string) => String(s));

    const html: string = fn('Folder Trend: src', points, 'linesPct');

    // Every commit point still renders an interactive dot
    const dotMatches = [...html.matchAll(/class="chart-dot"/g)];
    expect(dotMatches.length).toBe(21);

    // Extract x-coordinates and text of x-axis SHA labels
    const xAxisLabels = [
      ...html.matchAll(/<text x="([\d.]+)" y="[\d.]+" text-anchor="middle"[^>]*>\s*([^\s<]+)\s*<\/text>/g),
    ].map((m) => ({ x: parseFloat(m[1]), label: m[2] }));

    expect(xAxisLabels.length).toBeGreaterThanOrEqual(2);
    expect(xAxisLabels.length).toBeLessThanOrEqual(12);
    expect(xAxisLabels[0].label).toBe(points[0].shortSha);
    expect(xAxisLabels[xAxisLabels.length - 1].label).toBe(points[20].shortSha);

    for (let i = 1; i < xAxisLabels.length; i++) {
      expect(xAxisLabels[i].x - xAxisLabels[i - 1].x).toBeGreaterThan(46);
    }
  });

  it('formatMarkdown converts CTA action buttons, jump anchors, and external links', () => {
    const fnMatch = ASK_AI_CLIENT_SCRIPT.match(/function formatMarkdown\([\s\S]*?\n  \}/);
    expect(fnMatch).not.toBeNull();

    const formatMarkdown = new Function('escapeHtml', `${fnMatch![0]}\nreturn formatMarkdown;`)(
      (s: string) =>
        s
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;'),
    );

    // Jump CTA button in a list item (as in ai-proxy replies)
    const jumpResult = formatMarkdown('- [🚀 前往快速上手指南](#quickstart)');
    expect(jumpResult).toContain('<ul class="ask-ai-actions-list">');
    expect(jumpResult).toContain('class="btn btn-sm ask-ai-jump-btn"');
    expect(jumpResult).toContain('data-jump="#quickstart"');
    expect(jumpResult).toContain('🚀 前往快速上手指南');

    // Action CTA button
    const actionResult = formatMarkdown('- [連接本地服務](action:connect)');
    expect(actionResult).toContain('<ul class="ask-ai-actions-list">');
    expect(actionResult).toContain('class="btn btn-sm btn-primary ask-ai-cta-btn"');
    expect(actionResult).toContain('data-action="action:connect"');

    // External link CTA button
    const extResult = formatMarkdown('[查看說明](https://example.com/docs)');
    expect(extResult).toContain('class="btn btn-sm ask-ai-cta-btn"');
    expect(extResult).toContain('href="https://example.com/docs"');
    expect(extResult).toContain('target="_blank"');

    // Bold, inline code, and code block
    const richResult = formatMarkdown('**重點提示**: 使用 `covpages mcp` 指令');
    expect(richResult).toContain('<strong>重點提示</strong>');
    expect(richResult).toContain('<code>covpages mcp</code>');

    const codeBlockResult = formatMarkdown('```sh\n$ npx covpages\n```');
    expect(codeBlockResult).toContain('<pre><code>$ npx covpages</code></pre>');
  });

  it('Ask AI restores conversation history across page navigation and jumps', () => {
    const storage: Record<string, string> = {
      covpages_ask_ai_history: JSON.stringify([
        { role: 'user', html: '<p>如何快速開始？</p>', text: '如何快速開始？' },
        {
          role: 'assistant',
          html: '<p><button type="button" class="btn btn-sm ask-ai-jump-btn" data-jump="#quickstart">🚀 前往快速上手指南</button></p>',
          text: '🚀 前往快速上手指南',
        },
      ]),
    };

    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;
    const originalSessionStorage = globalThis.sessionStorage;
    const originalLocalStorage = globalThis.localStorage;

    try {
      (globalThis as any).window = globalThis;
      (globalThis as any).sessionStorage = {
        getItem: (k: string) => storage[k] || null,
        setItem: (k: string, v: string) => {
          storage[k] = String(v);
        },
        removeItem: (k: string) => {
          delete storage[k];
        },
      };
      (globalThis as any).localStorage = {
        getItem: (k: string) => storage[k] || null,
        setItem: (k: string, v: string) => {
          storage[k] = String(v);
        },
        removeItem: (k: string) => {
          delete storage[k];
        },
      };

      const elements: Record<string, any> = {};
      function createMockEl(id: string) {
        const children: any[] = [];
        const el: any = {
          id,
          children,
          style: {},
          setAttribute: () => {},
          getAttribute: () => null,
          addEventListener: () => {},
          appendChild: (child: any) => children.push(child),
          querySelectorAll: (sel: string) => (sel.includes('.ask-ai-msg') ? children : []),
          remove: () => {},
          scrollTop: 0,
          scrollHeight: 100,
        };
        return el;
      }

      (globalThis as any).document = {
        getElementById: (id: string) => {
          if (!elements[id]) elements[id] = createMockEl(id);
          return elements[id];
        },
        createElement: (tag: string) => createMockEl(tag),
        addEventListener: () => {},
      };

      const messagesEl = (globalThis as any).document.getElementById('ask-ai-messages');
      messagesEl.children.push(createMockEl('initial-greeting'));

      // Run script in mock environment
      new Function(ASK_AI_CLIENT_SCRIPT)();

      // Initial greeting + 2 restored history messages
      expect(messagesEl.children.length).toBe(3);
      expect(messagesEl.children[1].innerHTML).toContain('如何快速開始？');
      expect(messagesEl.children[2].innerHTML).toContain('data-jump="#quickstart"');
      expect(messagesEl.children[2].innerHTML).toContain('🚀 前往快速上手指南');

      // Clear button should be shown
      const clearBtn = (globalThis as any).document.getElementById('ask-ai-clear');
      expect(clearBtn.style.display).toBe('inline-flex');
    } finally {
      (globalThis as any).window = originalWindow;
      (globalThis as any).document = originalDocument;
      (globalThis as any).sessionStorage = originalSessionStorage;
      (globalThis as any).localStorage = originalLocalStorage;
    }
  });

  it('bypasses ai-proxy dummy fallback echo and computes high-value coverage targets client-side', async () => {
    const originalWindow = (globalThis as any).window;
    const originalDocument = (globalThis as any).document;
    const originalFetch = (globalThis as any).fetch;

    try {
      const mockStorage: Record<string, string> = {};
      const fakeStorage = {
        getItem: (k: string) => mockStorage[k] || null,
        setItem: (k: string, v: string) => { mockStorage[k] = v; },
        removeItem: (k: string) => { delete mockStorage[k]; },
      };

      const elements: Record<string, any> = {};
      function createMockEl(id: string) {
        const el: any = {
          id,
          children: [] as any[],
          innerHTML: '',
          value: '',
          style: {},
          attributes: {} as Record<string, string>,
          setAttribute: (k: string, v: string) => { el.attributes[k] = v; },
          getAttribute: (k: string) => el.attributes[k] || null,
          appendChild: (c: any) => el.children.push(c),
          querySelectorAll: () => [],
          addEventListener: () => {},
          remove: () => {},
          scrollTop: 0,
          scrollHeight: 100,
        };
        return el;
      }

      (globalThis as any).document = {
        getElementById: (id: string) => {
          if (!elements[id]) elements[id] = createMockEl(id);
          return elements[id];
        },
        createElement: (tag: string) => createMockEl(tag),
        addEventListener: () => {},
      };

      const mockData = {
        summary: {
          lines: { total: 1000, covered: 600, pct: 60.0 },
          functions: { total: 100, covered: 70, pct: 70.0 },
          branches: { total: 50, covered: 30, pct: 60.0 },
        },
        files: {
          'src/cli.ts': {
            path: 'src/cli.ts',
            lines: { total: 300, covered: 100, pct: 33.3 },
          },
          'src/index.ts': {
            path: 'src/index.ts',
            lines: { total: 200, covered: 180, pct: 90.0 },
          },
        },
      };

      (globalThis as any).window = {
        location: { href: 'https://user.github.io/covpages/', pathname: '/covpages/', hash: '' },
        sessionStorage: fakeStorage,
        localStorage: fakeStorage,
        __COVPAGES_DATA__: mockData,
      };

      // Mock fetch: ai-proxy returns dummy echo response
      (globalThis as any).fetch = async (url: string) => {
        if (url.includes('chat/completions')) {
          return {
            ok: true,
            json: async () => ({
              choices: [
                {
                  message: {
                    content: 'ai-proxy local assistant received: "Find high-value coverage targets". Permitted read-only tools: [none].',
                  },
                },
              ],
            }),
          };
        }
        return { ok: false };
      };

      // Run script
      new Function(ASK_AI_CLIENT_SCRIPT)();

      // Submit query
      const inputEl = (globalThis as any).document.getElementById('ask-ai-input');
      const formEl = (globalThis as any).document.getElementById('ask-ai-form');

      // Extract handleUserQuery directly by testing matching keywords
      const fnMatch = ASK_AI_CLIENT_SCRIPT.match(/async function handleUserQuery\([\s\S]*?\n  \}/);
      expect(fnMatch).not.toBeNull();

      const messagesEl = (globalThis as any).document.getElementById('ask-ai-messages');
      const prevCount = messagesEl.children.length;

      // Call handleUserQuery
      const handleUserQuery = new Function(
        'window', 'document', 'fetch',
        `let conversationHistory = [];
         let messagesEl = document.getElementById('ask-ai-messages');
         let input = document.getElementById('ask-ai-input');
         let statusPill = document.getElementById('ask-ai-status-pill');
         function escapeHtml(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
         function appendMessage(role, html) {
           const el = document.createElement('div');
           el.className = 'ask-ai-msg ask-ai-msg-' + role;
           el.innerHTML = html;
           messagesEl.appendChild(el);
           return el;
         }
         function bindActions() {}
         function saveHistory() {}
         function formatMarkdown(m) { return m; }
         ${ASK_AI_CLIENT_SCRIPT.match(/async function ensureCoverageData\(\)[\s\S]*?\n  \}/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/function computeHighValueTargets\([\s\S]*?\n  \}/)![0]}
         ${fnMatch![0]}
         return handleUserQuery;`
      )((globalThis as any).window, (globalThis as any).document, (globalThis as any).fetch);

      await handleUserQuery('Find high-value coverage targets');

      expect(messagesEl.children.length).toBeGreaterThan(prevCount);
      const lastMsg = messagesEl.children[messagesEl.children.length - 1];
      expect(lastMsg.innerHTML).not.toContain('ai-proxy local assistant received:');
      expect(lastMsg.innerHTML).toContain('Highest Value Targets to Improve Coverage');
      expect(lastMsg.innerHTML).toContain('src/cli.ts');
      expect(lastMsg.innerHTML).toContain('data-jump="#file=src%2Fcli.ts"');
    } finally {
      (globalThis as any).window = originalWindow;
      (globalThis as any).document = originalDocument;
      (globalThis as any).fetch = originalFetch;
    }
  });

  it('resolves MCP header link to absolute base (/covpages/covpages/mcp) when on deep SPA file route', () => {
    const originalWindow = (globalThis as any).window;
    try {
      (globalThis as any).window = {
        location: {
          protocol: 'https:',
          pathname: '/covpages/covpages/blob/main/src/mcp/web/client.mjs',
          href: 'https://yongjhih.github.io/covpages/covpages/blob/main/src/mcp/web/client.mjs',
        },
        matchMedia: () => ({ matches: false }),
      };

      const getBasePathMatch = APP_JS.match(/function getBasePath\(\) \{[\s\S]*?\n  \}/);
      const renderHeaderMatch = APP_JS.match(/function renderHeader\(\) \{[\s\S]*?\n  \}/);
      expect(getBasePathMatch).not.toBeNull();
      expect(renderHeaderMatch).not.toBeNull();

      const fn = new Function(
        'window',
        `const data = { repoName: 'covpages', title: 'Coverage' };
         const state = { theme: 'light', activeRefType: 'branch', activeRefName: 'main' };
         const activeView = { summary: { lines: { pct: 80 } } };
         const icons = { github: '', branch: '', sparkles: '', moon: '', sun: '', file: '', graph: '', commit: '' };
         function escapeHtml(s) { return String(s || ''); }
         function generateClientBadgeSvg() { return ''; }
         ${getBasePathMatch![0]}
         ${renderHeaderMatch![0]}
         return { getBasePath, renderHeader };`
      )((globalThis as any).window);

      const base = fn.getBasePath();
      expect(base).toBe('/covpages/covpages/');

      const headerHtml = fn.renderHeader();
      expect(headerHtml).toContain('href="/covpages/covpages/mcp"');
      expect(headerHtml).not.toContain('href="mcp"');
    } finally {
      (globalThis as any).window = originalWindow;
    }
  });
});

