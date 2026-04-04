# covpages

> **Impeccable GitHub-styled unit test coverage report generator for GitHub Pages.**  
> Supports mainstream formats (LCOV, Cobertura, JSON), zero-build drop-in deployment, commit range backfill, and multi-commit coverage trend graphs across the repository, folders, and individual files.

---

## ✨ Features

- **🎨 Authentic GitHub Primer UI**:
  - Pixel-perfect GitHub look & feel: typography, colors, borders, tabs, pills, and Octicons.
  - Native **Light & Dark mode** switching (system auto, manual switch, local preference persistence).
  - Genuine code viewer with gutter line numbers, execution hit counts (`42x`, `0`), and green/red coverage diff highlights.
  - Keyboard shortcuts (`/` for file search, `n` to jump to next uncovered line).
- **⚡ Zero-Build Drop-in Mode**:
  - Simply place `index.html` into your `gh-pages` branch.
  - Drop your `lcov.info` file into the directory (or have CI copy it there: `cp coverage/lcov.info gh-pages/`).
  - The client-side browser engine fetches and parses `lcov.info` in real time with zero Node runtime required on the hosting side!
  - Includes interactive drag-and-drop file upload when viewing directly in browser.
- **📈 Multi-Commit Coverage Trends**:
  - Track test coverage over time across git commits.
  - **Overall trend chart**: Global line, function, and branch coverage history.
  - **By Folder**: Drill down into any directory (e.g. `src/parsers/`) to see its historical coverage progression.
  - **By File**: Track specific files across commits to monitor regressions or gains.
  - Commit delta calculation with GitHub-style badges (`▲ +2.5%`, `▼ -0.8%`).
  - Interactive SVG trend charts with hover tooltips and commit snapshot inspection.
- **⏪ One-Command Commit Range Backfill**:
  - Use `covpages backfill` to run test suites across historical git commits in one command (e.g. `HEAD~10..HEAD`).
  - Automatically compiles coverage and generates an instant multi-commit trend timeline!
- **📁 Mainstream Coverage Formats & Framework Presets**:
  - **LCOV** (`lcov.info`, `.lcov`)
  - **Cobertura & Clover XML** (`cobertura.xml`, `clover.xml`)
  - **Istanbul / JSON** (`coverage-summary.json`, `coverage-final.json`)
  - Built-in presets for **Flutter/Dart, Vitest, Jest, Rust, Python, Go, and C/C++**.
- **💎 Impeccable Standard Compliance**:
  - Validated with `impeccable detect` with **0 design anti-patterns**.
  - Semantic HTML5, accessible ARIA roles, responsive container queries, and high-contrast focus rings.
- **🔒 Lightweight & Zero Runtime Dependencies**:
  - Fast, self-contained static output.
  - Works 100% offline, locally via `file://`, or deployed to GitHub Pages.

---

## ⚡ Deployment Mode 1: Zero-Build Drop-in (Easiest)

You can use `covpages` without running any generator in CI!

### Step 1: Create the drop-in site

```bash
npx covpages dropin gh-pages
```

This generates a static `index.html` (and `.nojekyll`) in `gh-pages/`.

### Step 2: Drop in your `lcov.info`

Whenever your tests run, just copy `lcov.info` into that directory:

```bash
cp coverage/lcov.info gh-pages/lcov.info
```

Commit and push `gh-pages`! When users visit your GitHub Pages URL, the page fetches and parses `lcov.info` dynamically in the browser in milliseconds!

---

## 🚀 Deployment Mode 2: Pre-rendered Build via CI

### Run with `npx` (No installation needed)

```bash
# Generate report from lcov.info
npx covpages coverage/lcov.info

# Or run with custom output directory and title
npx covpages generate --input coverage/lcov.info --output gh-pages --title "My Project Coverage"
```

### Preview locally

```bash
npx covpages serve covpages-dist
```

---

## ⏪ Backfilling Historical Commits

Want to generate coverage trend graphs across your past commits right now?

```bash
# Backfill the last 10 commits
npx covpages backfill -n 10 --test-cmd "npm test"

# Or backfill a specific commit range
npx covpages backfill --range "v1.0.0..v2.0.0" --test-cmd "flutter test --coverage"
```

`covpages backfill` will:
1. Safely stash your uncommitted work.
2. Checkout each historical commit in the range.
3. Run your test command and capture the generated `lcov.info`.
4. Restore your repository to its original branch.
5. Produce the complete multi-commit trend history immediately!

---

## 🌟 Framework Presets & Integrations

Run `npx covpages presets <framework>` to print the exact test command and GitHub Actions workflow for your framework:

