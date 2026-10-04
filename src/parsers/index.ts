import fs from 'node:fs';
import type { FileCoverage, SupportedFormat, ParseOptions } from '../types.js';
import { parseLcov } from './lcov.js';
import { parseCobertura } from './cobertura.js';
import { parseJsonCoverage } from './json.js';

export function detectFormat(filePath: string, content: string): SupportedFormat {
  const lowerPath = filePath.toLowerCase();
  if (lowerPath.endsWith('.lcov') || lowerPath.endsWith('.info') || lowerPath.includes('lcov')) {
    return 'lcov';
  }
  if (lowerPath.endsWith('.xml') || lowerPath.includes('cobertura') || lowerPath.includes('clover')) {
    return 'cobertura';
  }
  if (lowerPath.endsWith('.json')) {
    return 'json';
  }

  // Content-based heuristic
  const trimmed = content.trim();
  if (trimmed.startsWith('SF:') || trimmed.includes('\nSF:') || trimmed.includes('\r\nSF:') || trimmed.startsWith('TN:')) {
    return 'lcov';
  }
  if (trimmed.startsWith('<?xml') || trimmed.includes('<coverage') || trimmed.includes('<coverage ')) {
    return 'cobertura';
  }
  if (trimmed.startsWith('{') && (trimmed.includes('"total"') || trimmed.includes('"lines"') || trimmed.includes('"statementMap"'))) {
    return 'json';
  }

  // Default fallback
  return 'lcov';
}

export function parseCoverageFile(filePath: string, options: ParseOptions = {}): Record<string, FileCoverage> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const format = options.format && options.format !== 'auto' 
    ? options.format 
    : detectFormat(filePath, content);

  switch (format) {
    case 'cobertura':
    case 'clover':
      return parseCobertura(content, options.rootDir, options.includeSource);
    case 'json':
      return parseJsonCoverage(content, options.rootDir, options.includeSource);
    case 'lcov':
    default:
      return parseLcov(content, options.rootDir, options.includeSource);
  }
}

export { parseLcov, parseCobertura, parseJsonCoverage };
