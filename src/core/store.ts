/**
 * Git-inspired on-disk store for coverage history.
 *
 * Layout (relative to the output directory):
 *
 *   HEAD                                   "ref: refs/heads/<default-branch>"
 *   objects/<sha[0:2]>/<sha[2:]>.json      one CommitHistoryEntry per commit (content addressed by commit SHA)
 *   objects/<sha[0:2]>/<sha[2:]>.lcov      normalized raw LCOV for that commit (optional, --save-raw)
 *   refs/heads/<branch>                    "<sha>\n"  latest reported commit on the branch
 *   refs/tags/<tag>                        "<sha>\n"  commit the tag points at
 *
 * `history.json` and `refs.json` remain as compiled indexes (akin to git's
 * packed-refs) so static pages can load everything with a single fetch.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { CommitHistoryEntry, RefMap } from '../types.js';

export type ObjectKind = 'json' | 'lcov';

const SHA_RE = /^[0-9a-f]{7,64}$/i;

export function objectRelPath(sha: string, kind: ObjectKind): string {
  const s = sha.toLowerCase();
  return `objects/${s.slice(0, 2)}/${s.slice(2)}.${kind}`;
}

export function objectPath(outputDir: string, sha: string, kind: ObjectKind): string {
  return path.join(outputDir, objectRelPath(sha, kind));
}

function writeFile(file: string, content: string): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf-8');
}

export function writeCommitObject(outputDir: string, entry: CommitHistoryEntry): void {
  if (!SHA_RE.test(entry.commit.sha)) return;
  writeFile(objectPath(outputDir, entry.commit.sha, 'json'), JSON.stringify(entry, null, 2));
}

export function writeLcovObject(outputDir: string, sha: string, lcov: string): void {
  if (!SHA_RE.test(sha)) return;
  writeFile(objectPath(outputDir, sha, 'lcov'), lcov);
}

/** Read every commit object under objects/. */
export function loadCommitObjects(outputDir: string): CommitHistoryEntry[] {
  const root = path.join(outputDir, 'objects');
  if (!fs.existsSync(root)) return [];
  const out: CommitHistoryEntry[] = [];
  for (const fan of fs.readdirSync(root)) {
    const dir = path.join(root, fan);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json')) continue;
      try {
        const entry = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'));
        if (entry?.commit?.sha) out.push(entry);
      } catch {
        // skip corrupt object
      }
    }
  }
  return out;
}

/** Remove commit objects (and their lcov) that are no longer part of the retained history. */
export function pruneObjects(outputDir: string, keep: CommitHistoryEntry[]): void {
  const root = path.join(outputDir, 'objects');
  if (!fs.existsSync(root)) return;
  const keepSet = new Set(keep.map((c) => c.commit.sha.toLowerCase()));
  for (const fan of fs.readdirSync(root)) {
    const dir = path.join(root, fan);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      const sha = fan + f.replace(/\.(json|lcov)$/, '');
      if (!keepSet.has(sha)) fs.rmSync(path.join(dir, f), { force: true });
    }
    if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  }
}

/** Write loose refs: refs/heads/* and refs/tags/*, replacing stale ones. */
export function writeLooseRefs(outputDir: string, refs: RefMap): void {
  for (const [kind, map] of [['heads', refs.branches], ['tags', refs.tags]] as const) {
    const dir = path.join(outputDir, 'refs', kind);
    fs.rmSync(dir, { recursive: true, force: true });
    for (const [name, sha] of Object.entries(map)) {
      // Ref names may contain "/" (e.g. feature/x) – just like git, they become nested paths.
      if (!name || name.includes('..')) continue;
      writeFile(path.join(dir, name), `${sha}\n`);
    }
  }
}

export function writeHead(outputDir: string, branch: string): void {
  if (!branch) return;
  writeFile(path.join(outputDir, 'HEAD'), `ref: refs/heads/${branch}\n`);
}

export function readHeadBranch(outputDir: string): string | undefined {
  try {
    const m = fs.readFileSync(path.join(outputDir, 'HEAD'), 'utf-8').match(/^ref: refs\/heads\/(.+)$/m);
    return m?.[1].trim();
  } catch {
    return undefined;
  }
}

/**
 * Migrate legacy `history/lcov/lcov-<shortSha>.info` files into objects/ and
 * remove the legacy directory once everything known has been moved.
 */
export function migrateLegacyLcov(outputDir: string, commits: CommitHistoryEntry[]): number {
  const legacyDir = path.join(outputDir, 'history', 'lcov');
  if (!fs.existsSync(legacyDir)) return 0;
  let moved = 0;
  for (const f of fs.readdirSync(legacyDir)) {
    const m = f.match(/^(?:lcov-)?([0-9a-f]{7,64})\.(?:info|lcov)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const entry = commits.find((c) => c.commit.sha.toLowerCase().startsWith(key));
    if (!entry) continue;
    const target = objectPath(outputDir, entry.commit.sha, 'lcov');
    if (!fs.existsSync(target)) {
      writeFile(target, fs.readFileSync(path.join(legacyDir, f), 'utf-8'));
    }
    fs.rmSync(path.join(legacyDir, f), { force: true });
    moved++;
  }
  if (fs.readdirSync(legacyDir).length === 0) {
    fs.rmSync(path.join(outputDir, 'history'), { recursive: true, force: true });
  }
  return moved;
}
