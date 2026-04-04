import fs from 'node:fs';
import path from 'node:path';
import type { FileCoverage, LineCoverageDetail, FunctionCoverageDetail, CoverageMetric } from '../types.js';
import { normalizeFilePath } from './lcov.js';

function calcPct(covered: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((covered / total) * 10000) / 100;
}

function normalizeMetric(raw: any): CoverageMetric {
  if (!raw) return { total: 0, covered: 0, skipped: 0, pct: 100 };
  const total = Number(raw.total) || 0;
  const covered = Number(raw.covered) || 0;
  const skipped = Number(raw.skipped) || 0;
  const pct = raw.pct !== undefined ? Number(raw.pct) : calcPct(covered, total);
  return { total, covered, skipped, pct };
}

export function parseJsonCoverage(content: string, rootDir?: string, includeSource = false): Record<string, FileCoverage> {
  const data = JSON.parse(content);
  const files: Record<string, FileCoverage> = {};

  for (const [key, val] of Object.entries(data)) {
    if (key === 'total' || typeof val !== 'object' || val === null) {
      continue;
    }

    const item = val as any;
    const rawPath = item.path || key;
    const normalizedPath = normalizeFilePath(rawPath, rootDir);

    let lineDetails: Record<number, LineCoverageDetail> = {};
    let functionDetails: FunctionCoverageDetail[] | undefined;
    let linesMetric: CoverageMetric;
    let functionsMetric: CoverageMetric;
    let branchesMetric: CoverageMetric;

    // Check if it is istanbul coverage-final format with statementMap, s, fnMap, f, branchMap, b
    if (item.statementMap && item.s) {
      // Map statements to line coverage
      for (const [sId, count] of Object.entries(item.s)) {
        const loc = item.statementMap[sId];
        if (loc && loc.start) {
          const lineNum = loc.start.line;
          const hits = Number(count) || 0;
          if (!lineDetails[lineNum]) {
            lineDetails[lineNum] = { hits };
          } else {
            lineDetails[lineNum].hits = Math.max(lineDetails[lineNum].hits, hits);
          }
        }
      }

      // Map branches
      if (item.branchMap && item.b) {
        for (const [bId, branchCounts] of Object.entries(item.b)) {
          const bInfo = item.branchMap[bId];
          const counts = Array.isArray(branchCounts) ? branchCounts : [branchCounts];
          if (bInfo && bInfo.loc) {
            const lineNum = bInfo.loc.start.line;
            if (!lineDetails[lineNum]) lineDetails[lineNum] = { hits: 0 };
            if (!lineDetails[lineNum].branches) lineDetails[lineNum].branches = { total: 0, taken: 0 };
            lineDetails[lineNum].branches!.total += counts.length;
            lineDetails[lineNum].branches!.taken += counts.filter((c: any) => Number(c) > 0).length;
          }
        }
      }

      // Map functions
      if (item.fnMap && item.f) {
        functionDetails = [];
        for (const [fId, count] of Object.entries(item.f)) {
          const fn = item.fnMap[fId];
          if (fn) {
            functionDetails.push({
              name: fn.name || `anonymous_${fId}`,
              line: fn.loc ? fn.loc.start.line : 0,
              hits: Number(count) || 0,
            });
          }
        }
      }

      const lineNums = Object.keys(lineDetails).map(Number);
      const coveredLines = lineNums.filter((l) => lineDetails[l].hits > 0).length;
      linesMetric = {
        total: lineNums.length,
        covered: coveredLines,
        skipped: 0,
        pct: calcPct(coveredLines, lineNums.length),
      };

      const fnTotal = functionDetails ? functionDetails.length : 0;
      const fnCovered = functionDetails ? functionDetails.filter((f) => f.hits > 0).length : 0;
      functionsMetric = {
        total: fnTotal,
        covered: fnCovered,
        skipped: 0,
        pct: calcPct(fnCovered, fnTotal),
      };

      let brTotal = 0;
      let brTaken = 0;
      for (const l of Object.values(lineDetails)) {
        if (l.branches) {
          brTotal += l.branches.total;
          brTaken += l.branches.taken;
        }
      }
      branchesMetric = {
        total: brTotal,
        covered: brTaken,
        skipped: 0,
        pct: calcPct(brTaken, brTotal),
      };
    } else {
      // standard coverage-summary format
      linesMetric = normalizeMetric(item.lines || item.statements);
      functionsMetric = normalizeMetric(item.functions);
      branchesMetric = normalizeMetric(item.branches);
    }

    let sourceCode: string | undefined;
    if (includeSource) {
      const resolvedPath = rootDir ? path.resolve(rootDir, normalizedPath) : path.resolve(normalizedPath);
      try {
        if (fs.existsSync(resolvedPath)) {
          sourceCode = fs.readFileSync(resolvedPath, 'utf-8');
        }
      } catch {
        // ignore
      }
    }

    files[normalizedPath] = {
      path: normalizedPath,
      lines: linesMetric,
      functions: functionsMetric,
      branches: branchesMetric,
      lineDetails,
      functionDetails,
      sourceCode,
    };
  }

  return files;
}
