import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type {
  CommitHistoryEntry,
  CommitInfo,
  CovpagesData,
  FileCoverage,
} from '../types.js';
import { parseCoverageFile } from '../parsers/index.js';
import { aggregateCoverage } from './aggregator.js';
import {
  createCommitHistoryEntry,
  buildTrends,
  loadHistory,
  saveHistory,
  appendOrUpdateCommit,
  calculateDelta,
} from './history.js';
import { renderIndexHtml } from '../templates/index.html.js';

export interface BackfillOptions {
  range?: string;
  count?: number;
  testCmd?: string;
  coverageFile?: string;
  outputDir?: string;
  historyFile?: string;
  repoName?: string;
  title?: string;
  cwd?: string;
}

function runGit(cmd: string, cwd: string): string {
  return execSync(`git ${cmd}`, {
    cwd,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'ignore'],
  }).trim();
}

export function backfillCommits(options: BackfillOptions = {}): CovpagesData {
  const cwd = path.resolve(options.cwd || process.cwd());
  const outputDir = path.resolve(options.outputDir || 'covpages-dist');
  const historyPath = options.historyFile 
    ? path.resolve(options.historyFile) 
    : path.join(outputDir, 'history.json');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Check if git repo
  try {
    runGit('rev-parse --is-inside-work-tree', cwd);
  } catch {
    throw new Error(`Directory is not a git repository: ${cwd}`);
  }

  // 2. Save current ref
  let currentRef = runGit('rev-parse --abbrev-ref HEAD', cwd);
  if (currentRef === 'HEAD') {
    currentRef = runGit('rev-parse HEAD', cwd);
  }

  // 3. Stash any uncommitted work
  const status = runGit('status --porcelain', cwd);
  let didStash = false;
  if (status.length > 0) {
    console.log('📦 Working tree is dirty; stashing uncommitted changes...');
    try {
      execSync('git stash push -u -m "covpages-backfill-temporary-stash"', { cwd, stdio: 'ignore' });
      didStash = true;
    } catch {
      // ignore
    }
  }

  // 4. Resolve commit list
  let revs: string[] = [];
  if (options.range) {
    revs = runGit(`rev-list --reverse ${options.range}`, cwd).split(/\r?\n/).filter(Boolean);
  } else {
    const count = options.count || 5;
    revs = runGit(`rev-list --reverse -n ${count} HEAD`, cwd).split(/\r?\n/).filter(Boolean);
  }

  if (revs.length === 0) {
    throw new Error('No commits found in the specified range.');
  }

  console.log(`\n⏳ Found ${revs.length} commits to backfill.`);

  // Determine test command
  let testCmd = options.testCmd;
  if (!testCmd) {
    const pkgPath = path.join(cwd, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (pkg.scripts && pkg.scripts['test:coverage']) {
          testCmd = 'npm run test:coverage';
        } else if (pkg.scripts && pkg.scripts.test) {
          testCmd = 'npm test';
        }
      } catch {
        // ignore
      }
    }
  }
  if (!testCmd) {
    testCmd = 'npm test';
  }

  const covFileRelative = options.coverageFile || 'coverage/lcov.info';

  let commitsHistory = loadHistory(historyPath);
  let lastFiles: Record<string, FileCoverage> = {};
  let lastCommitInfo: CommitInfo | undefined;

  try {
    for (let i = 0; i < revs.length; i++) {
      const sha = revs[i];
      const shortSha = sha.slice(0, 7);
      const message = runGit(`log -1 --pretty=%B ${sha}`, cwd).split('\n')[0].trim();
      const author = runGit(`log -1 --pretty=%an ${sha}`, cwd).trim();
      const date = new Date(runGit(`log -1 --pretty=%cI ${sha}`, cwd).trim()).toISOString();
      const branch = runGit(`branch --contains ${sha}`, cwd).replace(/^\*?\s+/, '').split('\n')[0] || 'main';

      console.log(`[${i + 1}/${revs.length}] Checking out ${shortSha}: "${message}"`);
      execSync(`git checkout -q ${sha}`, { cwd, stdio: 'ignore' });

      // Run test command
      try {
        execSync(testCmd, { cwd, stdio: 'ignore' });
      } catch {
        console.warn(`  ⚠️ Test command failed for ${shortSha}, checking if coverage file was generated anyway...`);
      }

      const covFullPath = path.join(cwd, covFileRelative);
      if (fs.existsSync(covFullPath)) {
        const parsedFiles = parseCoverageFile(covFullPath, {
          rootDir: cwd,
          includeSource: false,
        });

        const aggregated = aggregateCoverage(parsedFiles);
        const commitInfo: CommitInfo = {
          sha,
          shortSha,
          message,
          author,
          date,
          branch,
        };

        const entry = createCommitHistoryEntry(
          commitInfo,
          aggregated.summary,
          aggregated.folders,
          aggregated.files
        );

        commitsHistory = appendOrUpdateCommit(commitsHistory, entry, 100);
        lastFiles = parsedFiles;
        lastCommitInfo = commitInfo;
        console.log(`  ✅ Recorded coverage: ${aggregated.summary.lines.pct}% lines`);
      } else {
        console.warn(`  ⚠️ Coverage file not found at ${covFileRelative} for commit ${shortSha}`);
      }
    }
  } finally {
    // 5. Restore original ref and unstash
    console.log(`\n🔄 Restoring repository to ${currentRef}...`);
    try {
      execSync(`git checkout -q ${currentRef}`, { cwd, stdio: 'ignore' });
    } catch {
      // ignore
    }

    if (didStash) {
      console.log('📦 Restoring stashed changes...');
      try {
        execSync('git stash pop -q', { cwd, stdio: 'ignore' });
      } catch {
        // ignore
      }
    }
  }

  // 6. Build Trends and finalize
  const trends = buildTrends(commitsHistory);
  saveHistory(historyPath, commitsHistory);

  const aggregated = aggregateCoverage(lastFiles);
  const currentCommit = lastCommitInfo || {
    sha: runGit('rev-parse HEAD', cwd),
    shortSha: runGit('rev-parse --short HEAD', cwd),
    message: 'Backfilled coverage',
    author: 'developer',
    date: new Date().toISOString(),
    branch: currentRef,
  };

  const previousCommit = commitsHistory.length > 1 
    ? commitsHistory[commitsHistory.length - 2]?.commit 
    : undefined;

  const previousSummary = commitsHistory.length > 1 
    ? commitsHistory[commitsHistory.length - 2]?.summary 
    : undefined;

  const delta = calculateDelta(aggregated.summary, previousSummary);

  const repoName = options.repoName || path.basename(cwd) || 'coverage';
  const title = options.title || 'Coverage Report';

  const covpagesData: CovpagesData = {
    title,
    repoName,
    generatedAt: new Date().toISOString(),
    currentCommit,
    previousCommit,
    delta,
    summary: aggregated.summary,
    folders: aggregated.folders,
    files: aggregated.files,
    folderChildren: aggregated.folderChildren,
    commits: commitsHistory,
    trends,
  };

  const rendered = renderIndexHtml(covpagesData);

  fs.writeFileSync(path.join(outputDir, 'index.html'), rendered.html, 'utf-8');
  fs.writeFileSync(path.join(outputDir, 'covpages-data.json'), JSON.stringify(covpagesData, null, 2), 'utf-8');
  fs.writeFileSync(path.join(outputDir, 'covpages-data.js'), rendered.dataJs, 'utf-8');

  console.log(`\n🎉 Backfill complete! Retained ${commitsHistory.length} commits in history.`);
  console.log(`   Output generated at: ${path.join(outputDir, 'index.html')}\n`);

  return covpagesData;
}
