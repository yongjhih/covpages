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

  it('all module scripts in mcp.html execute without runtime reference errors', async () => {
    const vm = await import('node:vm');
    for (const scope of ['project', 'coverage'] as const) {
      const html = renderMcpHtml({ repo: 'yongjhih/covpages', scope });
      const matches = [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/gi)];
      expect(matches.length).toBeGreaterThan(0);
      for (const m of matches) {
        const sandbox = {
          registeredTools: [] as any[],
          mountedTitle: '',
          window: {
            location: { href: 'https://yongjhih.github.io/covpages/mcp', search: '' }
          },
          document: {
            getElementById: () => ({ innerHTML: '' })
          },
          fetch: () => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              summary: { lines: { total: 100, covered: 80, pct: 80 } },
              commits: [],
              files: {}
            })
          }),
          navigator: {},
          console,
          setTimeout,
          clearTimeout,
          URL,
          URLSearchParams
        };

        const code = m[1].replace(
          /import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g,
          'function mountMcpPageUi(opts) { registeredTools.push(...opts.tools); mountedTitle = opts.title; }'
        );

        expect(() => {
          vm.runInNewContext(code, sandbox);
        }).not.toThrow();

        expect(sandbox.registeredTools.length).toBe(11);
        expect(sandbox.mountedTitle).toBeTruthy();
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
         let scrollTimer = null;
         ${ASK_AI_CLIENT_SCRIPT.match(/function isScrollAtBottom\([\s\S]*?\n  \}/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/function scrollToBottom\([\s\S]*?\n  \}/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/function ensureScrollBottom\([\s\S]*?\n  \}/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/function getAppRoot\(\)[\s\S]*?\n  \}/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/var PRESETS = [\s\S]*?;\n/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/async function ensureCoverageData\(\)[\s\S]*?\n  \}/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/var toolExecutors = \{[\s\S]*?\n  \};/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/async function callWebMcp\([\s\S]*?\n  \}/)![0]}
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
      expect(messagesEl.scrollTop).toBe(messagesEl.scrollHeight);
    } finally {
      (globalThis as any).window = originalWindow;
      (globalThis as any).document = originalDocument;
      (globalThis as any).fetch = originalFetch;
    }
  });

  it('maintains stick-to-bottom scroll position when replying, but respects user scroll-up', async () => {
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
          clientHeight: 100,
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

      (globalThis as any).window = {
        location: { href: 'https://user.github.io/covpages/', pathname: '/covpages/', hash: '' },
        sessionStorage: fakeStorage,
        localStorage: fakeStorage,
      };

      let fetchInterceptor = async () => ({ ok: false });
      const fetchWrapper = (...args: any[]) => fetchInterceptor(...args);

      const fnMatch = ASK_AI_CLIENT_SCRIPT.match(/async function handleUserQuery\([\s\S]*?\n  \}/);
      const messagesEl = (globalThis as any).document.getElementById('ask-ai-messages');

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
         let scrollTimer = null;
         ${ASK_AI_CLIENT_SCRIPT.match(/function isScrollAtBottom\([\s\S]*?\n  \}/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/function scrollToBottom\([\s\S]*?\n  \}/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/function ensureScrollBottom\([\s\S]*?\n  \}/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/function getAppRoot\(\)[\s\S]*?\n  \}/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/var PRESETS = [\s\S]*?;\n/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/async function ensureCoverageData\(\)[\s\S]*?\n  \}/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/var toolExecutors = \{[\s\S]*?\n  \};/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/async function callWebMcp\([\s\S]*?\n  \}/)![0]}
         ${ASK_AI_CLIENT_SCRIPT.match(/function computeHighValueTargets\([\s\S]*?\n  \}/)![0]}
         ${fnMatch![0]}
         return handleUserQuery;`
      )((globalThis as any).window, (globalThis as any).document, fetchWrapper);

      // Case 1: When user was at bottom
      messagesEl.scrollHeight = 300;
      messagesEl.clientHeight = 200;
      messagesEl.scrollTop = 100; // 300 - 100 - 200 = 0 (at bottom)
      await handleUserQuery('covpages cli help');
      expect(messagesEl.scrollTop).toBe(messagesEl.scrollHeight);

      // Case 2: When user scrolls up while assistant is processing
      messagesEl.scrollHeight = 1000;
      messagesEl.clientHeight = 200;
      fetchInterceptor = async () => {
        messagesEl.scrollTop = 100;
        return { ok: false };
      };
      await handleUserQuery('covpages cli help');
      // Should respect user's scroll position and not jump to bottom
      expect(messagesEl.scrollTop).toBe(100);
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

  it('compacts single-child empty directory chains like GitHub (x/xx/xxx) in files tree and table', () => {
    const getCompactedFolderMatch = APP_JS.match(/function getCompactedFolder\(startFolder, baseFolder, vChildren\) \{[\s\S]*?\n  \}/);
    expect(getCompactedFolderMatch).not.toBeNull();

    const fn = new Function(
      `${getCompactedFolderMatch![0]}
       return { getCompactedFolder };`
    )();

    // Setup mock directory structure:
    // packages/ (0 files, 1 subfolder: packages/core)
    // packages/core/ (0 files, 1 subfolder: packages/core/src)
    // packages/core/src/ (2 files, 0 subfolders)
    const vChildren: Record<string, { subfolders: string[]; files: string[] }> = {
      '': { subfolders: ['packages'], files: [] },
      'packages': { subfolders: ['packages/core'], files: [] },
      'packages/core': { subfolders: ['packages/core/src'], files: [] },
      'packages/core/src': { subfolders: [], files: ['packages/core/src/index.ts', 'packages/core/src/utils.ts'] },
    };

    // From root (''), packages should compact all the way to packages/core/src
    const rootComp = fn.getCompactedFolder('packages', '', vChildren);
    expect(rootComp.targetFolder).toBe('packages/core/src');
    expect(rootComp.displayName).toBe('packages/core/src');
    expect(rootComp.hasCompacted).toBe(true);

    // From packages/ (e.g. if navigated to packages directly), core should compact to core/src
    const pkgComp = fn.getCompactedFolder('packages/core', 'packages', vChildren);
    expect(pkgComp.targetFolder).toBe('packages/core/src');
    expect(pkgComp.displayName).toBe('core/src');
    expect(pkgComp.hasCompacted).toBe(true);

    // When a folder has files, it does not compact
    const nonComp = fn.getCompactedFolder('packages/core/src', 'packages/core', vChildren);
    expect(nonComp.targetFolder).toBe('packages/core/src');
    expect(nonComp.displayName).toBe('src');
    expect(nonComp.hasCompacted).toBe(false);

    // When a folder branches (2 subfolders), it stops at the branching folder
    const branchingChildren: Record<string, { subfolders: string[]; files: string[] }> = {
      '': { subfolders: ['src'], files: [] },
      'src': { subfolders: ['src/a', 'src/b'], files: [] },
      'src/a': { subfolders: [], files: ['src/a/one.ts'] },
      'src/b': { subfolders: [], files: ['src/b/two.ts'] },
    };
    const branchComp = fn.getCompactedFolder('src', '', branchingChildren);
    expect(branchComp.targetFolder).toBe('src');
    expect(branchComp.displayName).toBe('src');
    expect(branchComp.hasCompacted).toBe(false);
  });
});

