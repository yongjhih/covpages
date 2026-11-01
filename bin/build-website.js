#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distWebsite = path.join(__dirname, '../dist/website/index.js');

if (!fs.existsSync(distWebsite)) {
  const srcWebsite = path.join(__dirname, '../src/website/index.ts');
  if (fs.existsSync(srcWebsite)) {
    try {
      const { execSync } = await import('node:child_process');
      execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    } catch {
      console.error('\n❌ covpages: Failed to build TypeScript sources. Please run "npm run build" first.\n');
      process.exit(1);
    }
  } else {
    console.error('\n❌ covpages: Cannot find dist/website/index.js. Please reinstall or build the package.\n');
    process.exit(1);
  }
}

const { buildWebsite } = await import('../dist/website/index.js');

const targetDir = process.argv[2] || 'docs';
buildWebsite(targetDir);
console.log(`✨ Generated Covpages Project Website at ${targetDir}/index.html`);
