import fs from 'node:fs';
import path from 'node:path';
import type { FileCoverage, LineCoverageDetail, FunctionCoverageDetail } from '../types.js';
import { normalizeFilePath } from './lcov.js';

function calcPct(covered: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((covered / total) * 10000) / 100;
}

export function parseCobertura(xmlContent: string, rootDir?: string, includeSource = false): Record<string, FileCoverage> {
  const files: Record<string, FileCoverage> = {};

  // Find all <class ...>...</class> tags
  const classRegex = /<class\b([^>]*?)>([\s\S]*?)<\/class>/gi;
  let classMatch: RegExpExecArray | null;

  while ((classMatch = classRegex.exec(xmlContent)) !== null) {
    const classAttrs = classMatch[1];
    const classBody = classMatch[2];

    const filenameMatch = /filename=["']([^"']+)["']/i.exec(classAttrs);
    if (!filenameMatch) continue;

    const rawFilename = filenameMatch[1];
    const normalizedPath = normalizeFilePath(rawFilename, rootDir);

    const lineDetails: Record<number, LineCoverageDetail> = {};
    const functionDetails: FunctionCoverageDetail[] = [];

    // Parse methods
    const methodRegex = /<method\b([^>]*?)>([\s\S]*?)<\/method>/gi;
    let methodMatch: RegExpExecArray | null;
    while ((methodMatch = methodRegex.exec(classBody)) !== null) {
      const mAttrs = methodMatch[1];
      const mBody = methodMatch[2];
      const nameMatch = /name=["']([^"']+)["']/i.exec(mAttrs);
      const lineMatch = /line=["'](\d+)["']/i.exec(mAttrs);
      const hitsMatch = /hits=["'](\d+)["']/i.exec(mAttrs);

      let hits = hitsMatch ? parseInt(hitsMatch[1], 10) : 0;
      let line = lineMatch ? parseInt(lineMatch[1], 10) : 0;

      // Check inner lines if method hits weren't on the tag
      if (!hitsMatch) {
        const mLineHits = /<line\b[^>]*?hits=["'](\d+)["']/gi;
        let lh;
        while ((lh = mLineHits.exec(mBody)) !== null) {
          hits += parseInt(lh[1], 10) || 0;
        }
      }

      if (nameMatch) {
        functionDetails.push({
          name: nameMatch[1],
          line,
          hits,
        });
      }
    }

    // Parse lines
    const lineTagRegex = /<line\b([^>]*?)(?:\/?>|>[\s\S]*?<\/line>)/gi;
    let lineTagMatch: RegExpExecArray | null;
    let branchesFound = 0;
    let branchesHit = 0;

    while ((lineTagMatch = lineTagRegex.exec(classBody)) !== null) {
      const lAttrs = lineTagMatch[1];
      const numMatch = /number=["'](\d+)["']/i.exec(lAttrs);
      const hitsMatch = /hits=["'](\d+)["']/i.exec(lAttrs);
      const isBranchMatch = /branch=["']true["']/i.exec(lAttrs);
      const condMatch = /condition-coverage=["']\d+%\s*\((\d+)\/(\d+)\)["']/i.exec(lAttrs);

      if (!numMatch) continue;
      const lineNum = parseInt(numMatch[1], 10);
      const hits = hitsMatch ? parseInt(hitsMatch[1], 10) : 0;

      if (lineDetails[lineNum]) {
        lineDetails[lineNum].hits = Math.max(lineDetails[lineNum].hits, hits);
        continue;
      }

      let branches: { total: number; taken: number } | undefined;
      if (isBranchMatch || condMatch) {
        if (condMatch) {
          const taken = parseInt(condMatch[1], 10);
          const total = parseInt(condMatch[2], 10);
          branches = { taken, total };
          branchesFound += total;
          branchesHit += taken;
        } else {
          branches = { total: 1, taken: hits > 0 ? 1 : 0 };
          branchesFound += 1;
          if (hits > 0) branchesHit += 1;
        }
      }

      lineDetails[lineNum] = {
        hits,
        branches,
      };
    }

    const lineNums = Object.keys(lineDetails).map(Number);
    const linesFound = lineNums.length;
    const linesHit = lineNums.filter((l) => lineDetails[l].hits > 0).length;

    const functionsFound = functionDetails.length;
    const functionsHit = functionDetails.filter((f) => f.hits > 0).length;

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
      lines: {
        total: linesFound,
        covered: linesHit,
        skipped: Math.max(0, linesFound - linesHit),
        pct: calcPct(linesHit, linesFound),
      },
      functions: {
        total: functionsFound,
        covered: functionsHit,
        skipped: Math.max(0, functionsFound - functionsHit),
        pct: calcPct(functionsHit, functionsFound),
      },
      branches: {
        total: branchesFound,
        covered: branchesHit,
        skipped: Math.max(0, branchesFound - branchesHit),
        pct: calcPct(branchesHit, branchesFound),
      },
      lineDetails,
      functionDetails: functionDetails.length > 0 ? functionDetails : undefined,
      sourceCode,
    };
  }

  return files;
}
