import { describe, it, expect } from 'vitest';
import { renderWebsiteHtml } from '../src/website/render.js';

describe('Project Website Generator', () => {
  it('renders complete GitHub-styled project website HTML', () => {
    const html = renderWebsiteHtml({
      repo: 'yongjhih/covpages',
      badgeUrl: 'badges/overall.svg',
      liveDemoUrl: 'covpages/',
    });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Git-Native Code Coverage');
    expect(html).toContain('GitHub Pages');
    expect(html).toContain('Interactive Badge Generator');
    expect(html).toContain('Storage & Bandwidth Benchmarks');
    expect(html).toContain('+React & Component Reusability');
    expect(html).toContain('covpages/');
    expect(html).toContain('badges/overall.svg');
  });
});
