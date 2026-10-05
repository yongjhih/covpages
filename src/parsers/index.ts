import fs from 'node:fs';
import type { FileCoverage, SupportedFormat, ParseOptions } from '../types.js';
import { parseLcov } from './lcov.js';
import { parseCobertura } from './cobertura.js';
import { parseJsonCoverage } from './json.js';
import { registerParser, getParser, detectParser, listParsers, type CoverageParser } from './registry.js';

// ── Built-in format adapters ────────────────────────────────────────────────
// Order matters only as a tie-breaker; LCOV is first so it is the fallback.
registerParser({
  id: 'lcov',
  extension: 'info',
  detect(p, c) {
    const t = c.trimStart();
    if (t.startsWith('TN:') || t.startsWith('SF:') || /\r?\nSF:/.test(c)) return 10;
    const l = p.toLowerCase();
    return l.endsWith('.lcov') || l.endsWith('.info') || l.includes('lcov') ? 5 : 0;
  },
  parse: parseLcov,
});

registerParser({
  id: 'cobertura',
  aliases: ['clover'],
  extension: 'xml',
  detect(p, c) {
    const t = c.trimStart();
    if (t.startsWith('<?xml') || t.includes('<coverage')) return 10;
    const l = p.toLowerCase();
    return l.endsWith('.xml') || l.includes('cobertura') || l.includes('clover') ? 5 : 0;
  },
  parse: parseCobertura,
});

registerParser({
  id: 'json',
  aliases: ['istanbul'],
  extension: 'json',
  detect(p, c) {
    const t = c.trimStart();
    if (t.startsWith('{') && (t.includes('"statementMap"') || t.includes('"total"') || t.includes('"lines"'))) return 10;
    return p.toLowerCase().endsWith('.json') ? 5 : 0;
  },
  parse: parseJsonCoverage,
});

export function detectFormat(filePath: string, content: string): SupportedFormat {
  return detectParser(filePath, content).id as SupportedFormat;
}

/** Resolve the parser for a file, honouring an explicit `--format`. */
export function resolveParser(filePath: string, content: string, format?: SupportedFormat): CoverageParser {
  if (format && format !== 'auto') {
    const p = getParser(format);
    if (!p) {
      throw new Error(`Unsupported coverage format "${format}". Available: ${listParsers().map((x) => x.id).join(', ')}`);
    }
    return p;
  }
  return detectParser(filePath, content);
}

export function parseCoverageFile(filePath: string, options: ParseOptions = {}): Record<string, FileCoverage> {
  const content = fs.readFileSync(filePath, 'utf-8');
  return resolveParser(filePath, content, options.format).parse(content, options.rootDir, options.includeSource);
}

export { parseLcov, parseCobertura, parseJsonCoverage };
export { registerParser, getParser, detectParser, listParsers };
export type { CoverageParser };
