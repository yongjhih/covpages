#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distCli = path.join(__dirname, '../dist/cli.js');

if (!fs.existsSync(distCli)) {
  const srcCli = path.join(__dirname, '../src/cli.ts');
  if (fs.existsSync(srcCli)) {
    try {
      const { execSync } = await import('node:child_process');
      execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    } catch {
      console.error('\n❌ covpages: Failed to build TypeScript sources. Please run "npm run build" first.\n');
      process.exit(1);
    }
  } else {
    console.error('\n❌ covpages: Cannot find dist/cli.js. Please reinstall or build the package.\n');
    process.exit(1);
  }
}

await import('../dist/cli.js');
