# covpages Design & Architecture Specification

`covpages` is engineered to deliver an impeccable, GitHub-native unit test coverage reporting experience for GitHub Pages.

## 1. Impeccable Craftsmanship Principles

1. **GitHub Primer & Restrained Craft Aesthetic**:
   - Matches GitHub's typography: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif` with `tabular-nums` for all numeric alignment.
   - Authentic Primer color tokens for Light mode (`#ffffff`, `#f6f8fa`, `#d0d7de`, `#1f2328`, `#59636e`, `#0969da`, `#1a7f37`, `#cf222e`) and Dark mode (`#0d1117`, `#161b22`, `#30363d`, `#e6edf3`, `#8b949e`, `#4493f8`, `#3fb950`, `#f85149`).
   - Neutral dominance (shadcn/ui & Impeccable Operate/Read philosophy): High-contrast neutral primary actions (`--color-fg-default`), neutral active tab indicators, and neutral progress/badge treatments for healthy coverage (`>= 80%`), reserving semantic amber/red accents strictly for attention (`50–79%`) and danger (`< 50%`) states.
   - Pure GitHub Octicons (`currentColor`) for branch, commit, folders, files, search, themes, and trending graphs—zero emoji decorations.
   - Softened diff code view (`--color-success-line` / `--color-danger-line` at 6–8% alpha) with slightly deeper gutter line numbers and execution hit counters (`14–18%` alpha) for effortless long-session reading.

2. **Zero Anti-Pattern Guarantee**:
   - Compliant with `impeccable detect` design quality checks with 0 warnings/errors and full `craft-floor` compliance.
   - Themed browser surfaces (`color-scheme: light dark`, `::selection`, `scrollbar-color`, `caret-color`, `text-underline-offset`).
   - High contrast ratios conforming to WCAG AA / AAA.
   - Keyboard accessible (`t` for go-to-file, `b` to toggle sidebar, `/` to filter, `n` to jump to next uncovered line, tab-navigable tables and tabs).
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
