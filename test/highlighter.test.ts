import { describe, it, expect } from 'vitest';
import { PRISM_JS } from '../src/templates/prism.bundle.js';
import { STYLES_CSS } from '../src/templates/styles.css.js';
import { renderIndexHtml } from '../src/templates/index.html.js';

describe('Syntax Highlighting Integration', () => {
  it('bundles Prism with multi-language grammars', () => {
    expect(PRISM_JS).toBeDefined();
    expect(PRISM_JS.length).toBeGreaterThan(10000);
    expect(PRISM_JS).toContain('Prism');
    expect(PRISM_JS).toContain('languages');
  });

  it('embeds Prism syntax highlighting styles for light and dark themes', () => {
    expect(STYLES_CSS).toContain('.token.keyword');
    expect(STYLES_CSS).toContain('.token.string');
    expect(STYLES_CSS).toContain('.token.comment');
    expect(STYLES_CSS).toContain('.token.function');
    expect(STYLES_CSS).toContain('[data-color-mode="dark"] .token.keyword');
  });

  it('renders index.html containing Prism bundle script', () => {
    const output = renderIndexHtml();
    expect(output.html).toContain('Prism');
    expect(output.html).toContain('.token.keyword');
  });
});
