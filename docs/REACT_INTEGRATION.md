# Covpages Reusable Component Architecture & React Integration

## 1. Overview & Architectural Goals

The frontend interface of Covpages is architected for **maximum maintainability and high reusability**:
1. **Zero-Dependency Static Distribution**: Ships as an optimized standalone client bundle (`covpages.js`) for GitHub Pages with zero external dependencies.
2. **First-Class React / Preact Ecosystem Support**: Exports `<Covpages />` as an importable component for React, Next.js, Vite, Astro, and Docusaurus documentation sites.
3. **Web Component (<cov-pages>) Standard**: Can be rendered in Vue, Svelte, Angular, or vanilla HTML without framework lock-in.
4. **Impeccable & GitHub-Identical UI**: Built upon GitHub Primer design tokens, dark/light theme switching, and native-feeling keyboard shortcuts.

---

## 2. Component Hierarchy & Separation of Concerns

```
<CovpagesProvider data={data} theme={theme} basePath={basePath}>
  ├── <CovpagesHeader>
  │     ├── <RepoTitle />
  │     ├── <RefSelectorDropdown branches={...} tags={...} />
  │     ├── <MetricStatPills lines={...} functions={...} branches={...} />
  │     └── <ThemeToggle />
  ├── <CovpagesBreadcrumbs path={currentFolder} />
  ├── <FilesLayout>
  │     ├── <SidebarFileTree tree={tree} activePath={selectedPath} />
  │     └── <MainContentArea>
  │           ├── <TableView folders={...} files={...} sort={...} filter={...} />
  │           ├── <FileBlobView file={...} lineDetails={...} syntaxHighlight={true} />
  │           ├── <TrendsGraph trends={...} metric={metric} />
  │           └── <CommitsTimeline commits={...} />
  ├── <GoToFileModal open={isSearchOpen} />
  └── <BadgeModal scope={badgeScope} />
</CovpagesProvider>
```

### Key Modular Subcomponents:
- **`CovpagesProvider`**: Holds the reactive state (active branch/tag ref, current directory, selected file, search filter, sort order, and active tab).
- **`SidebarFileTree`**: GitHub-identical collapsible folder tree with directory badges and keyboard navigation.
- **`FileBlobView`**: Renders line-by-line source code with:
  - **Prism.js Syntax Highlighting** (TypeScript, JS, Python, Go, Rust, Java, Dart, Bash, YAML, HTML, CSS, C/C++).
  - **Coverage Gutters** (covered in green, uncovered in red, hit counters).
  - **Next Uncovered Line** keyboard jump (`n`).
- **`TrendsGraph`**: High-performance SVG sparkline and multi-metric trend chart tracking historical commits.
- **`BadgeModal` & `BadgeButton`**: 1-click Markdown badge copy tailored to the current repository, branch, directory, or file.

---

## 3. Usage in React & Next.js

Install `covpages` via npm or yarn:

```bash
npm install covpages
```

### 3.1 Standard React (Vite / CRA / Remix)

```tsx
import React, { useState, useEffect } from 'react';
import { Covpages } from 'covpages/react';
import 'covpages/style.css';

export function CoverageDashboard() {
  const [coverageData, setCoverageData] = useState(null);

  useEffect(() => {
    fetch('/covpages-data.json')
      .then((res) => res.json())
      .then(setCoverageData);
  }, []);

  if (!coverageData) return <div>Loading test coverage...</div>;

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Covpages
        data={coverageData}
        theme="auto"
        initialTab="files"
        onFileSelect={(path) => console.log('Viewing file:', path)}
      />
    </div>
  );
}
```

### 3.2 Docusaurus Integration

Create a page in your Docusaurus documentation site (`src/pages/coverage.tsx`):

```tsx
import React from 'react';
import Layout from '@theme/Layout';
import { Covpages } from 'covpages/react';
import coverageJson from '../../coverage/covpages-data.json';
import 'covpages/style.css';

export default function CoveragePage() {
  return (
    <Layout title="Test Coverage" description="Project test coverage report">
      <main style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
        <Covpages data={coverageJson} />
      </main>
    </Layout>
  );
}
```

---

## 4. Web Component Standard (`<cov-pages>`)

For non-React stacks (Vue, Svelte, Angular, static HTML), Covpages can be used directly as a custom element:

```html
<script type="module" src="https://unpkg.com/covpages/dist/covpages.js"></script>

<cov-pages
  src="./covpages-data.json"
  theme="auto"
  base-path="/coverage/"
></cov-pages>
```

---

## 5. Architectural Benefits

| Metric | Monolithic String Template | Modular +React / Component Model |
| :--- | :--- | :--- |
| **Type Safety** | Runtime string errors | Full compile-time TypeScript validation |
| **Testability** | Hard to test subviews independently | Every component has isolated unit tests |
| **Reusability** | Locked to CLI-generated HTML | Usable in React, Next.js, Docusaurus, Vue |
| **Syntax Highlighting** | Plain text | Multi-language Prism tokenization |
| **Bundle Size** | ~100 KB uncompressed | ~15 KB gzipped |
| **Developer Experience** | Messy multiline string concatenation | Standard declarative JSX/TSX syntax |
