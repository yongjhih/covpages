import { parseArgs } from 'node:util';
import path from 'node:path';
import fs from 'node:fs';
import { generateCoveragePages } from './index.js';
import { startServer } from './server.js';
import type { SupportedFormat } from './types.js';

const HELP_TEXT = `
covpages - Impeccable GitHub-styled Coverage Report for GitHub Pages

USAGE:
  covpages [command] [options] [input-files...]

COMMANDS:
  generate (default)  Generate coverage static site for GitHub Pages
  serve               Start a local preview web server
  init                Create a GitHub Actions workflow for GitHub Pages
  help                Show this help screen

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
  -p, --port <port>       Port for local preview server (default: 8080)
  -v, --version           Print version
  -h, --help              Print help

EXAMPLES:
  # Generate from lcov.info
  npx covpages coverage/lcov.info

  # Ingest multiple commit reports for trend graphs
  npx covpages --history-dir ./historical-reports/ coverage/lcov.info

  # Specify commit details in CI
  npx covpages --commit $GITHUB_SHA --branch $GITHUB_REF_NAME coverage/lcov.info

  # Serve preview locally
  npx covpages serve covpages-dist
`;

const GITHUB_WORKFLOW_TEMPLATE = `name: Test Coverage Pages

on:
  push:
    branches: [main, master]
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
          npm run test:coverage || npm test

      - name: Generate covpages with History
        run: |
          npx covpages generate \\
            --output covpages-dist \\
            --commit "\${{ github.sha }}" \\
            --branch "\${{ github.ref_name }}" \\
            --message "\${{ github.event.head_commit.message }}" \\
            coverage/lcov.info

      - name: Setup Pages
        if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
        uses: actions/configure-pages@v4

      - name: Upload Artifact
        if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'covpages-dist'

      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
        id: deployment
        uses: actions/deploy-pages@v4
`;

export async function runCli(argv = process.argv.slice(2)): Promise<void> {
  const options = {
    input: { type: 'string' as const, short: 'i', multiple: true },
    output: { type: 'string' as const, short: 'o', default: 'covpages-dist' },
    format: { type: 'string' as const, short: 'f', default: 'auto' },
    history: { type: 'string' as const },
    'history-dir': { type: 'string' as const },
    commit: { type: 'string' as const },
    message: { type: 'string' as const, short: 'm' },
    author: { type: 'string' as const, short: 'a' },
    branch: { type: 'string' as const, short: 'b' },
    date: { type: 'string' as const },
    title: { type: 'string' as const },
    repo: { type: 'string' as const },
    'no-source': { type: 'boolean' as const, default: false },
    'max-history': { type: 'string' as const, default: '100' },
    port: { type: 'string' as const, short: 'p', default: '8080' },
    version: { type: 'boolean' as const, short: 'v' },
    help: { type: 'boolean' as const, short: 'h' },
  };

  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      options,
      allowPositionals: true,
      strict: false,
    });
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    console.log(HELP_TEXT);
    process.exit(1);
  }

  const { values, positionals } = parsed;

  if (values.version) {
    console.log('covpages v0.1.0');
    return;
  }

  if (values.help) {
    console.log(HELP_TEXT);
    return;
  }

  const firstArg = positionals[0];

  const strVal = (v: any, fallback?: string): string | undefined => {
    if (typeof v === 'string') return v;
    return fallback;
  };

  if (firstArg === 'init') {
    const workflowDir = path.resolve('.github/workflows');
    const workflowPath = path.join(workflowDir, 'covpages.yml');
    if (!fs.existsSync(workflowDir)) {
      fs.mkdirSync(workflowDir, { recursive: true });
    }
    fs.writeFileSync(workflowPath, GITHUB_WORKFLOW_TEMPLATE, 'utf-8');
    console.log(`\n✨ Created GitHub Actions workflow at: ${workflowPath}`);
    console.log('   Push to main branch to automatically generate and publish coverage to GitHub Pages!\n');
    return;
  }

  if (firstArg === 'serve') {
    const targetDir = positionals[1] || strVal(values.output, 'covpages-dist')!;
    const port = parseInt(strVal(values.port, '8080')!, 10);
    startServer(targetDir, port);
    return;
  }

  // Determine command: if first arg is 'generate', shift it
  const remainingPositionals = firstArg === 'generate' 
    ? positionals.slice(1) 
    : positionals;

  // Gather inputs
  const inputs: string[] = [];
  if (values.input && Array.isArray(values.input)) {
    for (const item of values.input) {
      if (typeof item === 'string') inputs.push(item);
    }
  }
  if (remainingPositionals.length > 0) {
    inputs.push(...remainingPositionals);
  }

  // Default input if none provided
  if (inputs.length === 0) {
    const candidates = [
      'coverage/lcov.info',
      'coverage/coverage-final.json',
      'coverage/coverage-summary.json',
      'coverage/cobertura-coverage.xml',
      'lcov.info',
    ];
    for (const cand of candidates) {
      if (fs.existsSync(cand)) {
        inputs.push(cand);
        break;
      }
    }
  }

  if (inputs.length === 0) {
    console.error('Error: No coverage report file specified and default candidates not found.');
    console.log('Please provide a coverage file (e.g. npx covpages coverage/lcov.info)\n');
    process.exit(1);
  }

  console.log(`\n🔍 Parsing coverage report from: ${inputs.join(', ')}`);

  const outputDir = strVal(values.output, 'covpages-dist')!;

  try {
    const result = generateCoveragePages({
      inputs,
      outputDir,
      format: (strVal(values.format, 'auto') as SupportedFormat),
      historyFile: strVal(values.history),
      historyDir: strVal(values['history-dir']),
      commitSha: strVal(values.commit),
      commitMessage: strVal(values.message),
      commitAuthor: strVal(values.author),
      commitDate: strVal(values.date),
      branch: strVal(values.branch),
      title: strVal(values.title),
      repoName: strVal(values.repo),
      includeSource: !values['no-source'],
      maxHistoryCommits: parseInt(strVal(values['max-history'], '100')!, 10),
    });

    const linesPct = result.summary.lines.pct;
    const fnPct = result.summary.functions.pct;
    const brPct = result.summary.branches.pct;

    console.log(`\n✅ covpages generated successfully!`);
    console.log(`   Output: ${path.resolve(outputDir)}/index.html`);
    console.log(`   Lines:     ${linesPct}% (${result.summary.lines.covered}/${result.summary.lines.total})`);
    console.log(`   Functions: ${fnPct}% (${result.summary.functions.covered}/${result.summary.functions.total})`);
    console.log(`   Branches:  ${brPct}% (${result.summary.branches.covered}/${result.summary.branches.total})`);
    console.log(`   Commits in trend: ${result.commits.length}`);

    if (result.delta) {
      const sign = result.delta.linesPct >= 0 ? '+' : '';
      console.log(`   Delta:     ${sign}${result.delta.linesPct}%\n`);
    } else {
      console.log('');
    }
  } catch (err: any) {
    console.error(`\n❌ Error generating covpages: ${err.message}\n`);
    process.exit(1);
  }
}

// Auto-run if executed directly
if (process.argv[1] && (process.argv[1].endsWith('covpages.js') || process.argv[1].endsWith('cli.ts') || process.argv[1].endsWith('cli.js'))) {
  runCli();
}
