import { execSync } from 'node:child_process';
import type { CommitInfo } from '../types.js';

function runGit(cmd: string, cwd?: string): string {
  try {
    return execSync(`git ${cmd}`, {
      cwd: cwd || process.cwd(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

export function resolveCommitInfo(options?: {
  cwd?: string;
  sha?: string;
  message?: string;
  author?: string;
  date?: string;
  branch?: string;
  tag?: string;
}): CommitInfo {
  const cwd = options?.cwd || process.cwd();

  // 1. Explicit CLI options take highest priority
  let sha = options?.sha || process.env.GITHUB_SHA || runGit('rev-parse HEAD', cwd) || '0000000000000000000000000000000000000000';
  let shortSha = sha.slice(0, 7);
  let message = options?.message || (process.env.GITHUB_SHA ? '' : runGit('log -1 --pretty=%B', cwd).split('\n')[0]) || 'Initial commit';
  let author = options?.author || process.env.GITHUB_ACTOR || runGit('log -1 --pretty=%an', cwd) || 'developer';
  let date = options?.date || (runGit('log -1 --pretty=%cI', cwd)) || new Date().toISOString();
  let branch = options?.branch || process.env.GITHUB_HEAD_REF || (process.env.GITHUB_REF_TYPE === 'branch' ? process.env.GITHUB_REF_NAME : '') || runGit('rev-parse --abbrev-ref HEAD', cwd) || 'main';
  let tag = options?.tag || (process.env.GITHUB_REF_TYPE === 'tag' ? process.env.GITHUB_REF_NAME : '') || runGit('describe --tags --exact-match', cwd) || '';

  if (tag) {
    tag = tag.trim().replace(/^refs\/tags\//, '');
  }

  // Normalize date to ISO string if possible
  try {
    date = new Date(date).toISOString();
  } catch {
    date = new Date().toISOString();
  }

  return {
    sha,
    shortSha,
    message: message.trim() || 'Commit update',
    author: author.trim(),
    date,
    branch: branch.trim().replace(/^refs\/heads\//, ''),
    tag: tag || undefined,
  };
}
