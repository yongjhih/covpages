import { ICONS } from './icons.js';

export const ASK_AI_CSS = `
  /* Ask AI Drawer Styles (GitHub Primer) */
  .ask-ai-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ask-ai-backdrop[data-open="true"] {
    opacity: 1;
    pointer-events: auto;
  }

  .ask-ai-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 440px;
    max-width: 92vw;
    background-color: var(--color-canvas-overlay, #ffffff);
    border-left: 1px solid var(--color-border-default, #d0d7de);
    box-shadow: var(--shadow-rest, 0 8px 24px rgba(1, 4, 9, 0.15));
    display: flex;
    flex-direction: column;
    z-index: 1001;
    transform: translateX(100%);
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ask-ai-drawer[data-open="true"] {
    transform: translateX(0);
  }

  .ask-ai-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-bottom: 1px solid var(--color-border-default, #d0d7de);
    background-color: var(--color-canvas-subtle, #f6f8fa);
  }
  .ask-ai-title {
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-fg-default, #1f2328);
  }
  .ask-ai-title svg { fill: currentColor; }

  .ask-ai-status-pill {
    font-size: 11px;
    font-weight: 500;
    padding: 1px 6px;
    border-radius: 10px;
    background-color: var(--color-neutral-subtle, rgba(129, 139, 152, 0.12));
    color: var(--color-fg-muted, #59636e);
  }
  .ask-ai-status-pill[data-connected="true"] {
    background-color: var(--color-success-subtle, rgba(26, 127, 55, 0.1));
    color: var(--color-success-fg, #1a7f37);
  }

  .ask-ai-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-size: 13px;
    line-height: 1.5;
  }

  .ask-ai-msg {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 92%;
    border-radius: var(--radius-md, 6px);
    padding: 10px 14px;
    word-break: break-word;
  }
  .ask-ai-msg-assistant {
    align-self: flex-start;
    background-color: var(--color-canvas-subtle, #f6f8fa);
    border: 1px solid var(--color-border-default, #d0d7de);
    color: var(--color-fg-default, #1f2328);
  }
  .ask-ai-msg-user {
    align-self: flex-end;
    background-color: var(--color-accent-subtle, rgba(9, 105, 218, 0.1));
    border: 1px solid var(--color-accent-fg, #0969da);
    color: var(--color-fg-default, #1f2328);
  }

  .ask-ai-msg p { margin: 0 0 6px 0; }
  .ask-ai-msg p:last-child { margin-bottom: 0; }
  .ask-ai-msg ul, .ask-ai-msg ol { padding-left: 18px; margin: 4px 0 6px 0; }
  .ask-ai-msg li { margin-bottom: 2px; }
  .ask-ai-msg code {
    font-family: var(--font-mono, monospace);
    font-size: 12px;
    padding: 0.15em 0.35em;
    background-color: var(--color-neutral-subtle, rgba(129, 139, 152, 0.12));
    border-radius: var(--radius-sm, 4px);
  }
  .ask-ai-msg pre {
    background-color: var(--color-canvas-default, #ffffff);
    border: 1px solid var(--color-border-muted, #d8dee4);
    border-radius: var(--radius-sm, 4px);
    padding: 8px 10px;
    font-family: var(--font-mono, monospace);
    font-size: 11px;
    overflow-x: auto;
    margin: 6px 0;
  }
  .ask-ai-msg pre code {
    background: none;
    padding: 0;
  }

  .ask-ai-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }
  .ask-ai-chip {
    background-color: var(--color-canvas-default, #ffffff);
    border: 1px solid var(--color-border-default, #d0d7de);
    border-radius: 14px;
    padding: 3px 10px;
    font-size: 11px;
    color: var(--color-accent-fg, #0969da);
    cursor: pointer;
    line-height: 1.4;
    transition: background-color 0.15s ease;
  }
  .ask-ai-chip:hover {
    background-color: var(--color-canvas-subtle, #f6f8fa);
    text-decoration: none;
  }

  .ask-ai-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
    cursor: pointer;
  }

  .ask-ai-footer {
    padding: 12px 16px;
    border-top: 1px solid var(--color-border-default, #d0d7de);
    background-color: var(--color-canvas-subtle, #f6f8fa);
  }
  .ask-ai-form {
    display: flex;
    gap: 8px;
  }
  .ask-ai-input {
    flex: 1;
    min-width: 0;
    padding: 7px 12px;
    font-size: 13px;
    font-family: inherit;
    border: 1px solid var(--color-border-default, #d0d7de);
    border-radius: var(--radius-md, 6px);
    background-color: var(--color-canvas-default, #ffffff);
    color: var(--color-fg-default, #1f2328);
    outline: none;
  }
  .ask-ai-input:focus {
    border-color: var(--color-accent-fg, #0969da);
    box-shadow: 0 0 0 2px var(--color-accent-subtle, rgba(9, 105, 218, 0.15));
  }
`;

