import { describe, it, expect, beforeEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { runCli } from '../src/cli.js';

describe('Covpages CLI', () => {
  const fixturesDir = path.resolve(__dirname, 'fixtures');
  const outDir = path.resolve(__dirname, '../node_modules/.tmp-cli-test');

  beforeEach(() => {
    if (fs.existsSync(outDir)) {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });

  it('runs generate via CLI arguments', async () => {
    const lcovFile = path.join(fixturesDir, 'commit1.lcov');

    await runCli([
      'generate',
      '--input', lcovFile,
      '--output', outDir,
      '--title', 'CLI Test Report',
      '--commit', 'abcdef1234567890abcdef1234567890abcdef12',
      '--branch', 'feature/test',
    ]);

    expect(fs.existsSync(path.join(outDir, 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'covpages-data.json'))).toBe(true);

    const json = JSON.parse(fs.readFileSync(path.join(outDir, 'covpages-data.json'), 'utf-8'));
    expect(json.title).toBe('CLI Test Report');
    expect(json.currentCommit.branch).toBe('feature/test');
    expect(json.currentCommit.shortSha).toBe('abcdef1');
  });

  it('runs init command to generate GitHub workflow', async () => {
    const workflowPath = path.resolve('.github/workflows/covpages.yml');
    if (fs.existsSync(workflowPath)) {
      fs.unlinkSync(workflowPath);
    }

    await runCli(['init']);

    expect(fs.existsSync(workflowPath)).toBe(true);
    const content = fs.readFileSync(workflowPath, 'utf-8');
    expect(content).toContain('Test Coverage Pages');
    expect(content).toContain('covpages generate');
  });
});
