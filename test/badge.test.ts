import { describe, it, expect } from 'vitest';
import { generateBadgeSvg, getBadgeColor } from '../src/core/badge.js';

describe('Coverage Badge Generator', () => {
  it('assigns correct primer colors based on coverage percentage', () => {
    expect(getBadgeColor(95)).toBe('#2da44e');
    expect(getBadgeColor(80)).toBe('#2da44e');
    expect(getBadgeColor(79.9)).toBe('#bf8700');
    expect(getBadgeColor(50)).toBe('#bf8700');
    expect(getBadgeColor(49.9)).toBe('#cf222e');
    expect(getBadgeColor(0)).toBe('#cf222e');
  });

  it('generates valid SVG with default label and custom percentage', () => {
    const svg = generateBadgeSvg(88.5);
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('coverage: 88.5%');
    expect(svg).toContain('#2da44e');
    expect(svg).toContain('88.5%');
  });

  it('supports custom badge label', () => {
    const svg = generateBadgeSvg(64, 'unit test');
    expect(svg).toContain('unit test: 64%');
    expect(svg).toContain('#bf8700');
    expect(svg).toContain('64%');
  });

  it('sanitizes badge names and formats filenames', async () => {
    const { sanitizeBadgeName, getBadgeFileName } = await import('../src/core/badge.js');
    expect(sanitizeBadgeName('src/core/index.ts')).toBe('src-core-index.ts');
    expect(getBadgeFileName('folder', 'src/core')).toBe('folder-src-core.svg');
    expect(getBadgeFileName('branch', 'main')).toBe('branch-main.svg');
    expect(getBadgeFileName('tag', 'v1.0.0')).toBe('tag-v1.0.0.svg');
    expect(getBadgeFileName('commit', '043a134')).toBe('commit-043a134.svg');
    expect(getBadgeFileName('overall')).toBe('badge.svg');
  });

  it('formats badge labels correctly for default branch, non-default branch, tag, and commit', async () => {
    const { formatBadgeLabel } = await import('../src/core/badge.js');
    // Default branch -> coverage
    expect(formatBadgeLabel('branch', 'main', 'main')).toBe('coverage');
    expect(formatBadgeLabel('branch', 'master', 'master')).toBe('coverage');
    expect(formatBadgeLabel('overall')).toBe('coverage');

    // Non-default branch -> coverage@<ref>
    expect(formatBadgeLabel('branch', 'feat-auth', 'main')).toBe('coverage@feat-auth');
    expect(formatBadgeLabel('branch', 'dev', 'main')).toBe('coverage@dev');

    // Tag -> coverage@<tag>
    expect(formatBadgeLabel('tag', 'v1.0.0', 'main')).toBe('coverage@v1.0.0');

    // Commit -> coverage@<commit-id>
    expect(formatBadgeLabel('commit', '027bf6e', 'main')).toBe('coverage@027bf6e');

    // Folder and file retain names
    expect(formatBadgeLabel('folder', 'src/core')).toBe('src/core');
    expect(formatBadgeLabel('file', 'badge.ts')).toBe('badge.ts');
  });
});

