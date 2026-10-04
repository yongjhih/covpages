import type { FileCoverage, FolderCoverage, CoverageMetric, CoverageReport } from '../types.js';

function calcPct(covered: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((covered / total) * 10000) / 100;
}

export function aggregateCoverage(files: Record<string, FileCoverage>): CoverageReport & {
  folderChildren: Record<string, { subfolders: string[]; files: string[] }>;
} {
  const folders: Record<string, FolderCoverage> = {};
  const folderChildren: Record<string, { subfolders: Set<string>; files: string[] }> = {};

  const ensureFolder = (fPath: string) => {
    if (!folders[fPath]) {
      const parts = fPath ? fPath.split('/') : [];
      const name = parts.length > 0 ? parts[parts.length - 1] : 'root';
      folders[fPath] = {
        path: fPath,
        name,
        lines: { total: 0, covered: 0, skipped: 0, pct: 100 },
        functions: { total: 0, covered: 0, skipped: 0, pct: 100 },
        branches: { total: 0, covered: 0, skipped: 0, pct: 100 },
        filesCount: 0,
        foldersCount: 0,
      };
      folderChildren[fPath] = {
        subfolders: new Set(),
        files: [],
      };
    }
  };

  ensureFolder(''); // root folder

  // First pass: add files to their immediate parent and all ancestor folders
  for (const [filePath, fileCov] of Object.entries(files)) {
    const parts = filePath.split('/');
    const dirParts = parts.slice(0, -1);
    const immediateDir = dirParts.join('/');

    // Ensure all ancestor directories exist
    let currentDir = '';
    ensureFolder('');

    for (let i = 0; i < dirParts.length; i++) {
      const nextDir = dirParts.slice(0, i + 1).join('/');
      ensureFolder(nextDir);
      folderChildren[currentDir].subfolders.add(nextDir);
      currentDir = nextDir;
    }

    // Add file to its immediate directory
    folderChildren[immediateDir].files.push(filePath);

    // Roll up metrics into all ancestor folders (including root)
    let rollDir = '';
    const addMetrics = (targetDir: string) => {
      const f = folders[targetDir];
      f.lines.total += fileCov.lines.total;
      f.lines.covered += fileCov.lines.covered;
      f.lines.skipped += fileCov.lines.skipped;

      f.functions.total += fileCov.functions.total;
      f.functions.covered += fileCov.functions.covered;
      f.functions.skipped += fileCov.functions.skipped;

      f.branches.total += fileCov.branches.total;
      f.branches.covered += fileCov.branches.covered;
      f.branches.skipped += fileCov.branches.skipped;

      f.filesCount += 1;
    };

    addMetrics(''); // root
    for (let i = 0; i < dirParts.length; i++) {
      const targetDir = dirParts.slice(0, i + 1).join('/');
      addMetrics(targetDir);
    }
  }

  // Calculate percentages and folder counts for each folder
  for (const folder of Object.values(folders)) {
    folder.lines.pct = calcPct(folder.lines.covered, folder.lines.total);
    folder.functions.pct = calcPct(folder.functions.covered, folder.functions.total);
    folder.branches.pct = calcPct(folder.branches.covered, folder.branches.total);
    folder.foldersCount = folderChildren[folder.path].subfolders.size;
  }

  // Convert Set to sorted Array for folderChildren
  const finalFolderChildren: Record<string, { subfolders: string[]; files: string[] }> = {};
  for (const [fPath, child] of Object.entries(folderChildren)) {
    finalFolderChildren[fPath] = {
      subfolders: Array.from(child.subfolders).sort(),
      files: child.files.sort(),
    };
  }

  const rootFolder = folders[''] || {
    lines: { total: 0, covered: 0, skipped: 0, pct: 100 },
    functions: { total: 0, covered: 0, skipped: 0, pct: 100 },
    branches: { total: 0, covered: 0, skipped: 0, pct: 100 },
  };

  const summary = {
    lines: { ...rootFolder.lines },
    functions: { ...rootFolder.functions },
    branches: { ...rootFolder.branches },
  };

  return {
    summary,
    folders,
    files,
    folderChildren: finalFolderChildren,
  };
}
