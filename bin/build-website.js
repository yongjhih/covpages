#!/usr/bin/env node
import { buildWebsite } from '../dist/website/index.js';

const targetDir = process.argv[2] || 'docs';
buildWebsite(targetDir);
console.log(`✨ Generated Covpages Project Website at ${targetDir}/index.html`);
