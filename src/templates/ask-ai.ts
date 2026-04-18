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
    z-index: 20000;
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
    z-index: 20001;
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

  /* Primer Button styling for Drawer CTAs and Action Buttons */
  .ask-ai-drawer .btn,
  .ask-ai-cta-btn,
  .ask-ai-jump-btn {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    color: var(--color-fg-default, #1f2328);
    background-color: var(--color-btn-bg, #f6f8fa);
    border: 1px solid var(--color-btn-border, #d0d7de);
    border-radius: var(--radius-md, 6px);
    box-shadow: 0 1px 0 rgba(31, 35, 40, 0.04);
    cursor: pointer;
    text-decoration: none;
    user-select: none;
    transition: background-color 0.15s ease, border-color 0.15s ease;
    font-family: inherit;
    box-sizing: border-box;
  }
  .ask-ai-drawer .btn:hover,
  .ask-ai-cta-btn:hover,
  .ask-ai-jump-btn:hover {
    background-color: var(--color-btn-hover-bg, #eaeef2);
    border-color: var(--color-border-default, #d0d7de);
    text-decoration: none;
    color: var(--color-fg-default, #1f2328);
  }
  .ask-ai-drawer .btn-primary,
  .ask-ai-cta-btn.btn-primary {
    color: #ffffff !important;
    background-color: var(--color-btn-primary-bg, #1f883d);
    border-color: var(--color-btn-primary-border, #1a7f37);
  }
  .ask-ai-drawer .btn-primary:hover,
  .ask-ai-cta-btn.btn-primary:hover {
    background-color: var(--color-btn-primary-hover-bg, #1a7f37);
    border-color: var(--color-btn-primary-border, #1a7f37);
    color: #ffffff !important;
  }

  .ask-ai-msg ul.ask-ai-actions-list {
    list-style: none;
    padding-left: 0;
    margin: 8px 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ask-ai-msg ul.ask-ai-actions-list li {
    margin: 0;
    display: flex;
  }
  .ask-ai-msg ul.ask-ai-actions-list .ask-ai-cta-btn,
  .ask-ai-msg ul.ask-ai-actions-list .ask-ai-jump-btn {
    width: 100%;
    margin: 0;
    text-align: left;
  }

  .ask-ai-link {
    color: var(--color-accent-fg, #0969da);
    text-decoration: underline;
  }
  .ask-ai-link:hover {
    text-decoration: underline;
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
      <div class="ask-ai-header-actions" style="display: flex; gap: 6px; align-items: center;">
        <button type="button" class="btn btn-sm" id="ask-ai-clear" title="Clear chat history" aria-label="Clear chat history" style="display: none;">Clear</button>
        <button type="button" class="btn btn-sm" id="ask-ai-close" aria-label="Close Ask AI">&times; Close</button>
      </div>
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
  var clearBtn = document.getElementById('ask-ai-clear');
  var form = document.getElementById('ask-ai-form');
  var input = document.getElementById('ask-ai-input');
  var messagesEl = document.getElementById('ask-ai-messages');
  var statusPill = document.getElementById('ask-ai-status-pill');

  if (!drawer || !form || !input || !messagesEl) return;

  var STORAGE_KEY = 'covpages_ask_ai_history';
  var conversationHistory = [];

  function loadHistory() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  function updateClearBtn() {
    if (clearBtn) {
      clearBtn.style.display = conversationHistory.length > 0 ? 'inline-flex' : 'none';
    }
  }

  function saveHistory() {
    try {
      if (conversationHistory.length > 50) {
        conversationHistory = conversationHistory.slice(-50);
      }
      var data = JSON.stringify(conversationHistory);
      sessionStorage.setItem(STORAGE_KEY, data);
      try { localStorage.setItem(STORAGE_KEY, data); } catch (e) {}
    } catch (e) {}
    updateClearBtn();
  }

  function clearHistory() {
    conversationHistory = [];
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    var allMsgs = messagesEl.querySelectorAll('.ask-ai-msg');
    for (var i = 1; i < allMsgs.length; i++) {
      allMsgs[i].remove();
    }
    updateClearBtn();
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function (e) {
      e.preventDefault();
      clearHistory();
    });
  }

  function restoreHistory() {
    conversationHistory = loadHistory();
    var allMsgs = messagesEl.querySelectorAll('.ask-ai-msg');
    for (var m = 1; m < allMsgs.length; m++) {
      allMsgs[m].remove();
    }
    if (conversationHistory && conversationHistory.length > 0) {
      for (var i = 0; i < conversationHistory.length; i++) {
        var item = conversationHistory[i];
        if (item && item.role && item.html) {
          var msgEl = document.createElement('div');
          msgEl.className = 'ask-ai-msg ask-ai-msg-' + item.role;
          msgEl.innerHTML = item.html;
          messagesEl.appendChild(msgEl);
          bindActions(msgEl);
        }
      }
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    updateClearBtn();
  }

  var lastToggleTime = 0;
  function toggleDrawer(open) {
    if (typeof open !== 'boolean') {
      open = drawer.getAttribute('data-open') !== 'true';
    }
    var now = Date.now();
    if (open && now - lastToggleTime < 150) {
      return;
    }
    lastToggleTime = now;
    drawer.setAttribute('data-open', open ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (backdrop) backdrop.setAttribute('data-open', open ? 'true' : 'false');
    if (open) {
      if (messagesEl.children.length <= 1) {
        restoreHistory();
      }
      messagesEl.scrollTop = messagesEl.scrollHeight;
      setTimeout(function () { input.focus(); }, 100);
    }
  }

  window.toggleAskAiDrawer = function (open) {
    toggleDrawer(open);
  };

  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('#ask-ai-trigger, [data-ask-ai-trigger]') : null;
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      toggleDrawer();
      return;
    }
    var close = e.target && e.target.closest ? e.target.closest('#ask-ai-close, [data-ask-ai-close]') : null;
    if (close) {
      e.preventDefault();
      e.stopPropagation();
      toggleDrawer(false);
      return;
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', function (e) {
      e.preventDefault();
      toggleDrawer(false);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') {
      toggleDrawer(false);
    }
  });

  function appendMessage(sender, htmlContent, shouldSave, rawText) {
    var msgEl = document.createElement('div');
    msgEl.className = 'ask-ai-msg ask-ai-msg-' + sender;
    msgEl.innerHTML = htmlContent;
    messagesEl.appendChild(msgEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    bindActions(msgEl);

    if (shouldSave) {
      conversationHistory.push({
        role: sender,
        html: htmlContent,
        text: rawText || (htmlContent ? htmlContent.replace(/<[^>]+>/g, ' ').trim() : '')
      });
      saveHistory();
    }
    return msgEl;
  }

  // Restore history on script startup
  restoreHistory();

  function handleJump(hash) {
    if (!hash || !hash.startsWith('#')) return;
    var el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      toggleDrawer(false);
      return;
    }

    // Check if it belongs to ai-proxy local dashboard
    if (
      hash === '#form-add-site' ||
      hash === '#admin-dashboard-authenticated' ||
      hash === '#details-allow-prefix' ||
      hash === '#details-allowed-origins' ||
      hash === '#details-key-mgmt' ||
      hash.startsWith('#site-row-')
    ) {
      window.open('http://127.0.0.1:8788/dashboard.html' + hash, '_blank');
      return;
    }

    // Otherwise cross-page jump to project landing page
    var basePath = window.location.pathname.includes('/covpages/') ? '../' : './';
    window.location.href = basePath + hash;
  }

  function bindActions(container) {
    if (!container) return;
    var chips = container.querySelectorAll('.ask-ai-chip[data-ask]');
    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener('click', function (ev) {
        var query = ev.currentTarget.getAttribute('data-ask');
        if (query) {
          handleUserQuery(query);
        }
      });
    }

    var jumpBtns = container.querySelectorAll('.ask-ai-jump-btn[data-jump]');
    for (var k = 0; k < jumpBtns.length; k++) {
      jumpBtns[k].addEventListener('click', function (ev) {
        var hash = ev.currentTarget.getAttribute('data-jump');
        handleJump(hash);
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
          handleJump(action.slice('jump:'.length));
        } else if (action === 'action:connect' || action.startsWith('action:connect')) {
          window.location.href = 'http://127.0.0.1:8788/admin/v1/open-dashboard?redirect=' + encodeURIComponent(window.location.href);
        } else if (action.startsWith('action:')) {
          window.open('http://127.0.0.1:8788/dashboard.html', '_blank');
        }
      });
    }

    var links = container.querySelectorAll('a.ask-ai-cta-btn, a.ask-ai-link');
    for (var l = 0; l < links.length; l++) {
      links[l].addEventListener('click', function (ev) {
        var href = ev.currentTarget.getAttribute('href');
        if (!href) return;
        if (href.startsWith('doc.html') || href.startsWith('dashboard.html')) {
          ev.preventDefault();
          window.open('http://127.0.0.1:8788/' + href, '_blank');
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

    appendMessage('user', '<p>' + escapeHtml(text) + '</p>', true, text);
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
      var promptMessages = [
        {
          role: 'system',
          content: 'You are the Covpages Assistant. Covpages is a git-native test coverage reporting tool for GitHub Pages with multi-commit trends, scoped badges, and zero backend required.'
        }
      ];

      var recent = conversationHistory.slice(-6);
      for (var r = 0; r < recent.length; r++) {
        var hist = recent[r];
        if (hist && hist.role) {
          promptMessages.push({
            role: hist.role === 'user' ? 'user' : 'assistant',
            content: hist.text || (hist.html ? hist.html.replace(/<[^>]+>/g, ' ').trim() : '')
          });
        }
      }

      var relayRes = await fetch('http://127.0.0.1:8788/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'local',
          messages: promptMessages
        }),
        signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(1500) : undefined
      });

      if (relayRes.ok) {
        var replyData = await relayRes.json();
        var replyText = replyData && replyData.choices && replyData.choices[0] && replyData.choices[0].message && replyData.choices[0].message.content;
        if (replyText) {
          var formatted = formatMarkdown(replyText);
          typingEl.innerHTML = formatted;
          bindActions(typingEl);
          conversationHistory.push({
            role: 'assistant',
            html: formatted,
            text: replyText
          });
          saveHistory();
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
    conversationHistory.push({
      role: 'assistant',
      html: replyHtml,
      text: replyHtml.replace(/<[^>]+>/g, ' ').trim()
    });
    saveHistory();
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

  function formatMarkdown(markdown) {
    if (!markdown) return '';
    var lines = String(markdown).split('\\n');
    var result = [];
    var inCodeBlock = false;
    var codeBlockLines = [];
    var inList = false;

    function closeList() {
      if (inList === 'ol') {
        result.push('</ol>');
        inList = false;
      } else if (inList) {
        result.push('</ul>');
        inList = false;
      }
    }

    function formatInline(text) {
      var out = escapeHtml(text);

      // 1) Action CTA buttons: [Text](action:...)
      out = out.replace(
        /\\[([^\\]]+)\\]\\((action:[^)]+)\\)/g,
        function (_, label, actionUrl) {
          return '<button type="button" class="btn btn-sm btn-primary ask-ai-cta-btn" data-action="' + actionUrl + '">' + label + '</button>';
        }
      );

      // 2) Jump buttons: [Text](#hash)
      out = out.replace(
        /\\[([^\\]]+)\\]\\((#[^)]+)\\)/g,
        function (_, label, hash) {
          return '<button type="button" class="btn btn-sm ask-ai-jump-btn" data-jump="' + hash + '">' + label + '</button>';
        }
      );

      // 3) Normal Links / relative files: [Text](url)
      out = out.replace(
        /\\[([^\\]]+)\\]\\(([^)]+)\\)/g,
        function (_, label, url) {
          var isExt = url.startsWith('http://') || url.startsWith('https://');
          var targetAttr = isExt ? ' target="_blank" rel="noopener"' : '';
          return '<a href="' + url + '" class="btn btn-sm ask-ai-cta-btn" style="text-decoration:none;"' + targetAttr + '>' + label + '</a>';
        }
      );

      // 4) Bold: **text**
      out = out.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');

      // 5) Inline code
      out = out.replace(new RegExp('\\x60([^\\x60]+)\\x60', 'g'), '<code>$1</code>');

      return out;
    }

    var codeFence = String.fromCharCode(96, 96, 96);
    for (var i = 0; i < lines.length; i++) {
      var rawLine = lines[i];
      var trimmed = rawLine.trim();

      if (trimmed.startsWith(codeFence)) {
        if (inCodeBlock) {
          result.push('<pre><code>' + escapeHtml(codeBlockLines.join('\\n')) + '</code></pre>');
          codeBlockLines = [];
          inCodeBlock = false;
        } else {
          closeList();
          inCodeBlock = true;
        }
        continue;
      }
      if (inCodeBlock) {
        codeBlockLines.push(rawLine);
        continue;
      }

      if (!trimmed) {
        closeList();
        continue;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        var itemContent = trimmed.slice(2);
        var isAction = /^\\[.+?\\]\\(.+?\\)$/.test(itemContent.trim());
        if (!inList) {
          inList = 'ul';
          result.push(isAction ? '<ul class="ask-ai-actions-list">' : '<ul>');
        }
        result.push('<li>' + formatInline(itemContent) + '</li>');
        continue;
      }

      var olMatch = /^(\\d+)\\.\\s+(.*)$/.exec(trimmed);
      if (olMatch) {
        if (!inList) {
          inList = 'ol';
          result.push('<ol>');
        }
        result.push('<li>' + formatInline(olMatch[2]) + '</li>');
        continue;
      }

      closeList();

      if (trimmed.startsWith('> ')) {
        result.push('<blockquote>' + formatInline(trimmed.slice(2)) + '</blockquote>');
        continue;
      }

      result.push('<p>' + formatInline(rawLine) + '</p>');
    }

    closeList();
    if (inCodeBlock && codeBlockLines.length > 0) {
      result.push('<pre><code>' + escapeHtml(codeBlockLines.join('\\n')) + '</code></pre>');
    }

    return result.join('');
  }
})();
`;
