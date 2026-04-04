import { describe, it, expect, beforeEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { createDropinSite, renderDropinHtml } from '../src/index.js';

describe('Zero-build Drop-in Mode', () => {
  const outDir = path.resolve(__dirname, '../node_modules/.tmp-dropin-test');

  beforeEach(() => {
    if (fs.existsSync(outDir)) {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });

  it('renders drop-in html with null data for client-side bootstrapping', () => {
    const rendered = renderDropinHtml('My Dropin Coverage');
    expect(rendered.html).toContain('<!DOCTYPE html>');
    expect(rendered.html).toContain('window.__COVPAGES_DATA__ = null;');
    expect(rendered.html).toContain('parseClientLcov');
    expect(rendered.html).toContain('drop-zone');
  });

  it('creates dropin site files (index.html, .nojekyll)', () => {
    createDropinSite(outDir, 'Project Dropin');
    expect(fs.existsSync(path.join(outDir, 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, '.nojekyll'))).toBe(true);
  });
});
