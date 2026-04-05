import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import {
  objectRelPath,
  writeCommitObject,
  writeLcovObject,
  loadCommitObjects,
  pruneObjects,
  writeLooseRefs,
  writeHead,
  readHeadBranch,
  migrateLegacyLcov,
} from '../src/core/store.js';
import { appendOrUpdateCommit, extractRefs } from '../src/core/history.js';
import { resolveContainingBranch } from '../src/core/git.js';
import type { CommitHistoryEntry } from '../src/types.js';

const m = { total: 10, covered: 5, skipped: 5, pct: 50 };
function entry(sha: string, date: string, branch: string, tag?: string): CommitHistoryEntry {
  return {
    commit: { sha, shortSha: sha.slice(0, 7), message: 'm', author: 'a', date, branch, tag },
    summary: { lines: m, functions: m, branches: m },
    folders: {},
    files: {},
  } as unknown as CommitHistoryEntry;
}
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'covpages-store-'));
const A = 'a1b2c3d4e5f60718293a4b5c6d7e8f9012345678';
const B = 'b1b2c3d4e5f60718293a4b5c6d7e8f9012345678';

describe('git-like store', () => {
  it('fans objects out by sha prefix', () => {
    expect(objectRelPath(A, 'json')).toBe('objects/a1/b2c3d4e5f60718293a4b5c6d7e8f9012345678.json');
  });

  it('round-trips objects, refs and HEAD, and prunes', () => {
    const dir = tmp();
    writeCommitObject(dir, entry(A, '2026-01-01T00:00:00Z', 'main'));
    writeCommitObject(dir, entry(B, '2026-01-02T00:00:00Z', 'main', 'v1.0.0'));
    writeLcovObject(dir, A, 'TN:\n');
    expect(loadCommitObjects(dir).map((e) => e.commit.sha).sort()).toEqual([A, B]);

    pruneObjects(dir, [entry(B, '', 'main')]);
    expect(fs.existsSync(path.join(dir, objectRelPath(A, 'json')))).toBe(false);
    expect(fs.existsSync(path.join(dir, objectRelPath(A, 'lcov')))).toBe(false);
    expect(fs.existsSync(path.join(dir, 'objects', 'a1'))).toBe(false);

    writeLooseRefs(dir, { branches: { main: B, 'feature/x': A }, tags: { 'v1.0.0': B } });
    expect(fs.readFileSync(path.join(dir, 'refs/heads/main'), 'utf-8')).toBe(`${B}\n`);
    expect(fs.readFileSync(path.join(dir, 'refs/heads/feature/x'), 'utf-8')).toBe(`${A}\n`);
    expect(fs.readFileSync(path.join(dir, 'refs/tags/v1.0.0'), 'utf-8')).toBe(`${B}\n`);

    writeHead(dir, 'main');
    expect(readHeadBranch(dir)).toBe('main');
  });

  it('migrates legacy history/lcov files into objects', () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, 'history/lcov'), { recursive: true });
    fs.writeFileSync(path.join(dir, `history/lcov/lcov-${A.slice(0, 7)}.info`), 'LEGACY');
    expect(migrateLegacyLcov(dir, [entry(A, '', 'main')])).toBe(1);
    expect(fs.readFileSync(path.join(dir, objectRelPath(A, 'lcov')), 'utf-8')).toBe('LEGACY');
    expect(fs.existsSync(path.join(dir, 'history'))).toBe(false);
  });
});

describe('tag reports attach to their branch', () => {
  it('merges a tag report into the existing branch commit', () => {
    let h = appendOrUpdateCommit([], entry(A, '2026-01-01T00:00:00Z', 'main'));
    h = appendOrUpdateCommit(h, entry(A, '2026-01-01T00:00:00Z', 'HEAD', 'v1.0.0'));
    expect(h).toHaveLength(1);
    expect(h[0].commit).toMatchObject({ branch: 'main', tag: 'v1.0.0' });
    expect(extractRefs(h)).toEqual({ branches: { main: A }, tags: { 'v1.0.0': A } });
  });

  it('keeps the tag when the branch report arrives later', () => {
    let h = appendOrUpdateCommit([], entry(A, '2026-01-01T00:00:00Z', 'main', 'v1.0.0'));
    h = appendOrUpdateCommit(h, entry(A, '2026-01-01T00:00:00Z', 'main'));
    expect(h[0].commit.tag).toBe('v1.0.0');
  });

  it('resolves the containing branch of a tagged commit', () => {
    const dir = tmp();
    const git = (c: string) => execSync(`git ${c}`, { cwd: dir, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    git('init -q -b main');
    git('-c user.name=t -c user.email=t@t commit -q --allow-empty -m one');
    git('tag v1.0.0');
    const sha = git('rev-parse HEAD');
    git('checkout -q --detach v1.0.0');
    expect(resolveContainingBranch(sha, dir)).toBe('main');
  });
});
