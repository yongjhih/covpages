# Covpages Storage & Architecture Specification

## 1. Abstract

**Covpages** is a lightweight, zero-dependency, Git-native unit test coverage reporting engine and GitHub Pages publishing system. Designed to replace heavy SaaS coverage services (Codecov, Coveralls) and cumbersome self-hosted instances (SonarQube), Covpages enables developers to store, track, and visualize multi-commit coverage trends directly within their existing Git repository and GitHub Pages hosting.

This document defines the storage layout, data normalization rules, Git delta compression mechanisms, reference index schemas, and on-demand loading protocols.

---

## 2. Directory & Storage Layout

When published to GitHub Pages (either on the `gh-pages` branch or the `/docs` directory of the `main` branch), the storage layout is organized as follows:

```
<gh-pages-root>/          (or /docs)
├── index.html           # Single-page interactive coverage viewer (Primer design)
├── badge.svg            # Dynamic SVG coverage badge for README embedding
├── lcov.info            # Latest normalized LCOV snapshot (git delta friendly)
├── refs.json            # Branch and tag mapping to commit SHAs
├── history.json         # Compact multi-commit trend index (summary metrics only)
├── covpages-data.json   # Optional pre-compiled snapshot data
├── .nojekyll            # Bypasses Jekyll processing on GitHub Pages
├── .gitattributes       # Delta compression and line-ending attributes
└── history/
    └── lcov/            # On-demand raw commit coverage files
        ├── lcov-<sha1>.info
        ├── lcov-<sha2>.info
        └── ...
```

---

## 3. Git-Friendly LCOV Normalization & Delta Compression

A major hurdle with committing coverage files across hundreds of commits into a Git repository is potential repository bloat. Naive coverage reports contain timestamps, varying file orderings, CRLF line endings, and absolute local paths that break Git's delta-compression algorithms.

### 3.1 Normalization Algorithm
Covpages enforces strict normalization before writing any LCOV file (`normalizeLcov`):
1. **Line Ending Standardization**: Forces `\n` (LF) throughout.
2. **Path Harmonization**: Strips repository root prefixes and converts Windows backslashes (`\`) to POSIX slashes (`/`).
3. **Record Sorting**: Sorts source files (`SF:...`) alphabetically so line-by-line diffs between consecutive commits are strictly localized to modified code.
4. **Deterministic Token Ordering**: Normalizes internal records (`FN`, `FNDA`, `DA`, `BRDA`) in consistent numerical line order.

### 3.2 Git Packfile Delta Directives
Covpages automatically writes a `.gitattributes` file into the target directory with the following configuration:
```gitattributes
# Ensure deterministic LF line endings for maximum delta compression
*.info text eol=lf delta
*.lcov text eol=lf delta
history.json text eol=lf delta
refs.json text eol=lf delta
covpages-data.json text eol=lf delta
```
- `text eol=lf`: Prevents OS-dependent newline churn.
- `delta`: Explicitly instructs Git's packfile generator to perform sliding-window delta compression on `.info` and `.lcov` files.

---

## 4. Multi-Commit References & Indexing

### 4.1 Branch and Tag Index (`refs.json`)
Allows instantaneous switching between branches and release tags in the UI:
```json
{
  "updatedAt": "2026-10-05T00:18:00.000Z",
  "branches": {
    "main": "976927a4a88f7b7672be9c3f4e2f896b0144c123",
    "feature/auth": "3b2184c8a2b53d8650bc78d22dfb13f309aa8411"
  },
  "tags": {
    "v0.1.0": "976927a4a88f7b7672be9c3f4e2f896b0144c123"
  }
}
```

### 4.2 Compact Multi-Commit History Index (`history.json`)
To avoid loading massive raw coverage files over the network during initial page loads, Covpages compiles a lightweight summary index containing only metrics and folder/file rollups:
```json
[
  {
    "commit": {
      "sha": "976927a4a88f7b7672be9c3f4e2f896b0144c123",
      "shortSha": "976927a",
      "message": "feat: add branch selector and primer tree",
      "author": "Yong Jhih",
      "date": "2026-10-04T16:10:00.000Z",
      "branch": "main"
    },
    "summary": {
      "lines": { "total": 1625, "covered": 1138, "skipped": 487, "pct": 70.03 },
      "functions": { "total": 40, "covered": 36, "skipped": 4, "pct": 90 },
      "branches": { "total": 352, "covered": 248, "skipped": 104, "pct": 70.45 }
    },
    "folderSummaries": {
      "src": { "lines": { "total": 450, "covered": 320, "pct": 71.11 } }
    },
    "fileSummaries": {
      "src/index.ts": { "lines": { "total": 120, "covered": 90, "pct": 75 } }
    }
  }
]
```

---

## 5. On-Demand / Incremental Loading Protocol (按需加載)

To ensure sub-50ms initial load times and minimal mobile network consumption:
1. **Tier 1 (Instant Boot)**: The web browser downloads `index.html` and parses `history.json` or embedded snapshot data (~15–30 KB). The repository overview, folder tree, and coverage trend charts render immediately.
2. **Tier 2 (On-Demand Commit Inspection)**: When a user switches to a historical commit or selects a specific source file, the frontend initiates an asynchronous fetch for `history/lcov/lcov-<shortSha>.info`.
3. **Tier 3 (Client Cache)**: The client parses the fetched LCOV in a non-blocking pass, caches the line hit details in memory (`lcovCache[sha]`), and displays the line-by-line code viewer. Subsequent visits to the same commit or file require zero network roundtrips.

---

## 6. Multi-Format Coverage Support Roadmap

| Format | Source Tool / Ecosystem | Status | Specification / Parser |
| :--- | :--- | :--- | :--- |
| **LCOV (`.info`, `.lcov`)** | Vitest, Jest, lcov, gcov, cargo-llvm-cov, pytest-cov, Dart/Flutter | **Supported** | Line-based DA/BRDA/FN records; built-in normalizer |
| **Cobertura XML (`.xml`)** | Java (Maven/Gradle), Python, .NET, Go | **Supported** | XML DOM parser; `<class>`, `<line>`, `<methods>` |
| **Istanbul / NYC JSON (`.json`)** | Node.js, Cypress, Puppeteer | **Supported** | JSON schema with statementMap and fnMap |
| **JaCoCo XML (`.xml`)** | Android, Kotlin, Java Enterprise | Planned (v0.2) | Hierarchical package/class counter schema |
| **Golang Cover (`coverage.out`)** | `go test -coverprofile` | Planned (v0.2) | Block-based line count schema |