| Framework / Language | Test Command | Output File | View Preset |
|----------------------|--------------|-------------|-------------|
| **Flutter / Dart** | `flutter test --coverage` | `coverage/lcov.info` | `npx covpages presets flutter` |
| **Dart (Pure)** | `dart test --coverage=coverage ...` | `coverage/lcov.info` | `npx covpages presets dart` |
| **Vitest (TS/JS)** | `npx vitest run --coverage` | `coverage/lcov.info` | `npx covpages presets vitest` |
| **Jest (TS/JS)** | `npx jest --coverage --coverageReporters="lcov"` | `coverage/lcov.info` | `npx covpages presets jest` |
| **Rust** | `cargo llvm-cov --lcov --output-path coverage/lcov.info` | `coverage/lcov.info` | `npx covpages presets rust` |
| **Python** | `pytest --cov --cov-report=lcov:coverage/lcov.info` | `coverage/lcov.info` | `npx covpages presets python` |
| **Go** | `go test -coverprofile=coverage.out ./...` | `coverage.out` | `npx covpages presets go` |
| **C / C++** | `lcov --capture --directory . --output-file coverage/lcov.info` | `coverage/lcov.info` | `npx covpages presets cpp` |

### One-line Workflow Init for Your Framework

```bash
# Initialize workflow for Flutter
npx covpages init --framework flutter

# Initialize workflow for Rust
npx covpages init --framework rust

# Initialize workflow for Python
npx covpages init --framework python
```

---

## 🤖 GitHub Actions Workflow Example

```yaml
name: Test Coverage Pages

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: write
  pages: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install & Run Tests
        run: |
          npm ci
          npm run test:coverage

      - name: Restore Previous Coverage History
        uses: actions/cache/restore@v4
        with:
          path: covpages-dist/history.json
          key: covpages-history-${{ github.ref_name }}
          restore-keys: |
            covpages-history-

      - name: Generate covpages with History
        run: |
          npx covpages generate \
            --input coverage/lcov.info \
            --output covpages-dist \
            --commit "${{ github.sha }}" \
            --branch "${{ github.ref_name }}" \
            --message "${{ github.event.head_commit.message }}"

      - name: Save Coverage History Cache
        if: github.ref == 'refs/heads/main'
        uses: actions/cache/save@v4
        with:
          path: covpages-dist/history.json
          key: covpages-history-${{ github.ref_name }}-${{ github.run_id }}

      - name: Deploy to gh-pages Branch
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./covpages-dist
          force_orphan: true
```

---

## 🛠️ CLI Reference

```
COMMANDS:
  generate (default)  Generate coverage static site for GitHub Pages
  dropin              Generate zero-build drop-in static site (index.html + .nojekyll)
  backfill            Backfill test coverage across a range of historical git commits
  presets             View integration guides and workflows for mainstream frameworks
  serve               Start a local preview web server
  init                Create a GitHub Actions workflow for GitHub Pages
  help                Show help screen

OPTIONS:
  -i, --input <path>      Input coverage file (lcov.info, cobertura.xml, coverage-summary.json)
  -o, --output <dir>      Output directory for generated site (default: "covpages-dist")
  -f, --format <type>     Coverage format: lcov | cobertura | json | auto (default: auto)
  --history <file>        Path to history JSON file (default: "<output>/history.json")
  --history-dir <dir>     Directory containing multiple commit reports (for trends)
  --commit <sha>          Commit SHA (defaults to git HEAD)
  -m, --message <msg>     Commit message (defaults to git HEAD message)
  -a, --author <author>   Commit author (defaults to git author)
  -b, --branch <branch>   Branch name (defaults to git branch)
  --date <iso-date>       Commit date (defaults to git date or now)
  --title <title>         Custom title for report
  --repo <name>           Repository name
  --no-source             Exclude embedding source code in report
  --max-history <number>  Maximum number of history points (default: 100)
  --range <git-range>     Git revision range for backfill (e.g. HEAD~5..HEAD)
  -n, --count <number>    Number of commits to backfill (default: 5)
  --test-cmd <cmd>        Custom test command to run for backfill (e.g. "npm test")
  --coverage-file <path>  Coverage file produced by test command (default: "coverage/lcov.info")
  --framework <name>      Target framework for init/presets (flutter, vitest, jest, rust, python, go, cpp)
  -p, --port <port>       Port for local preview server (default: 8080)
  -v, --version           Print version
  -h, --help              Print help
```

---

## 📦 Programmatic API

```typescript
import { generateCoveragePages, backfillCommits, createDropinSite, FRAMEWORK_PRESETS } from 'covpages';

// 1. Generate full pre-rendered site
const data = generateCoveragePages({
  inputs: ['coverage/lcov.info'],
  outputDir: 'gh-pages',
  title: 'Project Test Coverage',
});

// 2. Or create drop-in static site for zero-build usage
createDropinSite('gh-pages', 'Project Test Coverage');

// 3. Or backfill historical commits
backfillCommits({
  count: 5,
  testCmd: 'npm test',
  coverageFile: 'coverage/lcov.info',
});
```

---

## 📄 License

MIT © 2026 covpages contributors
