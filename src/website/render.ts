import { ICONS } from '../templates/icons.js';

export function renderWebsiteHtml(options: {
  repo?: string;
  badgeUrl?: string;
  liveDemoUrl?: string;
} = {}): string {
  const repo = options.repo || 'yongjhih/covpages';
  const badgeUrl = options.badgeUrl || 'badges/overall.svg';
  const liveDemoUrl = options.liveDemoUrl || 'covpages/';

  return `<!DOCTYPE html>
<html lang="en" data-color-mode="auto">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Covpages - Git-Native, Zero-Server Code Coverage for GitHub Pages with multi-commit trends and scoped SVG badges.">
  <meta name="color-scheme" content="light dark">
  <title>Covpages - Git-Native Coverage for GitHub Pages</title>
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
      --color-success-subtle: rgba(26, 127, 55, 0.08);
      --color-neutral-subtle: rgba(129, 139, 152, 0.1);
      --color-btn-bg: #ffffff;
      --color-btn-border: #d0d7de;
      --color-btn-hover-bg: #f6f8fa;
      --color-btn-primary-bg: #1f2328;
      --color-btn-primary-fg: #ffffff;
      --color-btn-primary-border: #1f2328;
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
      --color-success-subtle: rgba(46, 160, 67, 0.1);
      --color-neutral-subtle: rgba(110, 118, 129, 0.12);
      --color-btn-bg: #161b22;
      --color-btn-border: #30363d;
      --color-btn-hover-bg: #21262d;
      --color-btn-primary-bg: #e6edf3;
      --color-btn-primary-fg: #0d1117;
      --color-btn-primary-border: #e6edf3;
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
        --color-success-subtle: rgba(46, 160, 67, 0.1);
        --color-neutral-subtle: rgba(110, 118, 129, 0.12);
        --color-btn-bg: #161b22;
        --color-btn-border: #30363d;
        --color-btn-hover-bg: #21262d;
        --color-btn-primary-bg: #e6edf3;
        --color-btn-primary-fg: #0d1117;
        --color-btn-primary-border: #e6edf3;
        --shadow-rest: 0 8px 24px rgba(1, 4, 9, 0.45), 0 1px 3px rgba(1, 4, 9, 0.3);
      }
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    ::selection {
      background-color: var(--color-accent-subtle);
      color: var(--color-fg-default);
    }

    html {
      scrollbar-color: var(--color-border-default) transparent;
    }

    body {
      font-family: var(--font-stack);
      font-size: 14px;
      line-height: 1.5;
      color: var(--color-fg-default);
      background-color: var(--color-canvas-default);
      caret-color: var(--color-fg-default);
      -webkit-font-smoothing: antialiased;
    }

    a {
      color: var(--color-accent-fg);
      text-decoration: none;
      text-underline-offset: 0.2em;
    }
    a:hover { text-decoration: underline; }

    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 24px;
      background-color: var(--color-canvas-subtle);
      border-bottom: 1px solid var(--color-border-default);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 15px;
      color: var(--color-fg-default);
    }
    .brand:hover { text-decoration: none; }

    .version-tag {
      font-size: 11px;
      font-family: var(--font-mono);
      font-variant-numeric: tabular-nums;
      padding: 1px 6px;
      background: var(--color-canvas-default);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-sm);
      color: var(--color-fg-muted);
      font-weight: 500;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .nav-link {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-fg-muted);
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .nav-link:hover {
      color: var(--color-fg-default);
      text-decoration: none;
    }
    .nav-link.active {
      color: var(--color-fg-default);
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 500;
      line-height: 20px;
      border-radius: var(--radius-md);
      cursor: pointer;
      border: 1px solid var(--color-btn-border);
      background-color: var(--color-btn-bg);
      color: var(--color-fg-default);
      text-decoration: none;
      box-shadow: var(--shadow-sm);
      transition: background-color 120ms cubic-bezier(0.25, 1, 0.5, 1), border-color 120ms cubic-bezier(0.25, 1, 0.5, 1);
    }
    .btn:hover {
      background-color: var(--color-btn-hover-bg);
      text-decoration: none;
    }
    .btn:focus-visible {
      outline: 2px solid var(--color-accent-fg);
      outline-offset: 1px;
    }
    .btn-primary {
      background-color: var(--color-btn-primary-bg);
      color: var(--color-btn-primary-fg) !important;
      border-color: var(--color-btn-primary-border);
      font-weight: 500;
    }
    .btn-primary:hover {
      background-color: var(--color-btn-primary-bg);
      opacity: 0.9;
    }
    .btn-sm {
      padding: 3px 10px;
      font-size: 12px;
      line-height: 18px;
    }

    .container {
      max-width: 1080px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Hero Section */
    .hero {
      padding: 64px 0 48px;
      border-bottom: 1px solid var(--color-border-muted);
    }
    .hero h1 {
      font-size: clamp(28px, 4vw, 40px);
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.025em;
      margin-bottom: 14px;
      color: var(--color-fg-default);
      text-wrap: balance;
    }
    .hero p {
      font-size: 16px;
      color: var(--color-fg-muted);
      max-width: 65ch;
      margin-bottom: 28px;
      line-height: 1.6;
    }
    .hero-ctas {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 40px;
    }

    /* Live Preview Mock Frame */
    .preview-card {
      background: var(--color-canvas-default);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-rest);
      text-align: left;
    }
    .preview-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: var(--color-canvas-subtle);
      border-bottom: 1px solid var(--color-border-default);
    }
    .preview-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--color-fg-default);
    }
    .preview-title svg {
      color: var(--color-fg-muted);
    }
    .preview-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .preview-table th {
      background-color: var(--color-canvas-default);
      color: var(--color-fg-muted);
      font-weight: 500;
      font-size: 12px;
      padding: 8px 16px;
      border-bottom: 1px solid var(--color-border-muted);
      text-align: left;
    }
    .preview-table td {
      padding: 8px 16px;
      border-bottom: 1px solid var(--color-border-muted);
      color: var(--color-fg-default);
      font-variant-numeric: tabular-nums;
    }
    .preview-table tr:last-child td {
      border-bottom: none;
    }
    .preview-path {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 12px;
    }
    .preview-path svg {
      color: var(--color-fg-muted);
    }
    .preview-pill {
      display: inline-block;
      padding: 1px 6px;
      font-size: 11px;
      font-weight: 500;
      border-radius: var(--radius-sm);
      background-color: var(--color-neutral-subtle);
      color: var(--color-fg-default);
      border: 1px solid var(--color-border-muted);
    }
    .preview-actions {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--color-canvas-subtle);
      border-top: 1px solid var(--color-border-default);
      gap: 12px;
      flex-wrap: wrap;
    }

    /* Section Headers */
    .section {
      padding: 56px 0;
      border-bottom: 1px solid var(--color-border-muted);
    }
    .section-header {
      margin-bottom: 32px;
    }
    .section-title {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.015em;
      margin-bottom: 6px;
      color: var(--color-fg-default);
    }
    .section-subtitle {
      font-size: 14px;
      color: var(--color-fg-muted);
      max-width: 68ch;
      line-height: 1.5;
    }

    /* Architectural Specification List (Primer Bordered Grid instead of SaaS Icon Cards) */
    .spec-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      background-color: var(--color-border-muted);
      gap: 1px;
      overflow: hidden;
    }
    .spec-item {
      padding: 20px 24px;
      background: var(--color-canvas-default);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .spec-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-fg-default);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .spec-title svg {
      color: var(--color-fg-muted);
      flex-shrink: 0;
    }
    .spec-desc {
      font-size: 13px;
      color: var(--color-fg-muted);
      line-height: 1.55;
    }
    .spec-desc code {
      font-family: var(--font-mono);
      font-size: 12px;
      padding: 1px 4px;
      background-color: var(--color-canvas-subtle);
      border-radius: var(--radius-sm);
    }

    /* Playground / Badges */
    .badge-builder {
      background: var(--color-canvas-default);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      padding: 24px;
    }
    .badge-builder-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-fg-default);
    }
    .form-input, .form-select {
      width: 100%;
      padding: 6px 10px;
      font-size: 13px;
      font-family: var(--font-stack);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      background: var(--color-canvas-default);
      color: var(--color-fg-default);
      outline: none;
    }
    .form-input:focus, .form-select:focus {
      border-color: var(--color-accent-fg);
      box-shadow: 0 0 0 2px var(--color-accent-subtle);
    }
    .badge-preview-box {
      padding: 16px;
      background: var(--color-canvas-subtle);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .badge-preview-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .badge-img-wrap {
      display: inline-flex;
      align-items: center;
    }
    .code-preview {
      width: 100%;
      background: var(--color-canvas-default);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-sm);
      padding: 10px 12px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--color-fg-default);
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Benchmarks Table */
    .benchmarks-table-wrap {
      overflow-x: auto;
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      padding: 16px;
      background-color: var(--color-canvas-subtle);
    }
    .benchmarks-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background-color: var(--color-canvas-default);
      border: 1px solid var(--color-border-muted);
      border-radius: var(--radius-md);
      overflow: hidden;
      text-align: left;
      font-size: 13px;
    }
    .benchmarks-table th, .benchmarks-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--color-border-muted);
      font-variant-numeric: tabular-nums;
    }
    .benchmarks-table th {
      background: var(--color-canvas-subtle);
      color: var(--color-fg-muted);
      font-weight: 600;
      font-size: 12px;
    }
    .benchmarks-table tr:last-child td {
      border-bottom: none;
    }
    .highlight-cell {
      color: var(--color-fg-default);
      font-weight: 600;
    }

    /* Code Tabs */
    .code-tabs {
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .tabs-header {
      display: flex;
      background: var(--color-canvas-subtle);
      border-bottom: 1px solid var(--color-border-default);
      overflow-x: auto;
    }
    .tab-btn {
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-fg-muted);
      background: none;
      border: none;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      white-space: nowrap;
    }
    .tab-btn:hover {
      color: var(--color-fg-default);
    }
    .tab-btn.active {
      color: var(--color-fg-default);
      font-weight: 600;
      border-bottom-color: var(--color-fg-default);
      background: var(--color-canvas-default);
    }
    .tab-content {
      padding: 16px 20px;
      background: var(--color-canvas-default);
      font-family: var(--font-mono);
      font-size: 12px;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre;
      color: var(--color-fg-default);
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--color-canvas-overlay);
      color: var(--color-fg-default);
      border: 1px solid var(--color-border-default);
      padding: 10px 16px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
      display: none;
      z-index: 1000;
      box-shadow: var(--shadow-rest);
    }

    /* Footer */
    .site-footer {
      padding: 40px 0;
      color: var(--color-fg-muted);
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .site-header { padding: 0 16px; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="site-header">
    <a href="#" class="brand">
      ${ICONS.github}
      <span>covpages</span>
      <span class="version-tag">v0.1.0</span>
    </a>

    <nav class="nav-links">
      <a href="#overview" class="nav-link active">Overview</a>
      <a href="${liveDemoUrl}" class="nav-link">Live Demo ${ICONS.linkExternal}</a>
      <a href="#features" class="nav-link">Architecture</a>
      <a href="#benchmarks" class="nav-link">Benchmarks</a>
      <a href="#badges" class="nav-link">Badges</a>
      <a href="#quickstart" class="nav-link">Quickstart</a>
      <a href="#react" class="nav-link">+React</a>
    </nav>

    <div class="header-actions">
      <button class="btn btn-sm" id="theme-toggle" title="Toggle theme" aria-label="Toggle theme">${ICONS.moon} <span>Theme</span></button>
      <a href="https://github.com/${repo}" class="btn btn-sm" target="_blank" rel="noopener">GitHub ${ICONS.linkExternal}</a>
      <a href="${liveDemoUrl}" class="btn btn-sm btn-primary">Live Coverage</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero" id="overview">
    <div class="container">
      <h1>Git-Native Code Coverage for GitHub Pages</h1>
      <p>
        Zero servers. Zero monthly SaaS fees. 100% inside your Git repository. Restrained GitHub Primer interface with multi-commit trends, scoped SVG badges, and syntax highlighting.
      </p>

      <div class="hero-ctas">
        <a href="${liveDemoUrl}" class="btn btn-primary">
          <span>Explore Live Demo</span>
          ${ICONS.linkExternal}
        </a>
        <a href="#quickstart" class="btn">
          Get Started in 5 Min
        </a>
        <a href="#badges" class="btn">
          Badge Generator
        </a>
      </div>

      <!-- Live Showcase Table Frame -->
      <div class="preview-card">
        <div class="preview-card-header">
          <div class="preview-title">
            ${ICONS.branch}
            <span>${repo} / main</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${badgeUrl}" alt="Coverage Badge" height="20" style="vertical-align: middle;">
          </div>
        </div>

        <div style="overflow-x: auto;">
          <table class="preview-table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Coverage</th>
                <th>Lines</th>
                <th>Functions</th>
                <th>Branches</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="preview-path">${ICONS.folder} <span>src/core</span></span></td>
                <td><span class="preview-pill">94.2%</span></td>
                <td>312 / 331</td>
                <td>96.0%</td>
                <td>89.4%</td>
              </tr>
              <tr>
                <td><span class="preview-path">${ICONS.folder} <span>src/parsers</span></span></td>
                <td><span class="preview-pill">91.8%</span></td>
                <td>245 / 267</td>
                <td>94.1%</td>
                <td>86.2%</td>
              </tr>
              <tr>
                <td><span class="preview-path">${ICONS.file} <span>src/index.ts</span></span></td>
                <td><span class="preview-pill">100.0%</span></td>
                <td>68 / 68</td>
                <td>100.0%</td>
                <td>92.0%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="preview-actions">
          <div style="font-size: 12px; color: var(--color-fg-muted);">
            Inspect directory trees, line-by-line execution counts, and historical commit deltas directly on GitHub Pages.
          </div>
          <a href="${liveDemoUrl}" class="btn btn-sm">
            <span>Open Interactive Coverage Viewer</span>
            ${ICONS.linkExternal}
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="section" id="features">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Why Choose Covpages?</h2>
        <p class="section-subtitle">
          Eliminate external SaaS subscriptions, privacy leaks, and slow CI steps with a native GitHub Pages workflow.
        </p>
      </div>

      <div class="spec-grid">
        <div class="spec-item">
          <h3 class="spec-title">${ICONS.package} <span>97.6% Git Delta Compression</span></h3>
          <p class="spec-desc">
            Covpages normalizes line endings and sorts LCOV records deterministically. 100 historical commits compress into just 1.24 MB in Git packfiles.
          </p>
        </div>

        <div class="spec-item">
          <h3 class="spec-title">${ICONS.tag} <span>Scoped SVG Badges with 1-Click Copy</span></h3>
          <p class="spec-desc">
            Generate coverage badges not just for your repo, but for every branch, subfolder, and file. Click to copy markdown directly into your README.
          </p>
        </div>

        <div class="spec-item">
          <h3 class="spec-title">${ICONS.code} <span>GitHub Primer UI & Syntax Highlighting</span></h3>
          <p class="spec-desc">
            Authentic tree/blob routing, keyboard shortcuts (<code>t</code>, <code>n</code>, <code>ESC</code>), line numbers, hit gutters, and Prism.js syntax highlighting.
          </p>
        </div>

        <div class="spec-item">
          <h3 class="spec-title">${ICONS.graph} <span>Multi-Commit Trends by Folder & File</span></h3>
          <p class="spec-desc">
            Track coverage progression across commits. Inspect historical trendlines by repository, individual directory, or specific source file.
          </p>
        </div>

        <div class="spec-item">
          <h3 class="spec-title">${ICONS.sidebar} <span>+React & Component Reusability</span></h3>
          <p class="spec-desc">
            Import <code>&lt;Covpages /&gt;</code> directly into React, Next.js, and Docusaurus documentation sites, or embed as a standard Web Component.
          </p>
        </div>

        <div class="spec-item">
          <h3 class="spec-title">${ICONS.zap} <span>Zero-Server 1-Click GitHub Actions</span></h3>
          <p class="spec-desc">
            Run <code>npx covpages init</code> to generate a zero-config GitHub Actions workflow that automatically publishes to GitHub Pages on every push.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Scoped Badges Playground -->
  <section class="section" id="badges">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Interactive Badge Generator</h2>
        <p class="section-subtitle">
          Embed live SVG coverage badges into your README.md for your entire project or specific folders.
        </p>
      </div>

      <div class="badge-builder">
        <div class="badge-builder-grid">
          <div class="form-group">
            <label class="form-label" for="badge-repo">GitHub Repository</label>
            <input type="text" id="badge-repo" class="form-input" value="${repo}">
          </div>

          <div class="form-group">
            <label class="form-label" for="badge-scope">Scope</label>
            <select id="badge-scope" class="form-select">
              <option value="overall">Overall Repository</option>
              <option value="branch">Branch (e.g. main)</option>
              <option value="folder">Directory (e.g. src)</option>
              <option value="file">File (e.g. src/index.ts)</option>
            </select>
          </div>

          <div class="form-group" id="badge-target-group" style="display: none;">
            <label class="form-label" id="badge-target-label" for="badge-target">Target Name</label>
            <input type="text" id="badge-target" class="form-input" value="src">
          </div>
        </div>

        <div class="badge-preview-box">
          <div class="badge-preview-row">
            <div class="badge-img-wrap">
              <img id="badge-preview-img" src="${badgeUrl}" alt="Badge Preview" height="20">
            </div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-sm btn-primary" id="copy-badge-md">${ICONS.copy} <span>Copy Markdown</span></button>
              <button class="btn btn-sm" id="copy-badge-url">Copy Badge URL</button>
            </div>
          </div>

          <div class="code-preview" id="badge-markdown-code"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Storage & Performance Benchmarks -->
  <section class="section" id="benchmarks">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Storage & Bandwidth Benchmarks</h2>
        <p class="section-subtitle">
          Normalized LCOV files achieve a 97.6% disk reduction in Git packfiles over 100 commits.
        </p>
      </div>

      <div class="benchmarks-table-wrap">
        <table class="benchmarks-table">
          <thead>
            <tr>
              <th>Storage Strategy (100 Commits)</th>
              <th>Raw Disk Size</th>
              <th>Git Packfile Size</th>
              <th>Compression Ratio</th>
              <th>Growth / Commit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Naive Unnormalized LCOV</td>
              <td>52.4 MB</td>
              <td>18.7 MB</td>
              <td>64.3%</td>
              <td>~187 KB / commit</td>
            </tr>
            <tr style="background: var(--color-canvas-subtle);">
              <td><strong>Covpages Normalized LCOV</strong></td>
              <td>52.4 MB</td>
              <td class="highlight-cell">1.24 MB</td>
              <td class="highlight-cell">97.6%</td>
              <td class="highlight-cell">~12.4 KB / commit</td>
            </tr>
            <tr>
              <td><strong>Covpages Compiled history.json</strong></td>
              <td>2.4 MB</td>
              <td class="highlight-cell">180 KB</td>
              <td class="highlight-cell">92.5%</td>
              <td class="highlight-cell">~1.8 KB / commit</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 24px;" class="benchmarks-table-wrap">
        <table class="benchmarks-table">
          <thead>
            <tr>
              <th>Total Cost of Ownership (TCO)</th>
              <th>Commercial SaaS (Codecov/Coveralls)</th>
              <th>Self-Hosted (SonarQube)</th>
              <th>Covpages (GitHub Pages)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Monthly Cost</strong></td>
              <td>$10 to $50 / user / month</td>
              <td>$40 to $200 / mo (Cloud VM + DB)</td>
              <td class="highlight-cell">$0 / month (100% Free)</td>
            </tr>
            <tr>
              <td><strong>Maintenance Overhead</strong></td>
              <td>Token rotation, billing setup</td>
              <td>OS updates, DB migrations</td>
              <td class="highlight-cell">Zero (Native Git commit)</td>
            </tr>
            <tr>
              <td><strong>Security & Privacy</strong></td>
              <td>Proprietary third-party SaaS</td>
              <td>Private, extra attack surface</td>
              <td class="highlight-cell">100% inside your GitHub Org</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Quickstart -->
  <section class="section" id="quickstart">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Quickstart & Setup</h2>
        <p class="section-subtitle">
          Get up and running in under 5 minutes with zero configuration.
        </p>
      </div>

      <div class="code-tabs">
        <div class="tabs-header">
          <button class="tab-btn active" data-tab="tab-cli">1. Automated CI Setup</button>
          <button class="tab-btn" data-tab="tab-vitest">Vitest / Jest</button>
          <button class="tab-btn" data-tab="tab-flutter">Flutter / Dart</button>
          <button class="tab-btn" data-tab="tab-go">Go</button>
          <button class="tab-btn" data-tab="tab-python">Python</button>
          <button class="tab-btn" data-tab="tab-rust">Rust</button>
          <button class="tab-btn" data-tab="tab-docker">Docker / Container</button>
        </div>

        <div class="tab-content" id="tab-cli"># 1. Initialize GitHub Actions Workflow in your repository
npx covpages init

# 2. Push to GitHub!
git add .github/workflows/covpages.yml
git commit -m "ci: add covpages coverage report workflow"
git push origin main

# Your coverage will be automatically published to https://&lt;owner&gt;.github.io/&lt;repo&gt;/</div>

        <div class="tab-content" id="tab-vitest" style="display: none;"># vitest.config.ts
export default {
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
};

# Run tests and generate covpages
npx vitest run --coverage
npx covpages generate --input coverage/lcov.info --output docs/covpages</div>

        <div class="tab-content" id="tab-flutter" style="display: none;"># Run Flutter test coverage
flutter test --coverage

# Generate Covpages report from coverage/lcov.info
npx covpages generate --input coverage/lcov.info --output docs/covpages</div>

        <div class="tab-content" id="tab-go" style="display: none;"># Run Go tests with coverage profile
go test -coverprofile=coverage.out ./...

# Convert or use covpages parser
npx covpages generate --input coverage.out --output docs/covpages</div>

        <div class="tab-content" id="tab-python" style="display: none;"># Run pytest with lcov output
pytest --cov=src --cov-report=lcov:coverage/lcov.info

# Generate Covpages report
npx covpages generate --input coverage/lcov.info --output docs/covpages</div>

        <div class="tab-content" id="tab-rust" style="display: none;"># Install cargo-llvm-cov
cargo install cargo-llvm-cov

# Run tests and generate lcov
cargo llvm-cov --lcov --output-path coverage/lcov.info

# Generate Covpages report
npx covpages generate --input coverage/lcov.info --output docs/covpages</div>

        <div class="tab-content" id="tab-docker" style="display: none;"># Run via Docker-wrapper CLI (Zero Node.js required on host)
./bin/covpages-docker.sh generate --input coverage/lcov.info --output docs/covpages

# Or run official container image directly
docker run --rm -v "$PWD:/workspace" -w /workspace \\
  ghcr.io/yongjhih/covpages:latest generate --input coverage/lcov.info --output docs/covpages

# Devcontainer: open directly in VS Code or GitHub Codespaces via .devcontainer/</div>
      </div>
    </div>
  </section>

  <!-- React Integration -->
  <section class="section" id="react">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">+React & Component Reusability</h2>
        <p class="section-subtitle">
          Easily integrate Covpages into React applications, Next.js, and Docusaurus portals.
        </p>
      </div>

      <div class="code-tabs">
        <div class="tabs-header">
          <button class="tab-btn active">React (Vite / Next.js / Docusaurus)</button>
        </div>
        <div class="tab-content">import React, { useState, useEffect } from 'react';
import { Covpages } from 'covpages/react';
import 'covpages/style.css';

export function CoveragePortal() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/covpages-data.json')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return &lt;div&gt;Loading coverage report...&lt;/div&gt;;

  return (
    &lt;div style={{ height: '100vh', width: '100%' }}&gt;
      &lt;Covpages data={data} theme="auto" initialTab="files" /&gt;
    &lt;/div&gt;
  );
}</div>
      </div>
    </div>
  </section>

  <!-- Toast -->
  <div id="toast" class="toast">Copied to clipboard!</div>

  <!-- Footer -->
  <footer class="container">
    <div class="site-footer">
      <div>
        Covpages is open source software released under the <a href="https://github.com/${repo}/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a>.
      </div>
      <div>
        Designed with GitHub Primer standards. Zero dependencies, Git-native, and private.
      </div>
    </div>
  </footer>

  <script>
    (function() {
      // Theme Toggle
      const themeToggle = document.getElementById('theme-toggle');
      let currentMode = localStorage.getItem('covpages-theme') || 'auto';
      document.documentElement.setAttribute('data-color-mode', currentMode);

      themeToggle.addEventListener('click', () => {
        const isDark = currentMode === 'dark' || (currentMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        currentMode = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-color-mode', currentMode);
        localStorage.setItem('covpages-theme', currentMode);
      });

      // Tab switcher
      const tabBtns = document.querySelectorAll('.tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.getAttribute('data-tab');
          if (!tabId) return;
          const container = btn.closest('.code-tabs');
          container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          container.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
          btn.classList.add('active');
          const target = document.getElementById(tabId);
          if (target) target.style.display = 'block';
        });
      });

      // Toast helper
      const toast = document.getElementById('toast');
      function showToast(msg) {
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 2000);
      }

      // Badge Playground
      const repoInput = document.getElementById('badge-repo');
      const scopeSelect = document.getElementById('badge-scope');
      const targetGroup = document.getElementById('badge-target-group');
      const targetLabel = document.getElementById('badge-target-label');
      const targetInput = document.getElementById('badge-target');
      const previewImg = document.getElementById('badge-preview-img');
      const mdCode = document.getElementById('badge-markdown-code');

      function sanitizeBadgeName(p) {
        return p.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/--+/g, '-').toLowerCase();
      }

      function updateBadgePreview() {
        const r = repoInput.value.trim() || '${repo}';
        const scope = scopeSelect.value;
        const target = targetInput.value.trim();

        if (scope === 'overall') {
          targetGroup.style.display = 'none';
        } else {
          targetGroup.style.display = 'flex';
          targetLabel.textContent = scope === 'branch' ? 'Branch Name' : (scope === 'folder' ? 'Directory Path' : 'File Path');
        }

        let badgeFile = 'badges/overall.svg';
        let linkPath = '';
        let altText = 'Coverage';

        if (scope === 'branch') {
          badgeFile = 'badges/branch-' + sanitizeBadgeName(target || 'main') + '.svg';
          linkPath = 'tree/' + (target || 'main');
          altText = 'Coverage: ' + (target || 'main');
        } else if (scope === 'folder') {
          badgeFile = 'badges/folder-' + sanitizeBadgeName(target || 'src') + '.svg';
          linkPath = 'tree/main/' + (target || 'src');
          altText = 'Coverage: ' + (target || 'src');
        } else if (scope === 'file') {
          badgeFile = 'badges/file-' + sanitizeBadgeName(target || 'src/index.ts') + '.svg';
          linkPath = 'blob/main/' + (target || 'src/index.ts');
          altText = 'Coverage: ' + (target || 'src/index.ts');
        }

        const origin = window.location.origin;
        const basePath = window.location.pathname.replace(/\\/[^\\/]*$/, '/');
        const fullBadgeUrl = origin + basePath + badgeFile;
        const fullLinkUrl = origin + basePath + (linkPath ? linkPath : '');

        previewImg.src = badgeFile;
        const mdSnippet = '[![' + altText + '](' + fullBadgeUrl + ')](' + fullLinkUrl + ')';
        mdCode.textContent = mdSnippet;
      }

      scopeSelect.addEventListener('change', updateBadgePreview);
      repoInput.addEventListener('input', updateBadgePreview);
      targetInput.addEventListener('input', updateBadgePreview);
      updateBadgePreview();

      document.getElementById('copy-badge-md').addEventListener('click', () => {
        navigator.clipboard.writeText(mdCode.textContent).then(() => {
          showToast('Copied Badge Markdown to clipboard!');
        });
      });

      document.getElementById('copy-badge-url').addEventListener('click', () => {
        navigator.clipboard.writeText(previewImg.src).then(() => {
          showToast('Copied Badge URL to clipboard!');
        });
      });
    })();
  </script>
</body>
</html>`;
}
