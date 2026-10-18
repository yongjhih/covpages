import fs from 'node:fs';
import path from 'node:path';
import { VENDORED_WEB_MODULES } from './web-modules.js';
import { renderMcpHtml } from './render.js';

export * from './render.js';
export * from './web-modules.js';

export interface BuildMcpOptions {
  repo?: string;
  title?: string;
}

/**
 * Vendors the 7 WebMCP zero-dependency client ES modules into targetDir/web/.
 */
export function vendorMcpWeb(targetDir: string): string[] {
  const resolvedTarget = path.basename(targetDir) === 'web'
    ? path.resolve(targetDir)
    : path.join(path.resolve(targetDir), 'web');

  fs.mkdirSync(resolvedTarget, { recursive: true });

  const written: string[] = [];
  for (const [filename, content] of Object.entries(VENDORED_WEB_MODULES)) {
    const dest = path.join(resolvedTarget, filename);
    fs.writeFileSync(dest, content, 'utf8');
    written.push(filename);
  }
  return written;
}

/**
 * Builds the compliant MCP Page (mcp.html) and vendors the WebMCP client modules into outputDir.
 */
export function buildMcpPage(
  outputDir: string,
  options: BuildMcpOptions = {}
): { mcpHtmlPath: string; vendoredFiles: string[] } {
  const resolvedOut = path.resolve(outputDir);
  fs.mkdirSync(resolvedOut, { recursive: true });

  const vendoredFiles = vendorMcpWeb(resolvedOut);
  const html = renderMcpHtml(options);
  const mcpHtmlPath = path.join(resolvedOut, 'mcp.html');
  fs.writeFileSync(mcpHtmlPath, html, 'utf8');

  return {
    mcpHtmlPath,
    vendoredFiles,
  };
}
