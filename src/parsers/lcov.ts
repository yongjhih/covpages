import fs from 'node:fs';
import path from 'node:path';
import type { FileCoverage, LineCoverageDetail, FunctionCoverageDetail, CoverageMetric } from '../types.js';

function calcPct(covered: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((covered / total) * 10000) / 100;
}

export function normalizeFilePath(filePath: string, rootDir?: string): string {
  let normalized = filePath.replace(/\\/g, '/');
  if (rootDir) {
    const rootNorm = path.resolve(rootDir).replace(/\\/g, '/');
    if (normalized.startsWith(rootNorm)) {
      normalized = normalized.slice(rootNorm.length);
    }
  }
  normalized = normalized.replace(/^\/+/, '');
  return normalized;
}

export function parseLcov(content: string, rootDir?: string, includeSource = false): Record<string, FileCoverage> {
  const files: Record<string, FileCoverage> = {};
  const lines = content.split(/\r?\n/);

  let currentPath = '';
  let lineDetails: Record<number, LineCoverageDetail> = {};
  let functionDetails: FunctionCoverageDetail[] = [];
  let fnMap = new Map<string, { line: number; hits: number }>();
  let fnf = 0;
  let fnh = 0;
  let brf = 0;
  let brh = 0;
  let lf = 0;
  let lh = 0;
  let seenSummaryLF = false;
  let seenSummaryFNF = false;
  let seenSummaryBRF = false;

  const resetCurrent = () => {
    currentPath = '';
    lineDetails = {};
    functionDetails = [];
    fnMap.clear();
    fnf = 0;
    fnh = 0;
    brf = 0;
    brh = 0;
    lf = 0;
    lh = 0;
    seenSummaryLF = false;
    seenSummaryFNF = false;
    seenSummaryBRF = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('SF:')) {
      currentPath = normalizeFilePath(line.slice(3).trim(), rootDir);
    } else if (line.startsWith('FN:')) {
      const parts = line.slice(3).split(',');
      if (parts.length >= 2) {
        const lineNum = parseInt(parts[0], 10);
        const name = parts.slice(1).join(',');
        if (!fnMap.has(name)) {
          fnMap.set(name, { line: lineNum, hits: 0 });
        }
      }
    } else if (line.startsWith('FNDA:')) {
      const parts = line.slice(5).split(',');
      if (parts.length >= 2) {
        const hits = parseInt(parts[0], 10) || 0;
        const name = parts.slice(1).join(',');
        const existing = fnMap.get(name);
        if (existing) {
          existing.hits += hits;
        } else {
          fnMap.set(name, { line: 0, hits });
        }
      }
    } else if (line.startsWith('FNF:')) {
      fnf = parseInt(line.slice(4), 10) || 0;
      seenSummaryFNF = true;
    } else if (line.startsWith('FNH:')) {
      fnh = parseInt(line.slice(4), 10) || 0;
    } else if (line.startsWith('BRDA:')) {
      const parts = line.slice(5).split(',');
      if (parts.length >= 4) {
        const lineNum = parseInt(parts[0], 10);
        const takenStr = parts[3];
        const taken = takenStr === '-' ? 0 : parseInt(takenStr, 10) || 0;
        
        if (!lineDetails[lineNum]) {
          lineDetails[lineNum] = { hits: 0 };
        }
        if (!lineDetails[lineNum].branches) {
          lineDetails[lineNum].branches = { total: 0, taken: 0 };
        }
        lineDetails[lineNum].branches!.total += 1;
        if (taken > 0) {
          lineDetails[lineNum].branches!.taken += 1;
        }
      }
    } else if (line.startsWith('BRF:')) {
      brf = parseInt(line.slice(4), 10) || 0;
      seenSummaryBRF = true;
    } else if (line.startsWith('BRH:')) {
      brh = parseInt(line.slice(4), 10) || 0;
    } else if (line.startsWith('DA:')) {
      const parts = line.slice(3).split(',');
      if (parts.length >= 2) {
        const lineNum = parseInt(parts[0], 10);
        const hits = parseInt(parts[1], 10) || 0;
        if (!lineDetails[lineNum]) {
          lineDetails[lineNum] = { hits };
        } else {
          lineDetails[lineNum].hits += hits;
        }
      }
    } else if (line.startsWith('LF:')) {
      lf = parseInt(line.slice(3), 10) || 0;
      seenSummaryLF = true;
    } else if (line.startsWith('LH:')) {
      lh = parseInt(line.slice(3), 10) || 0;
    } else if (line === 'end_of_record') {
      if (currentPath) {
        // Fallback calculations if LF/FNF/BRF summaries were omitted
        const lineNums = Object.keys(lineDetails).map(Number);
        const calcLF = lineNums.length;
        const calcLH = lineNums.filter((ln) => lineDetails[ln].hits > 0).length;
        const finalLF = seenSummaryLF ? lf : calcLF;
        const finalLH = seenSummaryLF ? lh : calcLH;

        let calcBRF = 0;
        let calcBRH = 0;
        for (const ln of lineNums) {
          const br = lineDetails[ln].branches;
          if (br) {
            calcBRF += br.total;
            calcBRH += br.taken;
          }
        }
        const finalBRF = seenSummaryBRF ? brf : calcBRF;
        const finalBRH = seenSummaryBRF ? brh : calcBRH;

        for (const [name, entry] of fnMap.entries()) {
          functionDetails.push({
            name,
            line: entry.line,
            hits: entry.hits,
          });
        }
        const calcFNF = functionDetails.length;
        const calcFNH = functionDetails.filter((f) => f.hits > 0).length;
        const finalFNF = seenSummaryFNF ? fnf : calcFNF;
        const finalFNH = seenSummaryFNF ? fnh : calcFNH;

        let sourceCode: string | undefined;
        if (includeSource) {
          const resolvedPath = rootDir ? path.resolve(rootDir, currentPath) : path.resolve(currentPath);
          try {
            if (fs.existsSync(resolvedPath)) {
              sourceCode = fs.readFileSync(resolvedPath, 'utf-8');
            }
          } catch {
            // ignore if not readable
          }
        }

        files[currentPath] = {
          path: currentPath,
          lines: {
            total: finalLF,
            covered: finalLH,
            skipped: Math.max(0, finalLF - finalLH),
            pct: calcPct(finalLH, finalLF),
          },
          functions: {
            total: finalFNF,
            covered: finalFNH,
            skipped: Math.max(0, finalFNF - finalFNH),
            pct: calcPct(finalFNH, finalFNF),
          },
          branches: {
            total: finalBRF,
            covered: finalBRH,
            skipped: Math.max(0, finalBRF - finalBRH),
            pct: calcPct(finalBRH, finalBRF),
          },
          lineDetails,
          functionDetails: functionDetails.length > 0 ? functionDetails : undefined,
          sourceCode,
        };
      }
      resetCurrent();
    }
  }

  return files;
}
