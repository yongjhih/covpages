import { describe, it, expect, beforeEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { generateCoveragePages } from '../src/index.js';

describe('Coverage Site Generator', () => {
  const fixturesDir = path.resolve(__dirname, 'fixtures');
  const outDir = path.resolve(__dirname, '../node_modules/.tmp-generator-test');

  beforeEach(() => {
    if (fs.existsSync(outDir)) {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });

  it('generates a full static covpages site from LCOV', () => {

    const data = generateCoveragePages({
      inputs: [path.join(fixturesDir, 'commit1.lcov')],
      outputDir: outDir,
      commitSha: 'fedcba9876543210fedcba9876543210fedcba9',
      commitMessage: 'feat: add first feature',
      commitAuthor: 'Developer',
      branch: 'main',
      title: 'Project Test Coverage',
      repoName: 'my-awesome-repo',
    });

    expect(data.title).toBe('Project Test Coverage');
    expect(data.repoName).toBe('my-awesome-repo');
    expect(data.summary.lines.pct).toBe(50);
    expect(data.commits.length).toBe(1);

    // Verify generated files
    const indexHtml = path.join(outDir, 'index.html');
    const dataJson = path.join(outDir, 'covpages-data.json');
    const dataJs = path.join(outDir, 'covpages-data.js');
    const historyJson = path.join(outDir, 'history.json');

    expect(fs.existsSync(indexHtml)).toBe(true);
    expect(fs.existsSync(dataJson)).toBe(true);
    expect(fs.existsSync(dataJs)).toBe(true);
    expect(fs.existsSync(historyJson)).toBe(true);
    expect(fs.existsSync(path.join(outDir, '.nojekyll'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, '.gitattributes'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'refs.json'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'lcov.info'))).toBe(true);

    const gitattributes = fs.readFileSync(path.join(outDir, '.gitattributes'), 'utf-8');
    expect(gitattributes).toContain('*.info text eol=lf delta');

    const htmlContent = fs.readFileSync(indexHtml, 'utf-8');
    expect(htmlContent).toContain('<!DOCTYPE html>');
    expect(htmlContent).toContain('Project Test Coverage - covpages');
    expect(htmlContent).toContain('window.__COVPAGES_DATA__');
    expect(htmlContent).toContain('files-sidebar');
    expect(htmlContent).toContain('goto-input');
    expect(htmlContent).toContain('Go to file... (t)');
    expect(htmlContent).toContain('ref-selector-btn');

    const jsonContent = JSON.parse(fs.readFileSync(dataJson, 'utf-8'));
    expect(jsonContent.summary.lines.total).toBe(10);
  });

  it('supports tag, baseUrl, and saveRaw historical LCOV snapshots', () => {
    const data = generateCoveragePages({
      inputs: [path.join(fixturesDir, 'commit1.lcov')],
      outputDir: outDir,
      commitSha: 'abcdef1234567890abcdef1234567890abcdef12',
      tag: 'v1.2.3',
      baseUrl: '/docs/covpages/',
      saveRaw: true,
    });

    expect(data.currentCommit.tag).toBe('v1.2.3');
    expect(data.baseUrl).toBe('/docs/covpages/');
    expect(data.refs?.tags['v1.2.3']).toBe('abcdef1234567890abcdef1234567890abcdef12');

    const rawSnapshot = path.join(outDir, 'objects', 'ab', 'cdef1234567890abcdef1234567890abcdef12.lcov');
    expect(fs.existsSync(rawSnapshot)).toBe(true);
    expect(fs.readFileSync(path.join(outDir, 'refs', 'tags', 'v1.2.3'), 'utf-8').trim()).toBe('abcdef1234567890abcdef1234567890abcdef12');
    const content = fs.readFileSync(rawSnapshot, 'utf-8');
    expect(content).toContain('SF:');
    expect(content).not.toContain('\r');
  });

  it('supports generating directly to docs/covpages subdirectory', () => {
    const docsDir = path.join(outDir, 'docs', 'covpages');
    const data = generateCoveragePages({
      inputs: [path.join(fixturesDir, 'commit1.lcov')],
      outputDir: docsDir,
      branch: 'main',
    });

    expect(fs.existsSync(path.join(docsDir, 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(docsDir, '.nojekyll'))).toBe(true);
    expect(fs.existsSync(path.join(docsDir, '.gitattributes'))).toBe(true);
    expect(fs.existsSync(path.join(docsDir, 'refs.json'))).toBe(true);
  });

  it('accumulates multiple commits and updates trends with delta', () => {
    // Run 1: Commit 1
    generateCoveragePages({
      inputs: [path.join(fixturesDir, 'commit1.lcov')],
      outputDir: outDir,
      commitSha: '1111111111111111111111111111111111111111',
      commitMessage: 'commit 1',
      date: '2026-01-01T00:00:00Z',
    });

    // Run 2: Commit 2
    const data2 = generateCoveragePages({
      inputs: [path.join(fixturesDir, 'commit2.lcov')],
      outputDir: outDir,
      commitSha: '2222222222222222222222222222222222222222',
      commitMessage: 'commit 2',
      date: '2026-01-02T00:00:00Z',
    });

    expect(data2.commits.length).toBe(2);
    expect(data2.delta).toBeDefined();
    expect(data2.delta!.linesPct).toBe(40); // 90% - 50% = +40%
    expect(data2.trends.overall.length).toBe(2);
    expect(data2.trends.folders['src/utils'].length).toBe(2);
    expect(data2.trends.files['src/index.ts'].length).toBe(2);
  });

  it('supports Cobertura XML and JSON inputs with canonical LCOV generation and raw archiving', () => {
    const data = generateCoveragePages({
      inputs: [path.join(fixturesDir, 'cobertura.xml')],
      outputDir: outDir,
      commitSha: 'c0be4701234567890abcdef1234567890abcdef1',
      saveRaw: true,
    });

    expect(data.summary.lines.pct).toBe(80);
    // Canonical lcov.info generated in output dir
    const canonicalLcovPath = path.join(outDir, 'lcov.info');
    expect(fs.existsSync(canonicalLcovPath)).toBe(true);
    expect(fs.readFileSync(canonicalLcovPath, 'utf-8')).toContain('SF:src/index.ts');

    // Canonical object stored under objects/c0/...lcov
    const objLcov = path.join(outDir, 'objects', 'c0', 'be4701234567890abcdef1234567890abcdef1.lcov');
    expect(fs.existsSync(objLcov)).toBe(true);

    // Original Cobertura source archived under objects/c0/...cobertura.xml
    const objXml = path.join(outDir, 'objects', 'c0', 'be4701234567890abcdef1234567890abcdef1.cobertura.xml');
    expect(fs.existsSync(objXml)).toBe(true);
    expect(fs.readFileSync(objXml, 'utf-8')).toContain('<coverage');

    // Artifacts manifest recorded in commit history
    const entry = data.commits.find(c => c.commit.sha === 'c0be4701234567890abcdef1234567890abcdef1');
    expect(entry?.artifacts?.lcov).toBe('objects/c0/be4701234567890abcdef1234567890abcdef1.lcov');
    expect(entry?.artifacts?.sources?.[0].format).toBe('cobertura');
  });
});
