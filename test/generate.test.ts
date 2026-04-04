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

    const htmlContent = fs.readFileSync(indexHtml, 'utf-8');
    expect(htmlContent).toContain('<!DOCTYPE html>');
    expect(htmlContent).toContain('Project Test Coverage - covpages');
    expect(htmlContent).toContain('window.__COVPAGES_DATA__');
    expect(htmlContent).toContain('files-sidebar');
    expect(htmlContent).toContain('goto-input');
    expect(htmlContent).toContain('Go to file... (t)');

    const jsonContent = JSON.parse(fs.readFileSync(dataJson, 'utf-8'));
    expect(jsonContent.summary.lines.total).toBe(10);
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
});
