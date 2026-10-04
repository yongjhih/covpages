# covpages Design & Architecture Specification

`covpages` is engineered to deliver an impeccable, GitHub-native unit test coverage reporting experience for GitHub Pages.

## 1. Impeccable Craftsmanship Principles

1. **GitHub Primer Aesthetic**:
   - Matches GitHub's typography: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif`.
   - Authentic color tokens for Light mode (`#ffffff`, `#f6f8fa`, `#d0d7de`, `#0969da`, `#1a7f37`, `#cf222e`) and Dark mode (`#0d1117`, `#161b22`, `#30363d`, `#2f81f7`, `#3fb950`, `#f85149`).
   - GitHub Octicons for branch, commit, folders, files, search, themes, and trending graphs.
   - Genuine diff code view with gutter line numbers, execution hit counter pills, and green/red highlights.

2. **Zero Anti-Pattern Guarantee**:
   - Compliant with `impeccable detect` design quality checks with 0 anti-patterns.
   - High contrast ratios conforming to WCAG AA / AAA.
   - Keyboard accessible (`/` to search, `n` to jump to next uncovered line, tab-navigable tables and tabs).
   - High-contrast `:focus-visible` outlines.

3. **Multi-Commit Trend Intelligence**:
   - Aggregates historical metrics across commits with delta calculations (`+2.4%`, `-1.1%`).
   - Multi-level trends:
     - **Overall**: Entire repository line, function, and branch coverage history.
     - **Folder-level**: Historical coverage progression for every subfolder.
     - **File-level**: Historical coverage progression for individual files.
   - Interactive SVG charts with cubic bezier smoothing, hover tooltips, and commit snapshot navigation.

4. **Zero-Dependency Lightweight Delivery**:
   - Zero external runtime dependencies for the CLI.
   - Zero CDN requests required in the static site output: operates 100% offline and via `file://`.
   - Dual output: `covpages-data.json` for CI/tooling and self-contained `index.html` with embedded data.

## 2. Architecture & Data Flow

```
[ Coverage Files ] (lcov.info / cobertura.xml / coverage-summary.json)
       │
       ▼
┌──────────────────┐
│  Parser Router   │  (Auto-detection based on file header / extension)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Aggregator      │  (Hierarchical directory rollups & metric computations)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  History Engine  │  (Multi-commit accumulation & trend graph calculations)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  HTML Template   │  (GitHub Primer CSS + SVG Octicons + Responsive App)
└────────┬─────────┘
         │
         ▼
[ GitHub Pages / Static Hosting ] (index.html, covpages-data.json)
```

## 3. Supported Coverage Formats

- **LCOV (`.info`, `.lcov`)**: Statements (`DA`), Functions (`FN`/`FNDA`), Branches (`BRDA`).
- **Cobertura / Clover (`.xml`)**: Class, package, lines, branch condition-coverage, methods.
- **Istanbul / JSON (`.json`)**: Summary format and full statement/branch/function mappings.
