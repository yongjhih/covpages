export interface FrameworkPreset {
  name: string;
  language: string;
  testCmd: string;
  coverageFile: string;
  description: string;
  workflowStep: string;
}

export const FRAMEWORK_PRESETS: Record<string, FrameworkPreset> = {
  flutter: {
    name: 'Flutter / Dart',
    language: 'dart',
    testCmd: 'flutter test --coverage',
    coverageFile: 'coverage/lcov.info',
    description: 'Flutter and Dart applications using built-in lcov test runner',
    workflowStep: `      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          channel: 'stable'

      - name: Run Tests with Coverage
        run: flutter test --coverage`,
  },
  dart: {
    name: 'Dart (Standalone)',
    language: 'dart',
    testCmd: 'dart test --coverage=coverage && dart pub run coverage:format_coverage --packages=.dart_tool/package_config.json --report-on=lib --lcov -i coverage -o coverage/lcov.info',
    coverageFile: 'coverage/lcov.info',
    description: 'Pure Dart packages and CLI applications',
    workflowStep: `      - name: Setup Dart
        uses: dart-lang/setup-dart@v1

      - name: Run Tests with Coverage
        run: |
          dart pub get
          dart test --coverage=coverage
          dart pub run coverage:format_coverage --packages=.dart_tool/package_config.json --report-on=lib --lcov -i coverage -o coverage/lcov.info`,
  },
  vitest: {
    name: 'Vitest (JavaScript / TypeScript)',
    language: 'javascript',
    testCmd: 'npx vitest run --coverage',
    coverageFile: 'coverage/lcov.info',
    description: 'Vite / Vitest projects with @vitest/coverage-v8 or istanbul',
    workflowStep: `      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Run Tests with Coverage
        run: |
          npm ci
          npx vitest run --coverage`,
  },
  jest: {
    name: 'Jest (JavaScript / TypeScript)',
    language: 'javascript',
    testCmd: 'npx jest --coverage --coverageReporters="lcov"',
    coverageFile: 'coverage/lcov.info',
    description: 'Jest test suites configured with lcov reporter',
    workflowStep: `      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Run Tests with Coverage
        run: |
          npm ci
          npx jest --coverage --coverageReporters="lcov"`,
  },
  rust: {
    name: 'Rust (cargo-llvm-cov)',
    language: 'rust',
    testCmd: 'cargo llvm-cov --lcov --output-path coverage/lcov.info',
    coverageFile: 'coverage/lcov.info',
    description: 'Rust crates using cargo-llvm-cov source-based coverage',
    workflowStep: `      - name: Install Rust toolchain
        uses: dtolnay/rust-toolchain@stable

      - name: Install cargo-llvm-cov
        uses: taiki-e/install-action@cargo-llvm-cov

      - name: Run Tests with Coverage
        run: |
          mkdir -p coverage
          cargo llvm-cov --lcov --output-path coverage/lcov.info`,
  },
  python: {
    name: 'Python (pytest-cov)',
    language: 'python',
    testCmd: 'pytest --cov --cov-report=lcov:coverage/lcov.info',
    coverageFile: 'coverage/lcov.info',
    description: 'Python projects using pytest and pytest-cov lcov output',
    workflowStep: `      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Run Tests with Coverage
        run: |
          pip install pytest pytest-cov
          pytest --cov --cov-report=lcov:coverage/lcov.info`,
  },
  go: {
    name: 'Go',
    language: 'go',
    testCmd: 'go test -coverprofile=coverage.out ./... && npx covpages coverage.out',
    coverageFile: 'coverage.out',
    description: 'Go projects using standard coverprofile',
    workflowStep: `      - name: Setup Go
        uses: actions/setup-go@v5
        with:
          go-version: 'stable'

      - name: Run Tests with Coverage
        run: go test -v -coverprofile=coverage.out ./...`,
  },
  cpp: {
    name: 'C / C++ (gcov / lcov)',
    language: 'cpp',
    testCmd: 'lcov --capture --directory . --output-file coverage/lcov.info',
    coverageFile: 'coverage/lcov.info',
    description: 'C/C++ projects compiled with --coverage',
    workflowStep: `      - name: Install lcov
        run: sudo apt-get update && sudo apt-get install -y lcov

      - name: Run Tests and Generate LCOV
        run: |
          mkdir -p coverage
          lcov --capture --directory . --output-file coverage/lcov.info`,
  },
};

export function getPreset(name: string): FrameworkPreset | undefined {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return FRAMEWORK_PRESETS[key] || FRAMEWORK_PRESETS[name.toLowerCase()];
}

export function generatePresetWorkflow(presetKey: string, options?: { docs?: boolean }): string {
  const preset = getPreset(presetKey);
  if (!preset) {
    throw new Error(`Unknown framework preset: "${presetKey}". Available: ${Object.keys(FRAMEWORK_PRESETS).join(', ')}`);
  }

  if (options?.docs) {
    return `name: Test Coverage Pages (Docs)

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

${preset.workflowStep}

      - name: Generate covpages Report for docs/covpages
        run: |
          npx covpages generate \\
            --input ${preset.coverageFile} \\
            --output docs/covpages \\
            --commit "\${{ github.sha }}" \\
            --branch "\${{ github.ref_name }}" \\
            --message "\${{ github.event.head_commit.message || 'Coverage update' }}"

      - name: Commit and Push to docs/covpages
        if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add docs/covpages
          git diff --staged --quiet || git commit -m "docs(coverage): update covpages report [skip ci]"
          git push
`;
  }

  return `name: Test Coverage Pages

on:
  push:
    branches: [main, master]
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

${preset.workflowStep}

      - name: Restore Previous Coverage History
        uses: actions/cache/restore@v4
        with:
          path: covpages-dist/history.json
          key: covpages-history-\${{ github.ref_name }}
          restore-keys: |
            covpages-history-

      - name: Generate covpages Report
        run: |
          npx covpages generate \\
            --input ${preset.coverageFile} \\
            --output covpages-dist \\
            --commit "\${{ github.sha }}" \\
            --branch "\${{ github.ref_name }}" \\
            --message "\${{ github.event.head_commit.message || 'Coverage update' }}"

      - name: Save Coverage History Cache
        if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
        uses: actions/cache/save@v4
        with:
          path: covpages-dist/history.json
          key: covpages-history-\${{ github.ref_name }}-\${{ github.run_id }}

      - name: Deploy to gh-pages Branch
        if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./covpages-dist
          force_orphan: true
`;
}