export function renderAskAiDrawerHtml(options: {
  mode: 'project' | 'coverage';
  baseUrl?: string;
}): string {
  const isCoverage = options.mode === 'coverage';

  const defaultGreeting = isCoverage
    ? `<p>Hello! I am your <strong>Covpages Coverage Assistant</strong>. I can help analyze your code coverage data, identify high-value test targets, inspect file metrics, or guide you through coverage trends.</p>`
    : `<p>Hello! I am your <strong>Covpages AI Assistant</strong>. Ask me how to configure covpages, generate framework presets (Flutter, Vitest, Jest, Rust, Python, Go), set up zero-build drop-in sites, or query MCP endpoints.</p>`;

  const chipsHtml = isCoverage
    ? `<div class="ask-ai-chips">
        <button type="button" class="ask-ai-chip" data-ask="Find high-value coverage targets">🎯 High-Value Targets</button>
        <button type="button" class="ask-ai-chip" data-ask="Which files have the most uncovered lines?">📊 Top Uncovered Files</button>
        <button type="button" class="ask-ai-chip" data-ask="What is the current coverage summary and delta?">📈 Summary &amp; Delta</button>
        <button type="button" class="ask-ai-chip" data-ask="Show multi-commit trend">🕒 Trend History</button>
        <button type="button" class="ask-ai-chip" data-ask="How to register this MCP in ai-proxy?">🔌 WebMCP Registration</button>
      </div>`
    : `<div class="ask-ai-chips">
        <button type="button" class="ask-ai-chip" data-ask="How do I set up covpages in 5 minutes?">🚀 Quickstart</button>
        <button type="button" class="ask-ai-chip" data-ask="Show Vitest GitHub Actions workflow">⚡ Vitest Preset</button>
        <button type="button" class="ask-ai-chip" data-ask="Show Flutter coverage workflow">💙 Flutter Preset</button>
        <button type="button" class="ask-ai-chip" data-ask="How does zero-build drop-in mode work?">📦 Drop-in Mode</button>
        <button type="button" class="ask-ai-chip" data-ask="Open live demo">👁️ Open Live Demo</button>
      </div>`;

  return `
  <div class="ask-ai-backdrop" id="ask-ai-backdrop" data-open="false"></div>
  <aside class="ask-ai-drawer" id="ask-ai-drawer" data-open="false" aria-hidden="true" aria-label="Ask AI Assistant">
    <div class="ask-ai-header">
      <div class="ask-ai-title">
        ${ICONS.terminal || ''}
        <span>Ask AI Assistant</span>
        <span class="ask-ai-status-pill" id="ask-ai-status-pill" data-connected="false">Local AI / Client</span>
      </div>
      <button type="button" class="btn btn-sm" id="ask-ai-close" aria-label="Close Ask AI">&times; Close</button>
    </div>

    <div class="ask-ai-body" id="ask-ai-messages">
      <div class="ask-ai-msg ask-ai-msg-assistant">
        ${defaultGreeting}
        ${chipsHtml}
      </div>
    </div>

    <div class="ask-ai-footer">
      <form class="ask-ai-form" id="ask-ai-form">
        <input type="text" class="ask-ai-input" id="ask-ai-input" placeholder="${isCoverage ? 'Ask about high-value targets, files, trends...' : 'Ask about setup, presets, badges, CLI...'}" autocomplete="off" required />
        <button type="submit" class="btn btn-primary btn-sm">Send</button>
      </form>
    </div>
  </aside>
  `;
}

