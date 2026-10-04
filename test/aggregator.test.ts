import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { parseCoverageFile } from '../src/parsers/index.js';
import { aggregateCoverage } from '../src/core/aggregator.js';

describe('Coverage Aggregator', () => {
  const fixturesDir = path.resolve(__dirname, 'fixtures');

  it('aggregates file coverage into folder tree and calculates rollups', () => {
    const files = parseCoverageFile(path.join(fixturesDir, 'commit1.lcov'));
    const result = aggregateCoverage(files);

    // Root folder
    expect(result.summary.lines.total).toBe(10); // 6 from index.ts + 4 from math.ts
    expect(result.summary.lines.covered).toBe(5); // 3 + 2
    expect(result.summary.lines.pct).toBe(50);
    expect(result.summary.functions.total).toBe(4);
    expect(result.summary.functions.covered).toBe(2);
    expect(result.summary.functions.pct).toBe(50);

    // Folders check
    expect(Object.keys(result.folders)).toContain('');
    expect(Object.keys(result.folders)).toContain('src');
    expect(Object.keys(result.folders)).toContain('src/utils');

    // src folder
    const srcFolder = result.folders['src'];
    expect(srcFolder.name).toBe('src');
    expect(srcFolder.lines.total).toBe(10);
    expect(srcFolder.lines.covered).toBe(5);

    // src/utils folder
    const utilsFolder = result.folders['src/utils'];
    expect(utilsFolder.name).toBe('utils');
    expect(utilsFolder.lines.total).toBe(4);
    expect(utilsFolder.lines.covered).toBe(2);

    // Hierarchy check
    expect(result.folderChildren[''].subfolders).toContain('src');
    expect(result.folderChildren['src'].subfolders).toContain('src/utils');
    expect(result.folderChildren['src'].files).toContain('src/index.ts');
    expect(result.folderChildren['src/utils'].files).toContain('src/utils/math.ts');
  });
});
