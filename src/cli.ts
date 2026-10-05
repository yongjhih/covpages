import { parseArgs } from 'node:util';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import {
  generateCoveragePages,
  startServer,
  backfillCommits,
  createDropinSite,
  FRAMEWORK_PRESETS,
  getPreset,
  generatePresetWorkflow,
} from './index.js';
import type { SupportedFormat } from './types.js';

const HELP_TEXT = `
covpages - Impeccable GitHub-styled Coverage Report for GitHub Pages

USAGE:
  covpages [command] [options] [input-files...]

COMMANDS:
  generate (default)  Generate coverage static site for GitHub Pages
  dropin              Generate zero-build drop-in static site (index.html + .nojekyll)
  backfill            Backfill test coverage across a range of historical git commits
  presets             View integration guides and workflows for mainstream frameworks
  docker              Run, build, or pull covpages inside a container (docker/podman)
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
  -t, --tag <tag>         Tag name (defaults to git tag if on tag)
  --base-url <url>        Base URL for subdirectory hosting (e.g. "/docs/covpages/")
  --save-raw              Save normalized raw LCOV as objects/<sha[0:2]>/<sha[2:]>.lcov
  --docs                  Target docs/covpages for GitHub Pages deployment
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

EXAMPLES:
  # 1. Zero-build Drop-in: put index.html in gh-pages, then just cp lcov.info!
  npx covpages dropin gh-pages
  cp coverage/lcov.info gh-pages/

  # 2. Backfill historical commits to create trend charts immediately
  npx covpages backfill --range HEAD~10..HEAD --test-cmd "npm test"

  # 3. Generate from lcov.info
  npx covpages coverage/lcov.info

  # 4. View framework integration workflows
  npx covpages presets flutter
  npx covpages presets vitest
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
    tag: { type: 'string' as const, short: 't' },
    'base-url': { type: 'string' as const },
    'save-raw': { type: 'boolean' as const, default: false },
    docs: { type: 'boolean' as const, default: false },
    date: { type: 'string' as const },
    title: { type: 'string' as const },
    repo: { type: 'string' as const },
    'no-source': { type: 'boolean' as const, default: false },
    'max-history': { type: 'string' as const, default: '100' },
    range: { type: 'string' as const },
    count: { type: 'string' as const, short: 'n' },
    'test-cmd': { type: 'string' as const },
    'coverage-file': { type: 'string' as const },
    framework: { type: 'string' as const },
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

  // 1. Drop-in command
  if (firstArg === 'dropin') {
    const targetDir = positionals[1] || strVal(values.output, 'gh-pages')!;
    createDropinSite(targetDir, strVal(values.title, 'Coverage Report'));
    console.log(`\n🎉 Zero-build Drop-in site created at: ${path.resolve(targetDir)}/index.html`);
    console.log('   How to use:');
    console.log('   1. Put your coverage file (lcov.info) into this directory.');
    console.log('   2. Push to your "gh-pages" branch.');
    console.log('   3. The page will fetch and parse lcov.info in real time on the client side!\n');
    return;
  }

  // 2. Presets command
  if (firstArg === 'presets') {
    const framework = positionals[1] || strVal(values.framework);
    if (framework) {
      const preset = getPreset(framework);
      if (!preset) {
        console.error(`\nUnknown framework "${framework}". Available presets:`);
        Object.keys(FRAMEWORK_PRESETS).forEach(k => console.log(` - ${k} (${FRAMEWORK_PRESETS[k].name})`));
        console.log('');
        process.exit(1);
      }
      console.log(`\n📘 Framework Preset: ${preset.name}`);
      console.log(`   Description:   ${preset.description}`);
      console.log(`   Test Command:  ${preset.testCmd}`);
      console.log(`   Coverage File: ${preset.coverageFile}\n`);
      console.log('--- Ready-to-use GitHub Actions Workflow (.github/workflows/covpages.yml) ---');
      console.log(generatePresetWorkflow(framework));
      return;
    }

    console.log('\n🌟 Available Framework Presets:\n');
    for (const [key, preset] of Object.entries(FRAMEWORK_PRESETS)) {
      console.log(`  • ${key.padEnd(10)} : ${preset.name.padEnd(32)} (${preset.testCmd})`);
    }
    console.log('\nRun "npx covpages presets <framework>" to view full CI workflow and configuration.\n');
    return;
  }

  // 3. Docker command
  if (firstArg === 'docker') {
    const subCmd = positionals[1] || '--help';
    const restArgs = positionals.slice(2);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dockerScript = path.resolve(__dirname, '../bin/covpages-docker.sh');
    const result = spawnSync(dockerScript, [subCmd, ...restArgs], {
      stdio: 'inherit',
      env: process.env,
    });
    process.exit(result.status ?? 0);
  }

  // 4. Backfill command
  if (firstArg === 'backfill') {
    const count = values.count ? parseInt(strVal(values.count)!, 10) : undefined;
    console.log('\n⏳ Starting commit backfill process...');
    try {
      const result = backfillCommits({
        range: strVal(values.range),
        count,
        testCmd: strVal(values['test-cmd']),
        coverageFile: strVal(values['coverage-file']),
        outputDir: strVal(values.output, 'covpages-dist')!,
        historyFile: strVal(values.history),
        repoName: strVal(values.repo),
        title: strVal(values.title),
      });
      console.log(`✅ Backfill completed with ${result.commits.length} commits in trend timeline!`);
    } catch (err: any) {
      console.error(`\n❌ Error during backfill: ${err.message}\n`);
      process.exit(1);
    }
    return;
  }

  // 4. Init command
  if (firstArg === 'init') {
    const framework = strVal(values.framework);
    const workflowDir = path.resolve('.github/workflows');
    const workflowPath = path.join(workflowDir, 'covpages.yml');
    if (!fs.existsSync(workflowDir)) {
      fs.mkdirSync(workflowDir, { recursive: true });
    }

    const presetKey = framework && getPreset(framework) ? framework : 'vitest';
    const workflowContent = generatePresetWorkflow(presetKey, { docs: Boolean(values.docs) });

    fs.writeFileSync(workflowPath, workflowContent, 'utf-8');
    console.log(`\n✨ Created GitHub Actions workflow at: ${workflowPath}`);
    if (values.docs) {
      console.log('   Configured for GitHub Pages deployment from docs/covpages on main branch!\n');
    } else {
      console.log('   Push to main branch to automatically generate and publish coverage to GitHub Pages!\n');
    }
    return;
  }

  // 5. Serve command
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

  const outputDir = values.docs && values.output === 'covpages-dist'
    ? 'docs/covpages'
    : strVal(values.output, 'covpages-dist')!;

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
      tag: strVal(values.tag),
      baseUrl: strVal(values['base-url']),
      saveRaw: Boolean(values['save-raw']),
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
