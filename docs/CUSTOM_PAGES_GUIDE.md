# Developer Guide: Building Your Own Covpages GitHub Pages

This guide walks you through setting up self-hosted unit test coverage reports with multi-commit trend tracking on GitHub Pages using **Covpages**.

---

## Method 1: Drop-in Zero-Config Setup (Easiest)

With Covpages drop-in mode, you only need to commit two files to your GitHub Pages directory (`gh-pages` branch or `/docs` on `main`):
1. `index.html` (the standalone Covpages viewer)
2. `lcov.info` (your normalized coverage output)

### Step 1: Generate Drop-in Files
Run the following in your repository:
```bash
npx covpages dropin --output docs
```
This generates:
- `docs/index.html`
- `docs/.nojekyll`
- `docs/.gitattributes`
- `docs/badge.svg`

### Step 2: Copy Your Test Coverage
Run your tests and output `lcov.info` into `docs/lcov.info`:
```bash
# Example with Vitest
npx vitest run --coverage
cp coverage/lcov.info docs/lcov.info
```

### Step 3: Configure GitHub Pages
1. Go to your GitHub repository -> **Settings** -> **Pages**.
2. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main` (or `master`)
   - Folder: `/docs`
3. Click **Save**. Your coverage report is live at `https://<username>.github.io/<repo>/`!

---

## Method 2: Fully Automated GitHub Actions (Recommended)

To automatically record coverage trends, commit histories, branch/tag switching, and badges on every pull request and push to `main`:

### Step 1: Initialize Workflow with Preset
Covpages provides preconfigured workflows for popular testing frameworks:

```bash
# Vitest (TypeScript / JavaScript)
npx covpages init --preset vitest --docs

# Jest (React / Node.js)
npx covpages init --preset jest --docs

# Pytest (Python)
npx covpages init --preset python --docs

# Go
npx covpages init --preset go --docs

# Rust (cargo-llvm-cov)
npx covpages init --preset rust --docs

# C / C++ (gcov / lcov)
npx covpages init --preset cpp --docs
```

Passing `--docs` configures the workflow to commit coverage reports directly to `docs/` on your `main` branch. Omit `--docs` if you prefer deploying to the isolated `gh-pages` branch.

### Step 2: Inspect Generated Workflow (`.github/workflows/covpages.yml`)
```yaml
name: Test Coverage Pages (Docs)

on:
  push:
    branches: [main, master]
  pull_request:

permissions:
  contents: write

concurrency:
  group: "covpages-docs"
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

      - name: Install Dependencies
        run: npm ci

      - name: Run Tests with Coverage
        run: npm run test:coverage

      - name: Generate covpages Report
        run: |
          npx covpages generate \
            --input coverage/lcov.info \
            --output docs \
            --commit "${{ github.sha }}" \
            --branch "${{ github.ref_name }}" \
            --message "${{ github.event.head_commit.message || 'Coverage update' }}" \
            --save-raw

      - name: Commit and Push to docs
        if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add docs
          git diff --staged --quiet || git commit -m "docs(coverage): update covpages report [skip ci]"
          git push
```

---

## Method 3: Embedding Coverage Badge in README

Covpages automatically generates a clean, retina-crisp SVG badge at `badge.svg`.

Add this snippet to your repository's `README.md`:

```markdown
[![Coverage](https://<username>.github.io/<repo>/badge.svg)](https://<username>.github.io/<repo>/)
```

For this repository:
```markdown
[![Coverage](https://yongjhih.github.io/covpages/badge.svg)](https://yongjhih.github.io/covpages/)
```

Badge Colors:
- `>= 80%`: Primer Green (`#2da44e`)
- `50% - 79.9%`: Primer Yellow (`#bf8700`)
- `< 50%`: Primer Red (`#cf222e`)

---

## Method 4: Backfilling Historical Commits

If you have an existing repository with git commits and wish to generate coverage trends for the past 20 commits:

```bash
# Automatically checkout past commits, run tests, and record history
npx covpages backfill --commits 20 --test-cmd "npm run test:coverage" --input coverage/lcov.info --output docs
```
This replays past commits and populates `history.json` and `refs.json` with historical data points.
