import type { FileCoverage } from '../types.js';

/**
 * A coverage format adapter. Every input format (LCOV, Cobertura, Clover, Istanbul JSON,
 * and future ones such as JaCoCo, Go coverprofile, coverage.py JSON…) is converted into the
 * internal `FileCoverage` model. Everything downstream – aggregation, history, the canonical
 * LCOV object stored in `objects/`, and the browser viewer – only ever sees that model, so
 * supporting a new format means registering one parser and nothing else.
 */
export interface CoverageParser {
  /** Format id used by `--format <id>` and recorded in the commit's artifact manifest. */
  id: string;
  /** Alternative ids accepted by `--format` (e.g. "clover" for the XML parser). */
  aliases?: string[];
  /** File extension used when the original report is archived in `objects/`. */
  extension: string;
  /**
   * Return a confidence score (0 = no, higher = more certain) for this file.
   * Path checks should score lower than content sniffing.
   */
  detect(filePath: string, content: string): number;
  parse(content: string, rootDir?: string, includeSource?: boolean): Record<string, FileCoverage>;
}

const registry = new Map<string, CoverageParser>();
const order: CoverageParser[] = [];

export function registerParser(parser: CoverageParser): void {
  for (const id of [parser.id, ...(parser.aliases || [])]) registry.set(id.toLowerCase(), parser);
  const i = order.findIndex((p) => p.id === parser.id);
  if (i >= 0) order[i] = parser;
  else order.push(parser);
}

export function getParser(id: string): CoverageParser | undefined {
  return registry.get(id.toLowerCase());
}

export function listParsers(): CoverageParser[] {
  return [...order];
}

/** Pick the best parser for a file; falls back to the first registered one (LCOV). */
export function detectParser(filePath: string, content: string): CoverageParser {
  let best: CoverageParser | undefined;
  let bestScore = 0;
  for (const p of order) {
    const s = p.detect(filePath, content);
    if (s > bestScore) {
      best = p;
      bestScore = s;
    }
  }
  if (!best && order.length === 0) throw new Error('No coverage parsers registered');
  return best || order[0];
}
