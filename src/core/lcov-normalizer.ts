/**
 * Normalizes LCOV content to ensure deterministic, sorted output.
 * This guarantees maximal Git delta compression across consecutive commits.
 */
export function normalizeLcov(content: string): string {
  if (!content || !content.trim()) return '';

  const records: { sf: string; lines: string[] }[] = [];
  const rawLines = content.split(/\r?\n/);
  let currentSf = '';
  let currentLines: string[] = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('SF:')) {
      currentSf = trimmed.slice(3).trim();
      currentLines = [trimmed];
    } else if (trimmed === 'end_of_record') {
      currentLines.push(trimmed);
      if (currentSf) {
        records.push({ sf: currentSf, lines: currentLines });
      }
      currentSf = '';
      currentLines = [];
    } else {
      if (currentLines.length > 0) {
        currentLines.push(trimmed);
      }
    }
  }

  // Sort file records alphabetically by path
  records.sort((a, b) => a.sf.localeCompare(b.sf));

  // Sort internal lines per record deterministically
  const output: string[] = [];
  for (const rec of records) {
    const fnLines: string[] = [];
    const fndaLines: string[] = [];
    const brdaLines: string[] = [];
    const daLines: string[] = [];
    let fnf = '';
    let fnh = '';
    let brf = '';
    let brh = '';
    let lf = '';
    let lh = '';

    for (const l of rec.lines) {
      if (l.startsWith('SF:') || l === 'end_of_record') continue;
      if (l.startsWith('FN:')) fnLines.push(l);
      else if (l.startsWith('FNDA:')) fndaLines.push(l);
      else if (l.startsWith('FNF:')) fnf = l;
      else if (l.startsWith('FNH:')) fnh = l;
      else if (l.startsWith('BRDA:')) brdaLines.push(l);
      else if (l.startsWith('BRF:')) brf = l;
      else if (l.startsWith('BRH:')) brh = l;
      else if (l.startsWith('DA:')) daLines.push(l);
      else if (l.startsWith('LF:')) lf = l;
      else if (l.startsWith('LH:')) lh = l;
    }

    // Sort FN by line number
    fnLines.sort((a, b) => {
      const lineA = parseInt(a.slice(3).split(',')[0], 10) || 0;
      const lineB = parseInt(b.slice(3).split(',')[0], 10) || 0;
      return lineA - lineB;
    });

    // Sort FNDA by function name
    fndaLines.sort((a, b) => a.localeCompare(b));

    // Sort BRDA by line, block, branch
    brdaLines.sort((a, b) => {
      const partsA = a.slice(5).split(',').map(Number);
      const partsB = b.slice(5).split(',').map(Number);
      for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
        if (partsA[i] !== partsB[i]) return partsA[i] - partsB[i];
      }
      return 0;
    });

    // Sort DA numerically by line number
    daLines.sort((a, b) => {
      const lineA = parseInt(a.slice(3).split(',')[0], 10) || 0;
      const lineB = parseInt(b.slice(3).split(',')[0], 10) || 0;
      return lineA - lineB;
    });

    output.push(`SF:${rec.sf}`);
    output.push(...fnLines);
    output.push(...fndaLines);
    if (fnf) output.push(fnf);
    if (fnh) output.push(fnh);
    output.push(...brdaLines);
    if (brf) output.push(brf);
    if (brh) output.push(brh);
    output.push(...daLines);
    if (lf) output.push(lf);
    if (lh) output.push(lh);
    output.push('end_of_record');
  }

  return output.join('\n') + '\n';
}

/**
 * Converts internal FileCoverage map (regardless of original input format: Cobertura, JSON, etc.)
 * into a standardized, deterministic normalized LCOV format.
 */
export function fileCoveragesToLcov(files: Record<string, import('../types.js').FileCoverage>): string {
  const filePaths = Object.keys(files).sort((a, b) => a.localeCompare(b));
  const output: string[] = [];

  for (const filePath of filePaths) {
    const file = files[filePath];
    output.push(`SF:${file.path || filePath}`);

    // FN / FNDA
    if (file.functionDetails && file.functionDetails.length > 0) {
      const sortedFns = [...file.functionDetails].sort((a, b) => a.line - b.line);
      for (const fn of sortedFns) {
        output.push(`FN:${fn.line},${fn.name}`);
      }
      const sortedFnda = [...file.functionDetails].sort((a, b) => a.name.localeCompare(b.name));
      for (const fn of sortedFnda) {
        output.push(`FNDA:${fn.hits},${fn.name}`);
      }
      output.push(`FNF:${file.functions.total}`);
      output.push(`FNH:${file.functions.covered}`);
    }

    // BRDA
    if (file.lineDetails) {
      const lineNumbers = Object.keys(file.lineDetails).map(Number).sort((a, b) => a - b);
      let brCount = 0;
      for (const ln of lineNumbers) {
        const detail = file.lineDetails[ln];
        if (detail?.branches) {
          const total = detail.branches.total || 0;
          const taken = detail.branches.taken || 0;
          for (let b = 0; b < total; b++) {
            const hit = b < taken ? 1 : 0;
            output.push(`BRDA:${ln},0,${b},${hit}`);
            brCount++;
          }
        }
      }
      if (brCount > 0 || file.branches.total > 0) {
        output.push(`BRF:${file.branches.total}`);
        output.push(`BRH:${file.branches.covered}`);
      }

      // DA
      for (const ln of lineNumbers) {
        const hits = file.lineDetails[ln]?.hits ?? 0;
        output.push(`DA:${ln},${hits}`);
      }
      output.push(`LF:${file.lines.total}`);
      output.push(`LH:${file.lines.covered}`);
    }

    output.push('end_of_record');
  }

  return normalizeLcov(output.join('\n'));
}

/**
 * Standard .gitattributes content for GitHub Pages and coverage directories
 * to guarantee optimal delta compression and LF normalization in git packfiles.
 */
export const GITATTRIBUTES_CONTENT = `# Covpages Git Packfile Optimization
# Forces text mode and LF line endings to maximize delta compression across commits
*.info text eol=lf delta
*.lcov text eol=lf delta
*.json text eol=lf delta
*.js text eol=lf delta
*.html text eol=lf delta
`;
