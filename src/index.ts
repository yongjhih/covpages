import fs from 'node:fs';
import path from 'node:path';
import type {
  CovpagesData,
  GenerateOptions,
  FileCoverage,
  CommitHistoryEntry,
} from './types.js';
import { parseCoverageFile } from './parsers/index.js';
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
import { normalizeLcov, GITATTRIBUTES_CONTENT } from './core/lcov-normalizer.js';
import { generateBadgeSvg, getBadgeFileName } from './core/badge.js';
import { renderIndexHtml, render404Html } from './templates/index.html.js';

export * from './types.js';
export * from './parsers/index.js';
export * from './core/aggregator.js';
export * from './core/history.js';
export * from './core/git.js';
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

  const inputPaths = options.inputs && options.inputs.length > 0 
    ? options.inputs 
    : ['coverage/lcov.info'];

  for (const inputPath of inputPaths) {
    const resolvedInput = path.resolve(inputPath);
    if (!fs.existsSync(resolvedInput)) {
      throw new Error(`Coverage input file not found: ${resolvedInput}`);
    }

    const parsed = parseCoverageFile(resolvedInput, {
      format: options.format,
      rootDir,
      includeSource: options.includeSource ?? true,
    });

    mergedFiles = { ...mergedFiles, ...parsed };
  }

  // 4. Hierarchical aggregation
  const aggregated = aggregateCoverage(mergedFiles);

  // 5. Create history entry for the current commit
  const currentEntry = createCommitHistoryEntry(
    currentCommit,
    aggregated.summary,
    aggregated.folders,
    aggregated.files
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

  // 8. Assemble CovpagesData
  const repoName = options.repoName || path.basename(rootDir) || 'coverage';
  const title = options.title || 'Coverage Report';

  const covpagesData: CovpagesData = {
    title,
    repoName,
    baseUrl: options.baseUrl,
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

  // 10. Generate scoped badges in badges/ directory for folders, files, and branches
  const badgesDir = path.join(outputDir, 'badges');
  if (!fs.existsSync(badgesDir)) {
    fs.mkdirSync(badgesDir, { recursive: true });
  }
  fs.writeFileSync(path.join(badgesDir, 'overall.svg'), generateBadgeSvg(aggregated.summary.lines.pct, 'coverage'), 'utf-8');

  if (currentCommit.branch) {
    const bFile = getBadgeFileName('branch', currentCommit.branch);
    fs.writeFileSync(path.join(badgesDir, bFile), generateBadgeSvg(aggregated.summary.lines.pct, currentCommit.branch), 'utf-8');
  }
  if (currentCommit.tag) {
    const tFile = getBadgeFileName('tag', currentCommit.tag);
    fs.writeFileSync(path.join(badgesDir, tFile), generateBadgeSvg(aggregated.summary.lines.pct, currentCommit.tag), 'utf-8');
  }
  if (currentCommit.shortSha) {
    fs.writeFileSync(path.join(badgesDir, `commit-${currentCommit.shortSha}.svg`), generateBadgeSvg(aggregated.summary.lines.pct, currentCommit.shortSha), 'utf-8');
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

  // 10. Normalize and write lcov.info if an LCOV input file exists
  for (const inp of inputPaths) {
    if (inp.endsWith('.info') || inp.endsWith('.lcov')) {
      try {
        const rawLcov = fs.readFileSync(path.resolve(inp), 'utf-8');
        const normalized = normalizeLcov(rawLcov);
        fs.writeFileSync(path.join(outputDir, 'lcov.info'), normalized, 'utf-8');

        if (options.saveRaw) {
          const rawDir = path.join(outputDir, 'history', 'lcov');
          if (!fs.existsSync(rawDir)) {
            fs.mkdirSync(rawDir, { recursive: true });
          }
          fs.writeFileSync(path.join(rawDir, `lcov-${currentCommit.shortSha}.info`), normalized, 'utf-8');
        }
      } catch {}
      break;
    }
  }

  return covpagesData;
}
