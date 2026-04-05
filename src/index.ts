import fs from 'node:fs';
import path from 'node:path';
import type {
  CovpagesData,
  GenerateOptions,
  FileCoverage,
  CommitHistoryEntry,
} from './types.js';
import { parseCoverageFile, resolveParser } from './parsers/index.js';
import { resolveCommitInfo } from './core/git.js';
import { aggregateCoverage } from './core/aggregator.js';
import {
  createCommitHistoryEntry,
  buildTrends,
  loadHistory,
  saveHistory,
  appendOrUpdateCommit,
  calculateDelta,
  extractRefs,
  saveRefs,
} from './core/history.js';
import { normalizeLcov, fileCoveragesToLcov, GITATTRIBUTES_CONTENT } from './core/lcov-normalizer.js';
import { generateBadgeSvg, getBadgeFileName, formatBadgeLabel } from './core/badge.js';
import { renderIndexHtml, render404Html } from './templates/index.html.js';
import {
  loadCommitObjects,
  writeCommitObject,
  writeLcovObject,
  writeRawObject,
  writeLooseRefs,
  writeHead,
  readHeadBranch,
  pruneObjects,
  migrateLegacyLcov,
} from './core/store.js';

export * from './types.js';
export * from './parsers/index.js';
export * from './core/aggregator.js';
export * from './core/history.js';
export * from './core/git.js';
export * from './core/store.js';
export * from './core/backfill.js';
export * from './core/presets.js';
export * from './core/lcov-normalizer.js';
export * from './core/badge.js';
export * from './server.js';
export { renderDropinHtml } from './templates/index.html.js';

