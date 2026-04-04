# covpages

> **Impeccable GitHub-styled unit test coverage report generator for GitHub Pages.**  
> Supports mainstream formats (LCOV, Cobertura, JSON) and multi-commit coverage trend graphs across the repository, folders, and individual files.

---

## ✨ Features

- **🎨 Authentic GitHub Primer UI**:
  - Pixel-perfect GitHub look & feel: typography, colors, borders, tabs, pills, and Octicons.
  - Native **Light & Dark mode** switching (system auto, manual switch, local preference persistence).
  - Genuine code viewer with gutter line numbers, execution hit counts (`42x`, `0`), and green/red coverage diff highlights.
  - Keyboard shortcuts (`/` for file search, `n` to jump to next uncovered line).
- **📈 Multi-Commit Coverage Trends**:
  - Track test coverage over time across git commits.
  - **Overall trend chart**: Global line, function, and branch coverage history.
  - **By Folder**: Drill down into any directory (e.g. `src/parsers/`) to see its historical coverage progression.
  - **By File**: Track specific files across commits to monitor regressions or gains.
  - Commit delta calculation with GitHub-style badges (`▲ +2.5%`, `▼ -0.8%`).
  - Interactive SVG trend charts with hover tooltips and commit snapshot inspection.
- **📁 Mainstream Coverage Formats**:
  - **LCOV** (`lcov.info`, `.lcov`)
  - **Cobertura & Clover XML** (`cobertura.xml`, `clover.xml`)
  - **Istanbul / JSON** (`coverage-summary.json`, `coverage-final.json`)
  - Automatic format detection.
- **💎 Impeccable Standard Compliance**:
  - Validated with `impeccable detect` with **0 design anti-patterns**.
  - Semantic HTML5, accessible ARIA roles, responsive container queries, and high-contrast focus rings.
- **⚡ Lightweight & Zero Runtime Dependencies**:
  - Fast, self-contained single-page static output.
  - Works 100% offline, locally via `file://`, or deployed to GitHub Pages.

---

## 🚀 Quick Start

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

## 📊 Multi-Commit Trend Support

`covpages` automatically persists historical coverage data across commits in `history.json`.

### Option A: Automatic in CI (GitHub Actions)

When running in GitHub Actions, `covpages` records the commit SHA, author, message, date, and branch. By saving or checking out the previous `gh-pages` branch, new commits are appended seamlessly to the trend timeline!

### Option B: Batch Ingestion via `--history-dir`

You can also point `covpages` to a directory containing historical coverage reports (e.g. `history/commit1.lcov`, `history/commit2.lcov`):

```bash
npx covpages --history-dir ./historical-reports/ coverage/lcov.info
```

### Option C: Explicit Commit Flagging

```bash
npx covpages generate \
  --input coverage/lcov.info \
  --output covpages-dist \
  --commit "$GITHUB_SHA" \
  --branch "$GITHUB_REF_NAME" \
  --message "$COMMIT_MSG"
```

---

## 🤖 GitHub Actions Workflow

Run `covpages init` to automatically generate `.github/workflows/covpages.yml`:

```bash
npx covpages init
```

### Example `.github/workflows/covpages.yml`

```yaml
name: Test Coverage Pages

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: write
  pages: write
  id-token: write

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

      - name: Generate covpages with History
        run: |
          npx covpages generate \
            --output covpages-dist \
            --commit "${{ github.sha }}" \
            --branch "${{ github.ref_name }}" \
            --message "${{ github.event.head_commit.message }}" \
            coverage/lcov.info

      - name: Setup Pages
        if: github.ref == 'refs/heads/main'
        uses: actions/configure-pages@v4

      - name: Upload Artifact
        if: github.ref == 'refs/heads/main'
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'covpages-dist'

      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 🛠️ CLI Options

| Option | Flag | Description | Default |
|--------|------|-------------|---------|
| `--input` | `-i` | Input coverage file(s) | `coverage/lcov.info` |
| `--output` | `-o` | Output directory for the static site | `covpages-dist` |
| `--format` | `-f` | Coverage format (`lcov`, `cobertura`, `json`, `auto`) | `auto` |
| `--history` | | Path to history JSON file | `<output>/history.json` |
| `--history-dir`| | Directory containing multiple commit reports | |
| `--commit` | | Commit SHA override | Git HEAD |
| `--message` | `-m` | Commit message override | Git HEAD message |
| `--author` | `-a` | Commit author override | Git author |
| `--branch` | `-b` | Branch name override | Git branch |
| `--date` | | Commit date override (ISO 8601) | Git date or now |
| `--title` | | Report title | `Coverage Report` |
| `--repo` | | Repository name | Current folder name |
| `--no-source` | | Do not embed source code lines in report | `false` |
| `--max-history`| | Maximum historical commits to retain in trend | `100` |
| `--port` | `-p` | Local preview server port | `8080` |

---

## 📦 Programmatic API

```typescript
import { generateCoveragePages } from 'covpages';

const data = generateCoveragePages({
  inputs: ['coverage/lcov.info'],
  outputDir: 'gh-pages',
  title: 'Project Test Coverage',
  commitSha: '4f8e21a...',
  branch: 'main',
});

console.log(`Coverage: ${data.summary.lines.pct}%`);
```

---

## 📄 License

MIT © 2026 covpages contributors
