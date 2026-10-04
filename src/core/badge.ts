/**
 * SVG Coverage Badge Generator
 * Generates lightweight, Shields.io-compatible SVG badges without any external dependencies.
 */

export function getBadgeColor(pct: number): string {
  if (pct >= 80) return '#2da44e'; // Primer green
  if (pct >= 50) return '#bf8700'; // Primer yellow/attention
  return '#cf222e'; // Primer red/danger
}

export function generateBadgeSvg(pct: number, label = 'coverage'): string {
  const roundedPct = Math.round(pct * 10) / 10;
  const pctStr = `${roundedPct}%`;
  const color = getBadgeColor(pct);

  // Character width approximations for crisp rendering
  const labelWidth = Math.round(label.length * 6.5 + 16);
  const valueWidth = Math.round(pctStr.length * 7.5 + 16);
  const totalWidth = labelWidth + valueWidth;

  const labelTextX = Math.round((labelWidth / 2) * 10);
  const valueTextX = Math.round((labelWidth + valueWidth / 2) * 10);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${pctStr}">
  <title>${label}: ${pctStr}</title>
  <linearGradient id="covpages-grad" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="covpages-r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#covpages-r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#covpages-grad)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${labelTextX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${label}</text>
    <text x="${labelTextX}" y="140" transform="scale(.1)" fill="#fff">${label}</text>
    <text aria-hidden="true" x="${valueTextX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${pctStr}</text>
    <text x="${valueTextX}" y="140" transform="scale(.1)" fill="#fff">${pctStr}</text>
  </g>
</svg>
`;
}
