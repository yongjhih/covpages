import { ICONS } from './icons.js';
import { FRAMEWORK_PRESETS } from '../core/presets.js';

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

  .ask-ai-thinking {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--color-fg-muted, #59636e);
    font-size: 13px;
  }
  .ask-ai-thinking-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--color-border-default, #d0d7de);
    border-top-color: var(--color-accent-fg, #0969da);
    border-radius: 50%;
    animation: ask-ai-spin 0.8s linear infinite;
    display: inline-block;
    flex-shrink: 0;
  }
  .ask-ai-thinking-dots span {
    animation: ask-ai-blink 1.4s infinite both;
    font-weight: 700;
  }
  .ask-ai-thinking-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .ask-ai-thinking-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }
  @keyframes ask-ai-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes ask-ai-blink {
    0%, 80%, 100% { opacity: 0.2; }
    40% { opacity: 1; }
  }

  .btn-danger {
    color: #ffffff !important;
    background-color: var(--color-btn-danger-bg, #da3633) !important;
    border-color: var(--color-btn-danger-border, #b62324) !important;
  }
  .btn-danger:hover {
    background-color: var(--color-btn-danger-hover-bg, #b62324) !important;
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
        <button type="submit" class="btn btn-primary btn-sm" id="ask-ai-submit">Send</button>
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
  var submitBtn = document.getElementById('ask-ai-submit') || (form && form.querySelector('button[type="submit"]'));
  var currentAbortController = null;

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

  function isScrollAtBottom(el, threshold) {
    if (!el) return true;
    threshold = typeof threshold === 'number' ? threshold : 60;
    var ch = typeof el.clientHeight === 'number' ? el.clientHeight : 0;
    var sh = typeof el.scrollHeight === 'number' ? el.scrollHeight : 0;
    var st = typeof el.scrollTop === 'number' ? el.scrollTop : 0;
    return (sh - st - ch) <= threshold;
  }

  function scrollToBottom(el) {
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  var scrollTimer = null;
  function ensureScrollBottom(el, wasAtBottom) {
    if (!el || wasAtBottom === false) return;
    scrollToBottom(el);
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(function () {
        if (isScrollAtBottom(el, 60)) {
          scrollToBottom(el);
        }
      });
    }
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      if (isScrollAtBottom(el, 60)) {
        scrollToBottom(el);
      }
    }, 50);
  }

  function appendMessage(sender, htmlContent, shouldSave, rawText) {
    var wasAtBottom = isScrollAtBottom(messagesEl, 60);
    var msgEl = document.createElement('div');
    msgEl.className = 'ask-ai-msg ask-ai-msg-' + sender;
    msgEl.innerHTML = htmlContent;
    messagesEl.appendChild(msgEl);
    if (sender === 'user' || wasAtBottom) {
      ensureScrollBottom(messagesEl, true);
    }
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

  function getAppRoot() {
    var p = window.location.pathname.replace(/index\\.html$/, '');
    var m = p.match(/^(.*?\\/)(?:tree|blob|commits|trends|mcp)(?:\\/|$)/);
    return m ? m[1] : (p.endsWith('/') ? p : (p + '/'));
  }

  function handleJump(hash) {
    if (!hash || !hash.startsWith('#')) return;

    if (hash.startsWith('#file=')) {
      var isCovPagesViewer = window.location.pathname.endsWith('/covpages/') ||
                             window.location.pathname.endsWith('/covpages/index.html');
      if (isCovPagesViewer) {
        window.location.hash = hash;
        toggleDrawer(false);
        return;
      }
      var isInsideCoverageSubfolder = window.location.pathname.includes('/covpages/covpages/') ||
                                     window.location.pathname.includes('/tree/') ||
                                     window.location.pathname.includes('/blob/') ||
                                     window.location.pathname.includes('/commits/') ||
                                     window.location.pathname.includes('/trends');
      var root = getAppRoot();
      var target = isInsideCoverageSubfolder ? (root + hash) : (root + 'covpages/' + hash);
      window.location.href = target;
      return;
    }

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
          if (targetUrl === 'mcp') {
            var root = getAppRoot();
            window.location.href = root + 'mcp';
            return;
          } else if (targetUrl === 'covpages/' || targetUrl === './covpages/') {
            var isInsideCoverage = window.location.pathname.includes('/covpages/covpages/') ||
                                   window.location.pathname.includes('/tree/') ||
                                   window.location.pathname.includes('/blob/') ||
                                   window.location.pathname.includes('/commits/') ||
                                   window.location.pathname.includes('/trends');
            var root = getAppRoot();
            window.location.href = isInsideCoverage ? root : (root + 'covpages/');
            return;
          }
          window.location.href = targetUrl;
        } else if (action.startsWith('jump:')) {
          handleJump(action.slice('jump:'.length));
        } else if (action === 'action:connect' || action.startsWith('action:connect')) {
          window.location.href = 'http://127.0.0.1:8788/admin/v1/open-dashboard?redirect=' + encodeURIComponent(window.location.href);
        } else if (action.startsWith('action:add-mcp')) {
          var addUrl = '';
          var query = action.split('?')[1];
          if (query) {
            var qParams = new URLSearchParams(query);
            addUrl = qParams.get('url') || '';
          }
          var dest = 'https://yongjhih.github.io/ai-proxy/dashboard.html' + (addUrl ? ('#add-url=' + encodeURIComponent(addUrl)) : '');
          window.open(dest, '_blank');
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
  async function ensureCoverageData() {
    if (typeof window !== 'undefined' && window.__COVPAGES_DATA__) {
      return window.__COVPAGES_DATA__;
    }

    var candidates = [
      'covpages-data.json',
      './covpages-data.json',
      './covpages/covpages-data.json',
      '../covpages-data.json',
      '../covpages/covpages-data.json'
    ];

    for (var i = 0; i < candidates.length; i++) {
      try {
        var res = await fetch(candidates[i]);
        if (res.ok) {
          var data = await res.json();
          if (data && data.files) {
            if (typeof window !== 'undefined') window.__COVPAGES_DATA__ = data;
            return data;
          }
        }
      } catch (err) {}
    }
    return null;
  }

  var PRESETS = ${JSON.stringify(FRAMEWORK_PRESETS)};

  // 11 Covpages WebMCP Tool Executors
  var toolExecutors = {
    get_cli_help: async function(args) {
      var cmd = args && args.command;
      var commands = {
        generate: 'covpages generate [options] [input-files...] - Generate coverage static site for GitHub Pages with multi-commit trends and badges.',
        dropin: 'covpages dropin [dir] - Generate zero-build drop-in static site (index.html + .nojekyll). Put in gh-pages, then simply copy lcov.info!',
        mcp: 'covpages mcp [dir] - Generate compliant MCP Page (mcp.html + web/ modules) for ai-proxy.',
        backfill: 'covpages backfill --range <range> --test-cmd <cmd> - Backfill test coverage across a range of historical git commits.',
        presets: 'covpages presets [framework] - View integration guides and workflows for mainstream frameworks (flutter, vitest, jest, rust, python, go, cpp).',
        docker: 'covpages docker <run|build|pull> [args...] - Run, build, or pull covpages inside a container (docker/podman).',
        serve: 'covpages serve [dir] [-p port] - Start a local preview web server.',
        init: 'covpages init [--framework <name>] [--docs] - Create a GitHub Actions workflow (.github/workflows/covpages.yml).'
      };
      if (cmd && cmd !== 'all' && commands[cmd]) {
        return {
          command: cmd,
          documentation: commands[cmd]
        };
      }
      return {
        usage: 'covpages [command] [options] [input-files...]',
        commands: commands,
        quickExamples: [
          'npx covpages dropin gh-pages && cp coverage/lcov.info gh-pages/',
          'npx covpages coverage/lcov.info --docs --save-raw',
          'npx covpages init --framework vitest --docs',
          'npx covpages backfill --range HEAD~5..HEAD --test-cmd "npm test"'
        ]
      };
    },
    get_framework_preset: async function(args) {
      var fw = (args && args.framework ? args.framework : '').toLowerCase().trim();
      var p = PRESETS[fw];
      if (!p) {
        return {
          error: 'Unknown framework preset: "' + fw + '". Available: ' + Object.keys(PRESETS).join(', '),
          availablePresets: Object.keys(PRESETS)
        };
      }
      var docs = args && args.docs !== false;
      var workflow = 'name: Test Coverage Pages\\n\\n' +
        'on:\\n  push:\\n    branches: [main, master]\\n  pull_request:\\n\\n' +
        'permissions:\\n  contents: write\\n  pages: write\\n  id-token: write\\n\\n' +
        'concurrency:\\n  group: "covpages"\\n  cancel-in-progress: false\\n\\n' +
        'jobs:\\n  coverage:\\n    runs-on: ubuntu-latest\\n    steps:\\n' +
        '      - uses: actions/checkout@v4\\n        with:\\n          fetch-depth: 0\\n\\n' +
        p.workflowStep + '\\n\\n' +
        '      - name: Generate covpages Report\\n        run: npx covpages ' + p.coverageFile + ' ' + (docs ? '--docs' : '--output gh-pages') + ' --save-raw --mcp\\n\\n' +
        '      - name: Deploy to GitHub Pages\\n        uses: peaceiris/actions-gh-pages@v4\\n        if: github.ref == \\'refs/heads/main\\' || github.ref == \\'refs/heads/master\\'\\n        with:\\n          github_token: ' + "${'\\x24{{ secrets.GITHUB_TOKEN }}'}" + '\\n          publish_dir: ' + (docs ? './docs/covpages' : './gh-pages') + '\\n';
      return {
        framework: p.name,
        language: p.language,
        testCommand: p.testCmd,
        coverageFile: p.coverageFile,
        description: p.description,
        recommendedWorkflowPath: '.github/workflows/covpages.yml',
        workflow: workflow
      };
    },
    consult_setup: async function(args) {
      args = args || {};
      if (args.zeroBuild) {
        return {
          recommendedMode: 'zero-build-dropin',
          summary: "Zero-build drop-in mode is ideal for environments where you don\\'t want to run Node.js in CI.",
          steps: [
            '1. Run "npx covpages dropin gh-pages" to create the static viewer.',
            '2. In your CI, simply produce your coverage report (lcov.info) and copy it into gh-pages/.',
            '3. Push gh-pages branch. The browser client parses and renders lcov.info dynamically at runtime!'
          ],
          command: 'npx covpages dropin gh-pages'
        };
      }
      if (args.hasExistingCommits) {
        return {
          recommendedMode: 'backfill-history',
          summary: 'Commit backfill mode executes historical commits in a git revision range to generate trendlines.',
          command: 'npx covpages backfill --range HEAD~10..HEAD --test-cmd "npm test" --docs',
          description: 'Runs your test suite across recent commits to populate multi-commit trends and store packed git objects.'
        };
      }
      var matchedFramework = args.framework || args.language || 'vitest';
      return {
        recommendedMode: 'github-actions-workflow',
        summary: 'GitHub Actions automated publishing with multi-commit trends and scoped badges.',
        quickCommand: 'npx covpages init --framework ' + matchedFramework + ' --docs',
        workflowFile: '.github/workflows/covpages.yml',
        features: [
          'Git packfile delta compression (100 commits compress into ~1.24 MB)',
          'Scoped SVG badges for every branch, directory, and file',
          'Built-in WebMCP endpoint (mcp.html + web/*.mjs) for ai-proxy'
        ]
      };
    },
    get_documentation: async function(args) {
      var topic = (args && args.topic) || 'overview';
      var bt = '\\x60';
      var docsMap = {
        overview: '# Covpages\\n\\nGit-Native Code Coverage for GitHub Pages with multi-commit trends, scoped SVG badges, syntax highlighting, and client-side WebMCP endpoints.',
        quickstart: '## Quickstart\\n\\n1. Run tests with coverage: ' + bt + 'npm test -- --coverage' + bt + '\\n2. Generate site: ' + bt + 'npx covpages coverage/lcov.info --docs --save-raw' + bt + '\\n3. Deploy ' + bt + 'docs/' + bt + ' to GitHub Pages.',
        dropin: '## Zero-Build Drop-in Mode\\n\\nPut ' + bt + 'index.html' + bt + ' in ' + bt + 'gh-pages' + bt + ', then just copy ' + bt + 'lcov.info' + bt + '. The browser parses LCOV at runtime!',
        backfill: '## Backfill Commits\\n\\nRun ' + bt + 'npx covpages backfill --range HEAD~10..HEAD' + bt + ' to backfill trend points across historical commits.',
        badges: '## Scoped SVG Badges\\n\\nCovpages generates badges into ' + bt + 'badges/' + bt + ' for repository, branch, directories, and files.',
        react: '## React & Component Integration\\n\\nUse ' + bt + 'import { Covpages } from "covpages/react";' + bt + ' to embed interactive coverage charts into Next.js or Docusaurus.',
        mcp: '## WebMCP & ai-proxy\\n\\nTurns any static GitHub Pages site into an MCP server via ' + bt + 'mcp.html' + bt + ' and vendored ' + bt + 'web/*.mjs' + bt + ' client modules.'
      };
      return {
        topic: topic,
        content: docsMap[topic] || docsMap.overview
      };
    },
    navigate_to: async function(args) {
      var target = (args && args.target) || 'live_demo';
      var targets = {
        live_demo: './covpages/',
        coverage_mcp: './covpages/mcp',
        badges: './#badges',
        quickstart: './#quickstart',
        github_repo: 'https://github.com/yongjhih/covpages'
      };
      var dest = targets[target] || './';
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = dest;
      }
      return { target: target, navigatedTo: dest };
    },
    find_high_value_targets: async function(args) {
      var covData = await ensureCoverageData();
      if (!covData || !covData.files || !covData.summary) {
        throw new Error('Coverage data file could not be loaded.');
      }
      var limit = (args && args.limit) || 5;
      var repoTotal = covData.summary.lines.total;
      var repoCovered = covData.summary.lines.covered;
      var curLinesPct = covData.summary.lines.pct;

      var files = Object.values(covData.files);
      if (args && args.folder) {
        var prefix = args.folder.endsWith('/') ? args.folder : args.folder + '/';
        files = files.filter(function(f) { return f.path.startsWith(prefix) || f.path === args.folder; });
      }

      var ranked = files.map(function(f) {
        var uncovered = f.lines.total - f.lines.covered;
        var gain = repoTotal > 0 ? (uncovered / repoTotal) * 100 : 0;
        var proj = repoTotal > 0 ? ((repoCovered + uncovered) / repoTotal) * 100 : 0;
        return {
          path: f.path,
          currentCoveragePct: f.lines.pct,
          uncoveredLines: uncovered,
          totalLines: f.lines.total,
          potentialGainPct: Number(gain.toFixed(2)),
          projectedRepoCoveragePct: Number(proj.toFixed(2)),
          recommendation: 'Covering ' + f.path + ' (currently ' + f.lines.pct.toFixed(1) + '%, ' + uncovered + ' uncovered lines) will increase overall repo coverage by +' + gain.toFixed(2) + '% (from ' + curLinesPct.toFixed(2) + '% to ' + proj.toFixed(2) + '%).'
        };
      }).sort(function(a, b) { return b.uncoveredLines - a.uncoveredLines; });

      return {
        repoSummary: {
          currentLinesPct: curLinesPct,
          coveredLines: repoCovered,
          totalLines: repoTotal,
          deltaVsPrevious: covData.delta ? covData.delta.linesPct : null
        },
        totalEvaluated: files.length,
        targets: ranked.slice(0, limit)
      };
    },
    get_coverage_summary: async function() {
      var covData = await ensureCoverageData();
      if (!covData || !covData.summary) {
        throw new Error('Coverage data file could not be loaded.');
      }
      return {
        repoName: covData.repoName || 'yongjhih/covpages',
        generatedAt: covData.generatedAt,
        currentCommit: covData.currentCommit,
        previousCommit: covData.previousCommit || null,
        summary: covData.summary,
        delta: covData.delta || null
      };
    },
    list_coverage_files: async function(args) {
      var covData = await ensureCoverageData();
      if (!covData || !covData.files) {
        throw new Error('Coverage data file could not be loaded.');
      }
      var files = Object.values(covData.files);
      var limit = (args && args.limit) || 20;
      files.sort(function(a, b) { return a.lines.pct - b.lines.pct; });
      return {
        totalFiles: files.length,
        files: files.slice(0, limit).map(function(f) {
          return { path: f.path, linesPct: f.lines.pct, uncovered: f.lines.total - f.lines.covered };
        })
      };
    },
    get_file_coverage: async function(args) {
      var covData = await ensureCoverageData();
      if (!covData || !covData.files) {
        throw new Error('Coverage data file could not be loaded.');
      }
      var p = args && args.path;
      var file = covData.files[p] || Object.values(covData.files).find(function(f) { return f.path === p || f.path.endsWith('/' + p); });
      if (!file) throw new Error('File not found in coverage report: ' + p);
      return {
        path: file.path,
        lines: file.lines,
        functions: file.functions,
        branches: file.branches,
        uncoveredLinesCount: file.lines.total - file.lines.covered
      };
    },
    get_coverage_trends: async function(args) {
      var covData = await ensureCoverageData();
      if (!covData || !covData.commits) {
        throw new Error('Coverage trends data not available.');
      }
      var limit = (args && args.limit) || 10;
      var commits = covData.commits.slice(-limit).map(function(c) {
        return {
          sha: c.commit ? c.commit.sha : '',
          shortSha: c.commit ? (c.commit.shortSha || c.commit.sha.slice(0, 7)) : '',
          message: c.commit ? c.commit.message : '',
          date: c.commit ? c.commit.date : '',
          linesPct: c.summary ? c.summary.lines.pct : 0
        };
      });
      return { totalCommits: covData.commits.length, trends: commits };
    },
    get_badge_code: async function(args) {
      var covData = await ensureCoverageData();
      var pct = covData && covData.summary ? covData.summary.lines.pct : 100;
      return {
        scope: (args && args.scope) || 'overall',
        coveragePct: pct,
        badgeFile: 'badges/overall.svg',
        badgeUrl: 'https://yongjhih.github.io/covpages/badges/overall.svg',
        markdown: '[![Coverage](https://yongjhih.github.io/covpages/badges/overall.svg)](https://yongjhih.github.io/covpages/covpages/)',
        html: '<a href="https://yongjhih.github.io/covpages/covpages/"><img src="https://yongjhih.github.io/covpages/badges/overall.svg" alt="Coverage" /></a>'
      };
    }
  };

  // Self-register modelContext if not present
  if (typeof navigator !== 'undefined') {
    if (!navigator.modelContext) {
      var toolsMap = new Map();
      for (var tk in toolExecutors) {
        toolsMap.set(tk, {
          name: tk,
          execute: toolExecutors[tk]
        });
      }
      navigator.modelContext = {
        registerTool: function(t) { toolsMap.set(t.name, t); },
        getTool: function(n) { return toolsMap.get(n) || null; },
        listTools: function() { return Array.from(toolsMap.values()); },
        callTool: async function(n, args) {
          var t = toolsMap.get(n);
          if (!t) throw new Error('Tool not found: ' + n);
          return await t.execute(args);
        }
      };
    } else {
      for (var tk2 in toolExecutors) {
        if (!navigator.modelContext.getTool(tk2)) {
          navigator.modelContext.registerTool({
            name: tk2,
            description: 'Covpages WebMCP tool: ' + tk2,
            execute: toolExecutors[tk2]
          });
        }
      }
    }
  }

  async function callWebMcp(toolName, args) {
    if (typeof navigator !== 'undefined' && navigator.modelContext && typeof navigator.modelContext.callTool === 'function') {
      try {
        var tool = navigator.modelContext.getTool(toolName);
        if (tool) {
          return await navigator.modelContext.callTool(toolName, args);
        }
      } catch (err) {}
    }
    var fn = toolExecutors[toolName];
    if (fn) {
      return await fn(args);
    }
    throw new Error('Unknown tool: ' + toolName);
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

    // Show animated thinking placeholder
    var typingEl = document.createElement('div');
    typingEl.className = 'ask-ai-msg ask-ai-msg-assistant';
    typingEl.innerHTML = [
      '<div class="ask-ai-thinking">',
      '  <span class="ask-ai-thinking-spinner"></span>',
      '  <span>Thinking<span class="ask-ai-thinking-dots"><span>.</span><span>.</span><span>.</span></span></span>',
      '</div>'
    ].join('');
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    function updateTypingContent(html, rawText) {
      var isAtBottomNow = typeof isScrollAtBottom === 'function' ? isScrollAtBottom(messagesEl, 60) : true;
      typingEl.innerHTML = html;
      bindActions(typingEl);
      if (isAtBottomNow) {
        if (typeof ensureScrollBottom === 'function') {
          ensureScrollBottom(messagesEl, true);
        } else {
          messagesEl.scrollTop = messagesEl.scrollHeight;
        }
      }
      var imgs = typingEl.querySelectorAll('img');
      for (var m = 0; m < imgs.length; m++) {
        if (!imgs[m].complete) {
          imgs[m].addEventListener('load', function () {
            if (isAtBottomNow) {
              if (typeof ensureScrollBottom === 'function') {
                ensureScrollBottom(messagesEl, true);
              } else {
                messagesEl.scrollTop = messagesEl.scrollHeight;
              }
            }
          });
        }
      }
      conversationHistory.push({
        role: 'assistant',
        html: html,
        text: rawText || html.replace(/<[^>]+>/g, ' ').trim()
      });
      saveHistory();
    }

    var activeAbortCtrl = typeof AbortController === 'function' ? new AbortController() : null;
    try {
      if (typeof currentAbortController !== 'undefined') {
        currentAbortController = activeAbortCtrl;
      }
    } catch (_) {}
    var activeSubmitBtn = typeof submitBtn !== 'undefined' ? submitBtn : null;
    if (activeSubmitBtn) {
      activeSubmitBtn.textContent = '■ Stop';
      activeSubmitBtn.classList.add('btn-danger');
      activeSubmitBtn.classList.remove('btn-primary');
    }

    // 1. Try local ai-proxy /v1/chat/completions relay
    var relaySuccess = false;
    var customEndpoint = '';
    try {
      if (window.localStorage) customEndpoint = window.localStorage.getItem('ai_proxy_endpoint') || '';
    } catch (e) {}
    var endpoint = (customEndpoint || 'http://127.0.0.1:8788').replace(/\\/+$/, '');

    try {
      var promptMessages = [
        {
          role: 'system',
          content: 'You are the Covpages Assistant. Covpages is a git-native test coverage reporting tool for GitHub Pages with multi-commit trends, scoped badges, and zero backend required. Answer questions helpfully and concisely using markdown formatting and action buttons when relevant.'
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

      var relayRes = await fetch(endpoint + '/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'local-default',
          messages: promptMessages
        }),
        signal: activeAbortCtrl ? activeAbortCtrl.signal : undefined
      });

      if (relayRes.ok) {
        var replyData = await relayRes.json();
        var replyText = replyData && replyData.choices && replyData.choices[0] && replyData.choices[0].message && replyData.choices[0].message.content;
        if (replyText) {
          var isFallbackEcho = replyText.indexOf('ai-proxy local assistant received:') !== -1 ||
                               replyText.indexOf('Permitted read-only tools: [none]') !== -1;
          if (!isFallbackEcho) {
            var formatted = formatMarkdown(replyText);
            updateTypingContent(formatted, replyText);
            if (statusPill) {
              statusPill.textContent = 'ai-proxy /v1 Connected';
              statusPill.setAttribute('data-connected', 'true');
            }
            relaySuccess = true;
          } else {
            if (statusPill) {
              statusPill.textContent = 'ai-proxy Ready (WebMCP Tools)';
              statusPill.setAttribute('data-connected', 'true');
            }
          }
        }
      } else {
        var errJson = await relayRes.json().catch(function () { return null; });
        var errMsg = (errJson && errJson.error && (errJson.error.message || errJson.error)) || ('HTTP ' + relayRes.status);
        console.warn('[Covpages AI] Relay returned non-200:', errMsg);
      }
    } catch (e) {
      if (activeAbortCtrl && activeAbortCtrl.signal && activeAbortCtrl.signal.aborted) {
        updateTypingContent('<p>⏹️ <em>Thinking stopped.</em></p>', '⏹️ Thinking stopped.');
        return;
      }
      console.warn('[Covpages AI] Failed to fetch /v1/chat/completions:', e);
    } finally {
      try {
        if (typeof currentAbortController !== 'undefined') {
          currentAbortController = null;
        }
      } catch (_) {}
      if (activeSubmitBtn) {
        activeSubmitBtn.textContent = 'Send';
        activeSubmitBtn.classList.remove('btn-danger');
        activeSubmitBtn.classList.add('btn-primary');
      }
    }

    if (relaySuccess) return;

    // 2. Intelligent Client-Side WebMCP Tool Dispatch Engine
    var lower = text.toLowerCase();
    var replyHtml = '';

    try {
      if (/(?:cli|help|commands?|options?|usage|參數|指令|用法|幫助|說明書)/i.test(lower) ||
          /(?:generate|dropin|backfill|docker|init|serve|presets)/i.test(lower)) {
        var subCmd = 'all';
        if (lower.includes('generate')) subCmd = 'generate';
        else if (lower.includes('dropin') || lower.includes('drop-in') || lower.includes('zero-build')) subCmd = 'dropin';
        else if (lower.includes('mcp')) subCmd = 'mcp';
        else if (lower.includes('backfill')) subCmd = 'backfill';
        else if (lower.includes('presets') || lower.includes('preset')) subCmd = 'presets';
        else if (lower.includes('docker')) subCmd = 'docker';
        else if (lower.includes('serve')) subCmd = 'serve';
        else if (lower.includes('init')) subCmd = 'init';

        var cliRes = await callWebMcp('get_cli_help', { command: subCmd });
        replyHtml = '<p>🛠️ <strong>WebMCP Tool Invoked:</strong> <code>get_cli_help(' + (cliRes.command ? '"' + escapeHtml(cliRes.command) + '"' : '') + ')</code></p>';
        if (cliRes.documentation) {
          replyHtml += '<p><strong>Command Reference:</strong></p>' +
            '<pre><code>' + escapeHtml(cliRes.documentation) + '</code></pre>';
        } else {
          replyHtml += '<p><strong>Usage:</strong> <code>' + escapeHtml(cliRes.usage) + '</code></p>' +
            '<p><strong>Available Commands:</strong></p>' +
            '<ul>' +
            '<li><code>generate</code>: ' + escapeHtml(cliRes.commands.generate) + '</li>' +
            '<li><code>dropin</code>: ' + escapeHtml(cliRes.commands.dropin) + '</li>' +
            '<li><code>mcp</code>: ' + escapeHtml(cliRes.commands.mcp) + '</li>' +
            '<li><code>backfill</code>: ' + escapeHtml(cliRes.commands.backfill) + '</li>' +
            '<li><code>presets</code>: ' + escapeHtml(cliRes.commands.presets) + '</li>' +
            '<li><code>docker</code>: ' + escapeHtml(cliRes.commands.docker) + '</li>' +
            '<li><code>init</code>: ' + escapeHtml(cliRes.commands.init) + '</li>' +
            '<li><code>serve</code>: ' + escapeHtml(cliRes.commands.serve) + '</li>' +
            '</ul>' +
            '<p><strong>Quick Examples:</strong></p>' +
            '<pre><code>' + escapeHtml(cliRes.quickExamples.join('\\n')) + '</code></pre>';
        }
        replyHtml += '<p><button type="button" class="btn btn-sm btn-primary ask-ai-cta-btn" data-action="navigate:mcp?tool=get_cli_help">Open in WebMCP Catalog (?tool=get_cli_help)</button></p>';
      } else if (/(?:high-value|target|roi|價值|提升|priorit|uncovered|最具價值|最有價值|最值得|目標)/i.test(lower)) {
        var targetRes = await callWebMcp('find_high_value_targets', { limit: 5 });
        replyHtml = '<p>🛠️ <strong>WebMCP Tool Invoked:</strong> <code>find_high_value_targets(limit: 5)</code></p>' +
          '<p>🎯 <strong>Highest Value Targets to Improve Coverage:</strong></p>' +
          '<p>Overall repo line coverage is currently <strong>' + targetRes.repoSummary.currentLinesPct.toFixed(2) + '%</strong> (' + targetRes.repoSummary.coveredLines + '/' + targetRes.repoSummary.totalLines + ' lines). Here are top files where adding tests yields the greatest gain:</p>' +
          '<ul class="ask-ai-actions-list">';

        targetRes.targets.forEach(function (t) {
          replyHtml += '<li>' +
            '<button type="button" class="btn btn-sm ask-ai-jump-btn" data-jump="#file=' + encodeURIComponent(t.path) + '" style="display:flex; flex-direction:column; align-items:flex-start; width:100%; padding:8px 12px; gap:4px; text-align:left;">' +
              '<div style="display:flex; align-items:center; justify-content:space-between; width:100%;">' +
                '<code>' + escapeHtml(t.path) + '</code>' +
                '<span class="badge" style="font-weight:600;">' + t.currentCoveragePct.toFixed(1) + '%</span>' +
              '</div>' +
              '<div style="font-size:11px; color:var(--color-fg-muted, #656d76);">' +
                t.uncoveredLines + ' uncovered lines &middot; <strong>+' + t.potentialGainPct.toFixed(2) + '%</strong> repo gain (up to ' + t.projectedRepoCoveragePct.toFixed(2) + '%)' +
              '</div>' +
            '</button>' +
          '</li>';
        });

        replyHtml += '</ul>' +
          '<p><button type="button" class="btn btn-sm btn-primary ask-ai-cta-btn" data-action="navigate:covpages/mcp?tool=find_high_value_targets">Open in WebMCP Catalog (?tool=find_high_value_targets)</button></p>';
      } else if (/(?:flutter|dart|vitest|vite|jest|rust|cargo|python|pytest|golang|go|cpp|preset|框架)/i.test(lower) || lower.includes('c++')) {
        var fw = 'vitest';
        if (lower.includes('flutter')) fw = 'flutter';
        else if (lower.includes('dart')) fw = 'dart';
        else if (lower.includes('jest')) fw = 'jest';
        else if (lower.includes('rust') || lower.includes('cargo')) fw = 'rust';
        else if (lower.includes('python') || lower.includes('pytest')) fw = 'python';
        else if (lower.includes('go') || lower.includes('golang')) fw = 'go';
        else if (lower.includes('cpp') || lower.includes('c++') || lower.includes('gcov')) fw = 'cpp';
        else if (lower.includes('vitest') || lower.includes('vite')) fw = 'vitest';

        var presetRes = await callWebMcp('get_framework_preset', { framework: fw, docs: true });
        replyHtml = '<p>🛠️ <strong>WebMCP Tool Invoked:</strong> <code>get_framework_preset(framework: "' + escapeHtml(fw) + '")</code></p>' +
          '<p>⚡ <strong>' + escapeHtml(presetRes.framework) + ' Integration Preset:</strong></p>' +
          '<p><strong>Test Command:</strong> <code>' + escapeHtml(presetRes.testCommand) + '</code></p>' +
          '<p><strong>Coverage File:</strong> <code>' + escapeHtml(presetRes.coverageFile) + '</code></p>' +
          '<p><strong>GitHub Actions Workflow (<code>' + escapeHtml(presetRes.recommendedWorkflowPath) + '</code>):</strong></p>' +
          '<pre><code>' + escapeHtml(presetRes.workflow) + '</code></pre>' +
          '<p><button type="button" class="btn btn-sm btn-primary ask-ai-cta-btn" data-action="navigate:mcp?tool=get_framework_preset&framework=' + encodeURIComponent(fw) + '">Open in WebMCP Catalog</button></p>';
      } else if (/(?:summary|delta|總覽|覆蓋率總結|current coverage|指標|metrics)/i.test(lower)) {
        var summaryRes = await callWebMcp('get_coverage_summary', {});
        var s = summaryRes.summary;
        var d = summaryRes.delta;
        var deltaStr = d ? (' (' + (d.linesPct >= 0 ? '+' : '') + d.linesPct + '% vs previous)') : '';
        replyHtml = '<p>🛠️ <strong>WebMCP Tool Invoked:</strong> <code>get_coverage_summary</code></p>' +
          '<p>📊 <strong>Current Coverage Metrics:</strong></p>' +
          '<ul>' +
          '<li><strong>Lines:</strong> ' + s.lines.pct + '% (' + s.lines.covered + '/' + s.lines.total + ')' + deltaStr + '</li>' +
          '<li><strong>Functions:</strong> ' + s.functions.pct + '% (' + s.functions.covered + '/' + s.functions.total + ')</li>' +
          '<li><strong>Branches:</strong> ' + s.branches.pct + '% (' + s.branches.covered + '/' + s.branches.total + ')</li>' +
          '</ul>' +
          '<p><button type="button" class="btn btn-sm btn-primary ask-ai-cta-btn" data-action="navigate:covpages/">Open Live Coverage Viewer</button></p>';
      } else if (/(?:trend|trends|history|歷史|趨勢|commits?|走勢|進展)/i.test(lower)) {
        var trendsRes = await callWebMcp('get_coverage_trends', { limit: 5 });
        replyHtml = '<p>🛠️ <strong>WebMCP Tool Invoked:</strong> <code>get_coverage_trends(limit: 5)</code></p>' +
          '<p>📈 <strong>Recent Coverage Trends across Commits:</strong></p>' +
          '<ul>';
        trendsRes.trends.forEach(function (c) {
          replyHtml += '<li><code>' + escapeHtml(c.shortSha) + '</code>: <strong>' + c.linesPct + '%</strong> - ' + escapeHtml(c.message) + ' (' + escapeHtml(c.date) + ')</li>';
        });
        replyHtml += '</ul>' +
          '<p><button type="button" class="btn btn-sm btn-primary ask-ai-cta-btn" data-action="navigate:covpages/#trend">View Interactive Trendline</button></p>';
      } else if (/(?:setup|advisor|consult|如何配置|配置|安裝|架設|模式|哪個模式|模式選擇)/i.test(lower)) {
        var setupRes = await callWebMcp('consult_setup', {
          zeroBuild: lower.includes('zero') || lower.includes('drop'),
          hasExistingCommits: lower.includes('backfill') || lower.includes('commit') || lower.includes('history')
        });
        replyHtml = '<p>🛠️ <strong>WebMCP Tool Invoked:</strong> <code>consult_setup</code></p>' +
          '<p>🚀 <strong>Recommended Deployment Mode:</strong> <code>' + escapeHtml(setupRes.recommendedMode) + '</code></p>' +
          '<p>' + escapeHtml(setupRes.summary) + '</p>' +
          (setupRes.quickCommand ? '<pre><code>' + escapeHtml(setupRes.quickCommand) + '</code></pre>' : '') +
          (setupRes.command ? '<pre><code>' + escapeHtml(setupRes.command) + '</code></pre>' : '') +
          '<p><button type="button" class="btn btn-sm btn-primary ask-ai-cta-btn" data-action="navigate:mcp?tool=consult_setup">Open in WebMCP Catalog</button></p>';
      } else if (/(?:badge|badges|徽章|svg badge|shield)/i.test(lower)) {
        var badgeRes = await callWebMcp('get_badge_code', { scope: 'overall' });
        replyHtml = '<p>🛠️ <strong>WebMCP Tool Invoked:</strong> <code>get_badge_code</code></p>' +
          '<p>🏷️ <strong>Scoped SVG Badge Code:</strong></p>' +
          '<p>Markdown:</p>' +
          '<pre><code>' + escapeHtml(badgeRes.markdown) + '</code></pre>' +
          '<p>HTML:</p>' +
          '<pre><code>' + escapeHtml(badgeRes.html) + '</code></pre>' +
          '<p><button type="button" class="btn btn-sm ask-ai-cta-btn" data-action="jump:#badges">Open Badge Generator</button></p>';
      } else if (/(?:doc|docs|documentation|文件|說明)/i.test(lower)) {
        var docRes = await callWebMcp('get_documentation', { topic: 'overview' });
        replyHtml = '<p>🛠️ <strong>WebMCP Tool Invoked:</strong> <code>get_documentation</code></p>' +
          formatMarkdown(docRes.content);
      } else if (/(?:navigate|jump|go to|前往|打開|跳轉|demo|live)/i.test(lower)) {
        replyHtml = '<p>🛠️ <strong>WebMCP Tool Invoked:</strong> <code>navigate_to(target: "live_demo")</code></p>' +
          '<p>Click below to jump directly to the live coverage report:</p>' +
          '<p><button type="button" class="btn btn-sm btn-primary ask-ai-cta-btn" data-action="navigate:covpages/">Open Live Coverage Demo</button></p>';
      } else if (/(?:mcp|ai-proxy|register|註冊|連接)/i.test(lower)) {
        var isCov = window.location.pathname.includes('/covpages/');
        var targetPath = isCov ? 'covpages/covpages/mcp' : 'covpages/mcp';
        var siteSlug = isCov ? 'covpages-covpages' : 'covpages';
        replyHtml = '<p>🔌 <strong>Register WebMCP Endpoint:</strong></p>' +
          '<p>Add this site to your local <code>ai-proxy</code> relay server:</p>' +
          '<pre><code>npx ai-proxy add https://yongjhih.github.io/' + targetPath + ' --name ' + siteSlug + '</code></pre>' +
          '<p style="display:flex;gap:0.5rem;flex-wrap:wrap;">' +
          '<button type="button" class="btn btn-sm btn-primary ask-ai-cta-btn" data-action="action:add-mcp?url=' + encodeURIComponent('https://yongjhih.github.io/' + targetPath) + '&name=' + encodeURIComponent(siteSlug) + '">➕ 一鍵新增到 local ai-proxy</button>' +
          '<button type="button" class="btn btn-sm ask-ai-cta-btn" data-action="navigate:mcp">View MCP Tools Catalog</button>' +
          '</p>';
      } else {
        replyHtml = '<p>🛠️ <strong>WebMCP Tools Ready (11 Tools Registered)</strong></p>' +
          '<p>Ask me a question or click a tool to run it directly:</p>' +
          '<div class="ask-ai-chips">' +
            '<button type="button" class="ask-ai-chip" data-ask="covpages cli help">🛠️ get_cli_help</button>' +
            '<button type="button" class="ask-ai-chip" data-ask="Find high-value coverage targets">🎯 find_high_value_targets</button>' +
            '<button type="button" class="ask-ai-chip" data-ask="Vitest framework preset">⚡ get_framework_preset</button>' +
            '<button type="button" class="ask-ai-chip" data-ask="Coverage summary and metrics">📊 get_coverage_summary</button>' +
            '<button type="button" class="ask-ai-chip" data-ask="Multi-commit coverage trends">📈 get_coverage_trends</button>' +
            '<button type="button" class="ask-ai-chip" data-ask="Generate SVG badge">🏷️ get_badge_code</button>' +
            '<button type="button" class="ask-ai-chip" data-ask="Setup advisor and modes">🚀 consult_setup</button>' +
          '</div>';
      }
    } catch (toolErr) {
      replyHtml = '<p>⚠️ Error executing WebMCP tool: ' + escapeHtml(toolErr && toolErr.message ? toolErr.message : String(toolErr)) + '</p>' +
        '<p>You can also query tools directly on the <a href="mcp">MCP Tools Catalog</a> page.</p>';
    }

    updateTypingContent(replyHtml);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (currentAbortController) {
        currentAbortController.abort();
        return;
      }
      var val = input.value;
      if (val) handleUserQuery(val);
    });
  }

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && currentAbortController) {
        currentAbortController.abort();
      }
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
