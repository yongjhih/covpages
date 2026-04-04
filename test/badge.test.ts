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
    expect(getBadgeFileName('overall')).toBe('badge.svg');
  });
});
