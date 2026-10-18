import { describe, it, expect } from 'vitest';
import { APP_JS } from '../src/templates/app.js.js';
import { ASK_AI_CLIENT_SCRIPT } from '../src/templates/ask-ai.js';
import { PRISM_JS } from '../src/templates/prism.bundle.js';
import { renderIndexHtml, render404Html } from '../src/templates/index.html.js';
import { renderWebsiteHtml } from '../src/website/render.js';

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
});

