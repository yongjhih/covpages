import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { parseCoverageFile } from '../src/parsers/index.js';
import { aggregateCoverage } from '../src/core/aggregator.js';
import {
  createCommitHistoryEntry,
  buildTrends,
  appendOrUpdateCommit,
  calculateDelta,
  loadHistory,
  saveHistory,
} from '../src/core/history.js';

describe('Coverage History & Trends', () => {
  const fixturesDir = path.resolve(__dirname, 'fixtures');

  it('builds multi-commit trends across repo, folders, and files', () => {
    // Commit 1 (50% lines)
    const files1 = parseCoverageFile(path.join(fixturesDir, 'commit1.lcov'));
    const agg1 = aggregateCoverage(files1);
    const entry1 = createCommitHistoryEntry(
      {
        sha: '1111111111111111111111111111111111111111',
        shortSha: '1111111',
        message: 'Commit 1',
        author: 'Alice',
        date: '2026-01-01T00:00:00Z',
        branch: 'main',
      },
      agg1.summary,
      agg1.folders,
      agg1.files
    );

    // Commit 2 (90% lines: 5/6 + 4/4 = 9/10)
    const files2 = parseCoverageFile(path.join(fixturesDir, 'commit2.lcov'));
    const agg2 = aggregateCoverage(files2);
    const entry2 = createCommitHistoryEntry(
      {
        sha: '2222222222222222222222222222222222222222',
        shortSha: '2222222',
        message: 'Commit 2',
        author: 'Bob',
        date: '2026-01-02T00:00:00Z',
        branch: 'main',
      },
      agg2.summary,
      agg2.folders,
      agg2.files
    );

    // Commit 3 (100% lines)
    const files3 = parseCoverageFile(path.join(fixturesDir, 'commit3.lcov'));
    const agg3 = aggregateCoverage(files3);
    const entry3 = createCommitHistoryEntry(
      {
        sha: '3333333333333333333333333333333333333333',
        shortSha: '3333333',
        message: 'Commit 3',
        author: 'Charlie',
        date: '2026-01-03T00:00:00Z',
        branch: 'main',
      },
      agg3.summary,
      agg3.folders,
      agg3.files
    );

    const commits = [entry1, entry2, entry3];
    const trends = buildTrends(commits);

    // 1. Overall Trend
    expect(trends.overall.length).toBe(3);
    expect(trends.overall[0].linesPct).toBe(50);
    expect(trends.overall[1].linesPct).toBe(90);
    expect(trends.overall[2].linesPct).toBe(100);

    // 2. Folder Trend by Folder: "src/utils"
    expect(trends.folders['src/utils']).toBeDefined();
    expect(trends.folders['src/utils'].length).toBe(3);
    expect(trends.folders['src/utils'][0].linesPct).toBe(50); // 2/4 in commit1
    expect(trends.folders['src/utils'][1].linesPct).toBe(100); // 4/4 in commit2
    expect(trends.folders['src/utils'][2].linesPct).toBe(100); // 4/4 in commit3

    // 3. File Trend by File: "src/index.ts"
    expect(trends.files['src/index.ts']).toBeDefined();
    expect(trends.files['src/index.ts'].length).toBe(3);
    expect(trends.files['src/index.ts'][0].linesPct).toBe(50); // 3/6
    expect(trends.files['src/index.ts'][1].linesPct).toBe(83.33); // 5/6
    expect(trends.files['src/index.ts'][2].linesPct).toBe(100); // 6/6

    // 4. Delta calculation
    const delta = calculateDelta(agg3.summary, agg2.summary);
    expect(delta).toBeDefined();
    expect(delta!.linesPct).toBe(10); // 100 - 90 = +10%
  });

  it('saves and loads history JSON correctly', () => {
    const tmpDir = path.resolve(__dirname, '../node_modules/.tmp-test');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const histFile = path.join(tmpDir, 'test-history.json');

    const sampleEntry = {
      commit: {
        sha: 'abc123',
        shortSha: 'abc123',
        message: 'test',
        author: 'tester',
        date: '2026-01-01T00:00:00Z',
        branch: 'main',
      },
      summary: {
        lines: { total: 10, covered: 8, skipped: 2, pct: 80 },
        functions: { total: 2, covered: 2, skipped: 0, pct: 100 },
        branches: { total: 2, covered: 2, skipped: 0, pct: 100 },
      },
      folderSummaries: {},
      fileSummaries: {},
    };

    saveHistory(histFile, [sampleEntry]);
    const loaded = loadHistory(histFile);

    expect(loaded.length).toBe(1);
    expect(loaded[0].commit.sha).toBe('abc123');
    expect(loaded[0].summary.lines.pct).toBe(80);
  });
});
