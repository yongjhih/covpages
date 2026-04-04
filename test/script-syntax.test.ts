import { describe, it, expect } from 'vitest';
import { APP_JS } from '../src/templates/app.js.js';
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
  const re = /<script>([\s\S]*?)<\/script>/g;
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
});