export const ASK_AI_CLIENT_SCRIPT = `
(function () {
  var triggerBtn = document.getElementById('ask-ai-trigger');
  var drawer = document.getElementById('ask-ai-drawer');
  var backdrop = document.getElementById('ask-ai-backdrop');
  var closeBtn = document.getElementById('ask-ai-close');
  var form = document.getElementById('ask-ai-form');
  var input = document.getElementById('ask-ai-input');
  var messagesEl = document.getElementById('ask-ai-messages');
  var statusPill = document.getElementById('ask-ai-status-pill');

  if (!drawer || !form || !input || !messagesEl) return;

  function toggleDrawer(open) {
    drawer.setAttribute('data-open', open ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (backdrop) backdrop.setAttribute('data-open', open ? 'true' : 'false');
    if (open) {
      setTimeout(function () { input.focus(); }, 100);
    }
  }

  if (triggerBtn) {
    triggerBtn.addEventListener('click', function () {
      toggleDrawer(drawer.getAttribute('data-open') !== 'true');
    });
  }
  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('#ask-ai-trigger') : null;
    if (btn) {
      e.preventDefault();
      toggleDrawer(drawer.getAttribute('data-open') !== 'true');
    }
  });
  if (closeBtn) {
    closeBtn.addEventListener('click', function () { toggleDrawer(false); });
  }
  if (backdrop) {
    backdrop.addEventListener('click', function () { toggleDrawer(false); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') {
      toggleDrawer(false);
    }
  });

  function appendMessage(sender, htmlContent) {
    var msgEl = document.createElement('div');
    msgEl.className = 'ask-ai-msg ask-ai-msg-' + sender;
    msgEl.innerHTML = htmlContent;
    messagesEl.appendChild(msgEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    bindActions(msgEl);
  }

  function bindActions(container) {
    var chips = container.querySelectorAll('.ask-ai-chip[data-ask]');
    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener('click', function (ev) {
        var query = ev.currentTarget.getAttribute('data-ask');
        if (query) {
          handleUserQuery(query);
        }
      });
    }

    var actionBtns = container.querySelectorAll('.ask-ai-cta-btn[data-action]');
    for (var j = 0; j < actionBtns.length; j++) {
      actionBtns[j].addEventListener('click', function (ev) {
        var action = ev.currentTarget.getAttribute('data-action');
        if (!action) return;
        if (action.startsWith('navigate:')) {
          var targetUrl = action.slice('navigate:'.length);
          window.location.href = targetUrl;
        } else if (action.startsWith('jump:')) {
          var hash = action.slice('jump:'.length);
          var el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            toggleDrawer(false);
          }
        }
      });
    }
  }

  // Load coverage data helper
  function getCoverageData() {
    if (typeof window !== 'undefined' && window.__COVPAGES_DATA__) {
      return window.__COVPAGES_DATA__;
    }
    return null;
  }

  // Client-side high-value target calculator
  function computeHighValueTargets(data, limit) {
    if (!data || !data.summary || !data.files) return null;
    var repoTotal = data.summary.lines.total;
    var repoCovered = data.summary.lines.covered;
    var files = Object.values(data.files);

    var ranked = files.map(function (f) {
      var unc = f.lines.total - f.lines.covered;
      var gain = (unc / repoTotal) * 100;
      var proj = ((repoCovered + unc) / repoTotal) * 100;
      return {
        path: f.path,
        pct: f.lines.pct,
        uncovered: unc,
        total: f.lines.total,
        gain: gain,
        projectedPct: proj
      };
    }).sort(function (a, b) {
      return b.uncovered - a.uncovered;
    });

    return {
      repoSummary: data.summary,
      targets: ranked.slice(0, limit || 5)
    };
  }

  async function handleUserQuery(text) {
    text = (text || '').trim();
    if (!text) return;

    appendMessage('user', '<p>' + escapeHtml(text) + '</p>');
    input.value = '';

    // Show typing placeholder
    var typingEl = document.createElement('div');
    typingEl.className = 'ask-ai-msg ask-ai-msg-assistant';
    typingEl.innerHTML = '<p><em>Thinking...</em></p>';
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // 1. Try local ai-proxy /v1/chat/completions relay
    var relaySuccess = false;
    try {
      var relayRes = await fetch('http://127.0.0.1:8788/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'local',
          messages: [
            {
              role: 'system',
              content: 'You are the Covpages Assistant. Covpages is a git-native test coverage reporting tool for GitHub Pages with multi-commit trends, scoped badges, and zero backend required.'
            },
            { role: 'user', content: text }
          ]
        }),
        signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(1500) : undefined
      });

      if (relayRes.ok) {
        var replyData = await relayRes.json();
        var replyText = replyData && replyData.choices && replyData.choices[0] && replyData.choices[0].message && replyData.choices[0].message.content;
        if (replyText) {
          typingEl.innerHTML = formatMarkdown(replyText);
          bindActions(typingEl);
          if (statusPill) {
            statusPill.textContent = 'ai-proxy /v1 Connected';
            statusPill.setAttribute('data-connected', 'true');
          }
          relaySuccess = true;
        }
      }
    } catch (e) {
      // Local relay not available; proceed to client-side rule engine
    }

    if (relaySuccess) return;

    // 2. Intelligent Client-Side Response Engine
    var lower = text.toLowerCase();
    var covData = getCoverageData();
    var replyHtml = '';

    if (lower.includes('high-value') || lower.includes('價值') || lower.includes('roi') || lower.includes('uncovered') || lower.includes('提升') || lower.includes('priorit')) {
      if (!covData) {
        // Fetch covpages-data.json if not in memory
        try {
          var res = await fetch('covpages-data.json');
          if (res.ok) covData = await res.json();
        } catch (err) {}
      }

      if (covData && covData.files) {
        var report = computeHighValueTargets(covData, 5);
        var curLinesPct = covData.summary.lines.pct.toFixed(2);
        replyHtml = '<p>🎯 <strong>Highest Value Targets to Improve Coverage:</strong></p>' +
          '<p>Overall repo line coverage is currently <strong>' + curLinesPct + '%</strong> (' + covData.summary.lines.covered + '/' + covData.summary.lines.total + ' lines). Here are the top 5 files where adding tests produces the greatest codebase impact:</p>' +
          '<ol>';

        report.targets.forEach(function (t) {
          replyHtml += '<li><code>' + escapeHtml(t.path) + '</code>: currently <strong>' + t.pct.toFixed(1) + '%</strong> (' + t.uncovered + ' uncovered lines).<br />' +
            '&rarr; Covering this file will increase repo coverage by <strong>+' + t.gain.toFixed(2) + '%</strong> (up to <strong>' + t.projectedPct.toFixed(2) + '%</strong>).</li>';
        });

        replyHtml += '</ol>' +
          '<p>You can also query this anytime via the WebMCP tool <code>find_high_value_targets</code>!</p>';
      } else {
        replyHtml = '<p>To inspect high-value coverage targets, visit the <a href="covpages/">Live Coverage Viewer</a> or register the WebMCP endpoint at <code>covpages/mcp</code>!</p>';
      }
    } else if (lower.includes('summary') || lower.includes('delta') || lower.includes('總覽') || lower.includes('覆蓋率')) {
      if (covData && covData.summary) {
        var s = covData.summary;
        var d = covData.delta;
        var deltaStr = d ? (' (' + (d.linesPct >= 0 ? '+' : '') + d.linesPct + '% vs previous)') : '';
        replyHtml = '<p>📊 <strong>Current Coverage Metrics:</strong></p>' +
          '<ul>' +
          '<li><strong>Lines:</strong> ' + s.lines.pct + '% (' + s.lines.covered + '/' + s.lines.total + ')' + deltaStr + '</li>' +
          '<li><strong>Functions:</strong> ' + s.functions.pct + '% (' + s.functions.covered + '/' + s.functions.total + ')</li>' +
          '<li><strong>Branches:</strong> ' + s.branches.pct + '% (' + s.branches.covered + '/' + s.branches.total + ')</li>' +
          '</ul>';
      } else {
        replyHtml = '<p>Explore overall metrics and multi-commit deltas in the <a href="covpages/">Live Coverage Viewer</a>.</p>';
      }
    } else if (lower.includes('flutter')) {
      replyHtml = '<p>💙 <strong>Flutter Integration Preset:</strong></p>' +
        '<p>Run tests with coverage and generate reports:</p>' +
        '<pre><code>flutter test --coverage\\nnpx covpages coverage/lcov.info --docs</code></pre>' +
        '<p>To scaffold the GitHub Actions CI workflow:</p>' +
        '<pre><code>npx covpages init --framework flutter --docs</code></pre>';
    } else if (lower.includes('vitest') || lower.includes('vite')) {
      replyHtml = '<p>⚡ <strong>Vitest Integration Preset:</strong></p>' +
        '<p>Configure <code>vitest.config.ts</code> with coverage provider (v8/istanbul) and run:</p>' +
        '<pre><code>npx vitest run --coverage\\nnpx covpages coverage/lcov.info --docs</code></pre>' +
        '<p>To generate the workflow file:</p>' +
        '<pre><code>npx covpages init --framework vitest --docs</code></pre>';
    } else if (lower.includes('dropin') || lower.includes('zero-build') || lower.includes('drop-in')) {
      replyHtml = '<p>📦 <strong>Zero-Build Drop-in Mode:</strong></p>' +
        '<p>No build step required in CI! Put a zero-build client in your <code>gh-pages</code> branch, then simply copy <code>lcov.info</code>:</p>' +
        '<pre><code>npx covpages dropin gh-pages\\ncp coverage/lcov.info gh-pages/\\n# The browser client parses LCOV dynamically at runtime!</code></pre>';
    } else if (lower.includes('demo') || lower.includes('live')) {
      replyHtml = '<p>Click below to jump directly to the live coverage report:</p>' +
        '<p><button type="button" class="btn btn-sm btn-primary ask-ai-cta-btn" data-action="navigate:covpages/">Open Live Coverage Demo</button></p>';
    } else if (lower.includes('badge')) {
      replyHtml = '<p>🏷️ <strong>Scoped SVG Badges:</strong></p>' +
        '<p>Covpages generates badges for your repository, branch, folders, and individual files into <code>badges/</code>.</p>' +
        '<pre><code>[![Coverage](https://yongjhih.github.io/covpages/badges/overall.svg)](https://yongjhih.github.io/covpages/covpages/)</code></pre>' +
        '<p><button type="button" class="btn btn-sm ask-ai-cta-btn" data-action="jump:#badges">Open Badge Generator</button></p>';
    } else if (lower.includes('mcp') || lower.includes('ai-proxy') || lower.includes('register')) {
      var isCov = window.location.pathname.includes('/covpages/');
      var targetPath = isCov ? 'covpages/covpages/mcp' : 'covpages/mcp';
      var siteSlug = isCov ? 'covpages-covpages' : 'covpages';
      replyHtml = '<p>🔌 <strong>Register WebMCP Endpoint:</strong></p>' +
        '<p>Add this site to your local <code>ai-proxy</code> relay server:</p>' +
        '<pre><code>npx ai-proxy add https://yongjhih.github.io/' + targetPath + ' --name ' + siteSlug + '</code></pre>' +
        '<p><button type="button" class="btn btn-sm btn-primary ask-ai-cta-btn" data-action="navigate:mcp">View MCP Tools Catalog</button></p>';
    } else {
      replyHtml = '<p>I can help you with:</p>' +
        '<ul>' +
        '<li>Finding high-value targets to increase test coverage</li>' +
        '<li>Generating CI workflows for Flutter, Vitest, Jest, Rust, Python, Go</li>' +
        '<li>Setting up zero-build drop-in sites</li>' +
        '<li>Creating SVG badges for folders and files</li>' +
        '<li>Registering WebMCP tools in <code>ai-proxy</code></li>' +
        '</ul>';
    }

    typingEl.innerHTML = replyHtml;
    bindActions(typingEl);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = input.value;
      if (val) handleUserQuery(val);
    });
  }

  // Bind initial suggestion chips
  bindActions(messagesEl);

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatMarkdown(str) {
    return escapeHtml(str)
      .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
      .replace(/\`([^\\\`]+)\`/g, '<code>$1</code>')
      .replace(/\\n/g, '<br />');
  }
})();
`;
