import { ICONS } from '../templates/icons.js';
import { FRAMEWORK_PRESETS } from '../core/presets.js';
import { ASK_AI_CSS, renderAskAiDrawerHtml, ASK_AI_CLIENT_SCRIPT } from '../templates/ask-ai.js';

interface McpToolMeta {
  name: string;
  title: string;
  description: string;
  readOnly: boolean;
  properties?: Record<string, { type?: string; description?: string }>;
  required?: string[];
}

const COVERAGE_TOOLS_META: McpToolMeta[] = [
  {
    name: 'find_high_value_targets',
    title: 'Find High-Value Coverage Targets',
    description: 'Identify and prioritize high-value files and directories where adding test coverage yields the greatest overall repository coverage gains.',
    readOnly: true,
    properties: {
      folder: { type: 'string', description: 'Filter targets to a specific directory or subfolder' },
      scope: { type: 'string', description: 'Analyze files or folders (default: "files")' },
      minUncoveredLines: { type: 'number', description: 'Filter targets with at least N uncovered lines' },
      maxCoverage: { type: 'number', description: 'Filter targets with current coverage <= percentage (0-100)' },
      limit: { type: 'integer', description: 'Maximum number of prioritized targets to return (default: 10)' }
    }
  },
  {
    name: 'get_coverage_summary',
    title: 'Get Coverage Summary',
    description: 'Get overall code coverage summary (lines, statements, functions, branches) and delta compared to previous commit.',
    readOnly: true
  },
  {
    name: 'list_coverage_files',
    title: 'List Coverage Files',
    description: 'List covered and uncovered source files with line coverage percentages and filter options.',
    readOnly: true,
    properties: {
      folder: { type: 'string', description: 'Filter files by directory/folder prefix (e.g. "src/parsers" or "lib")' },
      minCoverage: { type: 'number', description: 'Minimum line coverage percentage (0-100)' },
      maxCoverage: { type: 'number', description: 'Maximum line coverage percentage (0-100)' },
      limit: { type: 'integer', description: 'Maximum number of files to return (default: 50)' },
      sortBy: { type: 'string', description: 'Sort by linesPct (ascending), name (alphabetical), or uncovered lines count (descending)' }
    }
  },
  {
    name: 'get_file_coverage',
    title: 'Get File Coverage Details',
    description: 'Get detailed line-by-line coverage and uncovered lines for a specific file.',
    readOnly: true,
    properties: {
      path: { type: 'string', description: 'Relative path of the source file (e.g. "src/cli.ts")' }
    },
    required: ['path']
  },
  {
    name: 'get_coverage_trends',
    title: 'Get Coverage Trends',
    description: 'Get historical coverage trend data across previous commits.',
    readOnly: true,
    properties: {
      limit: { type: 'integer', description: 'Number of historical commits to return (default: 20)' },
      branch: { type: 'string', description: 'Filter trends by git branch' }
    }
  },
  {
    name: 'get_badge_code',
    title: 'Get Badge Code',
    description: 'Generate SVG badge markdown and embed code for overall coverage or a specific folder/file.',
    readOnly: true,
    properties: {
      scope: { type: 'string', description: 'Badge scope: overall project, folder, or specific file' },
      path: { type: 'string', description: 'Target folder or file path when scope is "folder" or "file"' },
      baseUrl: { type: 'string', description: 'Base URL of published GitHub Pages site (e.g. "https://user.github.io/repo")' }
    }
  }
];

const PROJECT_TOOLS_META: McpToolMeta[] = [
  {
    name: 'get_cli_help',
    title: 'Get CLI Help',
    description: 'Get covpages command-line interface documentation, commands, options, and usage examples.',
    readOnly: true,
    properties: {
      command: { type: 'string', description: 'Filter by specific subcommand (default: "all")' }
    }
  },
  {
    name: 'get_framework_preset',
    title: 'Get Framework Preset',
    description: 'Get framework-specific integration guide, test command, and ready-to-use GitHub Actions workflow (.github/workflows/covpages.yml).',
    readOnly: true,
    properties: {
      framework: { type: 'string', description: 'Target framework: flutter, dart, vitest, jest, rust, python, go, or cpp' },
      docs: { type: 'boolean', description: 'Configure workflow for GitHub Pages deployment from docs/ directory (default: true)' }
    },
    required: ['framework']
  },
  {
    name: 'consult_setup',
    title: 'Consult Setup',
    description: 'Consultative setup advisor for covpages. Recommends the optimal deployment mode (zero-build drop-in, GitHub Actions workflow, Docker, or commit backfill) based on your repository and requirements.',
    readOnly: true,
    properties: {
      language: { type: 'string', description: 'Programming language (e.g. "typescript", "dart", "rust", "python", "go")' },
      framework: { type: 'string', description: 'Testing framework (e.g. "vitest", "jest", "flutter", "pytest")' },
      zeroBuild: { type: 'boolean', description: 'True if you prefer zero-build drop-in mode without node/npm build step in CI' },
      hasExistingCommits: { type: 'boolean', description: 'True if you want to backfill coverage across historical git commits' }
    }
  },
  {
    name: 'get_documentation',
    title: 'Get Documentation',
    description: 'Fetch documentation topics (quickstart, dropin, backfill, badges, react, docker, specification, mcp).',
    readOnly: true,
    properties: {
      topic: { type: 'string', description: 'Documentation topic' }
    }
  },
  {
    name: 'navigate_to',
    title: 'Navigate To',
    description: 'Navigate to a specific page or section of covpages (e.g. live demo coverage viewer, badges generator, quickstart, GitHub repo).',
    readOnly: true,
    properties: {
      target: { type: 'string', description: 'Destination target' }
    },
    required: ['target']
  }
];

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderStaticCatalogHtml(tools: McpToolMeta[]): string {
  const toolCards = tools.map((t) => {
    const props = t.properties ? Object.entries(t.properties) : [];
    const inputsHtml = props.map(([k, schema]) => {
      const req = t.required && t.required.includes(k);
      return `<label class="mcp-field">
        <span><code>${escapeHtml(k)}</code> (${escapeHtml(schema.type || 'string')}${req ? ' *' : ''})</span>
        <input type="text" name="${escapeHtml(k)}" data-prop-type="${escapeHtml(schema.type || 'string')}" placeholder="${escapeHtml(schema.description || '')}" />
      </label>`;
    }).join('');

    return `<div class="mcp-tool-row" data-tool-name="${escapeHtml(t.name)}">
      <div class="mcp-tool-header">
        <h4 class="mcp-tool-title"><code>${escapeHtml(t.name)}</code></h4>
        <span class="badge ${t.readOnly ? 'badge-readonly' : 'badge-mutating'}">${t.readOnly ? 'Read-Only' : 'Mutating (Requires Confirmation)'}</span>
      </div>
      <p class="mcp-tool-desc">${escapeHtml(t.description)}</p>
      <form class="mcp-tool-form" data-tool="${escapeHtml(t.name)}" action="javascript:void(0);">
        ${inputsHtml ? `<div class="mcp-field-group">${inputsHtml}</div>` : ''}
        <div class="mcp-tool-actions">
          <button type="submit" class="btn btn-sm">Run Tool</button>
          ${t.readOnly ? `<a class="btn-link" href="?tool=${encodeURIComponent(t.name)}">Direct Link (?tool=${escapeHtml(t.name)})</a>` : ''}
        </div>
        <pre class="mcp-tool-result" hidden></pre>
      </form>
    </div>`;
  }).join('');

  return `
    <div class="mcp-page-widget">
      <div class="mcp-status-bar">
        <div><strong>MCP Relay Status:</strong> <span class="badge badge-neutral" data-status="ready">Ready (${tools.length} tools)</span></div>
        <div class="mcp-port-meta">Port: <code>8788</code></div>
      </div>
      <section class="mcp-catalog">
        <h3>Registered WebMCP Tools (${tools.length})</h3>
        <div class="mcp-tool-list">${toolCards}</div>
      </section>
    </div>
  `;
}

