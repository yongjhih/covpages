import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { parseCoverageFile, detectFormat, parseLcov, parseCobertura, parseJsonCoverage } from '../src/parsers/index.js';

describe('Coverage Parsers', () => {
  const fixturesDir = path.resolve(__dirname, 'fixtures');

  it('correctly detects coverage formats', () => {
    expect(detectFormat('lcov.info', 'SF:src/foo.ts\n')).toBe('lcov');
    expect(detectFormat('coverage.xml', '<coverage line-rate="0.8">')).toBe('cobertura');
    expect(detectFormat('coverage.json', '{"total": {}}')).toBe('json');
    expect(detectFormat('custom.txt', 'TN:\nSF:file.js')).toBe('lcov');
    expect(detectFormat('unknown.txt', '<?xml version="1.0"><coverage>')).toBe('cobertura');
  });

  it('parses LCOV file with functions, branches, lines', () => {
    const lcovPath = path.join(fixturesDir, 'commit1.lcov');
    const files = parseCoverageFile(lcovPath);

    expect(Object.keys(files)).toContain('src/index.ts');
    expect(Object.keys(files)).toContain('src/utils/math.ts');

    const indexCov = files['src/index.ts'];
    expect(indexCov.lines.total).toBe(6);
    expect(indexCov.lines.covered).toBe(3);
    expect(indexCov.lines.pct).toBe(50);
    expect(indexCov.functions.total).toBe(2);
    expect(indexCov.functions.covered).toBe(1);
    expect(indexCov.branches.total).toBe(2);
    expect(indexCov.branches.covered).toBe(1);
    expect(indexCov.lineDetails[1].hits).toBe(1);
    expect(indexCov.lineDetails[5].hits).toBe(0);

    const mathCov = files['src/utils/math.ts'];
    expect(mathCov.lines.total).toBe(4);
    expect(mathCov.lines.covered).toBe(2);
    expect(mathCov.lines.pct).toBe(50);
  });

  it('parses Cobertura XML with branch and line rates', () => {
    const xmlPath = path.join(fixturesDir, 'cobertura.xml');
    const files = parseCoverageFile(xmlPath);

    expect(Object.keys(files)).toContain('src/index.ts');
    const indexCov = files['src/index.ts'];
    expect(indexCov.lines.total).toBe(5);
    expect(indexCov.lines.covered).toBe(4);
    expect(indexCov.lines.pct).toBe(80);
    expect(indexCov.branches.total).toBe(4); // 2 from line 2 + 2 from line 4
    expect(indexCov.branches.covered).toBe(3); // 2 from line 2 + 1 from line 4
    expect(indexCov.functions.total).toBe(1);
    expect(indexCov.functions.covered).toBe(1);
  });

  it('parses JSON coverage summary format', () => {
    const jsonPath = path.join(fixturesDir, 'coverage-summary.json');
    const files = parseCoverageFile(jsonPath);

    expect(Object.keys(files)).toContain('src/index.ts');
    expect(Object.keys(files)).toContain('src/utils/math.ts');
    expect(files['src/index.ts'].lines.pct).toBe(80);
    expect(files['src/utils/math.ts'].functions.pct).toBe(50);
  });
});