export function createDropinSite(outputDir = 'gh-pages', title = 'Coverage Report'): void {
  const dir = path.resolve(outputDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const rendered = renderIndexHtml(null);
  fs.writeFileSync(path.join(dir, 'index.html'), rendered.html, 'utf-8');
  fs.writeFileSync(path.join(dir, '.nojekyll'), '', 'utf-8');
  fs.writeFileSync(path.join(dir, '.gitattributes'), GITATTRIBUTES_CONTENT, 'utf-8');
  fs.writeFileSync(path.join(dir, 'badge.svg'), generateBadgeSvg(100), 'utf-8');
  fs.writeFileSync(path.join(dir, '404.html'), render404Html(), 'utf-8');
}


export function generateCoveragePages(options: GenerateOptions): CovpagesData {
  const outputDir = path.resolve(options.outputDir || './covpages-dist');
  const rootDir = options.rootDir ? path.resolve(options.rootDir) : process.cwd();
  const maxHistory = options.maxHistoryCommits || 100;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Resolve commit info for current run
  const currentCommit = resolveCommitInfo({
    cwd: rootDir,
    sha: options.commitSha,
    message: options.commitMessage,
    author: options.commitAuthor,
    date: options.commitDate,
    branch: options.branch,
    tag: options.tag,
  });

  // 2. Load existing history
  const historyPath = options.historyFile 
    ? path.resolve(options.historyFile) 
    : path.join(outputDir, 'history.json');
  
  let commitsHistory = loadHistory(historyPath);
  // Loose commit objects (objects/<aa>/<rest>.json) are the source of truth;
  // history.json is just the packed index of them.
  for (const obj of loadCommitObjects(outputDir)) {
    commitsHistory = appendOrUpdateCommit(commitsHistory, obj, Number.MAX_SAFE_INTEGER);
  }

  // If a historyDir is provided, load and parse any historical coverage files
  if (options.historyDir && fs.existsSync(options.historyDir)) {
    const historyFiles = fs.readdirSync(options.historyDir)
      .filter((f: string) => !f.startsWith('.') && (f.endsWith('.lcov') || f.endsWith('.info') || f.endsWith('.xml') || f.endsWith('.json')))
      .sort();

    for (const hFile of historyFiles) {
      const fullHPath = path.join(options.historyDir, hFile);
      const parsedHFiles = parseCoverageFile(fullHPath, {
        format: options.format,
        rootDir,
        includeSource: false,
      });
      const aggregatedH = aggregateCoverage(parsedHFiles);

      // Extract metadata from filename if possible, e.g. <sha>_<date>_<branch>.lcov
      const baseName = path.basename(hFile, path.extname(hFile));
      const parts = baseName.split('_');
      const hSha = parts[0] || `hist_${baseName}`;
      const hDate = parts[1] || new Date(fs.statSync(fullHPath).mtime).toISOString();
      const hBranch = parts[2] || currentCommit.branch;

      const hCommitInfo = {
        sha: hSha,
        shortSha: hSha.slice(0, 7),
        message: `Coverage run ${baseName}`,
        author: 'automated',
        date: hDate,
        branch: hBranch,
      };

      const hEntry = createCommitHistoryEntry(
        hCommitInfo,
        aggregatedH.summary,
        aggregatedH.folders,
        aggregatedH.files
      );

      commitsHistory = appendOrUpdateCommit(commitsHistory, hEntry, maxHistory);
    }
  }

  // 3. Process primary input coverage file(s)
  let mergedFiles: Record<string, FileCoverage> = {};
  const sourcesArtifacts: { format: string; path: string }[] = [];

  const inputPaths = options.inputs && options.inputs.length > 0 
    ? options.inputs 
    : ['coverage/lcov.info'];

  for (let i = 0; i < inputPaths.length; i++) {
    const inputPath = inputPaths[i];
    const resolvedInput = path.resolve(inputPath);
    if (!fs.existsSync(resolvedInput)) {
      throw new Error(`Coverage input file not found: ${resolvedInput}`);
    }

    const content = fs.readFileSync(resolvedInput, 'utf-8');
    const parser = resolveParser(resolvedInput, content, options.format);
    const parsed = parser.parse(content, rootDir, options.includeSource ?? true);
    mergedFiles = { ...mergedFiles, ...parsed };

    if (options.saveRaw) {
      const ext = parser.extension || path.extname(resolvedInput).replace(/^\./, '') || 'raw';
      const kind = inputPaths.length > 1 ? `${i}.${parser.id}.${ext}` : `${parser.id}.${ext}`;
      const relPath = writeRawObject(outputDir, currentCommit.sha, kind, content);
      sourcesArtifacts.push({ format: parser.id, path: relPath });
    }
  }

  // 4. Canonical LCOV generation for unified client consumption
  const canonicalLcov = fileCoveragesToLcov(mergedFiles);
  fs.writeFileSync(path.join(outputDir, 'lcov.info'), canonicalLcov, 'utf-8');

  let lcovArtifactPath: string | undefined;
  if (options.saveRaw) {
    writeLcovObject(outputDir, currentCommit.sha, canonicalLcov);
    lcovArtifactPath = `objects/${currentCommit.sha.slice(0, 2).toLowerCase()}/${currentCommit.sha.slice(2).toLowerCase()}.lcov`;
  }

  const artifacts = options.saveRaw
    ? {
        lcov: lcovArtifactPath,
        sources: sourcesArtifacts.length > 0 ? sourcesArtifacts : undefined,
      }
    : undefined;

  // 5. Hierarchical aggregation
  const aggregated = aggregateCoverage(mergedFiles);

  // 6. Create history entry for the current commit
  const currentEntry = createCommitHistoryEntry(
    currentCommit,
    aggregated.summary,
    aggregated.folders,
    aggregated.files,
    artifacts
  );

  // Find previous commit before appending current
  const existingPrevious = commitsHistory.length > 0 
    ? commitsHistory[commitsHistory.length - 1] 
    : undefined;

  const previousCommit = existingPrevious?.commit;
  const delta = calculateDelta(aggregated.summary, existingPrevious?.summary);

  // Append or update current commit
  commitsHistory = appendOrUpdateCommit(commitsHistory, currentEntry, maxHistory);

  // 6. Build Trends across all historical commits (overall, folder, file)
  const trends = buildTrends(commitsHistory);

  // 7. Save updated history and refs
  saveHistory(historyPath, commitsHistory);
  const refs = extractRefs(commitsHistory);
  saveRefs(path.join(outputDir, 'refs.json'), refs);

  // Git-like loose store: objects/, refs/heads, refs/tags, HEAD
  for (const entry of commitsHistory) writeCommitObject(outputDir, entry);
  migrateLegacyLcov(outputDir, commitsHistory);
  pruneObjects(outputDir, commitsHistory);
  writeLooseRefs(outputDir, refs);
  const defaultBranch = readHeadBranch(outputDir) || currentCommit.branch || 'main';
  writeHead(outputDir, defaultBranch);

  // 8. Assemble CovpagesData
  const repoName = options.repoName || path.basename(rootDir) || 'coverage';
  const title = options.title || 'Coverage Report';

  const covpagesData: CovpagesData = {
    title,
    repoName,
    baseUrl: options.baseUrl,
    defaultBranch,
    generatedAt: new Date().toISOString(),
    currentCommit,
    previousCommit,
    delta,
    summary: aggregated.summary,
    folders: aggregated.folders,
    files: aggregated.files,
    folderChildren: aggregated.folderChildren,
    commits: commitsHistory,
    refs,
    trends,
  };

  // 9. Render and write HTML, JS, CSS, JSON, .nojekyll, and .gitattributes
  const rendered = renderIndexHtml(covpagesData);

  fs.writeFileSync(path.join(outputDir, 'index.html'), rendered.html, 'utf-8');
  fs.writeFileSync(path.join(outputDir, 'covpages-data.json'), JSON.stringify(covpagesData, null, 2), 'utf-8');
  fs.writeFileSync(path.join(outputDir, 'covpages-data.js'), rendered.dataJs, 'utf-8');
  fs.writeFileSync(path.join(outputDir, '.nojekyll'), '', 'utf-8');
  fs.writeFileSync(path.join(outputDir, '.gitattributes'), GITATTRIBUTES_CONTENT, 'utf-8');
  fs.writeFileSync(path.join(outputDir, 'badge.svg'), generateBadgeSvg(aggregated.summary.lines.pct), 'utf-8');
  fs.writeFileSync(path.join(outputDir, '404.html'), render404Html(), 'utf-8');

  // 10. Generate scoped badges in badges/ directory for folders, files, branches, tags, and commits
  const badgesDir = path.join(outputDir, 'badges');
  if (!fs.existsSync(badgesDir)) {
    fs.mkdirSync(badgesDir, { recursive: true });
  }
  fs.writeFileSync(path.join(badgesDir, 'overall.svg'), generateBadgeSvg(aggregated.summary.lines.pct, 'coverage'), 'utf-8');

  // Branch badges: default branch is 'coverage', other branches are 'coverage@<branch>'
  const branchMap: Record<string, number> = {};
  if (currentCommit.branch) {
    branchMap[currentCommit.branch] = aggregated.summary.lines.pct;
  }
  if (refs.branches) {
    for (const [b, sha] of Object.entries(refs.branches)) {
      const match = commitsHistory.find(c => c.commit.sha === sha || c.commit.shortSha === sha);
      branchMap[b] = match ? match.summary.lines.pct : aggregated.summary.lines.pct;
    }
  }
  for (const [branch, pct] of Object.entries(branchMap)) {
    const bFile = getBadgeFileName('branch', branch);
    const bLabel = formatBadgeLabel('branch', branch, defaultBranch);
    fs.writeFileSync(path.join(badgesDir, bFile), generateBadgeSvg(pct, bLabel), 'utf-8');
  }

  // Tag badges: 'coverage@<tag>'
  const tagMap: Record<string, number> = {};
  if (currentCommit.tag) {
    tagMap[currentCommit.tag] = aggregated.summary.lines.pct;
  }
  if (refs.tags) {
    for (const [t, sha] of Object.entries(refs.tags)) {
      const match = commitsHistory.find(c => c.commit.sha === sha || c.commit.shortSha === sha);
      tagMap[t] = match ? match.summary.lines.pct : aggregated.summary.lines.pct;
    }
  }
  for (const [tag, pct] of Object.entries(tagMap)) {
    const tFile = getBadgeFileName('tag', tag);
    const tLabel = formatBadgeLabel('tag', tag, defaultBranch);
    fs.writeFileSync(path.join(badgesDir, tFile), generateBadgeSvg(pct, tLabel), 'utf-8');
  }

  // Commit badges: 'coverage@<commit-id>'
  for (const entry of commitsHistory) {
    if (entry.commit.shortSha) {
      const cFile = getBadgeFileName('commit', entry.commit.shortSha);
      const cLabel = formatBadgeLabel('commit', entry.commit.shortSha, defaultBranch);
      fs.writeFileSync(path.join(badgesDir, cFile), generateBadgeSvg(entry.summary.lines.pct, cLabel), 'utf-8');
    }
  }

  for (const [fPath, fCov] of Object.entries(aggregated.folders)) {
    if (!fPath) continue;
    const fFile = getBadgeFileName('folder', fPath);
    fs.writeFileSync(path.join(badgesDir, fFile), generateBadgeSvg(fCov.lines.pct, fPath), 'utf-8');
  }

  for (const [filePath, fileCov] of Object.entries(aggregated.files)) {
    const fileFile = getBadgeFileName('file', filePath);
    fs.writeFileSync(path.join(badgesDir, fileFile), generateBadgeSvg(fileCov.lines.pct, path.basename(filePath)), 'utf-8');
  }

  return covpagesData;
}