export function renderMcpHtml(options: {
  repo?: string;
  title?: string;
  scope?: 'project' | 'coverage';
} = {}): string {
  const repo = options.repo || 'yongjhih/covpages';
  const isCoverage = options.scope === 'coverage';
  const title = options.title || (isCoverage
    ? 'Covpages Coverage & High-Value Targets WebMCP Tools'
    : 'Covpages CLI & Project WebMCP Tools');

  const serializedPresets = JSON.stringify(FRAMEWORK_PRESETS);
  const orderedTools = isCoverage
    ? [...COVERAGE_TOOLS_META, ...PROJECT_TOOLS_META]
    : [...PROJECT_TOOLS_META, ...COVERAGE_TOOLS_META];
  const staticCatalogHtml = renderStaticCatalogHtml(orderedTools);

  return `<!doctype html>
<html lang="en" data-color-mode="auto">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${isCoverage ? 'Covpages coverage metrics and high-value target prioritization WebMCP endpoint' : 'Covpages CLI, presets, and setup consultation WebMCP endpoint'}" />
  <meta name="color-scheme" content="light dark" />
  <title>${title} · covpages</title>
  <style>
    :root {
      color-scheme: light dark;
      --color-canvas-default: #ffffff;
      --color-canvas-subtle: #f6f8fa;
      --color-canvas-overlay: #ffffff;
      --color-border-default: #d0d7de;
      --color-border-muted: #d8dee4;
      --color-fg-default: #1f2328;
      --color-fg-muted: #59636e;
      --color-fg-subtle: #656d76;
      --color-accent-fg: #0969da;
      --color-accent-emphasis: #0969da;
      --color-accent-subtle: rgba(9, 105, 218, 0.08);
      --color-success-fg: #1a7f37;
      --color-success-emphasis: #1f883d;
      --color-success-subtle: rgba(26, 127, 55, 0.1);
      --color-danger-fg: #cf222e;
      --color-danger-subtle: rgba(207, 34, 46, 0.1);
      --color-warning-fg: #9a6700;
      --color-warning-subtle: rgba(154, 103, 0, 0.1);
      --color-neutral-subtle: rgba(129, 139, 152, 0.12);
      --color-btn-bg: #f6f8fa;
      --color-btn-border: #d0d7de;
      --color-btn-hover-bg: #eaeef2;
      --color-btn-primary-bg: #1f883d;
      --color-btn-primary-fg: #ffffff;
      --color-btn-primary-border: #1a7f37;
      --color-btn-primary-hover-bg: #1a7f37;
      --font-stack: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
      --radius-sm: 4px;
      --radius-md: 6px;
      --radius-lg: 8px;
      --shadow-sm: 0 1px 0 rgba(31, 35, 40, 0.04);
      --shadow-rest: 0 4px 12px rgba(31, 35, 40, 0.08), 0 1px 2px rgba(31, 35, 40, 0.06);
    }

    [data-color-mode="dark"] {
      color-scheme: dark;
      --color-canvas-default: #0d1117;
      --color-canvas-subtle: #161b22;
      --color-canvas-overlay: #161b22;
      --color-border-default: #30363d;
      --color-border-muted: #21262d;
      --color-fg-default: #e6edf3;
      --color-fg-muted: #8b949e;
      --color-fg-subtle: #6e7681;
      --color-accent-fg: #4493f8;
      --color-accent-emphasis: #1f6feb;
      --color-accent-subtle: rgba(56, 139, 253, 0.1);
      --color-success-fg: #3fb950;
      --color-success-emphasis: #238636;
      --color-success-subtle: rgba(46, 160, 67, 0.15);
      --color-danger-fg: #ff7b72;
      --color-danger-subtle: rgba(248, 81, 73, 0.15);
      --color-warning-fg: #d29922;
      --color-warning-subtle: rgba(210, 153, 34, 0.15);
      --color-neutral-subtle: rgba(110, 118, 129, 0.16);
      --color-btn-bg: #21262d;
      --color-btn-border: #30363d;
      --color-btn-hover-bg: #30363d;
      --color-btn-primary-bg: #238636;
      --color-btn-primary-fg: #ffffff;
      --color-btn-primary-border: rgba(240, 246, 252, 0.1);
      --color-btn-primary-hover-bg: #1a7f37;
      --shadow-rest: 0 8px 24px rgba(1, 4, 9, 0.45), 0 1px 3px rgba(1, 4, 9, 0.3);
    }

    @media (prefers-color-scheme: dark) {
      [data-color-mode="auto"] {
        color-scheme: dark;
        --color-canvas-default: #0d1117;
        --color-canvas-subtle: #161b22;
        --color-canvas-overlay: #161b22;
        --color-border-default: #30363d;
        --color-border-muted: #21262d;
        --color-fg-default: #e6edf3;
        --color-fg-muted: #8b949e;
        --color-fg-subtle: #6e7681;
        --color-accent-fg: #4493f8;
        --color-accent-emphasis: #1f6feb;
        --color-accent-subtle: rgba(56, 139, 253, 0.1);
        --color-success-fg: #3fb950;
        --color-success-emphasis: #238636;
        --color-success-subtle: rgba(46, 160, 67, 0.15);
        --color-danger-fg: #ff7b72;
        --color-danger-subtle: rgba(248, 81, 73, 0.15);
        --color-warning-fg: #d29922;
        --color-warning-subtle: rgba(210, 153, 34, 0.15);
        --color-neutral-subtle: rgba(110, 118, 129, 0.16);
        --color-btn-bg: #21262d;
        --color-btn-border: #30363d;
        --color-btn-hover-bg: #30363d;
        --color-btn-primary-bg: #238636;
        --color-btn-primary-fg: #ffffff;
        --color-btn-primary-border: rgba(240, 246, 252, 0.1);
        --color-btn-primary-hover-bg: #1a7f37;
        --shadow-rest: 0 8px 24px rgba(1, 4, 9, 0.45), 0 1px 3px rgba(1, 4, 9, 0.3);
      }
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-stack);
      font-size: 14px;
      line-height: 1.5;
      color: var(--color-fg-default);
      background-color: var(--color-canvas-default);
      -webkit-font-smoothing: antialiased;
    }

    a { color: var(--color-accent-fg); text-decoration: none; }
    a:hover { text-decoration: underline; }
    code, pre { font-family: var(--font-mono); }
    code {
      font-size: 12px;
      padding: 0.2em 0.4em;
      background-color: var(--color-neutral-subtle);
      border-radius: var(--radius-sm);
    }

    /* Header */
    .site-header {
      border-bottom: 1px solid var(--color-border-default);
      background-color: var(--color-canvas-default);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-inner {
      max-width: 1040px;
      margin: 0 auto;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 14px;
      color: var(--color-fg-default);
      text-decoration: none;
    }
    .brand svg { fill: currentColor; }
    .nav-links {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .nav-link {
      color: var(--color-fg-muted);
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--color-fg-default);
      text-decoration: none;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 500;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-btn-border);
      background-color: var(--color-btn-bg);
      color: var(--color-fg-default);
      cursor: pointer;
      line-height: 20px;
      transition: background-color 0.15s ease, border-color 0.15s ease;
      text-decoration: none;
    }
    .btn:hover {
      background-color: var(--color-btn-hover-bg);
      text-decoration: none;
    }
    .btn-sm {
      padding: 3px 10px;
      font-size: 12px;
    }
    .btn-primary {
      background-color: var(--color-btn-primary-bg);
      color: var(--color-btn-primary-fg);
      border-color: var(--color-btn-primary-border);
    }
    .btn-primary:hover {
      background-color: var(--color-btn-primary-hover-bg);
      color: var(--color-btn-primary-fg);
    }
    .btn-link {
      font-size: 12px;
      color: var(--color-accent-fg);
      text-decoration: none;
    }
    .btn-link:hover { text-decoration: underline; }

    /* Layout */
    .main-container {
      max-width: 1040px;
      margin: 0 auto;
      padding: 32px 24px 64px 24px;
    }
    .intro-section {
      margin-bottom: 24px;
    }
    .intro-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--color-fg-default);
      letter-spacing: -0.015em;
    }
    .intro-subtitle {
      font-size: 14px;
      color: var(--color-fg-muted);
      line-height: 1.6;
      margin-bottom: 16px;
    }

    /* Command snippet card */
    .command-box {
      background-color: var(--color-canvas-subtle);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      font-family: var(--font-mono);
      font-size: 13px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      overflow-x: auto;
    }
    .command-code {
      color: var(--color-fg-default);
      white-space: nowrap;
    }

    /* MCP Page Widget & UI Styling matching ai-proxy mountMcpPageUi */
    .mcp-page-widget {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .mcp-status-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background-color: var(--color-canvas-subtle);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      font-size: 13px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 12px;
      line-height: 1.4;
    }
    .badge-success {
      background-color: var(--color-success-subtle);
      color: var(--color-success-fg);
      border: 1px solid var(--color-success-fg);
    }
    .badge-warning {
      background-color: var(--color-warning-subtle);
      color: var(--color-warning-fg);
      border: 1px solid var(--color-warning-fg);
    }
    .badge-danger {
      background-color: var(--color-danger-subtle);
      color: var(--color-danger-fg);
      border: 1px solid var(--color-danger-fg);
    }
    .badge-neutral {
      background-color: var(--color-neutral-subtle);
      color: var(--color-fg-muted);
      border: 1px solid var(--color-border-default);
    }
    .badge-readonly {
      background-color: var(--color-accent-subtle);
      color: var(--color-accent-fg);
      border: 1px solid var(--color-accent-fg);
      font-size: 11px;
    }
    .badge-mutating {
      background-color: var(--color-warning-subtle);
      color: var(--color-warning-fg);
      border: 1px solid var(--color-warning-fg);
      font-size: 11px;
    }

    .mcp-catalog h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--color-fg-default);
    }
    .mcp-tool-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .mcp-tool-row {
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      background-color: var(--color-canvas-default);
      padding: 16px;
      box-shadow: var(--shadow-sm);
    }
    .mcp-tool-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      gap: 10px;
      flex-wrap: wrap;
    }
    .mcp-tool-title {
      font-size: 14px;
      margin: 0;
    }
    .mcp-tool-title code {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-accent-fg);
      background: none;
      padding: 0;
    }
    .mcp-tool-desc {
      font-size: 13px;
      color: var(--color-fg-muted);
      margin-bottom: 14px;
      line-height: 1.5;
    }
    .mcp-field-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }
    .mcp-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      color: var(--color-fg-muted);
    }
    .mcp-field input {
      padding: 6px 10px;
      font-size: 13px;
      font-family: inherit;
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-sm);
      background-color: var(--color-canvas-subtle);
      color: var(--color-fg-default);
      outline: none;
    }
    .mcp-field input:focus {
      border-color: var(--color-accent-fg);
      box-shadow: 0 0 0 2px var(--color-accent-subtle);
    }
    .mcp-tool-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .mcp-tool-result {
      margin-top: 12px;
      padding: 12px;
      background-color: var(--color-canvas-subtle);
      border: 1px solid var(--color-border-muted);
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-size: 12px;
      line-height: 1.5;
      overflow-x: auto;
      max-height: 360px;
      white-space: pre-wrap;
      color: var(--color-fg-default);
    }

    .mcp-direct-result {
      padding: 16px;
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      background-color: var(--color-canvas-subtle);
    }
    .mcp-direct-result h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .mcp-output {
      font-size: 12px;
      background-color: var(--color-canvas-default);
      padding: 12px;
      border: 1px solid var(--color-border-muted);
      border-radius: var(--radius-sm);
      max-height: 320px;
      overflow-y: auto;
      white-space: pre-wrap;
    }
    .mcp-alert {
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 13px;
    }
    .mcp-alert-warning {
      background-color: var(--color-warning-subtle);
      color: var(--color-warning-fg);
      border: 1px solid var(--color-warning-fg);
    }

    /* Footer */
    .site-footer {
      border-top: 1px solid var(--color-border-muted);
      padding: 24px 0;
      color: var(--color-fg-muted);
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    ${ASK_AI_CSS}
  </style>
  <script>
    (function () {
      try {
        var mode = localStorage.getItem('covpages-theme') || 'auto';
        document.documentElement.setAttribute('data-color-mode', mode);
      } catch (e) {}
    })();
  </script>
</head>
<body>
  <!-- Header -->
  <header class="site-header">
    <div class="header-inner">
      <a href="./" class="brand">
        ${ICONS.github}
        <span>covpages</span>
        <span style="color:var(--fg-muted);font-weight:400;">/</span>
        <span>${isCoverage ? 'covpages / mcp' : 'mcp'}</span>
      </a>

      <nav class="nav-links">
        <a href="${isCoverage ? '../' : './'}" class="nav-link">Overview</a>
        <a href="${isCoverage ? './' : 'covpages/'}" class="nav-link">${isCoverage ? 'Coverage Report' : 'Live Coverage'}</a>
        <a href="mcp" class="nav-link active">${isCoverage ? 'Coverage MCP (11 Tools)' : 'Project MCP (11 Tools)'}</a>
      </nav>

      <div style="display:flex;align-items:center;gap:10px;">
        <button class="btn btn-sm btn-primary" id="ask-ai-trigger" type="button">Ask AI</button>
        <button class="btn btn-sm" id="theme-toggle" type="button" title="Toggle theme">${ICONS.moon} Theme</button>
        <a href="https://github.com/${repo}" class="btn btn-sm" target="_blank" rel="noopener">GitHub ${ICONS.linkExternal}</a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="main-container">
    <section class="intro-section">
      <h1 class="intro-title">${title}</h1>
      <p class="intro-subtitle">
        Zero backend required. This page runs in your browser and registers 11 client-side WebMCP tools via <code>navigator.modelContext</code> (including coverage analysis, high-value test targets, multi-commit trends, badges, CLI reference, and setup advisor). AI assistants can fetch ready-to-use workflows, analyze coverage metrics, and navigate pages directly from Claude, Cursor, or ai-proxy.
      </p>

      <div class="command-box">
        <span class="command-code" data-replace-base-url="true">npx ai-proxy add https://&lt;host&gt;/&lt;org&gt;/&lt;repo&gt;/mcp --name covpages</span>
        <button class="btn btn-sm" id="copy-cmd" type="button">Copy</button>
      </div>
    </section>

    <!-- Mount target for WebMCP Catalog & Test Runner -->
    <div id="mcp-catalog">${staticCatalogHtml}</div>

    <footer class="site-footer">
      <span>Compliant with <a href="https://yongjhih.github.io/ai-proxy/" target="_blank" rel="noopener">MCP Pages 1.0 Specification</a></span>
      <span>Covpages &middot; Git-Native Coverage for GitHub Pages</span>
    </footer>
  </main>

  ${renderAskAiDrawerHtml({ mode: isCoverage ? 'coverage' : 'project' })}

  <script>
    (function () {
      // Auto-detect current page URL and update registration command snippet
      var cleanUrl = window.location.href.split('#')[0].split('?')[0];
      // Normalize to short URL without .html
      if (cleanUrl.endsWith('/mcp.html')) {
        cleanUrl = cleanUrl.slice(0, -'.html'.length);
      } else if (cleanUrl.endsWith('.html')) {
        cleanUrl = cleanUrl.slice(0, -'.html'.length);
      } else if (cleanUrl.endsWith('/')) {
        cleanUrl += 'mcp';
      }

      var defaultName = '${(repo.split('/')[1] || repo || 'covpages').toLowerCase()}';
      var siteName = defaultName;
      try {
        var parsed = new URL(cleanUrl);
        var p = parsed.pathname.replace(/\\/mcp(?:\\.html)?$/i, '').replace(/\\/+$/, '');
        var parts = p.split('/').filter(Boolean);
        if (parts.length > 0) {
          siteName = parts.join('-').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
        }
      } catch (e) {}

      var fullCmd = 'npx ai-proxy add ' + cleanUrl + ' --name ' + siteName;
      var nodes = document.querySelectorAll('[data-replace-base-url="true"]');
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].textContent = fullCmd;
      }

      var copyBtn = document.getElementById('copy-cmd');
      if (copyBtn) {
        copyBtn.addEventListener('click', function () {
          var targetEl = document.querySelector('[data-replace-base-url="true"]');
          var text = targetEl ? targetEl.textContent : fullCmd;
          navigator.clipboard.writeText(text).then(function () {
            copyBtn.textContent = 'Copied!';
            setTimeout(function () { copyBtn.textContent = 'Copy'; }, 2000);
          });
        });
      }

      // Theme toggle
      var themeBtn = document.getElementById('theme-toggle');
      if (themeBtn) {
        themeBtn.addEventListener('click', function () {
          var current = document.documentElement.getAttribute('data-color-mode') || 'auto';
          var next = current === 'dark' ? 'light' : current === 'light' ? 'auto' : 'dark';
          document.documentElement.setAttribute('data-color-mode', next);
          try { localStorage.setItem('covpages-theme', next); } catch (e) {}
        });
      }
    })();
  </script>

  <script>
    ${ASK_AI_CLIENT_SCRIPT}
  </script>

  <!-- WebMCP Tools registration and mount -->
  <script type="module">
    import { mountMcpPageUi } from './web/ui.mjs';

    const IS_COVERAGE_MODE = ${isCoverage ? 'true' : 'false'};
    const PRESETS = ${serializedPresets};
    const title = ${JSON.stringify(title)};
    const repo = ${JSON.stringify(repo)};

    let cachedCoverageData = null;
    async function loadCoverageData(signal) {
      if (cachedCoverageData) return cachedCoverageData;

      const candidates = [
        './covpages-data.json',
        './covpages/covpages-data.json',
        '../covpages-data.json',
        '../covpages/covpages-data.json'
      ];

      for (const url of candidates) {
        try {
          const res = await fetch(url, { signal });
          if (res.ok) {
            cachedCoverageData = await res.json();
            return cachedCoverageData;
          }
        } catch (err) {}
      }

      if (typeof window !== 'undefined' && window.__COVPAGES_DATA__) {
        cachedCoverageData = window.__COVPAGES_DATA__;
        return cachedCoverageData;
      }

      throw new Error('Coverage data file (covpages-data.json) could not be loaded.');
    }

    // Tools for Site-level / Project MCP (/covpages/mcp)
    const projectTools = [
      {
        name: 'get_cli_help',
        description: 'Get covpages command-line interface documentation, commands, options, and usage examples.',
        inputSchema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              enum: ['generate', 'dropin', 'mcp', 'backfill', 'presets', 'docker', 'serve', 'init', 'all'],
              description: 'Filter by specific subcommand (default: "all")'
            }
          },
          additionalProperties: false
        },
        annotations: {
          title: 'Get CLI Help',
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        },
        async execute({ command } = {}) {
          const commands = {
            generate: 'covpages generate [options] [input-files...] - Generate coverage static site for GitHub Pages with multi-commit trends and badges.',
            dropin: 'covpages dropin [dir] - Generate zero-build drop-in static site (index.html + .nojekyll). Put in gh-pages, then simply copy lcov.info!',
            mcp: 'covpages mcp [dir] - Generate compliant MCP Page (mcp.html + web/ modules) for ai-proxy.',
            backfill: 'covpages backfill --range <range> --test-cmd <cmd> - Backfill test coverage across a range of historical git commits.',
            presets: 'covpages presets [framework] - View integration guides and workflows for mainstream frameworks (flutter, vitest, jest, rust, python, go, cpp).',
            docker: 'covpages docker <run|build|pull> [args...] - Run, build, or pull covpages inside a container (docker/podman).',
            serve: 'covpages serve [dir] [-p port] - Start a local preview web server.',
            init: 'covpages init [--framework <name>] [--docs] - Create a GitHub Actions workflow (.github/workflows/covpages.yml).'
          };

          if (command && command !== 'all' && commands[command]) {
            return {
              command,
              documentation: commands[command]
            };
          }

          return {
            usage: 'covpages [command] [options] [input-files...]',
            commands,
            quickExamples: [
              'npx covpages dropin gh-pages && cp coverage/lcov.info gh-pages/',
              'npx covpages coverage/lcov.info --docs --save-raw',
              'npx covpages init --framework vitest --docs',
              'npx covpages backfill --range HEAD~5..HEAD --test-cmd "npm test"'
            ]
          };
        }
      },
      {
        name: 'get_framework_preset',
        description: 'Get framework-specific integration guide, test command, and ready-to-use GitHub Actions workflow (.github/workflows/covpages.yml).',
        inputSchema: {
          type: 'object',
          properties: {
            framework: {
              type: 'string',
              description: 'Target framework: flutter, dart, vitest, jest, rust, python, go, or cpp'
            },
            docs: {
              type: 'boolean',
              description: 'Configure workflow for GitHub Pages deployment from docs/ directory (default: true)'
            }
          },
          required: ['framework'],
          additionalProperties: false
        },
        annotations: {
          title: 'Get Framework Preset',
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        },
        async execute({ framework, docs = true }) {
          const key = (framework || '').toLowerCase().trim();
          const p = PRESETS[key];
          if (!p) {
            return {
              error: \`Unknown framework "\${framework}". Available: \${Object.keys(PRESETS).join(', ')}\`,
              availablePresets: Object.keys(PRESETS)
            };
          }

          const workflow = \`name: Test Coverage Pages

on:
  push:
    branches: [main, master]
  pull_request:

permissions:
  contents: write
  pages: write
  id-token: write

concurrency:
  group: "covpages"
  cancel-in-progress: false

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

\${p.workflowStep}

      - name: Generate covpages Report
        run: npx covpages \${p.coverageFile} \${docs ? '--docs' : '--output gh-pages'} --save-raw --mcp

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
        with:
          github_token: \${'\\x24{{ secrets.GITHUB_TOKEN }}'}
          publish_dir: \${docs ? './docs/covpages' : './gh-pages'}
\`;

          return {
            framework: p.name,
            language: p.language,
            testCommand: p.testCmd,
            coverageFile: p.coverageFile,
            description: p.description,
            recommendedWorkflowPath: '.github/workflows/covpages.yml',
            workflow
          };
        }
      },
      {
        name: 'consult_setup',
        description: 'Consultative setup advisor for covpages. Recommends the optimal deployment mode (zero-build drop-in, GitHub Actions workflow, Docker, or commit backfill) based on your repository and requirements.',
        inputSchema: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              description: 'Programming language (e.g. "typescript", "dart", "rust", "python", "go")'
            },
            framework: {
              type: 'string',
              description: 'Testing framework (e.g. "vitest", "jest", "flutter", "pytest")'
            },
            zeroBuild: {
              type: 'boolean',
              description: 'True if you prefer zero-build drop-in mode without node/npm build step in CI'
            },
            hasExistingCommits: {
              type: 'boolean',
              description: 'True if you want to backfill coverage across historical git commits'
            }
          },
          additionalProperties: false
        },
        annotations: {
          title: 'Consult Setup',
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        },
        async execute(input = {}) {
          if (input.zeroBuild) {
            return {
              recommendedMode: 'zero-build-dropin',
              summary: "Zero-build drop-in mode is ideal for environments where you don't want to run Node.js in CI.",
              steps: [
                '1. Run "npx covpages dropin gh-pages" to create the static viewer.',
                '2. In your CI, simply produce your coverage report (lcov.info) and copy it into gh-pages/.',
                '3. Push gh-pages branch. The browser client parses and renders lcov.info dynamically at runtime!'
              ],
              command: 'npx covpages dropin gh-pages'
            };
          }

          if (input.hasExistingCommits) {
            return {
              recommendedMode: 'backfill-history',
              summary: 'Commit backfill mode executes historical commits in a git revision range to generate trendlines.',
              command: 'npx covpages backfill --range HEAD~10..HEAD --test-cmd "npm test" --docs',
              description: 'Runs your test suite across recent commits to populate multi-commit trends and store packed git objects.'
            };
          }

          const matchedFramework = input.framework || input.language || 'vitest';
          return {
            recommendedMode: 'github-actions-workflow',
            summary: 'GitHub Actions automated publishing with multi-commit trends and scoped badges.',
            quickCommand: \`npx covpages init --framework \${matchedFramework} --docs\`,
            workflowFile: '.github/workflows/covpages.yml',
            features: [
              'Git packfile delta compression (100 commits compress into ~1.24 MB)',
              'Scoped SVG badges for every branch, directory, and file',
              'Built-in WebMCP endpoint (mcp.html + web/*.mjs) for ai-proxy'
            ]
          };
        }
      },
      {
        name: 'get_documentation',
        description: 'Fetch documentation topics (quickstart, dropin, backfill, badges, react, docker, specification, mcp).',
        inputSchema: {
          type: 'object',
          properties: {
            topic: {
              type: 'string',
              enum: ['overview', 'quickstart', 'dropin', 'backfill', 'presets', 'badges', 'react', 'docker', 'specification', 'mcp'],
              description: 'Documentation topic'
            }
          },
          additionalProperties: false
        },
        annotations: {
          title: 'Get Documentation',
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        },
        async execute({ topic = 'overview' } = {}) {
          const docsMap = {
            overview: '# Covpages\\n\\nGit-Native Code Coverage for GitHub Pages with multi-commit trends, scoped SVG badges, syntax highlighting, and client-side WebMCP endpoints.',
            quickstart: '## Quickstart\\n\\n1. Run tests with coverage: \`npm test -- --coverage\`\\n2. Generate site: \`npx covpages coverage/lcov.info --docs --save-raw\`\\n3. Deploy \`docs/\` to GitHub Pages.',
            dropin: '## Zero-Build Drop-in Mode\\n\\nPut \`index.html\` in \`gh-pages\`, then just copy \`lcov.info\`. The browser parses LCOV at runtime!',
            backfill: '## Backfill Commits\\n\\nRun \`npx covpages backfill --range HEAD~10..HEAD\` to backfill trend points across historical commits.',
            badges: '## Scoped SVG Badges\\n\\nCovpages generates badges into \`badges/\` for repository, branch, directories, and files.',
            react: '## React & Component Integration\\n\\nUse \`import { Covpages } from "covpages/react";\` to embed interactive coverage charts into Next.js or Docusaurus.',
            mcp: '## WebMCP & ai-proxy\\n\\nTurns any static GitHub Pages site into an MCP server via \`mcp.html\` and vendored \`web/*.mjs\` client modules.'
          };
          return {
            topic,
            content: docsMap[topic] || docsMap.overview
          };
        }
      },
      {
        name: 'navigate_to',
        description: 'Navigate to a specific page or section of covpages (e.g. live demo coverage viewer, badges generator, quickstart, GitHub repo).',
        inputSchema: {
          type: 'object',
          properties: {
            target: {
              type: 'string',
              enum: ['live_demo', 'badges', 'quickstart', 'coverage_mcp', 'github_repo'],
              description: 'Destination target'
            }
          },
          required: ['target'],
          additionalProperties: false
        },
        annotations: {
          title: 'Navigate To',
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        },
        async execute({ target }) {
          const targets = {
            live_demo: './covpages/',
            coverage_mcp: './covpages/mcp',
            badges: './#badges',
            quickstart: './#quickstart',
            github_repo: 'https://github.com/' + repo
          };
          const dest = targets[target] || './';
          if (typeof window !== 'undefined' && window.location) {
            window.location.href = dest;
          }
          return {
            target,
            navigatedTo: dest
          };
        }
      }
    ];

    // Tools for Coverage-level MCP (/covpages/covpages/mcp)
    const coverageTools = [
      {
        name: 'find_high_value_targets',
        description: 'Identify and prioritize high-value files and directories where adding test coverage yields the greatest overall repository coverage gains.',
        inputSchema: {
          type: 'object',
          properties: {
            folder: {
              type: 'string',
              description: 'Filter targets to a specific directory or subfolder'
            },
            scope: {
              type: 'string',
              enum: ['files', 'folders'],
              description: 'Analyze files or folders (default: "files")'
            },
            minUncoveredLines: {
              type: 'number',
              description: 'Filter targets with at least N uncovered lines'
            },
            maxCoverage: {
              type: 'number',
              description: 'Filter targets with current coverage <= percentage (0-100)'
            },
            limit: {
              type: 'integer',
              description: 'Maximum number of prioritized targets to return (default: 10)'
            }
          },
          additionalProperties: false
        },
        annotations: {
          title: 'Find High-Value Coverage Targets',
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        },
        async execute(input = {}, { signal } = {}) {
          const data = await loadCoverageData(signal);
          const isFolders = input.scope === 'folders';
          const repoTotal = data.summary.lines.total;
          const repoCovered = data.summary.lines.covered;
          const curRepoPct = data.summary.lines.pct;

          let items = isFolders
            ? Object.entries(data.folders || {}).map(([p, f]) => ({ path: p || '(root)', lines: f.lines, functions: f.functions, branches: f.branches }))
            : Object.values(data.files || {});

          if (input.folder) {
            const prefix = input.folder.endsWith('/') ? input.folder : input.folder + '/';
            items = items.filter(f => f.path.startsWith(prefix) || f.path === input.folder);
          }
          if (typeof input.minUncoveredLines === 'number') {
            items = items.filter(f => (f.lines.total - f.lines.covered) >= input.minUncoveredLines);
          }
          if (typeof input.maxCoverage === 'number') {
            items = items.filter(f => f.lines.pct <= input.maxCoverage);
          }

          const ranked = items.map(item => {
            const uncovered = item.lines.total - item.lines.covered;
            const potentialGain = repoTotal > 0 ? (uncovered / repoTotal) * 100 : 0;
            const projectedPct = repoTotal > 0 ? ((repoCovered + uncovered) / repoTotal) * 100 : 0;
            const priority = potentialGain >= 5 || uncovered >= 150 ? 'high' : potentialGain >= 1 || uncovered >= 40 ? 'medium' : 'low';
            return {
              path: item.path,
              currentCoveragePct: item.lines.pct,
              uncoveredLines: uncovered,
              totalLines: item.lines.total,
              potentialGainPct: Number(potentialGain.toFixed(2)),
              projectedRepoCoveragePct: Number(projectedPct.toFixed(2)),
              priority,
              recommendation: \`Covering \${item.path} (currently \${item.lines.pct.toFixed(1)}%, \${uncovered} uncovered lines) will increase overall repo coverage by +\${potentialGain.toFixed(2)}% (from \${curRepoPct.toFixed(2)}% to \${projectedPct.toFixed(2)}%).\`
            };
          }).sort((a, b) => b.uncoveredLines - a.uncoveredLines);

          const limit = typeof input.limit === 'number' && input.limit > 0 ? input.limit : 10;
          return {
            repoSummary: {
              currentLinesPct: curRepoPct,
              coveredLines: repoCovered,
              totalLines: repoTotal,
              deltaVsPrevious: data.delta ? data.delta.linesPct : null
            },
            totalEvaluated: items.length,
            targets: ranked.slice(0, limit)
          };
        }
      },
      {
        name: 'get_coverage_summary',
        description: 'Get overall code coverage summary (lines, statements, functions, branches) and delta compared to previous commit.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false
        },
        annotations: {
          title: 'Get Coverage Summary',
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        },
        async execute(_input, { signal } = {}) {
          const data = await loadCoverageData(signal);
          return {
            repoName: data.repoName,
            generatedAt: data.generatedAt,
            currentCommit: data.currentCommit,
            previousCommit: data.previousCommit || null,
            summary: data.summary,
            delta: data.delta || null
          };
        }
      },
      {
        name: 'list_coverage_files',
        description: 'List covered and uncovered source files with line coverage percentages and filter options.',
        inputSchema: {
          type: 'object',
          properties: {
            folder: {
              type: 'string',
              description: 'Filter files by directory/folder prefix (e.g. "src/parsers" or "lib")'
            },
            minCoverage: {
              type: 'number',
              description: 'Minimum line coverage percentage (0-100)'
            },
            maxCoverage: {
              type: 'number',
              description: 'Maximum line coverage percentage (0-100)'
            },
            limit: {
              type: 'integer',
              description: 'Maximum number of files to return (default: 50)'
            },
            sortBy: {
              type: 'string',
              enum: ['linesPct', 'name', 'uncovered'],
              description: 'Sort by linesPct (ascending), name (alphabetical), or uncovered lines count (descending)'
            }
          },
          additionalProperties: false
        },
        annotations: {
          title: 'List Coverage Files',
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        },
        async execute(input = {}, { signal } = {}) {
          const data = await loadCoverageData(signal);
          let files = Object.values(data.files || {});
          if (input.folder) {
            const folderPrefix = input.folder.endsWith('/') ? input.folder : input.folder + '/';
            files = files.filter(f => f.path.startsWith(folderPrefix) || f.path === input.folder);
          }
          if (typeof input.minCoverage === 'number') {
            files = files.filter(f => f.lines.pct >= input.minCoverage);
          }
          if (typeof input.maxCoverage === 'number') {
            files = files.filter(f => f.lines.pct <= input.maxCoverage);
          }

          const sortBy = input.sortBy || 'linesPct';
          if (sortBy === 'linesPct') {
            files.sort((a, b) => a.lines.pct - b.lines.pct);
          } else if (sortBy === 'name') {
            files.sort((a, b) => a.path.localeCompare(b.path));
          } else if (sortBy === 'uncovered') {
            files.sort((a, b) => (b.lines.total - b.lines.covered) - (a.lines.total - a.lines.covered));
          }

          const limit = typeof input.limit === 'number' && input.limit > 0 ? input.limit : 50;
          const totalMatching = files.length;
          const truncated = files.slice(0, limit).map(f => ({
            path: f.path,
            lines: f.lines,
            functions: f.functions,
            branches: f.branches,
            uncoveredLinesCount: (f.lines.total - f.lines.covered)
          }));

          return {
            totalMatching,
            returned: truncated.length,
            files: truncated
          };
        }
      },
      {
        name: 'get_file_coverage',
        description: 'Get detailed line-by-line coverage and uncovered lines for a specific file.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Relative path of the source file (e.g. "src/cli.ts")'
            }
          },
          required: ['path'],
          additionalProperties: false
        },
        annotations: {
          title: 'Get File Coverage Details',
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        },
        async execute({ path: filePath }, { signal } = {}) {
          const data = await loadCoverageData(signal);
          const file = data.files && (data.files[filePath] || Object.values(data.files).find(f => f.path === filePath || f.path.endsWith('/' + filePath)));
          if (!file) {
            throw new Error(\`File "\${filePath}" not found in coverage report.\`);
          }

          const uncoveredLines = [];
          if (file.lineHits) {
            for (const [lineNo, hits] of Object.entries(file.lineHits)) {
              if (hits === 0) uncoveredLines.push(Number(lineNo));
            }
          } else if (file.lineDetails) {
            for (const d of file.lineDetails) {
              if (d.hits === 0) uncoveredLines.push(d.line);
            }
          }

          return {
            path: file.path,
            lines: file.lines,
            functions: file.functions,
            branches: file.branches,
            uncoveredLines,
            uncoveredCount: uncoveredLines.length
          };
        }
      },
      {
        name: 'get_coverage_trends',
        description: 'Get historical coverage trend data across previous commits.',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'integer',
              description: 'Number of historical commits to return (default: 20)'
            },
            branch: {
              type: 'string',
              description: 'Filter trends by git branch'
            }
          },
          additionalProperties: false
        },
        annotations: {
          title: 'Get Coverage Trends',
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        },
        async execute(input = {}, { signal } = {}) {
          const data = await loadCoverageData(signal);
          let commits = Array.isArray(data.commits) ? [...data.commits] : [];
          if (input.branch) {
            commits = commits.filter(c => c.commit && c.commit.branch === input.branch);
          }
          const limit = typeof input.limit === 'number' && input.limit > 0 ? input.limit : 20;
          const sliced = commits.slice(-limit).map(c => ({
            sha: c.commit ? c.commit.sha : '',
            shortSha: c.commit ? c.commit.shortSha || c.commit.sha.slice(0, 7) : '',
            message: c.commit ? c.commit.message : '',
            date: c.commit ? c.commit.date : '',
            branch: c.commit ? c.commit.branch : '',
            linesPct: c.summary ? c.summary.lines.pct : 0,
            functionsPct: c.summary ? c.summary.functions.pct : 0,
            branchesPct: c.summary ? c.summary.branches.pct : 0
          }));

          return {
            totalCommits: commits.length,
            returned: sliced.length,
            trends: sliced
          };
        }
      },
      {
        name: 'get_badge_code',
        description: 'Generate SVG badge markdown and embed code for overall coverage or a specific folder/file.',
        inputSchema: {
          type: 'object',
          properties: {
            scope: {
              type: 'string',
              enum: ['overall', 'folder', 'file'],
              description: 'Badge scope: overall project, folder, or specific file'
            },
            path: {
              type: 'string',
              description: 'Target folder or file path when scope is "folder" or "file"'
            },
            baseUrl: {
              type: 'string',
              description: 'Base URL of published GitHub Pages site (e.g. "https://user.github.io/repo")'
            }
          },
          additionalProperties: false
        },
        annotations: {
          title: 'Get Badge Code',
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false
        },
        async execute(input = {}, { signal } = {}) {
          const data = await loadCoverageData(signal);
          const scope = input.scope || 'overall';
          let badgeRelative = 'badges/overall.svg';
          let label = 'Coverage';
          let pct = data.summary ? data.summary.lines.pct : 100;

          if (scope === 'folder' && input.path) {
            const clean = input.path.replace(/[\\/\\\\]+/g, '__');
            badgeRelative = \`badges/folder__\${clean}.svg\`;
            label = \`Coverage: \${input.path}\`;
            const folderObj = data.folders && data.folders[input.path];
            if (folderObj) pct = folderObj.lines.pct;
          } else if (scope === 'file' && input.path) {
            const clean = input.path.replace(/[\\/\\\\]+/g, '__');
            badgeRelative = \`badges/file__\${clean}.svg\`;
            label = \`Coverage: \${input.path}\`;
            const fileObj = data.files && data.files[input.path];
            if (fileObj) pct = fileObj.lines.pct;
          }

          const base = input.baseUrl ? input.baseUrl.replace(/\\/+$/, '') : '.';
          const fullBadgeUrl = base === '.' ? badgeRelative : \`\${base}/\${badgeRelative}\`;
          const siteUrl = base === '.' ? './covpages/' : \`\${base}/covpages/\`;

          return {
            scope,
            coveragePct: pct,
            badgeFile: badgeRelative,
            badgeUrl: fullBadgeUrl,
            markdown: \`[![\${label}](\${fullBadgeUrl})](\${siteUrl})\`,
            html: \`<a href="\${siteUrl}"><img src="\${fullBadgeUrl}" alt="\${label}" /></a>\`
          };
        }
      }
    ];

    const tools = IS_COVERAGE_MODE
      ? [...coverageTools, ...projectTools]
      : [...projectTools, ...coverageTools];

    mountMcpPageUi({
      container: document.getElementById('mcp-catalog'),
      title,
      tools
    });
  </script>
</body>
</html>
`;
}
