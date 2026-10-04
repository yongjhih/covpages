import { describe, it, expect } from 'vitest';
import { normalizeLcov, GITATTRIBUTES_CONTENT } from '../src/core/lcov-normalizer.js';

describe('LCOV Normalizer & Git Delta Compression', () => {
  it('normalizes CRLF to LF and trims whitespace', () => {
    const raw = 'TN:\r\nSF:src/b.ts\r\nDA:1,1\r\nDA:2,0\r\nend_of_record\r\n';
    const normalized = normalizeLcov(raw);

    expect(normalized).not.toContain('\r');
    expect(normalized.endsWith('\n')).toBe(true);
  });

  it('sorts SF file sections alphabetically regardless of input ordering', () => {
    const unordered = `SF:src/z.ts
DA:1,1
end_of_record
SF:src/a.ts
DA:5,1
end_of_record
SF:src/m.ts
DA:2,1
end_of_record
`;

    const normalized = normalizeLcov(unordered);
    const sfLines = normalized.split('\n').filter(l => l.startsWith('SF:'));
    expect(sfLines).toEqual(['SF:src/a.ts', 'SF:src/m.ts', 'SF:src/z.ts']);
  });

  it('sorts lines, branches, and functions deterministically inside each record', () => {
    const unorderedLines = `SF:src/sample.ts
DA:10,1
DA:2,0
DA:5,3
FN:10,bar
FN:1,foo
FNDA:3,foo
FNDA:1,bar
BRDA:10,0,1,1
BRDA:2,0,0,0
LF:3
LH:2
end_of_record
`;

    const normalized = normalizeLcov(unorderedLines);

    // Verify DA lines are sorted by line number (2, 5, 10)
    const daLines = normalized.split('\n').filter(l => l.startsWith('DA:'));
    expect(daLines).toEqual(['DA:2,0', 'DA:5,3', 'DA:10,1']);

    // Verify FN lines are sorted by line number (1, 10)
    const fnLines = normalized.split('\n').filter(l => l.startsWith('FN:'));
    expect(fnLines).toEqual(['FN:1,foo', 'FN:10,bar']);

    // Verify BRDA lines are sorted by line number (2, 10)
    const brdaLines = normalized.split('\n').filter(l => l.startsWith('BRDA:'));
    expect(brdaLines).toEqual(['BRDA:2,0,0,0', 'BRDA:10,0,1,1']);
  });

  it('guarantees identical output for permuted input records', () => {
    const runA = `SF:src/service.ts
DA:1,1
DA:2,1
end_of_record
SF:src/controller.ts
DA:1,0
end_of_record
`;

    const runB = `SF:src/controller.ts
DA:1,0
end_of_record
SF:src/service.ts
DA:2,1
DA:1,1
end_of_record
`;

    expect(normalizeLcov(runA)).toBe(normalizeLcov(runB));
  });

  it('defines GITATTRIBUTES_CONTENT with text eol=lf delta rules', () => {
    expect(GITATTRIBUTES_CONTENT).toContain('*.info text eol=lf delta');
    expect(GITATTRIBUTES_CONTENT).toContain('*.lcov text eol=lf delta');
    expect(GITATTRIBUTES_CONTENT).toContain('*.json text eol=lf delta');
  });
});
