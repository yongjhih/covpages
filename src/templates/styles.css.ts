export const STYLES_CSS = `
/* Primer-inspired GitHub theme design tokens */
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;

  --color-canvas-default: #ffffff;
  --color-canvas-subtle: #f6f8fa;
  --color-canvas-inset: #f6f8fa;
  --color-border-default: #d0d7de;
  --color-border-muted: #d8dee4;
  --color-fg-default: #1f2328;
  --color-fg-muted: #656d76;
  --color-fg-subtle: #6e7781;
  --color-accent-fg: #0969da;
  --color-accent-emphasis: #0969da;
  --color-accent-subtle: #ddf4ff;
  --color-success-fg: #1a7f37;
  --color-success-emphasis: #1f883d;
  --color-success-subtle: #dafbe1;
  --color-danger-fg: #cf222e;
  --color-danger-emphasis: #cf222e;
  --color-danger-subtle: #ffebe9;
  --color-attention-fg: #9a6700;
  --color-attention-emphasis: #bf8700;
  --color-attention-subtle: #fff8c5;
  --color-neutral-subtle: rgba(234, 238, 242, 0.5);

  --chart-grid: #eaeef2;
  --chart-line: #0969da;
  --chart-fill: rgba(9, 105, 218, 0.08);

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --shadow-sm: 0 1px 0 rgba(27, 31, 36, 0.04);
  --shadow-rest: 0 1px 3px rgba(31, 35, 40, 0.12), 0 1px 2px rgba(31, 35, 40, 0.14);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-canvas-default: #0d1117;
    --color-canvas-subtle: #161b22;
    --color-canvas-inset: #010409;
    --color-border-default: #30363d;
    --color-border-muted: #21262d;
    --color-fg-default: #e6edf3;
    --color-fg-muted: #848d97;
    --color-fg-subtle: #6e7681;
    --color-accent-fg: #2f81f7;
    --color-accent-emphasis: #1f6feb;
    --color-accent-subtle: rgba(56, 139, 253, 0.15);
    --color-success-fg: #3fb950;
    --color-success-emphasis: #238636;
    --color-success-subtle: rgba(46, 160, 67, 0.15);
    --color-danger-fg: #f85149;
    --color-danger-emphasis: #da3633;
    --color-danger-subtle: rgba(248, 81, 73, 0.15);
    --color-attention-fg: #d29922;
    --color-attention-emphasis: #9e6a03;
    --color-attention-subtle: rgba(187, 128, 9, 0.15);
    --color-neutral-subtle: rgba(110, 118, 129, 0.1);

    --chart-grid: #21262d;
    --chart-line: #2f81f7;
    --chart-fill: rgba(47, 129, 247, 0.12);
  }
}

:root[data-theme="dark"] {
  --color-canvas-default: #0d1117;
  --color-canvas-subtle: #161b22;
  --color-canvas-inset: #010409;
  --color-border-default: #30363d;
  --color-border-muted: #21262d;
  --color-fg-default: #e6edf3;
  --color-fg-muted: #848d97;
  --color-fg-subtle: #6e7681;
  --color-accent-fg: #2f81f7;
  --color-accent-emphasis: #1f6feb;
  --color-accent-subtle: rgba(56, 139, 253, 0.15);
  --color-success-fg: #3fb950;
  --color-success-emphasis: #238636;
  --color-success-subtle: rgba(46, 160, 67, 0.15);
  --color-danger-fg: #f85149;
  --color-danger-emphasis: #da3633;
  --color-danger-subtle: rgba(248, 81, 73, 0.15);
  --color-attention-fg: #d29922;
  --color-attention-emphasis: #9e6a03;
  --color-attention-subtle: rgba(187, 128, 9, 0.15);
  --color-neutral-subtle: rgba(110, 118, 129, 0.1);

  --chart-grid: #21262d;
  --chart-line: #2f81f7;
  --chart-fill: rgba(47, 129, 247, 0.12);
}

:root[data-theme="light"] {
  --color-canvas-default: #ffffff;
  --color-canvas-subtle: #f6f8fa;
  --color-canvas-inset: #f6f8fa;
  --color-border-default: #d0d7de;
  --color-border-muted: #d8dee4;
  --color-fg-default: #1f2328;
  --color-fg-muted: #656d76;
  --color-fg-subtle: #6e7781;
  --color-accent-fg: #0969da;
  --color-accent-emphasis: #0969da;
  --color-accent-subtle: #ddf4ff;
  --color-success-fg: #1a7f37;
  --color-success-emphasis: #1f883d;
  --color-success-subtle: #dafbe1;
  --color-danger-fg: #cf222e;
  --color-danger-emphasis: #cf222e;
  --color-danger-subtle: #ffebe9;
  --color-attention-fg: #9a6700;
  --color-attention-emphasis: #bf8700;
  --color-attention-subtle: #fff8c5;
  --color-neutral-subtle: rgba(234, 238, 242, 0.5);

  --chart-grid: #eaeef2;
  --chart-line: #0969da;
  --chart-fill: rgba(9, 105, 218, 0.08);
}

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-fg-default);
  background-color: var(--color-canvas-default);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header bar */
.gh-header {
  background-color: var(--color-canvas-subtle);
  border-bottom: 1px solid var(--color-border-default);
  padding: 12px 24px;
}

.gh-header-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.gh-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--color-fg-default);
  font-weight: 600;
  font-size: 16px;
}

.gh-brand-icon {
  display: flex;
  align-items: center;
  color: var(--color-fg-default);
}

.gh-repo-title {
  color: var(--color-accent-fg);
  font-weight: 600;
}

.gh-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* GitHub Buttons & Selectors */
.gh-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: var(--color-fg-default);
  background-color: var(--color-canvas-subtle);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  cursor: pointer;
  text-decoration: none;
  transition: 80ms cubic-bezier(0.33, 1, 0.68, 1);
  box-shadow: var(--shadow-sm);
  user-select: none;
}

.gh-btn:hover {
  background-color: var(--color-border-muted);
}

.gh-btn:active {
  background-color: var(--color-border-default);
}

.gh-btn:focus-visible {
  outline: 2px solid var(--color-accent-fg);
  outline-offset: -1px;
}

.gh-btn-primary {
  color: #ffffff;
  background-color: var(--color-success-emphasis);
  border-color: rgba(27, 31, 36, 0.15);
}

.gh-btn-primary:hover {
  background-color: #2c974b;
}

/* Ref (Branch/Tag) Selector Popover */
.ref-selector-wrap {
  position: relative;
}

.ref-selector-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.ref-btn-label {
  font-weight: 600;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-caret {
  font-size: 11px;
  margin-left: 2px;
  color: var(--color-fg-muted);
}

.ref-popover {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 300px;
  background-color: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-rest);
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ref-popover-header {
  padding: 8px 10px;
  background-color: var(--color-canvas-subtle);
  border-bottom: 1px solid var(--color-border-default);
}

.ref-popover-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ref-popover-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-fg-default);
}

.ref-popover-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  font-size: 13px;
  color: var(--color-fg-muted);
  border-radius: var(--radius-sm);
}

.ref-popover-close:hover {
  color: var(--color-fg-default);
  background-color: var(--color-neutral-subtle);
}

.ref-search-wrap {
  margin-bottom: 8px;
}

.ref-search-input {
  width: 100%;
  padding: 5px 8px;
  font-size: 12px;
  color: var(--color-fg-default);
  background-color: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  outline: none;
}

.ref-search-input::placeholder {
  color: var(--color-fg-muted);
  opacity: 1;
}

.ref-search-input:focus {
  border-color: var(--color-accent-fg);
  box-shadow: 0 0 0 2px var(--color-accent-subtle);
}

.ref-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--color-border-muted);
  margin-top: 4px;
}

.ref-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 4px 8px;
  font-size: 12px;
  color: var(--color-fg-muted);
  cursor: pointer;
  margin-bottom: -1px;
}

.ref-tab:hover {
  color: var(--color-fg-default);
}

.ref-tab.active {
  color: var(--color-fg-default);
  border-bottom-color: #fd8c73;
  font-weight: 600;
}

.ref-list {
  max-height: 250px;
  overflow-y: auto;
  padding: 4px 0;
}

.ref-item {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--color-fg-default);
  cursor: pointer;
  gap: 8px;
  text-decoration: none;
}

.ref-item:hover, .ref-item.active {
  background-color: var(--color-canvas-subtle);
}

.ref-item.selected {
  font-weight: 600;
}

.ref-item-check {
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fg-default);
  flex-shrink: 0;
}

.ref-item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ref-item-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 10px;
  margin-left: auto;
}

.ref-empty {
  padding: 16px 12px;
  text-align: center;
  color: var(--color-fg-muted);
  font-size: 12px;
}

/* Tabs */
.gh-nav-tabs {
  background-color: var(--color-canvas-subtle);
  border-bottom: 1px solid var(--color-border-default);
  padding: 0 24px;
}

.gh-nav-tabs-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.gh-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-fg-muted);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
}

.gh-tab:hover {
  color: var(--color-fg-default);
}

.gh-tab.active {
  color: var(--color-fg-default);
  font-weight: 600;
  border-bottom-color: #fd8c73;
}

.gh-tab .counter {
  display: inline-block;
  padding: 0 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: var(--color-fg-default);
  background-color: var(--color-neutral-subtle);
  border-radius: 20px;
}

/* Main Container */
.gh-container {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  flex: 1;
}

/* Metric Cards */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.metric-card {
  background-color: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.metric-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.metric-percent {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.1;
  font-family: var(--font-sans);
}

.metric-counts {
  font-size: 13px;
  color: var(--color-fg-muted);
}

/* Progress bar */
.progress-bar-container {
  height: 6px;
  background-color: var(--color-border-muted);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 6px;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 3px;
}

/* Delta badges */
.delta-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 12px;
  line-height: 14px;
}

.delta-badge.positive {
  color: var(--color-success-fg);
  background-color: var(--color-success-subtle);
}

.delta-badge.negative {
  color: var(--color-danger-fg);
  background-color: var(--color-danger-subtle);
}

.delta-badge.neutral {
  color: var(--color-fg-muted);
  background-color: var(--color-neutral-subtle);
}

/* GitHub Commit Banner */
.commit-banner {
  background-color: var(--color-canvas-subtle);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.commit-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.commit-author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--color-accent-emphasis);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}

.commit-message {
  font-weight: 600;
  color: var(--color-fg-default);
}

.commit-meta {
  color: var(--color-fg-muted);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.commit-sha-badge {
  font-family: var(--font-mono);
  font-size: 12px;
  background-color: var(--color-neutral-subtle);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  color: var(--color-accent-fg);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Toolbar & Breadcrumbs */
.file-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--color-fg-muted);
  flex-wrap: wrap;
}

.breadcrumb-item {
  color: var(--color-accent-fg);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.breadcrumb-item:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  color: var(--color-fg-muted);
}

.search-box {
  position: relative;
  min-width: 220px;
}

.search-box input {
  width: 100%;
  padding: 5px 10px 5px 30px;
  font-size: 13px;
  color: var(--color-fg-default);
  background-color: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  outline: none;
}

.search-box input::placeholder {
  color: var(--color-fg-muted);
  opacity: 1;
}

.search-box input:focus {
  border-color: var(--color-accent-fg);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
}

.search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-fg-muted);
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 1;
}

/* File Table */
.gh-box {
  background-color: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 24px;
}

.table-wrapper {
  overflow-x: auto;
  max-inline-size: 100%;
}

table.gh-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
}

table.gh-table th {
  background-color: var(--color-canvas-subtle);
  color: var(--color-fg-muted);
  font-weight: 600;
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-border-default);
  white-space: nowrap;
  user-select: none;
}

table.gh-table th.sortable {
  cursor: pointer;
}

table.gh-table th.sortable:hover {
  color: var(--color-fg-default);
}

table.gh-table td {
  padding: 8px 16px;
  border-top: 1px solid var(--color-border-muted);
  color: var(--color-fg-default);
  vertical-align: middle;
}

table.gh-table tbody tr:first-child td {
  border-top: none;
}

table.gh-table tbody tr:hover td {
  background-color: var(--color-canvas-subtle);
}

.file-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.file-link {
  color: var(--color-fg-default);
  text-decoration: none;
  cursor: pointer;
}

.file-link:hover {
  color: var(--color-accent-fg);
  text-decoration: underline;
}

/* Rate Pill */
.rate-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  min-width: 52px;
}

.rate-high {
  color: var(--color-success-fg);
  background-color: var(--color-success-subtle);
}

.rate-medium {
  color: var(--color-attention-fg);
  background-color: var(--color-attention-subtle);
}

.rate-low {
  color: var(--color-danger-fg);
  background-color: var(--color-danger-subtle);
}

/* Charts */
.chart-container {
  background-color: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.svg-chart {
  width: 100%;
  height: 240px;
  overflow: visible;
}

.chart-dot {
  cursor: pointer;
  transition: r 0.2s ease, fill 0.2s ease;
}

.chart-dot:hover {
  r: 6;
  fill: var(--color-accent-fg);
}

/* Tooltip */
.chart-tooltip {
  position: absolute;
  background-color: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  box-shadow: var(--shadow-rest);
  font-size: 12px;
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.15s ease;
  white-space: nowrap;
}

/* Code Viewer */
.blob-wrapper {
  background-color: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 24px;
}

.blob-header {
  background-color: var(--color-canvas-subtle);
  border-bottom: 1px solid var(--color-border-default);
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: var(--color-fg-muted);
}

.blob-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 20px;
}

.code-table td {
  padding: 0 8px;
}

.code-table tr:hover {
  filter: brightness(0.96);
}

.blob-num {
  width: 1%;
  min-width: 48px;
  text-align: right;
  color: var(--color-fg-subtle);
  user-select: none;
  cursor: pointer;
  border-right: 1px solid var(--color-border-muted);
}

.blob-hits {
  width: 1%;
  min-width: 36px;
  text-align: right;
  color: var(--color-fg-muted);
  user-select: none;
  font-size: 11px;
  border-right: 1px solid var(--color-border-muted);
}

.blob-code {
  white-space: pre-wrap;
  word-break: break-all;
  padding-left: 12px !important;
}

/* Line Coverage Highlighting */
tr.line-covered {
  background-color: var(--color-success-subtle);
}

tr.line-covered .blob-hits {
  color: var(--color-success-fg);
  font-weight: 500;
}

tr.line-uncovered {
  background-color: var(--color-danger-subtle);
}

tr.line-uncovered .blob-hits {
  color: var(--color-danger-fg);
  font-weight: 600;
}

/* File Tree Sidebar & Layout */
.files-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  width: 100%;
}

.files-sidebar {
  width: 280px;
  flex-shrink: 0;
  background-color: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  position: sticky;
  top: 16px;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.files-layout.sidebar-collapsed .files-sidebar {
  display: none;
}

.files-main {
  flex: 1;
  min-width: 0;
}

.sidebar-header {
  padding: 8px 12px;
  background-color: var(--color-canvas-subtle);
  border-bottom: 1px solid var(--color-border-default);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-fg-default);
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-counter {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  background-color: var(--color-neutral-subtle);
  border-radius: 10px;
  color: var(--color-fg-muted);
}

.sidebar-btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  color: var(--color-fg-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-btn-icon:hover {
  color: var(--color-fg-default);
  background-color: var(--color-neutral-subtle);
}

.sidebar-btn-icon:focus-visible {
  outline: 2px solid var(--color-accent-fg);
}

.goto-box {
  padding: 8px 10px;
  border-bottom: 1px solid var(--color-border-muted);
  background-color: var(--color-canvas-default);
  position: relative;
}

.goto-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.goto-input {
  width: 100%;
  padding: 5px 28px 5px 28px;
  font-size: 12px;
  color: var(--color-fg-default);
  background-color: var(--color-canvas-subtle);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  outline: none;
}

.goto-input::placeholder {
  color: var(--color-fg-muted);
  opacity: 1;
}

.goto-input:focus {
  background-color: var(--color-canvas-default);
  border-color: var(--color-accent-fg);
  box-shadow: 0 0 0 2px var(--color-accent-subtle);
}

.goto-icon {
  position: absolute;
  left: 8px;
  color: var(--color-fg-muted);
  pointer-events: none;
  display: flex;
  align-items: center;
  z-index: 1;
}

.goto-shortcut {
  position: absolute;
  right: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 1px 4px;
  background-color: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 3px;
  color: var(--color-fg-muted);
  pointer-events: none;
  line-height: 14px;
}

.goto-clear {
  position: absolute;
  right: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: var(--color-fg-muted);
  display: flex;
  align-items: center;
}

.goto-clear:hover {
  color: var(--color-fg-default);
}

.tree-container {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 6px 4px;
  flex: 1;
}

.tree-node {
  position: relative;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  font-size: 12px;
  line-height: 20px;
  border-radius: var(--radius-sm);
  color: var(--color-fg-default);
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  gap: 6px;
  margin: 1px 0;
  transition: background-color 0.1s ease;
}

.tree-node:hover {
  background-color: var(--color-neutral-subtle);
  color: var(--color-fg-default);
}

.tree-node.selected {
  background-color: var(--color-accent-subtle);
  color: var(--color-fg-default);
  font-weight: 600;
}

.tree-node.selected::before {
  content: "";
  position: absolute;
  left: 2px;
  top: 5px;
  bottom: 5px;
  width: 3px;
  background-color: var(--color-accent-fg);
  border-radius: 2px;
}

.tree-node:focus-visible {
  outline: 2px solid var(--color-accent-fg);
}

.tree-node[data-tree-folder] .tree-icon {
  color: var(--color-accent-fg);
}

.tree-node[data-tree-file] .tree-icon {
  color: var(--color-fg-muted);
}

.tree-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--color-fg-muted);
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.tree-toggle-spacer {
  width: 16px;
  flex-shrink: 0;
}

.tree-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.tree-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 10px;
  margin-left: 4px;
  flex-shrink: 0;
  line-height: 14px;
}

.tree-badge-high {
  color: var(--color-success-fg);
  background-color: var(--color-success-subtle);
}

.tree-badge-med {
  color: var(--color-attention-fg);
  background-color: var(--color-attention-subtle);
}

.tree-badge-low {
  color: var(--color-danger-fg);
  background-color: var(--color-danger-subtle);
}

.goto-results {
  overflow-y: auto;
  padding: 6px 4px;
  flex: 1;
}

.goto-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  gap: 8px;
  color: var(--color-fg-default);
  margin: 1px 0;
  transition: background-color 0.1s ease;
}

.goto-item:hover, .goto-item.active {
  background-color: var(--color-neutral-subtle);
}

.goto-item.selected {
  background-color: var(--color-accent-subtle);
  color: var(--color-fg-default);
  font-weight: 600;
}

.goto-item.selected::before {
  content: "";
  position: absolute;
  left: 2px;
  top: 4px;
  bottom: 4px;
  width: 3px;
  background-color: var(--color-accent-fg);
  border-radius: 2px;
}

.goto-item-path {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: 11px;
}

.goto-highlight {
  font-weight: 700;
  color: var(--color-accent-fg);
}

.goto-empty {
  padding: 24px 12px;
  text-align: center;
  color: var(--color-fg-muted);
  font-size: 12px;
}

.sidebar-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  font-size: 12px;
  color: var(--color-fg-default);
  background-color: var(--color-canvas-subtle);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.sidebar-toggle-btn:hover {
  background-color: var(--color-canvas-default);
  border-color: var(--color-accent-fg);
}

.sidebar-toggle-btn:focus-visible {
  outline: 2px solid var(--color-accent-fg);
}

/* Footer */
.gh-footer {
  border-top: 1px solid var(--color-border-default);
  padding: 24px;
  text-align: center;
  font-size: 12px;
  color: var(--color-fg-muted);
  margin-top: auto;
}

.gh-footer a {
  color: var(--color-accent-fg);
  text-decoration: none;
}

.gh-footer a:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gh-header-inner, .file-toolbar, .commit-banner {
    flex-direction: column;
    align-items: flex-start;
  }
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
`;
