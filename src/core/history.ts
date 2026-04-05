import fs from 'node:fs';
import path from 'node:path';
import type {
  CommitHistoryEntry,
  CommitInfo,
  CoverageMetric,
  FileCoverage,
  FolderCoverage,
  TrendPoint,
  RefMap,
} from '../types.js';

export function createCommitHistoryEntry(
  commit: CommitInfo,
  summary: { lines: CoverageMetric; functions: CoverageMetric; branches: CoverageMetric },
  folders: Record<string, FolderCoverage>,
  files: Record<string, FileCoverage>,
  artifacts?: import('../types.js').CommitArtifacts
): CommitHistoryEntry {
  const folderSummaries: Record<string, { lines: CoverageMetric; functions: CoverageMetric; branches: CoverageMetric }> = {};
  for (const [fPath, fCov] of Object.entries(folders)) {
    folderSummaries[fPath] = {
      lines: { ...fCov.lines },
      functions: { ...fCov.functions },
      branches: { ...fCov.branches },
    };
  }

  const fileSummaries: Record<string, { lines: CoverageMetric; functions: CoverageMetric; branches: CoverageMetric }> = {};
  for (const [filePath, fileCov] of Object.entries(files)) {
    fileSummaries[filePath] = {
      lines: { ...fileCov.lines },
      functions: { ...fileCov.functions },
      branches: { ...fileCov.branches },
    };
  }

  return {
    commit,
    summary,
    folderSummaries,
    fileSummaries,
    artifacts: artifacts || undefined,
  };
}

export function buildTrends(commits: CommitHistoryEntry[]): {
  overall: TrendPoint[];
  folders: Record<string, TrendPoint[]>;
  files: Record<string, TrendPoint[]>;
} {
  // Sort commits chronologically by date
  const sorted = [...commits].sort((a, b) => {
    const timeA = new Date(a.commit.date).getTime() || 0;
    const timeB = new Date(b.commit.date).getTime() || 0;
    return timeA - timeB;
  });

  const overall: TrendPoint[] = sorted.map((c) => ({
    sha: c.commit.sha,
    shortSha: c.commit.shortSha || c.commit.sha.slice(0, 7),
    date: c.commit.date,
    message: c.commit.message,
    author: c.commit.author,
    branch: c.commit.branch,
    tag: c.commit.tag,
    linesPct: c.summary.lines.pct,
    functionsPct: c.summary.functions.pct,
    branchesPct: c.summary.branches.pct,
    linesCovered: c.summary.lines.covered,
    linesTotal: c.summary.lines.total,
  }));

  // Collect all unique folder paths
  const folderPaths = new Set<string>();
  for (const c of sorted) {
    for (const f of Object.keys(c.folderSummaries || {})) {
      folderPaths.add(f);
    }
  }

  const folders: Record<string, TrendPoint[]> = {};
  for (const fPath of folderPaths) {
    folders[fPath] = [];
    for (const c of sorted) {
      const fSummary = c.folderSummaries?.[fPath];
      if (fSummary) {
        folders[fPath].push({
          sha: c.commit.sha,
          shortSha: c.commit.shortSha || c.commit.sha.slice(0, 7),
          date: c.commit.date,
          message: c.commit.message,
          author: c.commit.author,
          branch: c.commit.branch,
          tag: c.commit.tag,
          linesPct: fSummary.lines.pct,
          functionsPct: fSummary.functions.pct,
          branchesPct: fSummary.branches.pct,
          linesCovered: fSummary.lines.covered,
          linesTotal: fSummary.lines.total,
        });
      }
    }
  }

  // Collect all unique file paths
  const filePaths = new Set<string>();
  for (const c of sorted) {
    for (const f of Object.keys(c.fileSummaries || {})) {
      filePaths.add(f);
    }
  }

  const files: Record<string, TrendPoint[]> = {};
  for (const filePath of filePaths) {
    files[filePath] = [];
    for (const c of sorted) {
      const fSummary = c.fileSummaries?.[filePath];
      if (fSummary) {
        files[filePath].push({
          sha: c.commit.sha,
          shortSha: c.commit.shortSha || c.commit.sha.slice(0, 7),
          date: c.commit.date,
          message: c.commit.message,
          author: c.commit.author,
          branch: c.commit.branch,
          tag: c.commit.tag,
          linesPct: fSummary.lines.pct,
          functionsPct: fSummary.functions.pct,
          branchesPct: fSummary.branches.pct,
          linesCovered: fSummary.lines.covered,
          linesTotal: fSummary.lines.total,
        });
      }
    }
  }

  return { overall, folders, files };
}

export function loadHistory(historyPath: string): CommitHistoryEntry[] {
  try {
    if (fs.existsSync(historyPath)) {
      const content = fs.readFileSync(historyPath, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        return data;
      }
      if (Array.isArray(data.commits)) {
        return data.commits;
      }
    }
  } catch {
    // If invalid JSON or cannot read, return empty
  }
  return [];
}

export function saveHistory(historyPath: string, commits: CommitHistoryEntry[]): void {
  const dir = path.dirname(historyPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(historyPath, JSON.stringify(commits, null, 2), 'utf-8');
}

export function appendOrUpdateCommit(
  existingCommits: CommitHistoryEntry[],
  newEntry: CommitHistoryEntry,
  maxCommits = 100
): CommitHistoryEntry[] {
  // A commit is one object, regardless of whether it was reported via a branch
  // push or a tag push – merge ref metadata instead of overwriting it.
  const prev = existingCommits.find((c) => c.commit.sha === newEntry.commit.sha);
  if (prev) {
    const branch = newEntry.commit.branch && newEntry.commit.branch !== 'HEAD'
      ? newEntry.commit.branch
      : prev.commit.branch;
    newEntry = {
      ...newEntry,
      commit: { ...newEntry.commit, branch, tag: newEntry.commit.tag || prev.commit.tag },
    };
  }
  const filtered = existingCommits.filter((c) => c.commit.sha !== newEntry.commit.sha);
  filtered.push(newEntry);

  // Sort chronologically
  filtered.sort((a, b) => {
    const timeA = new Date(a.commit.date).getTime() || 0;
    const timeB = new Date(b.commit.date).getTime() || 0;
    return timeA - timeB;
  });

  // Keep last maxCommits
  if (filtered.length > maxCommits) {
    return filtered.slice(filtered.length - maxCommits);
  }
  return filtered;
}

export function calculateDelta(
  current: { lines: CoverageMetric; functions: CoverageMetric; branches: CoverageMetric },
  previous?: { lines: CoverageMetric; functions: CoverageMetric; branches: CoverageMetric }
): { linesPct: number; functionsPct: number; branchesPct: number } | undefined {
  if (!previous) return undefined;
  return {
    linesPct: Math.round((current.lines.pct - previous.lines.pct) * 100) / 100,
    functionsPct: Math.round((current.functions.pct - previous.functions.pct) * 100) / 100,
    branchesPct: Math.round((current.branches.pct - previous.branches.pct) * 100) / 100,
  };
}

export function extractRefs(commits: CommitHistoryEntry[]): RefMap {
  const branches: Record<string, string> = {};
  const tags: Record<string, string> = {};

  for (const c of commits) {
    if (c.commit.branch && c.commit.branch !== 'HEAD') {
      branches[c.commit.branch] = c.commit.sha;
    }
    if (c.commit.tag) {
      tags[c.commit.tag] = c.commit.sha;
    }
  }

  return { branches, tags };
}

export function saveRefs(refsPath: string, refs: RefMap): void {
  const dir = path.dirname(refsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(refsPath, JSON.stringify(refs, null, 2), 'utf-8');
}

