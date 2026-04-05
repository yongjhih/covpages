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

/**
 * Find the branch a commit lives on (used for tag builds / detached HEAD).
 * Preference: remote default branch > main > master > first match.
 */
export function resolveContainingBranch(sha: string, cwd?: string): string | undefined {
  const list = (args: string) =>
    runGit(`branch ${args} --contains ${sha} --format='%(refname:short)'`, cwd)
      .split(/\r?\n/)
      .map((b) => b.trim().replace(/^origin\//, ''))
      .filter((b) => b && b !== 'HEAD' && b !== 'origin' && !b.includes('HEAD detached'));
  const candidates = [...new Set([...list('-r'), ...list('')])];
  if (candidates.length === 0) return undefined;
  const def = runGit('symbolic-ref --short refs/remotes/origin/HEAD', cwd).replace(/^origin\//, '');
  for (const pref of [def, 'main', 'master']) {
    if (pref && candidates.includes(pref)) return pref;
  }
  return candidates[0];
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

  // A tag is not a branch: when the given/derived "branch" is actually the tag name
  // or a detached HEAD, find the branch that contains the tagged commit instead.
  branch = branch.trim().replace(/^refs\/heads\//, '');
  if (!branch || branch === 'HEAD' || (tag && branch === tag)) {
    branch = resolveContainingBranch(sha, cwd) || 'main';
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
