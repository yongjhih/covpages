import type { CovpagesData } from '../types.js';
import { ICONS } from './icons.js';
import { STYLES_CSS } from './styles.css.js';
import { APP_JS } from './app.js.js';

export function renderIndexHtml(data: CovpagesData, options: { inline?: boolean } = {}): {
  html: string;
  css: string;
  js: string;
  dataJs: string;
} {
  const jsonStr = JSON.stringify(data);
  const iconsStr = JSON.stringify(ICONS);
  const dataJs = `window.__COVPAGES_DATA__ = ${jsonStr};\nwindow.__COVPAGES_ICONS__ = ${iconsStr};`;

  const safeTitle = data.title ? `${data.title} - covpages` : 'Coverage Report - covpages';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Unit test coverage report with multi-commit trends powered by covpages">
  <meta name="color-scheme" content="light dark">
  <title>${safeTitle}</title>
  <style>
${STYLES_CSS}
  </style>
</head>
<body>
  <div id="covpages-app">
    <noscript>
      <div style="padding: 24px; text-align: center; font-family: sans-serif;">
        <h2>JavaScript is required to view interactive coverage reports.</h2>
        <p>Overall Line Coverage: <strong>${data.summary.lines.pct}%</strong> (${data.summary.lines.covered}/${data.summary.lines.total})</p>
      </div>
    </noscript>
  </div>
  <div id="chart-tooltip" class="chart-tooltip" role="tooltip" aria-hidden="true"></div>
  <script>
${dataJs}
  </script>
  <script>
${APP_JS}
  </script>
</body>
</html>`;

  return {
    html,
    css: STYLES_CSS,
    js: APP_JS,
    dataJs,
  };
}
