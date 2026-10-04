export const APP_JS = `
(function() {
  'use strict';

  // Read data from window.__COVPAGES_DATA__
  const data = window.__COVPAGES_DATA__;
  if (!data) {
    console.error('Covpages data not found.');
    return;
  }

  // Icons map passed from backend
  const icons = window.__COVPAGES_ICONS__ || {};

  // Application State
  const state = {
    activeTab: 'files', // 'files' | 'trends' | 'commits'
    currentFolder: '',
    selectedFile: null,
    selectedCommitSha: data.currentCommit?.sha || '',
    trendScope: 'overall', // 'overall' | 'folder' | 'file'
    trendTarget: '',
    trendMetric: 'linesPct', // 'linesPct' | 'functionsPct' | 'branchesPct'
    filterText: '',
    sortColumn: 'name',
    sortAsc: true,
    theme: localStorage.getItem('covpages-theme') || 'auto',
  };

  // Helper: rate class based on percentage
  function getRateClass(pct) {
    if (pct >= 80) return 'rate-high';
    if (pct >= 50) return 'rate-medium';
    return 'rate-low';
  }

  function getRateColor(pct) {
    if (pct >= 80) return 'var(--color-success-fg)';
    if (pct >= 50) return 'var(--color-attention-fg)';
    return 'var(--color-danger-fg)';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(isoStr) {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  }

  // DOM Elements
  const container = document.getElementById('covpages-app');
  const tooltipEl = document.getElementById('chart-tooltip');

  // Theme application
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem('covpages-theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  applyTheme(state.theme);

  // Render top header
  function renderHeader() {
    const isDark = state.theme === 'dark' || (state.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const themeIcon = isDark ? icons.sun : icons.moon;
    const currentC = data.currentCommit;

    return \`
      <header class="gh-header">
        <div class="gh-header-inner">
          <a href="#" class="gh-brand" id="brand-link">
            <span class="gh-brand-icon">\${icons.github || ''}</span>
            <span>\${escapeHtml(data.repoName || 'covpages')}</span>
            <span class="gh-repo-title">/ \${escapeHtml(data.title || 'Coverage')}</span>
          </a>
          <div class="gh-header-actions">
            <span class="gh-btn" title="Branch">
              \${icons.branch || ''}
              <span>\${escapeHtml(currentC?.branch || 'main')}</span>
            </span>
            <span class="gh-btn" title="Commit">
              \${icons.commit || ''}
              <span class="commit-sha-badge">\${escapeHtml(currentC?.shortSha || '')}</span>
            </span>
            <button class="gh-btn" id="theme-toggle-btn" title="Toggle Theme" aria-label="Toggle Theme">
              \${themeIcon}
            </button>
          </div>
        </div>
      </header>
      <nav class="gh-nav-tabs" aria-label="Coverage views">
        <div class="gh-nav-tabs-inner">
          <a class="gh-tab \${state.activeTab === 'files' ? 'active' : ''}" data-tab="files" role="tab" aria-selected="\${state.activeTab === 'files'}">
            \${icons.file || ''}
            <span>Files</span>
            <span class="counter">\${Object.keys(data.files || {}).length}</span>
          </a>
          <a class="gh-tab \${state.activeTab === 'trends' ? 'active' : ''}" data-tab="trends" role="tab" aria-selected="\${state.activeTab === 'trends'}">
            \${icons.graph || ''}
            <span>Trends</span>
            <span class="counter">\${data.commits?.length || 1}</span>
          </a>
          <a class="gh-tab \${state.activeTab === 'commits' ? 'active' : ''}" data-tab="commits" role="tab" aria-selected="\${state.activeTab === 'commits'}">
            \${icons.commit || ''}
            <span>Commits</span>
            <span class="counter">\${data.commits?.length || 1}</span>
          </a>
        </div>
      </nav>
    \`;
  }

  // Render metric cards
  function renderMetrics(summary, delta) {
    const renderDelta = (val) => {
      if (val === undefined || val === null) return '';
      const isPos = val > 0;
      const isNeg = val < 0;
      const cls = isPos ? 'positive' : isNeg ? 'negative' : 'neutral';
      const icon = isPos ? icons.arrowUp : isNeg ? icons.arrowDown : '';
      const prefix = isPos ? '+' : '';
      return \`<span class="delta-badge \${cls}">\${icon}\${prefix}\${val.toFixed(2)}%</span>\`;
    };

    return \`
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-title">
            <span>Line Coverage</span>
            \${renderDelta(delta?.linesPct)}
          </div>
          <div class="metric-value-row">
            <span class="metric-percent \${getRateClass(summary.lines.pct)}">\${summary.lines.pct}%</span>
            <span class="metric-counts">\${summary.lines.covered} / \${summary.lines.total} lines</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: \${summary.lines.pct}%; background-color: \${getRateColor(summary.lines.pct)};"></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-title">
            <span>Function Coverage</span>
            \${renderDelta(delta?.functionsPct)}
          </div>
          <div class="metric-value-row">
            <span class="metric-percent \${getRateClass(summary.functions.pct)}">\${summary.functions.pct}%</span>
            <span class="metric-counts">\${summary.functions.covered} / \${summary.functions.total} functions</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: \${summary.functions.pct}%; background-color: \${getRateColor(summary.functions.pct)};"></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-title">
            <span>Branch Coverage</span>
            \${renderDelta(delta?.branchesPct)}
          </div>
          <div class="metric-value-row">
            <span class="metric-percent \${getRateClass(summary.branches.pct)}">\${summary.branches.pct}%</span>
            <span class="metric-counts">\${summary.branches.covered} / \${summary.branches.total} branches</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: \${summary.branches.pct}%; background-color: \${getRateColor(summary.branches.pct)};"></div>
          </div>
        </div>
      </div>
    \`;
  }

  // Render commit banner
  function renderCommitBanner() {
    const c = data.currentCommit;
    if (!c) return '';
    const initial = (c.author || 'D').slice(0, 1).toUpperCase();

    return \`
      <div class="commit-banner">
        <div class="commit-left">
          <div class="commit-author-avatar" title="\${escapeHtml(c.author)}">\${initial}</div>
          <div>
            <span class="commit-message">\${escapeHtml(c.message)}</span>
            <div class="commit-meta">
              <span>\${escapeHtml(c.author)}</span>
              <span>committed \${formatDate(c.date)}</span>
            </div>
          </div>
        </div>
        <div class="commit-meta">
          <span class="commit-sha-badge">\${icons.commit} \${escapeHtml(c.shortSha)}</span>
        </div>
      </div>
    \`;
  }

  // Render SVG Sparkline
  function renderSparkline(trendPoints) {
    if (!trendPoints || trendPoints.length <= 1) return '<span style="color:var(--color-fg-subtle)">—</span>';
    const width = 80;
    const height = 20;
    const padding = 2;

    const values = trendPoints.map(p => p.linesPct);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = (max - min) || 1;

    const coords = values.map((val, idx) => {
      const x = padding + (idx / (values.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return \`\${x.toFixed(1)},\${y.toFixed(1)}\`;
    }).join(' ');

    const lastVal = values[values.length - 1];
    const firstVal = values[0];
    const strokeColor = lastVal >= firstVal ? 'var(--color-success-fg)' : 'var(--color-danger-fg)';

    return \`
      <svg width="\${width}" height="\${height}" style="vertical-align:middle; overflow:visible;">
        <polyline points="\${coords}" fill="none" stroke="\${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    \`;
  }

  // Render Interactive SVG Trend Chart
  function renderTrendChart(title, points, metricKey = 'linesPct') {
    if (!points || points.length === 0) {
      return \`
        <div class="chart-container">
          <div class="chart-title">\${escapeHtml(title)}</div>
          <div style="padding: 40px; text-align:center; color:var(--color-fg-muted);">No commit history points recorded yet.</div>
        </div>
      \`;
    }

    const width = 800;
    const height = 220;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 35;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    const metricName = metricKey === 'linesPct' ? 'Lines' : metricKey === 'functionsPct' ? 'Functions' : 'Branches';

    // Min and max for Y-axis (scale between 0 and 100 or tighter)
    const rawValues = points.map(p => p[metricKey] ?? 0);
    const minVal = Math.max(0, Math.floor(Math.min(...rawValues) / 10) * 10 - 10);
    const maxVal = Math.min(100, Math.ceil(Math.max(...rawValues) / 10) * 10 + 10);
    const valRange = (maxVal - minVal) || 10;

    // Y ticks
    const ticks = [minVal, minVal + valRange / 2, maxVal];

    // Compute point coordinates
    const coords = points.map((p, idx) => {
      const x = points.length === 1 
        ? paddingLeft + chartW / 2 
        : paddingLeft + (idx / (points.length - 1)) * chartW;
      const y = paddingTop + chartH - (((p[metricKey] ?? 0) - minVal) / valRange) * chartH;
      return { x, y, point: p };
    });

    // Generate Path D
    let pathD = '';
    if (coords.length === 1) {
      pathD = \`M \${coords[0].x - 10} \${coords[0].y} L \${coords[0].x + 10} \${coords[0].y}\`;
    } else {
      pathD = coords.reduce((acc, c, i) => {
        if (i === 0) return \`M \${c.x} \${c.y}\`;
        const prev = coords[i - 1];
        const cp1x = prev.x + (c.x - prev.x) / 2;
        const cp1y = prev.y;
        const cp2x = prev.x + (c.x - prev.x) / 2;
        const cp2y = c.y;
        return \`\${acc} C \${cp1x} \${cp1y}, \${cp2x} \${cp2y}, \${c.x} \${c.y}\`;
      }, '');
    }

    const areaD = coords.length > 1
      ? \`\${pathD} L \${coords[coords.length - 1].x} \${paddingTop + chartH} L \${coords[0].x} \${paddingTop + chartH} Z\`
      : '';

    const gridLines = ticks.map(t => {
      const y = paddingTop + chartH - ((t - minVal) / valRange) * chartH;
      return \`
        <line x1="\${paddingLeft}" y1="\${y}" x2="\${width - paddingRight}" y2="\${y}" stroke="var(--chart-grid)" stroke-dasharray="3,3"/>
        <text x="\${paddingLeft - 8}" y="\${y + 4}" text-anchor="end" fill="var(--color-fg-muted)" font-size="11">\${Math.round(t)}%</text>
      \`;
    }).join('');

    const circles = coords.map((c, i) => {
      const p = c.point;
      const isSelected = p.sha === state.selectedCommitSha;
      const r = isSelected ? 6 : 4;
      const fill = isSelected ? 'var(--color-attention-fg)' : 'var(--chart-line)';
      const stroke = 'var(--color-canvas-default)';
      return \`
        <circle class="chart-dot" cx="\${c.x}" cy="\${c.y}" r="\${r}" fill="\${fill}" stroke="\${stroke}" stroke-width="2"
          data-sha="\${p.sha}" data-date="\${escapeHtml(p.date)}" data-msg="\${escapeHtml(p.message)}"
          data-lines="\${p.linesPct}%" data-fn="\${p.functionsPct}%" data-br="\${p.branchesPct}%"
          data-covered="\${p.linesCovered}" data-total="\${p.linesTotal}"
        />
        <text x="\${c.x}" y="\${paddingTop + chartH + 18}" text-anchor="middle" fill="var(--color-fg-muted)" font-size="10" font-family="var(--font-mono)">
          \${escapeHtml(p.shortSha)}
        </text>
      \`;
    }).join('');

    return \`
      <div class="chart-container">
        <div class="chart-header">
          <div class="chart-title">
            \${icons.graph}
            <span>\${escapeHtml(title)} (\${metricName})</span>
          </div>
          <div class="chart-actions">
            <button class="gh-btn \${metricKey === 'linesPct' ? 'gh-btn-primary' : ''}" data-metric="linesPct">Lines</button>
            <button class="gh-btn \${metricKey === 'functionsPct' ? 'gh-btn-primary' : ''}" data-metric="functionsPct">Functions</button>
            <button class="gh-btn \${metricKey === 'branchesPct' ? 'gh-btn-primary' : ''}" data-metric="branchesPct">Branches</button>
          </div>
        </div>
        <svg viewBox="0 0 \${width} \${height}" class="svg-chart">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--chart-line)" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="var(--chart-line)" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          \${gridLines}
          \${areaD ? \`<path d="\${areaD}" fill="url(#areaGrad)"/>\` : ''}
          <path d="\${pathD}" fill="none" stroke="var(--chart-line)" stroke-width="2.5" stroke-linecap="round"/>
          \${circles}
        </svg>
      </div>
    \`;
  }

  // Render Breadcrumbs
  function renderBreadcrumbs() {
    const parts = state.currentFolder ? state.currentFolder.split('/') : [];
    let html = \`<a class="breadcrumb-item" data-folder="">\${escapeHtml(data.repoName || 'root')}</a>\`;
    let accum = '';

    parts.forEach((p, idx) => {
      accum = accum ? \`\${accum}/\${p}\` : p;
      html += \`<span class="breadcrumb-separator">/</span>\`;
      if (idx === parts.length - 1 && !state.selectedFile) {
        html += \`<span style="font-weight:600; color:var(--color-fg-default);">\${escapeHtml(p)}</span>\`;
      } else {
        html += \`<a class="breadcrumb-item" data-folder="\${accum}">\${escapeHtml(p)}</a>\`;
      }
    });

    if (state.selectedFile) {
      const fileName = state.selectedFile.split('/').pop();
      html += \`<span class="breadcrumb-separator">/</span><span style="font-weight:600; color:var(--color-fg-default);">\${escapeHtml(fileName)}</span>\`;
    }

    return \`<div class="breadcrumbs">\${html}</div>\`;
  }

  // Render Files and Folders Table
  function renderTable() {
    const children = data.folderChildren?.[state.currentFolder] || { subfolders: [], files: [] };
    const query = state.filterText.toLowerCase().trim();

    let rows = [];

    // Subfolders
    children.subfolders.forEach(subPath => {
      const name = subPath.split('/').pop() || subPath;
      if (query && !name.toLowerCase().includes(query) && !subPath.toLowerCase().includes(query)) return;
      const fCov = data.folders?.[subPath];
      if (!fCov) return;

      const trendPoints = data.trends?.folders?.[subPath];

      rows.push({
        type: 'folder',
        name,
        path: subPath,
        lines: fCov.lines,
        functions: fCov.functions,
        branches: fCov.branches,
        sparkline: renderSparkline(trendPoints),
      });
    });

    // Files
    children.files.forEach(filePath => {
      const name = filePath.split('/').pop() || filePath;
      if (query && !name.toLowerCase().includes(query) && !filePath.toLowerCase().includes(query)) return;
      const fileCov = data.files?.[filePath];
      if (!fileCov) return;

      const trendPoints = data.trends?.files?.[filePath];

      rows.push({
        type: 'file',
        name,
        path: filePath,
        lines: fileCov.lines,
        functions: fileCov.functions,
        branches: fileCov.branches,
        sparkline: renderSparkline(trendPoints),
      });
    });

    // Sorting
    rows.sort((a, b) => {
      let valA, valB;
      if (state.sortColumn === 'lines') {
        valA = a.lines.pct;
        valB = b.lines.pct;
      } else if (state.sortColumn === 'functions') {
        valA = a.functions.pct;
        valB = b.functions.pct;
      } else if (state.sortColumn === 'branches') {
        valA = a.branches.pct;
        valB = b.branches.pct;
      } else {
        // name
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      }

      if (valA < valB) return state.sortAsc ? -1 : 1;
      if (valA > valB) return state.sortAsc ? 1 : -1;
      return 0;
    });

    const renderSortArrow = (col) => {
      if (state.sortColumn !== col) return '';
      return state.sortAsc ? ' ▲' : ' ▼';
    };

    let tableRows = '';
    if (rows.length === 0) {
      tableRows = \`<tr><td colspan="6" style="text-align:center; padding: 32px; color:var(--color-fg-muted);">No files or folders matching filter</td></tr>\`;
    } else {
      tableRows = rows.map(r => {
        const icon = r.type === 'folder' ? icons.folder : icons.file;
        const clickAttr = r.type === 'folder' ? \`data-nav-folder="\${r.path}"\` : \`data-nav-file="\${r.path}"\`;
        return \`
          <tr>
            <td>
              <div class="file-name-cell">
                <span>\${icon}</span>
                <a class="file-link" \${clickAttr}>\${escapeHtml(r.name)}</a>
              </div>
            </td>
            <td>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="rate-badge \${getRateClass(r.lines.pct)}">\${r.lines.pct}%</span>
                <div class="progress-bar-container" style="width: 70px; margin-top:0;">
                  <div class="progress-bar-fill" style="width:\${r.lines.pct}%; background-color:\${getRateColor(r.lines.pct)};"></div>
                </div>
              </div>
            </td>
            <td>\${r.lines.covered} / \${r.lines.total} <span style="color:var(--color-fg-subtle); font-size:11px;">(\${r.lines.skipped} missed)</span></td>
            <td>\${r.functions.pct}% <span style="color:var(--color-fg-subtle); font-size:11px;">(\${r.functions.covered}/\${r.functions.total})</span></td>
            <td>\${r.branches.pct}% <span style="color:var(--color-fg-subtle); font-size:11px;">(\${r.branches.covered}/\${r.branches.total})</span></td>
            <td>\${r.sparkline}</td>
          </tr>
        \`;
      }).join('');
    }

    return \`
      <div class="file-toolbar">
        \${renderBreadcrumbs()}
        <div class="search-box">
          <span class="search-icon">\${icons.search}</span>
          <input type="text" id="filter-input" placeholder="Filter files... (press /)" value="\${escapeHtml(state.filterText)}" aria-label="Filter files">
        </div>
      </div>
      <div class="gh-box">
        <div class="table-wrapper">
          <table class="gh-table">
            <thead>
              <tr>
                <th class="sortable" data-sort="name">Name\${renderSortArrow('name')}</th>
                <th class="sortable" data-sort="lines">Coverage\${renderSortArrow('lines')}</th>
                <th>Lines</th>
                <th class="sortable" data-sort="functions">Functions\${renderSortArrow('functions')}</th>
                <th class="sortable" data-sort="branches">Branches\${renderSortArrow('branches')}</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              \${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    \`;
  }

  // Render Source Code Detail Viewer for a single file
  function renderFileViewer() {
    const filePath = state.selectedFile;
    const fileCov = data.files?.[filePath];
    if (!fileCov) return '<div>File not found in coverage report.</div>';

    const trendPoints = data.trends?.files?.[filePath] || [];

    // Build lines view
    const sourceCode = fileCov.sourceCode;
    const lineDetails = fileCov.lineDetails || {};

    let linesArray = [];
    if (sourceCode) {
      linesArray = sourceCode.split(/\\r?\\n/);
    } else {
      // Reconstruct line rows from lineDetails keys
      const maxLine = Math.max(...Object.keys(lineDetails).map(Number), 1);
      for (let i = 1; i <= maxLine; i++) {
        linesArray.push('');
      }
    }

    let codeRows = '';
    linesArray.forEach((rawLine, idx) => {
      const lineNum = idx + 1;
      const detail = lineDetails[lineNum];

      let rowClass = '';
      let hitsText = '';

      if (detail) {
        if (detail.hits > 0) {
          rowClass = 'line-covered';
          hitsText = \`\${detail.hits}x\`;
        } else {
          rowClass = 'line-uncovered';
          hitsText = '0';
        }
      }

      codeRows += \`
        <tr class="\${rowClass}" id="L\${lineNum}">
          <td class="blob-num" data-line-number="\${lineNum}">\${lineNum}</td>
          <td class="blob-hits">\${hitsText}</td>
          <td class="blob-code">\${escapeHtml(rawLine || ' ')}</td>
        </tr>
      \`;
    });

    return \`
      <div class="file-toolbar">
        \${renderBreadcrumbs()}
        <div>
          <button class="gh-btn" id="jump-next-uncovered" title="Jump to next uncovered line (n)">Next Uncovered (n)</button>
        </div>
      </div>

      \${renderMetrics(fileCov, null)}

      \${trendPoints.length > 1 ? renderTrendChart(\`Trend for \${filePath}\`, trendPoints, state.trendMetric) : ''}

      <div class="blob-wrapper">
        <div class="blob-header">
          <div>
            <strong>\${escapeHtml(filePath)}</strong>
            <span style="margin-left:8px;">\${linesArray.length} lines</span>
          </div>
          <div class="blob-actions">
            <span>\${fileCov.lines.covered}/\${fileCov.lines.total} lines covered (\${fileCov.lines.pct}%)</span>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="code-table">
            <tbody>
              \${codeRows}
            </tbody>
          </table>
        </div>
      </div>
    \`;
  }

  // Render Dedicated Trends Tab
  function renderTrendsTab() {
    const overallTrends = data.trends?.overall || [];
    const folderKeys = Object.keys(data.trends?.folders || {}).filter(Boolean).sort();
    const fileKeys = Object.keys(data.trends?.files || {}).sort();

    let targetPoints = overallTrends;
    let targetTitle = 'Overall Repository Coverage Trend';

    if (state.trendScope === 'folder' && state.trendTarget) {
      targetPoints = data.trends?.folders?.[state.trendTarget] || [];
      targetTitle = \`Folder Coverage Trend: \${state.trendTarget}\`;
    } else if (state.trendScope === 'file' && state.trendTarget) {
      targetPoints = data.trends?.files?.[state.trendTarget] || [];
      targetTitle = \`File Coverage Trend: \${state.trendTarget}\`;
    }

    const folderOptions = folderKeys.map(k => \`<option value="\${k}" \${state.trendScope === 'folder' && state.trendTarget === k ? 'selected' : ''}>\${escapeHtml(k)}</option>\`).join('');
    const fileOptions = fileKeys.map(k => \`<option value="\${k}" \${state.trendScope === 'file' && state.trendTarget === k ? 'selected' : ''}>\${escapeHtml(k)}</option>\`).join('');

    return \`
      <div style="margin-bottom: 20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span style="font-weight:600; font-size:14px;">Scope:</span>
          <button class="gh-btn \${state.trendScope === 'overall' ? 'gh-btn-primary' : ''}" data-scope="overall">Repository Overall</button>
          <button class="gh-btn \${state.trendScope === 'folder' ? 'gh-btn-primary' : ''}" data-scope="folder">By Folder</button>
          <button class="gh-btn \${state.trendScope === 'file' ? 'gh-btn-primary' : ''}" data-scope="file">By File</button>
        </div>
        \${state.trendScope === 'folder' ? \`
          <div>
            <select id="trend-folder-select" class="gh-btn" style="min-width:240px; padding:6px 10px;">
              <option value="">-- Select Folder --</option>
              \${folderOptions}
            </select>
          </div>
        \` : ''}
        \${state.trendScope === 'file' ? \`
          <div>
            <select id="trend-file-select" class="gh-btn" style="min-width:280px; padding:6px 10px;">
              <option value="">-- Select File --</option>
              \${fileOptions}
            </select>
          </div>
        \` : ''}
      </div>

      \${renderTrendChart(targetTitle, targetPoints, state.trendMetric)}

      <div class="gh-box" style="margin-top: 20px;">
        <div style="padding: 12px 16px; background-color:var(--color-canvas-subtle); border-bottom: 1px solid var(--color-border-default); font-weight:600;">
          Historical Commits for this Trend
        </div>
        <div class="table-wrapper">
          <table class="gh-table">
            <thead>
              <tr>
                <th>Commit</th>
                <th>Coverage</th>
                <th>Lines</th>
                <th>Functions</th>
                <th>Branches</th>
                <th>Date</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              \${targetPoints.slice().reverse().map(p => \`
                <tr>
                  <td>
                    <span class="commit-sha-badge">\${icons.commit} \${escapeHtml(p.shortSha)}</span>
                  </td>
                  <td>
                    <span class="rate-badge \${getRateClass(p.linesPct)}">\${p.linesPct}%</span>
                  </td>
                  <td>\${p.linesCovered} / \${p.linesTotal}</td>
                  <td>\${p.functionsPct}%</td>
                  <td>\${p.branchesPct}%</td>
                  <td style="color:var(--color-fg-muted);">\${formatDate(p.date)}</td>
                  <td>\${escapeHtml(p.message)}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    \`;
  }

  // Render Commits Tab
  function renderCommitsTab() {
    const commits = (data.commits || []).slice().reverse();

    return \`
      <div class="gh-box">
        <div style="padding: 12px 16px; background-color:var(--color-canvas-subtle); border-bottom: 1px solid var(--color-border-default); font-weight:600; display:flex; justify-content:space-between; align-items:center;">
          <span>Commit History (\${commits.length})</span>
          <span style="font-size:12px; font-weight:normal; color:var(--color-fg-muted);">Recorded runs</span>
        </div>
        <div class="table-wrapper">
          <table class="gh-table">
            <thead>
              <tr>
                <th>Commit</th>
                <th>Author</th>
                <th>Branch</th>
                <th>Line Coverage</th>
                <th>Functions</th>
                <th>Branches</th>
                <th>Date</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              \${commits.map(c => {
                const isCurrent = c.commit.sha === data.currentCommit?.sha;
                return \`
                  <tr \${isCurrent ? 'style="background-color: var(--color-accent-subtle);"' : ''}>
                    <td>
                      <span class="commit-sha-badge">
                        \${icons.commit} \${escapeHtml(c.commit.shortSha || c.commit.sha.slice(0, 7))}
                      </span>
                    </td>
                    <td>\${escapeHtml(c.commit.author)}</td>
                    <td>\${escapeHtml(c.commit.branch)}</td>
                    <td>
                      <span class="rate-badge \${getRateClass(c.summary.lines.pct)}">\${c.summary.lines.pct}%</span>
                    </td>
                    <td>\${c.summary.functions.pct}%</td>
                    <td>\${c.summary.branches.pct}%</td>
                    <td style="color:var(--color-fg-muted); white-space:nowrap;">\${formatDate(c.commit.date)}</td>
                    <td>\${escapeHtml(c.commit.message)}</td>
                  </tr>
                \`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    \`;
  }

  // Main Render Routine
  function render() {
    let mainContent = '';

    if (state.activeTab === 'files') {
      if (state.selectedFile) {
        mainContent = renderFileViewer();
      } else {
        const currentFolderCov = data.folders?.[state.currentFolder] || data.summary;
        const trendPoints = state.currentFolder 
          ? data.trends?.folders?.[state.currentFolder] 
          : data.trends?.overall;

        mainContent = \`
          \${renderCommitBanner()}
          \${renderMetrics(currentFolderCov, data.delta)}
          \${trendPoints && trendPoints.length > 1 ? renderTrendChart(state.currentFolder ? \`Folder Trend: \${state.currentFolder}\` : 'Overall Coverage Trend', trendPoints, state.trendMetric) : ''}
          \${renderTable()}
        \`;
      }
    } else if (state.activeTab === 'trends') {
      mainContent = renderTrendsTab();
    } else if (state.activeTab === 'commits') {
      mainContent = renderCommitsTab();
    }

    container.innerHTML = \`
      \${renderHeader()}
      <main class="gh-container">
        \${mainContent}
      </main>
      <footer class="gh-footer">
        Generated by <a href="https://github.com/covpages/covpages" target="_blank" rel="noopener">covpages</a> • 
        \${escapeHtml(data.generatedAt ? formatDate(data.generatedAt) : new Date().toISOString())}
      </footer>
    \`;

    bindEvents();
  }

  // Event handlers
  function bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        render();
      });
    }

    // Brand link
    const brandLink = document.getElementById('brand-link');
    if (brandLink) {
      brandLink.addEventListener('click', (e) => {
        e.preventDefault();
        state.activeTab = 'files';
        state.currentFolder = '';
        state.selectedFile = null;
        render();
      });
    }

    // Nav tabs
    document.querySelectorAll('.gh-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        state.activeTab = tab.getAttribute('data-tab');
        render();
      });
    });

    // Breadcrumb navigation
    document.querySelectorAll('.breadcrumb-item').forEach(item => {
      item.addEventListener('click', () => {
        const folder = item.getAttribute('data-folder');
        state.currentFolder = folder || '';
        state.selectedFile = null;
        render();
      });
    });

    // Folder navigation in table
    document.querySelectorAll('[data-nav-folder]').forEach(el => {
      el.addEventListener('click', () => {
        state.currentFolder = el.getAttribute('data-nav-folder');
        state.selectedFile = null;
        render();
      });
    });

    // File navigation in table
    document.querySelectorAll('[data-nav-file]').forEach(el => {
      el.addEventListener('click', () => {
        state.selectedFile = el.getAttribute('data-nav-file');
        render();
      });
    });

    // Filter input
    const filterInput = document.getElementById('filter-input');
    if (filterInput) {
      filterInput.addEventListener('input', (e) => {
        state.filterText = e.target.value;
        // Re-render only table
        const tableContainer = document.querySelector('.gh-box');
        if (tableContainer) {
          const newHtml = renderTable();
          const toolbar = document.querySelector('.file-toolbar');
          if (toolbar) {
            toolbar.outerHTML = newHtml;
            bindEvents();
            // preserve focus
            const refocusedInput = document.getElementById('filter-input');
            if (refocusedInput) {
              refocusedInput.focus();
              refocusedInput.selectionStart = refocusedInput.selectionEnd = refocusedInput.value.length;
            }
          }
        }
      });
    }

    // Table sorting
    document.querySelectorAll('.gh-table th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const sortCol = th.getAttribute('data-sort');
        if (state.sortColumn === sortCol) {
          state.sortAsc = !state.sortAsc;
        } else {
          state.sortColumn = sortCol;
          state.sortAsc = true;
        }
        render();
      });
    });

    // Metric selector in charts
    document.querySelectorAll('.chart-actions button[data-metric]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.trendMetric = btn.getAttribute('data-metric');
        render();
      });
    });

    // Trend scope selector in Trends Tab
    document.querySelectorAll('button[data-scope]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.trendScope = btn.getAttribute('data-scope');
        if (state.trendScope === 'folder') {
          const firstFolder = Object.keys(data.trends?.folders || {})[0] || '';
          state.trendTarget = firstFolder;
        } else if (state.trendScope === 'file') {
          const firstFile = Object.keys(data.trends?.files || {})[0] || '';
          state.trendTarget = firstFile;
        } else {
          state.trendTarget = '';
        }
        render();
      });
    });

    // Trend folder select
    const trendFolderSelect = document.getElementById('trend-folder-select');
    if (trendFolderSelect) {
      trendFolderSelect.addEventListener('change', (e) => {
        state.trendTarget = e.target.value;
        render();
      });
    }

    // Trend file select
    const trendFileSelect = document.getElementById('trend-file-select');
    if (trendFileSelect) {
      trendFileSelect.addEventListener('change', (e) => {
        state.trendTarget = e.target.value;
        render();
      });
    }

    // Jump to next uncovered line in source viewer
    const jumpBtn = document.getElementById('jump-next-uncovered');
    if (jumpBtn) {
      jumpBtn.addEventListener('click', () => {
        const uncoveredRows = document.querySelectorAll('tr.line-uncovered');
        if (uncoveredRows.length === 0) return;
        const scrollY = window.scrollY;
        let targetRow = null;
        for (const row of uncoveredRows) {
          const top = row.getBoundingClientRect().top + scrollY;
          if (top > scrollY + 50) {
            targetRow = row;
            break;
          }
        }
        if (!targetRow) targetRow = uncoveredRows[0];
        targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    // Tooltip for chart dots
    document.querySelectorAll('.chart-dot').forEach(dot => {
      dot.addEventListener('mouseenter', (e) => {
        if (!tooltipEl) return;
        const sha = dot.getAttribute('data-sha')?.slice(0, 7);
        const date = formatDate(dot.getAttribute('data-date'));
        const msg = dot.getAttribute('data-msg');
        const lines = dot.getAttribute('data-lines');
        const fn = dot.getAttribute('data-fn');
        const br = dot.getAttribute('data-br');

        tooltipEl.innerHTML = \`
          <div style="font-weight:600; margin-bottom:4px;">\${escapeHtml(msg)}</div>
          <div style="color:var(--color-fg-muted); margin-bottom:6px;">\${sha} • \${date}</div>
          <div>Lines: <strong>\${lines}</strong> • Functions: <strong>\${fn}</strong> • Branches: <strong>\${br}</strong></div>
        \`;
        tooltipEl.style.opacity = '1';
        tooltipEl.style.left = (e.pageX + 10) + 'px';
        tooltipEl.style.top = (e.pageY - 40) + 'px';
      });

      dot.addEventListener('mousemove', (e) => {
        if (!tooltipEl) return;
        tooltipEl.style.left = (e.pageX + 10) + 'px';
        tooltipEl.style.top = (e.pageY - 40) + 'px';
      });

      dot.addEventListener('mouseleave', () => {
        if (!tooltipEl) return;
        tooltipEl.style.opacity = '0';
      });
    });
  }

  // Keyboard shortcut '/' to focus search input
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
      const input = document.getElementById('filter-input');
      if (input) {
        e.preventDefault();
        input.focus();
      }
    } else if (e.key === 'n' && state.selectedFile && document.activeElement?.tagName !== 'INPUT') {
      const jumpBtn = document.getElementById('jump-next-uncovered');
      if (jumpBtn) jumpBtn.click();
    }
  });

  // Initial render
  render();
})();
`;
