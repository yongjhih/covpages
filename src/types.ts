export interface CoverageMetric {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
}

export interface LineCoverageDetail {
  hits: number;
  branches?: {
    total: number;
    taken: number;
  };
}

export interface FunctionCoverageDetail {
  name: string;
  line: number;
  hits: number;
}

export interface FileCoverage {
  path: string; // normalized path relative to repo root, e.g. "src/parsers/lcov.ts"
  lines: CoverageMetric;
  functions: CoverageMetric;
  branches: CoverageMetric;
  lineDetails: Record<number, LineCoverageDetail>;
  functionDetails?: FunctionCoverageDetail[];
  sourceCode?: string; // Optional embedded source code lines for the viewer
}

export interface FolderCoverage {
  path: string; // "" for root, or "src", "src/parsers"
  name: string;
  lines: CoverageMetric;
  functions: CoverageMetric;
  branches: CoverageMetric;
  filesCount: number;
  foldersCount: number;
}

export interface CommitInfo {
  sha: string;
  shortSha: string;
  message: string;
  author: string;
  date: string; // ISO 8601
  branch: string;
  tag?: string;
}

export interface TrendPoint {
  sha: string;
  shortSha: string;
  date: string;
  message: string;
  author: string;
  branch: string;
  tag?: string;
  linesPct: number;
  functionsPct: number;
  branchesPct: number;
  linesCovered: number;
  linesTotal: number;
}

export interface RefMap {
  branches: Record<string, string>; // branch name -> commit SHA
  tags: Record<string, string>;     // tag name -> commit SHA
}

export interface CommitHistoryEntry {
  commit: CommitInfo;
  summary: {
    lines: CoverageMetric;
    functions: CoverageMetric;
    branches: CoverageMetric;
  };
  folderSummaries: Record<string, {
    lines: CoverageMetric;
    functions: CoverageMetric;
    branches: CoverageMetric;
  }>;
  fileSummaries: Record<string, {
    lines: CoverageMetric;
    functions: CoverageMetric;
    branches: CoverageMetric;
  }>;
  /** Raw data stored in objects/ for this commit (written with --save-raw). */
  artifacts?: CommitArtifacts;
}

/**
 * Per-commit raw data manifest. Whatever the input format, a canonical LCOV is always
 * produced (the browser viewer only needs one parser); the original reports are archived
 * next to it so nothing is lost and future viewers/parsers can use richer formats.
 */
export interface CommitArtifacts {
  /** Canonical normalized LCOV, e.g. "objects/ab/cdef….lcov". */
  lcov?: string;
  /** Original input reports, e.g. [{ format: "cobertura", path: "objects/ab/cdef….0.cobertura.xml" }]. */
  sources?: { format: string; path: string }[];
}

export interface CoverageReport {
  summary: {
    lines: CoverageMetric;
    functions: CoverageMetric;
    branches: CoverageMetric;
  };
  folders: Record<string, FolderCoverage>;
  files: Record<string, FileCoverage>;
}

export interface CovpagesData {
  title: string;
  repoName: string;
  baseUrl?: string;
  defaultBranch?: string;
  generatedAt: string;
  currentCommit: CommitInfo;
  previousCommit?: CommitInfo;
  delta?: {
    linesPct: number;
    functionsPct: number;
    branchesPct: number;
  };
  summary: {
    lines: CoverageMetric;
    functions: CoverageMetric;
    branches: CoverageMetric;
  };
  folders: Record<string, FolderCoverage>;
  files: Record<string, FileCoverage>;
  folderChildren: Record<string, {
    subfolders: string[];
    files: string[];
  }>;
  commits: CommitHistoryEntry[];
  refs?: RefMap;
  trends: {
    overall: TrendPoint[];
    folders: Record<string, TrendPoint[]>;
    files: Record<string, TrendPoint[]>;
  };
}

/** Built-in ids are listed for editor hints; any id registered via `registerParser` is accepted. */
export type SupportedFormat = 'lcov' | 'cobertura' | 'clover' | 'json' | 'istanbul' | 'auto' | (string & {});

export interface ParseOptions {
  format?: SupportedFormat;
  rootDir?: string;
  includeSource?: boolean;
}

export interface GenerateOptions {
  inputs: string[];
  outputDir: string;
  historyFile?: string;
  historyDir?: string;
  format?: SupportedFormat;
  title?: string;
  repoName?: string;
  baseUrl?: string;
  commitSha?: string;
  commitMessage?: string;
  commitAuthor?: string;
  commitDate?: string;
  branch?: string;
  tag?: string;
  rootDir?: string;
  includeSource?: boolean;
  maxHistoryCommits?: number;
  saveRaw?: boolean;
}
