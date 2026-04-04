export const APP_JS = `
(function() {
  'use strict';

  // Read data from window.__COVPAGES_DATA__ or fetch dynamically
  let data = window.__COVPAGES_DATA__ || null;

  // Icons map passed from backend with resilient fallbacks
  const icons = Object.assign({
    github: '<svg height="20" aria-hidden="true" viewBox="0 0 16 16" width="20" fill="currentColor"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>',
    branch: '<svg height="16" aria-hidden="true" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"></path></svg>',
    tag: '<svg height="16" aria-hidden="true" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>',
    check: '<svg height="16" aria-hidden="true" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>',
    commit: '<svg height="16" aria-hidden="true" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path></svg>',
    folder: '<svg height="16" aria-hidden="true" viewBox="0 0 16 16" width="16" fill="#54aeff"><path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z"></path></svg>',
    file: '<svg height="16" aria-hidden="true" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l3.914 3.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0 1 14.25 16h-10.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V6H10.75A1.75 1.75 0 0 1 9 4.25V1.5Zm7.75.56v2.69c0 .138.112.25.25.25h2.69Z"></path></svg>',
    search: '<svg height="16" aria-hidden="true" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="m10.68 11.745 4.035 4.034a.75.75 0 1 0 1.06-1.06l-4.034-4.035a6.5 6.5 0 1 0-1.06 1.06Zm-4.18 1.255a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"></path></svg>',
    chevronRight: '<svg height="14" aria-hidden="true" viewBox="0 0 16 16" width="14" fill="currentColor"><path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 5.72 4.28a.75.75 0 0 1 0-1.06Z"></path></svg>',
    chevronDown: '<svg height="14" aria-hidden="true" viewBox="0 0 16 16" width="14" fill="currentColor"><path d="M12.78 5.22a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.06 0L3.22 6.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L8 8.94l3.72-3.72a.75.75 0 0 1 1.06 0Z"></path></svg>',
    sidebar: '<svg height="16" aria-hidden="true" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H5v-13Zm4.75 0v13h7.75a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Z"></path></svg>',
    x: '<svg height="14" aria-hidden="true" viewBox="0 0 16 16" width="14" fill="currentColor"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path></svg>',
  }, window.__COVPAGES_ICONS__ || {});

  // Application State
  const state = {
    activeTab: 'files', // 'files' | 'trends' | 'commits'
    currentFolder: '',
    selectedFile: null,
    selectedCommitSha: '',
    activeRefType: 'branch', // 'branch' | 'tag'
    activeRefName: '',
    refPopoverOpen: false,
    refSearchText: '',
    refActiveTab: 'branches', // 'branches' | 'tags'
    trendScope: 'overall', // 'overall' | 'folder' | 'file'
    trendTarget: '',
    trendMetric: 'linesPct', // 'linesPct' | 'functionsPct' | 'branchesPct'
    filterText: '',
    gotoFilterText: '',
    gotoActiveIndex: 0,
    sortColumn: 'name',
    sortAsc: true,
    theme: localStorage.getItem('covpages-theme') || 'auto',
    sidebarVisible: localStorage.getItem('covpages-sidebar') !== 'false',
    expandedFolders: new Set(['']),
  };

  let activeView = null;

  function ensureExpanded(filePath) {
    if (!filePath) return;
    const parts = filePath.split('/');
    let cur = '';
    state.expandedFolders.add('');
    for (let i = 0; i < parts.length - 1; i++) {
      cur = cur ? cur + '/' + parts[i] : parts[i];
      state.expandedFolders.add(cur);
    }
  }

  function getAvailableRefs() {
    const branches = {};
    const tags = {};

    if (data?.refs) {
      if (data.refs.branches) Object.assign(branches, data.refs.branches);
      if (data.refs.tags) Object.assign(tags, data.refs.tags);
    }

    if (Array.isArray(data?.commits)) {
      for (const c of data.commits) {
        const info = c.commit;
        if (info?.branch && !branches[info.branch]) branches[info.branch] = info.sha;
        if (info?.tag && !tags[info.tag]) tags[info.tag] = info.sha;
      }
    }

    if (Object.keys(branches).length === 0) {
      const b = data?.currentCommit?.branch || 'main';
      branches[b] = data?.currentCommit?.sha || 'HEAD';
    }

    return { branches, tags };
  }

  function getBasePath() {
    if (data?.baseUrl) return data.baseUrl.replace(/\/$/, '') + '/';
    if (window.location.protocol === 'file:') return '';
    const p = window.location.pathname;
    const clean = p.replace(/\/index\.html$/, '');
    const segments = clean.split('/').filter(Boolean);
    if (segments.length > 0) {
      if (segments[0] === 'covpages' || window.location.hostname.endsWith('github.io')) {
        return '/' + segments[0] + '/';
      }
    }
    return '/';
  }

  function sanitizeBadgeName(name) {
    return (name || '').replace(/[/\\?%*:|"<>]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  function generateClientBadgeSvg(pct, label) {
    label = label || 'coverage';
    const roundedPct = Math.round(pct * 10) / 10;
    const pctStr = roundedPct + '%';
    let color = '#2da44e';
    if (pct < 50) color = '#cf222e';
    else if (pct < 80) color = '#bf8700';

    const labelWidth = Math.round(label.length * 6.5 + 16);
    const valueWidth = Math.round(pctStr.length * 7.5 + 16);
    const totalWidth = labelWidth + valueWidth;
    const labelTextX = Math.round((labelWidth / 2) * 10);
    const valueTextX = Math.round((labelWidth + valueWidth / 2) * 10);

    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + totalWidth + '" height="20" role="img" aria-label="' + escapeHtml(label) + ': ' + pctStr + '">' +
      '<title>' + escapeHtml(label) + ': ' + pctStr + '</title>' +
      '<linearGradient id="cov-g" x2="0" y2="100%">' +
        '<stop offset="0" stop-color="#bbb" stop-opacity=".1"/>' +
        '<stop offset="1" stop-opacity=".1"/>' +
      '</linearGradient>' +
      '<clipPath id="cov-r">' +
        '<rect width="' + totalWidth + '" height="20" rx="3" fill="#fff"/>' +
      '</clipPath>' +
      '<g clip-path="url(#cov-r)">' +
        '<rect width="' + labelWidth + '" height="20" fill="#555"/>' +
        '<rect x="' + labelWidth + '" width="' + valueWidth + '" height="20" fill="' + color + '"/>' +
        '<rect width="' + totalWidth + '" height="20" fill="url(#cov-g)"/>' +
      '</g>' +
      '<g fill="#fff" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" text-rendering="geometricPrecision" font-size="110">' +
        '<text aria-hidden="true" x="' + labelTextX + '" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">' + escapeHtml(label) + '</text>' +
        '<text x="' + labelTextX + '" y="140" transform="scale(.1)" fill="#fff">' + escapeHtml(label) + '</text>' +
        '<text aria-hidden="true" x="' + valueTextX + '" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">' + pctStr + '</text>' +
        '<text x="' + valueTextX + '" y="140" transform="scale(.1)" fill="#fff">' + pctStr + '</text>' +
      '</g>' +
    '</svg>';
  }

  function showToast(msg) {
    let toast = document.getElementById('gh-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gh-toast';
      toast.className = 'gh-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<span class="gh-toast-icon">' + (icons.check || '✓') + '</span><span>' + escapeHtml(msg) + '</span>';
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function openBadgeModal(label, pct, badgeFilename) {
    const origin = window.location.origin;
    const base = getBasePath();
    const badgeUrl = origin + base + (badgeFilename ? 'badges/' + badgeFilename : 'badge.svg');
    const pageUrl = window.location.href;
    const mdSnippet = '[![Coverage - ' + label + '](' + badgeUrl + ')](' + pageUrl + ')';
    const htmlSnippet = '<a href="' + pageUrl + '"><img src="' + badgeUrl + '" alt="Coverage - ' + label + '" /></a>';

    let modalBackdrop = document.getElementById('badge-modal-backdrop');
    if (modalBackdrop) modalBackdrop.remove();

    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'badge-modal-backdrop';
    modalBackdrop.className = 'badge-modal-backdrop';
    modalBackdrop.innerHTML = 
      '<div class="badge-modal" role="dialog" aria-label="Coverage Badge Snippet">' +
        '<div class="badge-modal-header">' +
          '<span class="badge-modal-title">Coverage Badge: ' + escapeHtml(label) + '</span>' +
          '<button class="badge-modal-close" id="badge-modal-close" aria-label="Close">✕</button>' +
        '</div>' +
        '<div class="badge-modal-body">' +
          '<div class="badge-preview-box">' +
            generateClientBadgeSvg(pct, label) +
          '</div>' +
          '<div>' +
            '<div class="badge-field-label"><span>Markdown</span></div>' +
            '<div class="badge-code-wrap">' +
              '<input type="text" class="badge-code-input" id="badge-md-input" readonly value="' + escapeHtml(mdSnippet) + '">' +
              '<button class="badge-copy-inline-btn" data-copy-target="badge-md-input">Copy</button>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div class="badge-field-label"><span>HTML</span></div>' +
            '<div class="badge-code-wrap">' +
              '<input type="text" class="badge-code-input" id="badge-html-input" readonly value="' + escapeHtml(htmlSnippet) + '">' +
              '<button class="badge-copy-inline-btn" data-copy-target="badge-html-input">Copy</button>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div class="badge-field-label"><span>Badge Image URL</span></div>' +
            '<div class="badge-code-wrap">' +
              '<input type="text" class="badge-code-input" id="badge-url-input" readonly value="' + escapeHtml(badgeUrl) + '">' +
              '<button class="badge-copy-inline-btn" data-copy-target="badge-url-input">Copy</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modalBackdrop);

    modalBackdrop.querySelector('#badge-modal-close').addEventListener('click', () => modalBackdrop.remove());
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.remove();
    });

    modalBackdrop.querySelectorAll('.badge-copy-inline-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy-target');
        const input = document.getElementById(targetId);
        if (input) {
          navigator.clipboard.writeText(input.value);
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
          showToast('Copied to clipboard!');
        }
      });
    });
  }

  async function copyBadgeMarkdown(label, pct, badgeFilename) {
    const origin = window.location.origin;
    const base = getBasePath();
    const badgeUrl = origin + base + (badgeFilename ? 'badges/' + badgeFilename : 'badge.svg');
    const pageUrl = window.location.href;
    const mdSnippet = '[![Coverage - ' + label + '](' + badgeUrl + ')](' + pageUrl + ')';
    try {
      await navigator.clipboard.writeText(mdSnippet);
      showToast('Copied badge Markdown for "' + label + '" to clipboard!');
    } catch {
      openBadgeModal(label, pct, badgeFilename);
    }
  }

  function parseRoute() {
    // 1. SPA redirect query: ?/tree/main/src
    if (window.location.search.startsWith('?/')) {
      const redirect = decodeURIComponent(window.location.search.slice(2));
      const cleanUrl = getBasePath() + redirect.replace(/^\//, '');
      window.history.replaceState(null, '', cleanUrl);
    }

    // 2. Legacy hash handling
    const hash = window.location.hash || '';
    if (hash.startsWith('#') && hash.includes('=')) {
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      if (params.has('branch')) { state.activeRefType = 'branch'; state.activeRefName = params.get('branch'); }
      if (params.has('tag')) { state.activeRefType = 'tag'; state.activeRefName = params.get('tag'); }
      if (params.has('file')) { state.selectedFile = params.get('file'); state.activeTab = 'files'; }
      else if (params.has('folder')) { state.currentFolder = params.get('folder'); state.selectedFile = null; state.activeTab = 'files'; }
      if (params.has('tab')) { state.activeTab = params.get('tab'); }
      updateRoute(true);
      return;
    }

    // 3. Subpath relative to getBasePath()
    let subpath = '';
    if (window.location.protocol === 'file:' || hash.startsWith('#/')) {
      subpath = (hash || '').replace(/^#\/?/, '');
    } else {
      const p = window.location.pathname;
      const base = getBasePath();
      if (p.startsWith(base)) {
        subpath = p.slice(base.length);
      } else {
        subpath = p.replace(/^\//, '');
      }
    }

    subpath = subpath.replace(/\/$/, '');
    if (!subpath || subpath === 'index.html') {
      state.activeTab = 'files';
      state.currentFolder = '';
      state.selectedFile = null;
      return;
    }

    const refs = getAvailableRefs();
    const allRefNames = [...Object.keys(refs.branches), ...Object.keys(refs.tags)];
    allRefNames.sort((a, b) => b.length - a.length);

    function matchRefAndPath(remainder) {
      for (const rName of allRefNames) {
        if (remainder === rName || remainder.startsWith(rName + '/')) {
          const rest = remainder.slice(rName.length).replace(/^\//, '');
          const rType = refs.tags[rName] ? 'tag' : 'branch';
          const sha = rType === 'tag' ? refs.tags[rName] : refs.branches[rName];
          return { refName: rName, refType: rType, sha: sha, path: rest };
        }
      }
      const firstSlash = remainder.indexOf('/');
      const firstPart = firstSlash !== -1 ? remainder.slice(0, firstSlash) : remainder;
      const restPart = firstSlash !== -1 ? remainder.slice(firstSlash + 1) : '';
      if (/^[0-9a-f]{7,40}$/i.test(firstPart)) {
        return { refName: firstPart, refType: 'branch', sha: firstPart, path: restPart };
      }
      return { refName: data?.currentCommit?.branch || 'main', refType: 'branch', sha: data?.currentCommit?.sha || '', path: remainder };
    }

    if (subpath.startsWith('tree/')) {
      const remainder = subpath.slice(5);
      const matched = matchRefAndPath(remainder);
      state.activeRefType = matched.refType;
      state.activeRefName = matched.refName;
      state.selectedCommitSha = matched.sha;
      state.currentFolder = matched.path || '';
      state.selectedFile = null;
      state.activeTab = 'files';
      ensureExpanded(state.currentFolder);
    } else if (subpath.startsWith('blob/')) {
      const remainder = subpath.slice(5);
      const matched = matchRefAndPath(remainder);
      state.activeRefType = matched.refType;
      state.activeRefName = matched.refName;
      state.selectedCommitSha = matched.sha;
      state.selectedFile = matched.path;
      state.activeTab = 'files';
      ensureExpanded(state.selectedFile);
    } else if (subpath.startsWith('commits')) {
      const remainder = subpath.slice(7).replace(/^\//, '');
      if (remainder) {
        const matched = matchRefAndPath(remainder);
        state.activeRefType = matched.refType;
        state.activeRefName = matched.refName;
        state.selectedCommitSha = matched.sha;
      }
      state.activeTab = 'commits';
    } else if (subpath.startsWith('trends')) {
      state.activeTab = 'trends';
    }
  }

  function updateRoute(replace = false) {
    const base = getBasePath();
    const ref = state.activeRefName || data?.currentCommit?.branch || 'main';
    let targetUrl = base;

    if (state.activeTab === 'commits') {
      targetUrl = base + 'commits/' + encodeURI(ref);
    } else if (state.activeTab === 'trends') {
      targetUrl = base + 'trends';
    } else if (state.selectedFile) {
      targetUrl = base + 'blob/' + encodeURI(ref) + '/' + state.selectedFile;
    } else if (state.currentFolder) {
      targetUrl = base + 'tree/' + encodeURI(ref) + '/' + state.currentFolder;
    } else if (ref !== 'main' || state.activeRefType === 'tag') {
      targetUrl = base + 'tree/' + encodeURI(ref);
    } else {
      targetUrl = base;
    }

    if (window.location.protocol === 'file:') {
      const fileHash = '#' + targetUrl;
      if (window.location.hash !== fileHash) {
        if (replace) history.replaceState(null, '', fileHash);
        else history.pushState(null, '', fileHash);
      }
      return;
    }

    if (window.location.pathname !== targetUrl) {
      if (replace) history.replaceState(null, '', targetUrl);
      else history.pushState(null, '', targetUrl);
    }
  }

  function initState() {
    if (data) {
      state.selectedCommitSha = data.currentCommit?.sha || '';
      if (!state.activeRefName) {
        if (data.currentCommit?.tag) {
          state.activeRefType = 'tag';
          state.activeRefName = data.currentCommit.tag;
        } else {
          state.activeRefType = 'branch';
          state.activeRefName = data.currentCommit?.branch || 'main';
        }
      }
      state.expandedFolders.add('');
      if (data.folderChildren?.['']?.subfolders) {
        for (const sf of data.folderChildren[''].subfolders) {
          state.expandedFolders.add(sf);
        }
      }
      parseRoute();
    }
  }

  const lcovCache = {};
  let loadingLcovSha = null;

  async function fetchCommitLcov(sha, shortSha) {
    const key = sha || shortSha;
    if (!key || lcovCache[key] || loadingLcovSha === key) return;
    loadingLcovSha = key;

    const candidates = [
      './history/lcov/lcov-' + shortSha + '.info',
      './history/lcov/' + sha + '.lcov',
      './history/lcov/' + shortSha + '.lcov',
      './history/lcov/lcov-' + sha + '.info',
      './coverage/lcov-' + shortSha + '.info',
    ];

    for (const url of candidates) {
      try {
        const resp = await fetch(url);
        if (resp.ok) {
          const text = await resp.text();
          const parsed = parseClientLcov(text, data?.commits || []);
          lcovCache[key] = parsed.files;
          if (sha) lcovCache[sha] = parsed.files;
          if (shortSha) lcovCache[shortSha] = parsed.files;
          break;
        }
      } catch {}
    }

    loadingLcovSha = null;
    render();
  }

  function getActiveViewData() {
    if (!data) return null;
    const cEntry = data.commits?.find(c => c.commit.sha === state.selectedCommitSha || c.commit.shortSha === state.selectedCommitSha);
    if (!cEntry || cEntry.commit.sha === data.currentCommit?.sha) {
      return {
        commit: data.currentCommit,
        summary: data.summary,
        folders: data.folders,
        files: data.files,
        folderChildren: data.folderChildren,
        delta: data.delta,
      };
    }

    const sha = cEntry.commit.sha;
    const shortSha = cEntry.commit.shortSha;
    const cachedFiles = lcovCache[sha] || lcovCache[shortSha];
    if (!cachedFiles && !loadingLcovSha && (state.selectedFile || state.activeTab === 'files')) {
      fetchCommitLcov(sha, shortSha);
    }

    const folders = {};
    const files = {};
    const folderChildren = {};

    const ensureF = (fp) => {
      if (!folders[fp]) {
        const parts = fp ? fp.split('/') : [];
        folders[fp] = {
          path: fp,
          name: parts.length > 0 ? parts[parts.length - 1] : 'root',
          lines: { total: 0, covered: 0, skipped: 0, pct: 100 },
          functions: { total: 0, covered: 0, skipped: 0, pct: 100 },
          branches: { total: 0, covered: 0, skipped: 0, pct: 100 },
          filesCount: 0,
          foldersCount: 0,
        };
        folderChildren[fp] = { subfolders: new Set(), files: [] };
      }
    };
    ensureF('');

    if (cEntry.folderSummaries) {
      for (const [fp, sm] of Object.entries(cEntry.folderSummaries)) {
        ensureF(fp);
        Object.assign(folders[fp], sm);
      }
    }
    if (cEntry.fileSummaries) {
      for (const [fp, sm] of Object.entries(cEntry.fileSummaries)) {
        const cf = cachedFiles?.[fp];
        files[fp] = {
          path: fp,
          lines: cf ? cf.lines : sm.lines,
          functions: cf ? cf.functions : sm.functions,
          branches: cf ? cf.branches : sm.branches,
          sourceCode: cf?.sourceCode || (cEntry.commit.sha === data.currentCommit?.sha ? data.files?.[fp]?.sourceCode : undefined),
          lineDetails: cf?.lineDetails || (cEntry.commit.sha === data.currentCommit?.sha ? data.files?.[fp]?.lineDetails : undefined),
        };
        const parts = fp.split('/');
        const dirParts = parts.slice(0, -1);
        const imm = dirParts.join('/');
        let cur = '';
        ensureF('');
        for (let i = 0; i < dirParts.length; i++) {
          const nxt = dirParts.slice(0, i + 1).join('/');
          ensureF(nxt);
          folderChildren[cur].subfolders.add(nxt);
          cur = nxt;
        }
        ensureF(imm);
        folderChildren[imm].files.push(fp);
      }
    } else {
      Object.assign(folders, data.folders);
      Object.assign(files, data.files);
      Object.assign(folderChildren, data.folderChildren);
    }

    const cleanChildren = {};
    for (const [k, v] of Object.entries(folderChildren)) {
      cleanChildren[k] = {
        subfolders: Array.from(v.subfolders || []).sort(),
        files: (v.files || []).sort(),
      };
    }

    return {
      commit: cEntry.commit,
      summary: cEntry.summary,
      folders,
      files,
      folderChildren: cleanChildren,
      delta: null,
    };
  }

  function selectRef(refType, refName, refSha) {
    state.activeRefType = refType;
    state.activeRefName = refName;
    state.refPopoverOpen = false;
    state.refSearchText = '';
    state.selectedCommitSha = refSha || '';
    updateRoute();
    render();
  }

  function renderRefPopover() {
    const { branches, tags } = getAvailableRefs();
    const branchNames = Object.keys(branches).sort();
    const tagNames = Object.keys(tags).sort();
    const activeTab = state.refActiveTab;
    const search = state.refSearchText.toLowerCase().trim();

    let list = activeTab === 'branches' ? branchNames : tagNames;
    if (search) {
      list = list.filter(item => item.toLowerCase().includes(search));
    }

    let itemsHtml = '';
    if (list.length === 0) {
      itemsHtml = \`<div class="ref-empty">No \${activeTab === 'branches' ? 'branches' : 'tags'} found</div>\`;
    } else {
      itemsHtml = list.map(name => {
        const isCurrent = state.activeRefType === (activeTab === 'branches' ? 'branch' : 'tag') && state.activeRefName === name;
        const checkIcon = isCurrent ? (icons.check || '✓') : '';
        const sha = activeTab === 'branches' ? branches[name] : tags[name];
        const cEntry = data?.commits?.find(c => c.commit.sha === sha || c.commit.shortSha === sha);
        const covBadge = cEntry ? \`<span class="ref-item-badge \${getRateClass(cEntry.summary.lines.pct)}">\${cEntry.summary.lines.pct}%</span>\` : '';

        return \`
          <div class="ref-item \${isCurrent ? 'selected active' : ''}" data-ref-type="\${activeTab === 'branches' ? 'branch' : 'tag'}" data-ref-name="\${escapeHtml(name)}" data-ref-sha="\${escapeHtml(sha || '')}" role="option" aria-selected="\${isCurrent}">
            <span class="ref-item-check">\${checkIcon}</span>
            <span class="ref-item-name">\${escapeHtml(name)}</span>
            \${covBadge}
          </div>
        \`;
      }).join('');
    }

    return \`
      <div class="ref-popover" id="ref-popover" role="dialog" aria-label="Switch branches or tags">
        <div class="ref-popover-header">
          <div class="ref-popover-top">
            <span class="ref-popover-title">Switch branches/tags</span>
            <button class="ref-popover-close" id="ref-popover-close" aria-label="Close">✕</button>
          </div>
          <div class="ref-search-wrap">
            <input type="text" class="ref-search-input" id="ref-search-input" placeholder="Filter branches/tags..." value="\${escapeHtml(state.refSearchText)}" aria-label="Filter branches and tags">
          </div>
          <div class="ref-tabs" role="tablist">
            <button class="ref-tab \${activeTab === 'branches' ? 'active' : ''}" data-ref-tab="branches" role="tab" aria-selected="\${activeTab === 'branches'}">
              Branches (\${branchNames.length})
            </button>
            <button class="ref-tab \${activeTab === 'tags' ? 'active' : ''}" data-ref-tab="tags" role="tab" aria-selected="\${activeTab === 'tags'}">
              Tags (\${tagNames.length})
            </button>
          </div>
        </div>
        <div class="ref-list" role="listbox">
          \${itemsHtml}
        </div>
      </div>
    \`;
  }

  // Pure client-side LCOV Parser for drop-in static mode
  function parseClientLcov(content, historyCommits) {
    const lines = content.split(/\\r?\\n/);
    const files = {};
    let currentPath = '';
    let lineDetails = {};
    let fnMap = new Map();
    let fnf = 0, fnh = 0, brf = 0, brh = 0, lf = 0, lh = 0;
    let seenLF = false, seenFNF = false, seenBRF = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('SF:')) {
        currentPath = line.slice(3).trim().replace(/\\\\/g, '/').replace(/^\\/+/, '');
      } else if (line.startsWith('FN:')) {
        const parts = line.slice(3).split(',');
        if (parts.length >= 2) {
          fnMap.set(parts.slice(1).join(','), { line: parseInt(parts[0], 10), hits: 0 });
        }
      } else if (line.startsWith('FNDA:')) {
        const parts = line.slice(5).split(',');
        if (parts.length >= 2) {
          const hits = parseInt(parts[0], 10) || 0;
          const name = parts.slice(1).join(',');
          const ex = fnMap.get(name);
          if (ex) ex.hits += hits; else fnMap.set(name, { line: 0, hits });
        }
      } else if (line.startsWith('FNF:')) {
        fnf = parseInt(line.slice(4), 10) || 0; seenFNF = true;
      } else if (line.startsWith('FNH:')) {
        fnh = parseInt(line.slice(4), 10) || 0;
      } else if (line.startsWith('BRDA:')) {
        const parts = line.slice(5).split(',');
        if (parts.length >= 4) {
          const ln = parseInt(parts[0], 10);
          const taken = parts[3] === '-' ? 0 : parseInt(parts[3], 10) || 0;
          if (!lineDetails[ln]) lineDetails[ln] = { hits: 0 };
          if (!lineDetails[ln].branches) lineDetails[ln].branches = { total: 0, taken: 0 };
          lineDetails[ln].branches.total += 1;
          if (taken > 0) lineDetails[ln].branches.taken += 1;
        }
      } else if (line.startsWith('BRF:')) {
        brf = parseInt(line.slice(4), 10) || 0; seenBRF = true;
      } else if (line.startsWith('BRH:')) {
        brh = parseInt(line.slice(4), 10) || 0;
      } else if (line.startsWith('DA:')) {
        const parts = line.slice(3).split(',');
        if (parts.length >= 2) {
          const ln = parseInt(parts[0], 10);
          const hits = parseInt(parts[1], 10) || 0;
          if (!lineDetails[ln]) lineDetails[ln] = { hits }; else lineDetails[ln].hits += hits;
        }
      } else if (line.startsWith('LF:')) {
        lf = parseInt(line.slice(3), 10) || 0; seenLF = true;
      } else if (line.startsWith('LH:')) {
        lh = parseInt(line.slice(3), 10) || 0;
      } else if (line === 'end_of_record') {
        if (currentPath) {
          const lineNums = Object.keys(lineDetails).map(Number);
          const finalLF = seenLF ? lf : lineNums.length;
          const finalLH = seenLF ? lh : lineNums.filter(l => lineDetails[l].hits > 0).length;
          const fnArr = Array.from(fnMap.entries()).map(([name, e]) => ({ name, line: e.line, hits: e.hits }));
          const finalFNF = seenFNF ? fnf : fnArr.length;
          const finalFNH = seenFNF ? fnh : fnArr.filter(f => f.hits > 0).length;
          let cBRF = 0, cBRH = 0;
          lineNums.forEach(ln => {
            if (lineDetails[ln].branches) {
              cBRF += lineDetails[ln].branches.total;
              cBRH += lineDetails[ln].branches.taken;
            }
          });
          const finalBRF = seenBRF ? brf : cBRF;
          const finalBRH = seenBRF ? brh : cBRH;

          const calcPct = (c, t) => t === 0 ? 100 : Math.round((c / t) * 10000) / 100;

          files[currentPath] = {
            path: currentPath,
            lines: { total: finalLF, covered: finalLH, skipped: Math.max(0, finalLF - finalLH), pct: calcPct(finalLH, finalLF) },
            functions: { total: finalFNF, covered: finalFNH, skipped: Math.max(0, finalFNF - finalFNH), pct: calcPct(finalFNH, finalFNF) },
            branches: { total: finalBRF, covered: finalBRH, skipped: Math.max(0, finalBRF - finalBRH), pct: calcPct(finalBRH, finalBRF) },
            lineDetails,
            functionDetails: fnArr,
          };
        }
        currentPath = ''; lineDetails = {}; fnMap.clear();
        fnf = 0; fnh = 0; brf = 0; brh = 0; lf = 0; lh = 0;
        seenLF = false; seenFNF = false; seenBRF = false;
      }
    }

    // Client-side tree aggregator
    const folders = {};
    const folderChildren = {};
    const ensureF = (fp) => {
      if (!folders[fp]) {
        const parts = fp ? fp.split('/') : [];
        folders[fp] = {
          path: fp, name: parts.length > 0 ? parts[parts.length - 1] : 'root',
          lines: { total: 0, covered: 0, skipped: 0, pct: 100 },
          functions: { total: 0, covered: 0, skipped: 0, pct: 100 },
          branches: { total: 0, covered: 0, skipped: 0, pct: 100 },
          filesCount: 0, foldersCount: 0,
        };
        folderChildren[fp] = { subfolders: new Set(), files: [] };
      }
    };
    ensureF('');
    for (const [fp, fc] of Object.entries(files)) {
      const parts = fp.split('/');
      const dirParts = parts.slice(0, -1);
      const imm = dirParts.join('/');
      let cur = '';
      ensureF('');
      for (let i = 0; i < dirParts.length; i++) {
        const nxt = dirParts.slice(0, i + 1).join('/');
        ensureF(nxt);
        folderChildren[cur].subfolders.add(nxt);
        cur = nxt;
      }
      folderChildren[imm].files.push(fp);
      const roll = (tgt) => {
        const f = folders[tgt];
        f.lines.total += fc.lines.total; f.lines.covered += fc.lines.covered; f.lines.skipped += fc.lines.skipped;
        f.functions.total += fc.functions.total; f.functions.covered += fc.functions.covered; f.functions.skipped += fc.functions.skipped;
        f.branches.total += fc.branches.total; f.branches.covered += fc.branches.covered; f.branches.skipped += fc.branches.skipped;
        f.filesCount++;
      };
      roll('');
      for (let i = 0; i < dirParts.length; i++) roll(dirParts.slice(0, i + 1).join('/'));
    }

    for (const f of Object.values(folders)) {
      f.lines.pct = f.lines.total ? Math.round((f.lines.covered / f.lines.total) * 10000) / 100 : 100;
      f.functions.pct = f.functions.total ? Math.round((f.functions.covered / f.functions.total) * 10000) / 100 : 100;
      f.branches.pct = f.branches.total ? Math.round((f.branches.covered / f.branches.total) * 10000) / 100 : 100;
      f.foldersCount = folderChildren[f.path].subfolders.size;
    }

    const cleanChildren = {};
    for (const [k, v] of Object.entries(folderChildren)) {
      cleanChildren[k] = { subfolders: Array.from(v.subfolders).sort(), files: v.files.sort() };
    }

    const root = folders[''] || { lines: { total: 0, covered: 0, skipped: 0, pct: 100 }, functions: { total: 0, covered: 0, skipped: 0, pct: 100 }, branches: { total: 0, covered: 0, skipped: 0, pct: 100 } };
    const summary = { lines: { ...root.lines }, functions: { ...root.functions }, branches: { ...root.branches } };

    const currentCommit = {
      sha: 'HEAD',
      shortSha: 'HEAD',
      message: 'Drop-in Coverage Report',
      author: 'git',
      date: new Date().toISOString(),
      branch: 'gh-pages',
    };

    const commits = Array.isArray(historyCommits) ? [...historyCommits] : [];
    if (commits.length === 0 || commits[commits.length - 1]?.commit?.sha !== currentCommit.sha) {
      const fSum = {}, flSum = {};
      for (const [k, v] of Object.entries(folders)) fSum[k] = { lines: { ...v.lines }, functions: { ...v.functions }, branches: { ...v.branches } };
      for (const [k, v] of Object.entries(files)) flSum[k] = { lines: { ...v.lines }, functions: { ...v.functions }, branches: { ...v.branches } };
      commits.push({ commit: currentCommit, summary, folderSummaries: fSum, fileSummaries: flSum });
    }

    const overallTrend = commits.map(c => ({
      sha: c.commit.sha, shortSha: c.commit.shortSha || c.commit.sha.slice(0, 7),
      date: c.commit.date, message: c.commit.message, author: c.commit.author, branch: c.commit.branch,
      linesPct: c.summary.lines.pct, functionsPct: c.summary.functions.pct, branchesPct: c.summary.branches.pct,
      linesCovered: c.summary.lines.covered, linesTotal: c.summary.lines.total,
    }));

    const folderTrends = {};
    const fileTrends = {};
    for (const c of commits) {
      for (const [fp, sm] of Object.entries(c.folderSummaries || {})) {
        if (!folderTrends[fp]) folderTrends[fp] = [];
        folderTrends[fp].push({
          sha: c.commit.sha, shortSha: c.commit.shortSha || c.commit.sha.slice(0, 7),
          date: c.commit.date, message: c.commit.message, author: c.commit.author, branch: c.commit.branch,
          linesPct: sm.lines.pct, functionsPct: sm.functions.pct, branchesPct: sm.branches.pct,
          linesCovered: sm.lines.covered, linesTotal: sm.lines.total,
        });
      }
      for (const [fp, sm] of Object.entries(c.fileSummaries || {})) {
        if (!fileTrends[fp]) fileTrends[fp] = [];
        fileTrends[fp].push({
          sha: c.commit.sha, shortSha: c.commit.shortSha || c.commit.sha.slice(0, 7),
          date: c.commit.date, message: c.commit.message, author: c.commit.author, branch: c.commit.branch,
          linesPct: sm.lines.pct, functionsPct: sm.functions.pct, branchesPct: sm.branches.pct,
          linesCovered: sm.lines.covered, linesTotal: sm.lines.total,
        });
      }
    }

    let delta;
    if (commits.length > 1) {
      const prev = commits[commits.length - 2].summary;
      delta = {
        linesPct: Math.round((summary.lines.pct - prev.lines.pct) * 100) / 100,
        functionsPct: Math.round((summary.functions.pct - prev.functions.pct) * 100) / 100,
        branchesPct: Math.round((summary.branches.pct - prev.branches.pct) * 100) / 100,
      };
    }

    return {
      title: 'Coverage Report',
      repoName: (typeof location !== 'undefined' ? location.pathname.split('/').filter(Boolean)[0] : '') || 'coverage',
      generatedAt: new Date().toISOString(),
      currentCommit,
      delta,
      summary,
      folders,
      files,
      folderChildren: cleanChildren,
      commits,
      trends: { overall: overallTrend, folders: folderTrends, files: fileTrends },
    };
  }

  // Helper: rate class based on percentage
  function getRateClass(pct) {
    if (pct >= 80) return 'rate-high';
    if (pct >= 50) return 'rate-medium';
    return 'rate-low';
  }

  function getCovLevel(pct) {
    if (pct >= 80) return 'high';
    if (pct >= 50) return 'med';
    return 'low';
  }

  function getRateColor(pct) {
    if (pct >= 80) return 'var(--color-success-fg)';
    if (pct >= 50) return 'var(--color-attention-fg)';
    return 'var(--color-danger-fg)';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(isoStr) {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  }

  // DOM Elements
  const container = document.getElementById('covpages-app');
  const tooltipEl = document.getElementById('chart-tooltip');

  // Theme application
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem('covpages-theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  applyTheme(state.theme);

  // Render top header
  function renderHeader() {
    const isDark = state.theme === 'dark' || (state.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const themeIcon = isDark ? icons.sun : icons.moon;
    const viewCommit = activeView?.commit || data.currentCommit;

    return \`
      <header class="gh-header">
        <div class="gh-header-inner">
          <a href="#" class="gh-brand" id="brand-link">
            <span class="gh-brand-icon">\${icons.github || ''}</span>
            <span>\${escapeHtml(data.repoName || 'covpages')}</span>
            <span class="gh-repo-title">/ \${escapeHtml(data.title || 'Coverage')}</span>
          </a>
          <div class="gh-header-actions">
            <div class="ref-selector-wrap">
              <button class="gh-btn ref-selector-btn" id="ref-selector-btn" title="Switch branches or tags" aria-haspopup="true" aria-expanded="\${state.refPopoverOpen}">
                \${state.activeRefType === 'tag' ? (icons.tag || '') : (icons.branch || '')}
                <span class="ref-btn-label">\${escapeHtml(state.activeRefName || viewCommit?.branch || 'main')}</span>
                <span class="dropdown-caret">▼</span>
              </button>
              \${state.refPopoverOpen ? renderRefPopover() : ''}
            </div>
            <span class="gh-btn" title="Commit">
              \${icons.commit || ''}
              <span class="commit-sha-badge">\${escapeHtml(viewCommit?.shortSha || '')}</span>
            </span>
            <button class="gh-btn badge-btn" id="header-badge-btn" data-badge-copy="ref" title="Click to copy badge Markdown for this branch/tag">
              <span class="badge-svg-display">\${generateClientBadgeSvg(activeView?.summary?.lines?.pct || data?.summary?.lines?.pct || 100, state.activeRefName || 'coverage')}</span>
              <span class="badge-copy-text">\${icons.copy || '📋'} Copy Badge</span>
            </button>
            <button class="gh-btn" id="theme-toggle-btn" title="Toggle Theme" aria-label="Toggle Theme">
              \${themeIcon}
            </button>
          </div>
        </div>
      </header>
      <nav class="gh-nav-tabs" aria-label="Coverage views">
        <div class="gh-nav-tabs-inner">
          <a class="gh-tab \${state.activeTab === 'files' ? 'active' : ''}" data-tab="files" role="tab" aria-selected="\${state.activeTab === 'files'}">
            \${icons.file || ''}
            <span>Files</span>
            <span class="counter">\${Object.keys(activeView?.files || data.files || {}).length}</span>
          </a>
          <a class="gh-tab \${state.activeTab === 'trends' ? 'active' : ''}" data-tab="trends" role="tab" aria-selected="\${state.activeTab === 'trends'}">
            \${icons.graph || ''}
            <span>Trends</span>
            <span class="counter">\${data.commits?.length || 1}</span>
          </a>
          <a class="gh-tab \${state.activeTab === 'commits' ? 'active' : ''}" data-tab="commits" role="tab" aria-selected="\${state.activeTab === 'commits'}">
            \${icons.commit || ''}
            <span>Commits</span>
            <span class="counter">\${data.commits?.length || 1}</span>
          </a>
        </div>
      </nav>
    \`;
  }

  // Render metric cards
  function renderMetrics(summary, delta) {
    const renderDelta = (val) => {
      if (val === undefined || val === null) return '';
      const isPos = val > 0;
      const isNeg = val < 0;
      const cls = isPos ? 'positive' : isNeg ? 'negative' : 'neutral';
      const icon = isPos ? icons.arrowUp : isNeg ? icons.arrowDown : '';
      const prefix = isPos ? '+' : '';
      return \`<span class="delta-badge \${cls}">\${icon}\${prefix}\${val.toFixed(2)}%</span>\`;
    };

    return \`
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-title">
            <span>Line Coverage</span>
            \${renderDelta(delta?.linesPct)}
          </div>
          <div class="metric-value-row">
            <span class="metric-percent \${getRateClass(summary.lines.pct)}">\${summary.lines.pct}%</span>
            <span class="metric-counts">\${summary.lines.covered} / \${summary.lines.total} lines</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: \${summary.lines.pct}%; background-color: \${getRateColor(summary.lines.pct)};"></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-title">
            <span>Function Coverage</span>
            \${renderDelta(delta?.functionsPct)}
          </div>
          <div class="metric-value-row">
            <span class="metric-percent \${getRateClass(summary.functions.pct)}">\${summary.functions.pct}%</span>
            <span class="metric-counts">\${summary.functions.covered} / \${summary.functions.total} functions</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: \${summary.functions.pct}%; background-color: \${getRateColor(summary.functions.pct)};"></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-title">
            <span>Branch Coverage</span>
            \${renderDelta(delta?.branchesPct)}
          </div>
          <div class="metric-value-row">
            <span class="metric-percent \${getRateClass(summary.branches.pct)}">\${summary.branches.pct}%</span>
            <span class="metric-counts">\${summary.branches.covered} / \${summary.branches.total} branches</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: \${summary.branches.pct}%; background-color: \${getRateColor(summary.branches.pct)};"></div>
          </div>
        </div>
      </div>
    \`;
  }

  // Render commit banner
  function renderCommitBanner() {
    const c = activeView?.commit || data.currentCommit;
    if (!c) return '';
    const initial = (c.author || 'D').slice(0, 1).toUpperCase();

    return \`
      <div class="commit-banner">
        <div class="commit-left">
          <div class="commit-author-avatar" title="\${escapeHtml(c.author)}">\${initial}</div>
          <div>
            <span class="commit-message">\${escapeHtml(c.message)}</span>
            <div class="commit-meta">
              <span>\${escapeHtml(c.author)}</span>
              <span>committed \${formatDate(c.date)}</span>
            </div>
          </div>
        </div>
        <div class="commit-meta">
          <span class="commit-sha-badge">\${icons.commit} \${escapeHtml(c.shortSha)}</span>
        </div>
      </div>
    \`;
  }

  // Render SVG Sparkline
  function renderSparkline(trendPoints) {
    if (!trendPoints || trendPoints.length <= 1) return '<span style="color:var(--color-fg-subtle)">—</span>';
    const width = 80;
    const height = 20;
    const padding = 2;

    const values = trendPoints.map(p => p.linesPct);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = (max - min) || 1;

    const coords = values.map((val, idx) => {
      const x = padding + (idx / (values.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return \`\${x.toFixed(1)},\${y.toFixed(1)}\`;
    }).join(' ');

    const lastVal = values[values.length - 1];
    const firstVal = values[0];
    const strokeColor = lastVal >= firstVal ? 'var(--color-success-fg)' : 'var(--color-danger-fg)';

    return \`
      <svg width="\${width}" height="\${height}" style="vertical-align:middle; overflow:visible;">
        <polyline points="\${coords}" fill="none" stroke="\${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    \`;
  }

  // Render Interactive SVG Trend Chart
  function renderTrendChart(title, points, metricKey = 'linesPct') {
    if (!points || points.length === 0) {
      return \`
        <div class="chart-container">
          <div class="chart-title">\${escapeHtml(title)}</div>
          <div style="padding: 40px; text-align:center; color:var(--color-fg-muted);">No commit history points recorded yet.</div>
        </div>
      \`;
    }

    const width = 800;
    const height = 220;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 35;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    const metricName = metricKey === 'linesPct' ? 'Lines' : metricKey === 'functionsPct' ? 'Functions' : 'Branches';

    const rawValues = points.map(p => p[metricKey] ?? 0);
    const minVal = Math.max(0, Math.floor(Math.min(...rawValues) / 10) * 10 - 10);
    const maxVal = Math.min(100, Math.ceil(Math.max(...rawValues) / 10) * 10 + 10);
    const valRange = (maxVal - minVal) || 10;

    const ticks = [minVal, minVal + valRange / 2, maxVal];

    const coords = points.map((p, idx) => {
      const x = points.length === 1 
        ? paddingLeft + chartW / 2 
        : paddingLeft + (idx / (points.length - 1)) * chartW;
      const y = paddingTop + chartH - (((p[metricKey] ?? 0) - minVal) / valRange) * chartH;
      return { x, y, point: p };
    });

    let pathD = '';
    if (coords.length === 1) {
      pathD = \`M \${coords[0].x - 10} \${coords[0].y} L \${coords[0].x + 10} \${coords[0].y}\`;
    } else {
      pathD = coords.reduce((acc, c, i) => {
        if (i === 0) return \`M \${c.x} \${c.y}\`;
        const prev = coords[i - 1];
        const cp1x = prev.x + (c.x - prev.x) / 2;
        const cp1y = prev.y;
        const cp2x = prev.x + (c.x - prev.x) / 2;
        const cp2y = c.y;
        return \`\${acc} C \${cp1x} \${cp1y}, \${cp2x} \${cp2y}, \${c.x} \${c.y}\`;
      }, '');
    }

    const areaD = coords.length > 1
      ? \`\${pathD} L \${coords[coords.length - 1].x} \${paddingTop + chartH} L \${coords[0].x} \${paddingTop + chartH} Z\`
      : '';

    const gridLines = ticks.map(t => {
      const y = paddingTop + chartH - ((t - minVal) / valRange) * chartH;
      return \`
        <line x1="\${paddingLeft}" y1="\${y}" x2="\${width - paddingRight}" y2="\${y}" stroke="var(--chart-grid)" stroke-dasharray="3,3"/>
        <text x="\${paddingLeft - 8}" y="\${y + 4}" text-anchor="end" fill="var(--color-fg-muted)" font-size="11">\${Math.round(t)}%</text>
      \`;
    }).join('');

    const circles = coords.map((c, i) => {
      const p = c.point;
      const isSelected = p.sha === state.selectedCommitSha;
      const r = isSelected ? 6 : 4;
      const fill = isSelected ? 'var(--color-attention-fg)' : 'var(--chart-line)';
      const stroke = 'var(--color-canvas-default)';
      return \`
        <circle class="chart-dot" cx="\${c.x}" cy="\${c.y}" r="\${r}" fill="\${fill}" stroke="\${stroke}" stroke-width="2"
          data-sha="\${p.sha}" data-date="\${escapeHtml(p.date)}" data-msg="\${escapeHtml(p.message)}"
          data-lines="\${p.linesPct}%" data-fn="\${p.functionsPct}%" data-br="\${p.branchesPct}%"
          data-covered="\${p.linesCovered}" data-total="\${p.linesTotal}"
        />
        <text x="\${c.x}" y="\${paddingTop + chartH + 18}" text-anchor="middle" fill="var(--color-fg-muted)" font-size="10" font-family="var(--font-mono)">
          \${escapeHtml(p.shortSha)}
        </text>
      \`;
    }).join('');

    return \`
      <div class="chart-container">
        <div class="chart-header">
          <div class="chart-title">
            \${icons.graph}
            <span>\${escapeHtml(title)} (\${metricName})</span>
          </div>
          <div class="chart-actions">
            <button class="gh-btn \${metricKey === 'linesPct' ? 'gh-btn-primary' : ''}" data-metric="linesPct">Lines</button>
            <button class="gh-btn \${metricKey === 'functionsPct' ? 'gh-btn-primary' : ''}" data-metric="functionsPct">Functions</button>
            <button class="gh-btn \${metricKey === 'branchesPct' ? 'gh-btn-primary' : ''}" data-metric="branchesPct">Branches</button>
          </div>
        </div>
        <svg viewBox="0 0 \${width} \${height}" class="svg-chart">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--chart-line)" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="var(--chart-line)" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          \${gridLines}
          \${areaD ? \`<path d="\${areaD}" fill="url(#areaGrad)"/>\` : ''}
          <path d="\${pathD}" fill="none" stroke="var(--chart-line)" stroke-width="2.5" stroke-linecap="round"/>
          \${circles}
        </svg>
      </div>
    \`;
  }

  // Render Breadcrumbs with sidebar toggle button
  function renderBreadcrumbs() {
    let folder = state.currentFolder;
    if (state.selectedFile) {
      const parts = state.selectedFile.split('/');
      parts.pop();
      folder = parts.join('/');
    }
    const parts = folder ? folder.split('/') : [];
    let html = \`<a class="breadcrumb-item" data-folder="">\${escapeHtml(data.repoName || 'root')}</a>\`;
    let accum = '';

    parts.forEach((p, idx) => {
      accum = accum ? \`\${accum}/\${p}\` : p;
      html += \`<span class="breadcrumb-separator">/</span>\`;
      if (idx === parts.length - 1 && !state.selectedFile) {
        html += \`<span style="font-weight:600; color:var(--color-fg-default);">\${escapeHtml(p)}</span>\`;
      } else {
        html += \`<a class="breadcrumb-item" data-folder="\${accum}">\${escapeHtml(p)}</a>\`;
      }
    });

    if (state.selectedFile) {
      const fileName = state.selectedFile.split('/').pop();
      html += \`<span class="breadcrumb-separator">/</span><span style="font-weight:600; color:var(--color-fg-default);">\${escapeHtml(fileName)}</span>\`;
    }

    const toggleBtn = !state.sidebarVisible
      ? \`<button class="sidebar-toggle-btn" id="sidebar-expand-btn" title="Show file tree (b)" aria-label="Show file tree">\${icons.sidebar || ''} <span>Files</span></button>\`
      : '';

    return \`<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">\${toggleBtn}<div class="breadcrumbs">\${html}</div></div>\`;
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const lower = text.toLowerCase();
    const qLower = query.toLowerCase();
    const idx = lower.indexOf(qLower);
    if (idx === -1) return escapeHtml(text);
    return escapeHtml(text.slice(0, idx)) + 
      '<strong class="goto-highlight">' + escapeHtml(text.slice(idx, idx + query.length)) + '</strong>' + 
      escapeHtml(text.slice(idx + query.length));
  }

  function renderGotoResults() {
    const query = state.gotoFilterText.trim().toLowerCase();
    const vFiles = activeView?.files || data.files || {};
    const allFiles = Object.keys(vFiles);
    const matches = allFiles.filter(f => f.toLowerCase().includes(query));

    matches.sort((a, b) => {
      const aBase = a.split('/').pop()?.toLowerCase() || '';
      const bBase = b.split('/').pop()?.toLowerCase() || '';
      const aStarts = aBase.startsWith(query);
      const bStarts = bBase.startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.localeCompare(b);
    });

    if (matches.length === 0) {
      return \`
        <div class="goto-results" role="listbox">
          <div class="goto-empty">No files matching "\${escapeHtml(state.gotoFilterText)}"</div>
        </div>
      \`;
    }

    const maxItems = 50;
    const items = matches.slice(0, maxItems).map((filePath, idx) => {
      const fileCov = vFiles[filePath];
      const isSelected = state.selectedFile === filePath;
      const isActive = state.gotoActiveIndex === idx;
      const level = getCovLevel(fileCov.lines.pct);
      return \`
        <div class="goto-item \${isSelected ? 'selected' : ''} \${isActive ? 'active' : ''}" data-goto-file="\${escapeHtml(filePath)}" role="option" aria-selected="\${isSelected}">
          <span class="tree-icon" aria-hidden="true">\${icons.file || ''}</span>
          <span class="goto-item-path">\${highlightMatch(filePath, state.gotoFilterText)}</span>
          <span class="tree-badge tree-badge-\${level}">\${fileCov.lines.pct}%</span>
        </div>
      \`;
    }).join('');

    return \`
      <div class="goto-results" role="listbox" id="goto-results-list">
        \${items}
      </div>
    \`;
  }

  function renderTreeBranch(folderPath, depth = 0) {
    const vChildren = activeView?.folderChildren || data.folderChildren || {};
    const vFolders = activeView?.folders || data.folders || {};
    const vFiles = activeView?.files || data.files || {};
    const node = vChildren[folderPath] || { subfolders: [], files: [] };
    let html = '';

    for (const subfolder of node.subfolders) {
      const isExpanded = state.expandedFolders.has(subfolder);
      const folderCov = vFolders[subfolder];
      const folderName = subfolder.split('/').pop() || subfolder;
      const isCurrent = state.currentFolder === subfolder && !state.selectedFile;
      const level = folderCov ? getCovLevel(folderCov.lines.pct) : 'high';
      const pct = folderCov ? folderCov.lines.pct : 100;
      const indent = 8 + depth * 14;

      html += \`
        <div class="tree-node \${isCurrent ? 'selected' : ''}" style="padding-left: \${indent}px;" data-tree-folder="\${escapeHtml(subfolder)}" role="treeitem" aria-expanded="\${isExpanded}">
          <button class="tree-toggle-btn" data-tree-toggle="\${escapeHtml(subfolder)}" aria-label="\${isExpanded ? 'Collapse' : 'Expand'} \${escapeHtml(folderName)}" tabindex="-1">
            \${isExpanded ? (icons.chevronDown || '▼') : (icons.chevronRight || '▶')}
          </button>
          <span class="tree-icon" aria-hidden="true">\${icons.folder || ''}</span>
          <span class="tree-label" title="\${escapeHtml(folderName)}">\${escapeHtml(folderName)}</span>
          <span class="tree-badge tree-badge-\${level}">\${pct}%</span>
        </div>
      \`;

      if (isExpanded) {
        html += renderTreeBranch(subfolder, depth + 1);
      }
    }

    for (const filePath of node.files) {
      const fileCov = vFiles[filePath];
      if (!fileCov) continue;
      const fileName = filePath.split('/').pop() || filePath;
      const isSelected = state.selectedFile === filePath;
      const level = getCovLevel(fileCov.lines.pct);
      const indent = 8 + depth * 14 + 18;

      html += \`
        <div class="tree-node \${isSelected ? 'selected' : ''}" style="padding-left: \${indent}px;" data-tree-file="\${escapeHtml(filePath)}" role="treeitem" aria-selected="\${isSelected}">
          <span class="tree-icon" aria-hidden="true">\${icons.file || ''}</span>
          <span class="tree-label" title="\${escapeHtml(fileName)}">\${escapeHtml(fileName)}</span>
          <span class="tree-badge tree-badge-\${level}">\${fileCov.lines.pct}%</span>
        </div>
      \`;
    }

    return html;
  }

  function renderTreeContainer() {
    return \`
      <div class="tree-container" role="tree" aria-label="Repository files">
        \${renderTreeBranch('', 0)}
      </div>
    \`;
  }

  function renderSidebar() {
    const vFiles = activeView?.files || data.files || {};
    const totalFiles = Object.keys(vFiles).length;
    return \`
      <div class="sidebar-header">
        <span class="sidebar-title">
          <span class="tree-icon" aria-hidden="true">\${icons.sidebar || ''}</span>
          <span>Files</span>
          <span class="sidebar-counter">\${totalFiles}</span>
        </span>
        <button class="sidebar-btn-icon" id="sidebar-collapse-btn" title="Collapse file tree (b)" aria-label="Collapse file tree">
          \${icons.chevronRight || '›'}
        </button>
      </div>
      <div class="goto-box">
        <div class="goto-input-wrapper">
          <span class="goto-icon" aria-hidden="true">\${icons.search || ''}</span>
          <input type="text" id="goto-input" class="goto-input" placeholder="Go to file... (t)" value="\${escapeHtml(state.gotoFilterText)}" aria-label="Go to file">
          \${state.gotoFilterText 
            ? \`<button class="goto-clear" id="goto-clear" aria-label="Clear file search">\${icons.x || '×'}</button>\` 
            : '<kbd class="goto-shortcut">t</kbd>'
          }
        </div>
      </div>
      \${state.gotoFilterText.trim() ? renderGotoResults() : renderTreeContainer()}
    \`;
  }

  // Render Files and Folders Table
  function renderTable() {
    const vChildren = activeView?.folderChildren || data.folderChildren || {};
    const vFolders = activeView?.folders || data.folders || {};
    const vFiles = activeView?.files || data.files || {};
    const children = vChildren[state.currentFolder] || { subfolders: [], files: [] };
    const query = state.filterText.toLowerCase().trim();

    let rows = [];

    children.subfolders.forEach(subPath => {
      const name = subPath.split('/').pop() || subPath;
      if (query && !name.toLowerCase().includes(query) && !subPath.toLowerCase().includes(query)) return;
      const fCov = vFolders[subPath];
      if (!fCov) return;

      const trendPoints = data.trends?.folders?.[subPath];

      rows.push({
        type: 'folder',
        name,
        path: subPath,
        lines: fCov.lines,
        functions: fCov.functions,
        branches: fCov.branches,
        sparkline: renderSparkline(trendPoints),
      });
    });

    children.files.forEach(filePath => {
      const name = filePath.split('/').pop() || filePath;
      if (query && !name.toLowerCase().includes(query) && !filePath.toLowerCase().includes(query)) return;
      const fileCov = vFiles[filePath];
      if (!fileCov) return;

      const trendPoints = data.trends?.files?.[filePath];

      rows.push({
        type: 'file',
        name,
        path: filePath,
        lines: fileCov.lines,
        functions: fileCov.functions,
        branches: fileCov.branches,
        sparkline: renderSparkline(trendPoints),
      });
    });

    rows.sort((a, b) => {
      let valA, valB;
      if (state.sortColumn === 'lines') {
        valA = a.lines.pct;
        valB = b.lines.pct;
      } else if (state.sortColumn === 'functions') {
        valA = a.functions.pct;
        valB = b.functions.pct;
      } else if (state.sortColumn === 'branches') {
        valA = a.branches.pct;
        valB = b.branches.pct;
      } else {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      }

      if (valA < valB) return state.sortAsc ? -1 : 1;
      if (valA > valB) return state.sortAsc ? 1 : -1;
      return 0;
    });

    const renderSortArrow = (col) => {
      if (state.sortColumn !== col) return '';
      return state.sortAsc ? ' ▲' : ' ▼';
    };

    let tableRows = '';
    if (rows.length === 0) {
      tableRows = \`<tr><td colspan="6" style="text-align:center; padding: 32px; color:var(--color-fg-muted);">No files or folders matching filter</td></tr>\`;
    } else {
      tableRows = rows.map(r => {
        const icon = r.type === 'folder' ? icons.folder : icons.file;
        const clickAttr = r.type === 'folder' ? \`data-nav-folder="\${r.path}"\` : \`data-nav-file="\${r.path}"\`;
        return \`
          <tr>
            <td>
              <div class="file-name-cell">
                <span>\${icon}</span>
                <a class="file-link" \${clickAttr}>\${escapeHtml(r.name)}</a>
              </div>
            </td>
            <td>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="rate-badge \${getRateClass(r.lines.pct)}">\${r.lines.pct}%</span>
                <div class="progress-bar-container" style="width: 70px; margin-top:0;">
                  <div class="progress-bar-fill" style="width:\${r.lines.pct}%; background-color:\${getRateColor(r.lines.pct)};"></div>
                </div>
              </div>
            </td>
            <td>\${r.lines.covered} / \${r.lines.total} <span style="color:var(--color-fg-subtle); font-size:11px;">(\${r.lines.skipped} missed)</span></td>
            <td>\${r.functions.pct}% <span style="color:var(--color-fg-subtle); font-size:11px;">(\${r.functions.covered}/\${r.functions.total})</span></td>
            <td>\${r.branches.pct}% <span style="color:var(--color-fg-subtle); font-size:11px;">(\${r.branches.covered}/\${r.branches.total})</span></td>
            <td>\${r.sparkline}</td>
          </tr>
        \`;
      }).join('');
    }

    const activeFolderCov = activeView?.folders?.[state.currentFolder] || activeView?.summary || { lines: { pct: 100 } };
    const folderParts = state.currentFolder ? state.currentFolder.split('/') : [];
    const currentFolderName = folderParts.length > 0 ? folderParts[folderParts.length - 1] : (data?.repoName || 'coverage');

    return \`
      <div class="file-toolbar">
        \${renderBreadcrumbs()}
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="badge-toolbar-group">
            <button class="gh-btn badge-btn" id="folder-badge-btn" data-badge-copy="folder" data-badge-folder="\${escapeHtml(state.currentFolder || '')}" title="Click to copy badge Markdown for this directory">
              <span class="badge-svg-display">\${generateClientBadgeSvg(activeFolderCov.lines.pct, currentFolderName)}</span>
              <span class="badge-copy-text">\${icons.copy || '📋'} Copy Badge</span>
            </button>
          </div>
          <div class="search-box">
            <span class="search-icon" aria-hidden="true">\${icons.search || ''}</span>
            <input type="text" id="filter-input" placeholder="Filter files... (press /)" value="\${escapeHtml(state.filterText)}" aria-label="Filter files">
          </div>
        </div>
      </div>
      <div class="gh-box">
        <div class="table-wrapper">
          <table class="gh-table">
            <thead>
              <tr>
                <th class="sortable" data-sort="name">Name\${renderSortArrow('name')}</th>
                <th class="sortable" data-sort="lines">Coverage\${renderSortArrow('lines')}</th>
                <th>Lines</th>
                <th class="sortable" data-sort="functions">Functions\${renderSortArrow('functions')}</th>
                <th class="sortable" data-sort="branches">Branches\${renderSortArrow('branches')}</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              \${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    \`;
  }

  function getLanguageFromPath(filePath) {
    if (!filePath) return 'javascript';
    const parts = filePath.split('.');
    const ext = parts[parts.length - 1].toLowerCase();
    const map = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      mjs: 'javascript',
      cjs: 'javascript',
      json: 'json',
      html: 'markup',
      htm: 'markup',
      svg: 'markup',
      xml: 'markup',
      css: 'css',
      py: 'python',
      go: 'go',
      rs: 'rust',
      java: 'java',
      dart: 'dart',
      sh: 'bash',
      bash: 'bash',
      zsh: 'bash',
      yml: 'yaml',
      yaml: 'yaml',
      md: 'markdown',
      c: 'c',
      h: 'c',
      cpp: 'cpp',
      hpp: 'cpp',
      cc: 'cpp',
    };
    return map[ext] || 'javascript';
  }

  function highlightSourceCodeLines(sourceCode, filePath) {
    if (!sourceCode) return [];
    const rawLines = sourceCode.split(/\\r?\\n/);
    const p = typeof window !== 'undefined' ? window.Prism : (typeof Prism !== 'undefined' ? Prism : null);
    if (!p || !p.highlight) {
      return rawLines.map(function(l) { return escapeHtml(l || ' '); });
    }
    const lang = getLanguageFromPath(filePath);
    const grammar = p.languages[lang] || p.languages.javascript;
    if (!grammar) {
      return rawLines.map(function(l) { return escapeHtml(l || ' '); });
    }
    try {
      const rawHtml = p.highlight(sourceCode, grammar, lang);
      const splitLines = rawHtml.split(/\\r?\\n/);
      const openTags = [];
      const result = [];

      for (let i = 0; i < splitLines.length; i++) {
        let line = splitLines[i];
        let prefix = openTags.map(function(t) { return t.full; }).join('');

        const tagRegex = /<\\/?span[^>]*>/g;
        let match;
        while ((match = tagRegex.exec(line)) !== null) {
          const tag = match[0];
          if (tag.startsWith('</')) {
            openTags.pop();
          } else {
            openTags.push({ full: tag });
          }
        }
        let suffix = '</span>'.repeat(openTags.length);
        result.push(prefix + (line || ' ') + suffix);
      }
      return result;
    } catch (e) {
      return rawLines.map(function(l) { return escapeHtml(l || ' '); });
    }
  }

  // Render Source Code Detail Viewer for a single file
  function renderFileViewer() {
    const filePath = state.selectedFile;
    const vFiles = activeView?.files || data.files || {};
    const fileCov = vFiles[filePath];
    if (!fileCov) return '<div>File not found in coverage report.</div>';

    const trendPoints = data.trends?.files?.[filePath] || [];

    const sourceCode = fileCov.sourceCode;
    const lineDetails = fileCov.lineDetails || {};

    if (loadingLcovSha && (!lineDetails || Object.keys(lineDetails).length === 0) && !sourceCode) {
      return \`
        <div class="file-toolbar">
          \${renderBreadcrumbs()}
        </div>
        \${renderMetrics(fileCov, null)}
        <div class="blob-wrapper" style="padding: 48px 24px; text-align: center; color: var(--color-fg-muted);">
          <div style="font-size: 14px; font-weight: 600; color: var(--color-fg-default); margin-bottom: 8px;">Loading coverage details for commit \${escapeHtml(activeView?.commit?.shortSha || '')}...</div>
          <div style="font-size: 12px;">Fetching normalized LCOV data on demand</div>
        </div>
      \`;
    }

    let linesArray = [];
    if (sourceCode) {
      linesArray = sourceCode.split(/\\r?\\n/);
    } else if (Object.keys(lineDetails).length > 0) {
      const maxLine = Math.max(...Object.keys(lineDetails).map(Number), 1);
      for (let i = 1; i <= maxLine; i++) {
        linesArray.push('');
      }
    } else {
      return \`
        <div class="file-toolbar">
          \${renderBreadcrumbs()}
        </div>
        \${renderMetrics(fileCov, null)}
        \${trendPoints.length > 1 ? renderTrendChart('Trend for ' + escapeHtml(filePath), trendPoints, state.trendMetric) : ''}
        <div class="blob-wrapper" style="padding: 48px 24px; text-align: center; color: var(--color-fg-muted);">
          <div style="font-size: 14px; font-weight: 600; color: var(--color-fg-default); margin-bottom: 8px;">Line-by-line coverage details not available</div>
          <div style="font-size: 12px;">Summary metrics are preserved in history index (\${fileCov.lines.covered}/\${fileCov.lines.total} lines covered, \${fileCov.lines.pct}%).</div>
        </div>
      \`;
    }

    let highlightedLines = [];
    if (sourceCode) {
      highlightedLines = highlightSourceCodeLines(sourceCode, filePath);
    }

    let codeRows = '';
    const totalLines = highlightedLines.length > 0 ? highlightedLines.length : linesArray.length;
    for (let idx = 0; idx < totalLines; idx++) {
      const lineNum = idx + 1;
      const detail = lineDetails[lineNum];

      let rowClass = '';
      let hitsText = '';

      if (detail) {
        if (detail.hits > 0) {
          rowClass = 'line-covered';
          hitsText = \`\${detail.hits}x\`;
        } else {
          rowClass = 'line-uncovered';
          hitsText = '0';
        }
      }

      const codeHtml = highlightedLines[idx] !== undefined ? highlightedLines[idx] : escapeHtml(linesArray[idx] || ' ');

      codeRows += \`
        <tr class="\${rowClass}" id="L\${lineNum}">
          <td class="blob-num" data-line-number="\${lineNum}">\${lineNum}</td>
          <td class="blob-hits">\${hitsText}</td>
          <td class="blob-code">\${codeHtml}</td>
        </tr>
      \`;
    }

    const fileParts = filePath.split('/');
    const currentFileName = fileParts[fileParts.length - 1];

    return \`
      <div class="file-toolbar">
        \${renderBreadcrumbs()}
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="badge-toolbar-group">
            <button class="gh-btn badge-btn" id="file-badge-btn" data-badge-copy="file" data-badge-file="\${escapeHtml(filePath)}" title="Click to copy badge Markdown for this file">
              <span class="badge-svg-display">\${generateClientBadgeSvg(fileCov.lines.pct, currentFileName)}</span>
              <span class="badge-copy-text">\${icons.copy || '📋'} Copy Badge</span>
            </button>
          </div>
          <button class="gh-btn" id="jump-next-uncovered" title="Jump to next uncovered line (n)">Next Uncovered (n)</button>
        </div>
      </div>

      \${renderMetrics(fileCov, null)}

      \${trendPoints.length > 1 ? renderTrendChart('Trend for ' + escapeHtml(filePath), trendPoints, state.trendMetric) : ''}

      <div class="blob-wrapper">
        <div class="blob-header">
          <div>
            <strong>\${escapeHtml(filePath)}</strong>
            <span style="margin-left:8px;">\${linesArray.length} lines</span>
          </div>
          <div class="blob-actions">
            <span>\${fileCov.lines.covered}/\${fileCov.lines.total} lines covered (\${fileCov.lines.pct}%)</span>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="code-table">
            <tbody>
              \${codeRows}
            </tbody>
          </table>
        </div>
      </div>
    \`;
  }

  // Render Dedicated Trends Tab
  function renderTrendsTab() {
    const overallTrends = data.trends?.overall || [];
    const folderKeys = Object.keys(data.trends?.folders || {}).filter(Boolean).sort();
    const fileKeys = Object.keys(data.trends?.files || {}).sort();

    let targetPoints = overallTrends;
    let targetTitle = 'Overall Repository Coverage Trend';

    if (state.trendScope === 'folder' && state.trendTarget) {
      targetPoints = data.trends?.folders?.[state.trendTarget] || [];
      targetTitle = \`Folder Coverage Trend: \${state.trendTarget}\`;
    } else if (state.trendScope === 'file' && state.trendTarget) {
      targetPoints = data.trends?.files?.[state.trendTarget] || [];
      targetTitle = \`File Coverage Trend: \${state.trendTarget}\`;
    }

    const folderOptions = folderKeys.map(k => \`<option value="\${k}" \${state.trendScope === 'folder' && state.trendTarget === k ? 'selected' : ''}>\${escapeHtml(k)}</option>\`).join('');
    const fileOptions = fileKeys.map(k => \`<option value="\${k}" \${state.trendScope === 'file' && state.trendTarget === k ? 'selected' : ''}>\${escapeHtml(k)}</option>\`).join('');

    return \`
      <div style="margin-bottom: 20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span style="font-weight:600; font-size:14px;">Scope:</span>
          <button class="gh-btn \${state.trendScope === 'overall' ? 'gh-btn-primary' : ''}" data-scope="overall">Repository Overall</button>
          <button class="gh-btn \${state.trendScope === 'folder' ? 'gh-btn-primary' : ''}" data-scope="folder">By Folder</button>
          <button class="gh-btn \${state.trendScope === 'file' ? 'gh-btn-primary' : ''}" data-scope="file">By File</button>
        </div>
        \${state.trendScope === 'folder' ? \`
          <div>
            <select id="trend-folder-select" class="gh-btn" style="min-width:240px; padding:6px 10px;">
              <option value="">-- Select Folder --</option>
              \${folderOptions}
            </select>
          </div>
        \` : ''}
        \${state.trendScope === 'file' ? \`
          <div>
            <select id="trend-file-select" class="gh-btn" style="min-width:280px; padding:6px 10px;">
              <option value="">-- Select File --</option>
              \${fileOptions}
            </select>
          </div>
        \` : ''}
      </div>

      \${renderTrendChart(targetTitle, targetPoints, state.trendMetric)}

      <div class="gh-box" style="margin-top: 20px;">
        <div style="padding: 12px 16px; background-color:var(--color-canvas-subtle); border-bottom: 1px solid var(--color-border-default); font-weight:600;">
          Historical Commits for this Trend
        </div>
        <div class="table-wrapper">
          <table class="gh-table">
            <thead>
              <tr>
                <th>Commit</th>
                <th>Coverage</th>
                <th>Lines</th>
                <th>Functions</th>
                <th>Branches</th>
                <th>Date</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              \${targetPoints.slice().reverse().map(p => \`
                <tr>
                  <td>
                    <span class="commit-sha-badge">\${icons.commit} \${escapeHtml(p.shortSha)}</span>
                  </td>
                  <td>
                    <span class="rate-badge \${getRateClass(p.linesPct)}">\${p.linesPct}%</span>
                  </td>
                  <td>\${p.linesCovered} / \${p.linesTotal}</td>
                  <td>\${p.functionsPct}%</td>
                  <td>\${p.branchesPct}%</td>
                  <td style="color:var(--color-fg-muted);">\${formatDate(p.date)}</td>
                  <td>\${escapeHtml(p.message)}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    \`;
  }

  // Render Commits Tab
  function renderCommitsTab() {
    const commits = (data.commits || []).slice().reverse();

    return \`
      <div class="gh-box">
        <div style="padding: 12px 16px; background-color:var(--color-canvas-subtle); border-bottom: 1px solid var(--color-border-default); font-weight:600; display:flex; justify-content:space-between; align-items:center;">
          <span>Commit History (\${commits.length})</span>
          <span style="font-size:12px; font-weight:normal; color:var(--color-fg-muted);">Recorded runs</span>
        </div>
        <div class="table-wrapper">
          <table class="gh-table">
            <thead>
              <tr>
                <th>Commit</th>
                <th>Author</th>
                <th>Branch</th>
                <th>Line Coverage</th>
                <th>Functions</th>
                <th>Branches</th>
                <th>Date</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              \${commits.map(c => {
                const isCurrent = c.commit.sha === (activeView?.commit?.sha || data.currentCommit?.sha);
                return \`
                  <tr data-commit-sha="\${escapeHtml(c.commit.sha)}" style="cursor:pointer;\${isCurrent ? ' background-color: var(--color-accent-subtle);' : ''}" title="Click to view this commit coverage snapshot">
                    <td>
                      <span class="commit-sha-badge">
                        \${icons.commit} \${escapeHtml(c.commit.shortSha || c.commit.sha.slice(0, 7))}
                      </span>
                    </td>
                    <td>\${escapeHtml(c.commit.author)}</td>
                    <td>\${escapeHtml(c.commit.branch)}</td>
                    <td>
                      <span class="rate-badge \${getRateClass(c.summary.lines.pct)}">\${c.summary.lines.pct}%</span>
                    </td>
                    <td>\${c.summary.functions.pct}%</td>
                    <td>\${c.summary.branches.pct}%</td>
                    <td style="color:var(--color-fg-muted); white-space:nowrap;">\${formatDate(c.commit.date)}</td>
                    <td>\${escapeHtml(c.commit.message)}</td>
                  </tr>
                \`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    \`;
  }

  // Render Empty Drop-in State when no coverage file is found yet
  function renderEmptyState() {
    return \`
      <header class="gh-header">
        <div class="gh-header-inner">
          <div class="gh-brand">
            <span class="gh-brand-icon">\${icons.github || ''}</span>
            <span>covpages</span>
            <span class="gh-repo-title">/ Drop-in Coverage</span>
          </div>
          <div class="gh-header-actions">
            <button class="gh-btn" id="theme-toggle-btn" title="Toggle Theme" aria-label="Toggle Theme">
              \${icons.moon}
            </button>
          </div>
        </div>
      </header>
      <main class="gh-container">
        <div style="max-width: 800px; margin: 40px auto; text-align: center;">
          <div style="margin-bottom: 24px; color: var(--color-accent-fg);">
            \${icons.file}
          </div>
          <h2 style="margin-bottom: 8px;">No coverage report detected yet</h2>
          <p style="color: var(--color-fg-muted); margin-bottom: 24px;">
            Place your <code>lcov.info</code> file into this directory to automatically render coverage metrics and trends.
          </p>

          <div id="drop-zone" style="border: 2px dashed var(--color-border-default); border-radius: var(--radius-lg); padding: 40px 20px; background-color: var(--color-canvas-subtle); cursor: pointer; margin-bottom: 32px; transition: border-color 0.2s;">
            <p style="font-weight: 600; margin-bottom: 4px;">Drag & drop your <code>lcov.info</code> here to view immediately</p>
            <p style="color: var(--color-fg-muted); font-size: 12px; margin-bottom: 12px;">or click to select file from your computer</p>
            <input type="file" id="lcov-file-input" accept=".info,.lcov,.txt" style="display: none;">
            <button class="gh-btn gh-btn-primary" id="select-file-btn">Select lcov.info</button>
          </div>

          <div class="gh-box" style="text-align: left; padding: 20px;">
            <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 14px;">Quick Framework Commands:</h3>
            <div style="font-family: var(--font-mono); font-size: 12px; background: var(--color-canvas-subtle); padding: 12px; border-radius: var(--radius-md); overflow-x: auto; line-height: 1.8;">
              <div># Flutter / Dart</div>
              <div style="color: var(--color-accent-fg); margin-bottom: 8px;">flutter test --coverage && cp coverage/lcov.info .</div>
              <div># Vitest / Jest</div>
              <div style="color: var(--color-accent-fg); margin-bottom: 8px;">npx vitest run --coverage && cp coverage/lcov.info .</div>
              <div># Rust</div>
              <div style="color: var(--color-accent-fg); margin-bottom: 8px;">cargo llvm-cov --lcov --output-path lcov.info</div>
              <div># Python</div>
              <div style="color: var(--color-accent-fg);">pytest --cov --cov-report=lcov:lcov.info</div>
            </div>
          </div>
        </div>
      </main>
    \`;
  }

  // Main Render Routine
  function render() {
    if (!data) {
      container.innerHTML = renderEmptyState();
      bindEmptyEvents();
      return;
    }

    activeView = getActiveViewData();

    let mainContent = '';

    if (state.activeTab === 'files') {
      let mainPane = '';
      if (state.selectedFile) {
        mainPane = renderFileViewer();
      } else {
        const vFolders = activeView?.folders || data.folders || {};
        const vSummary = activeView?.summary || data.summary;
        const currentFolderCov = vFolders[state.currentFolder] || vSummary;
        const trendPoints = state.currentFolder 
          ? data.trends?.folders?.[state.currentFolder] 
          : data.trends?.overall;

        mainPane = \`
          \${renderCommitBanner()}
          \${renderMetrics(currentFolderCov, activeView?.delta ?? data.delta)}
          \${trendPoints && trendPoints.length > 1 ? renderTrendChart(state.currentFolder ? \`Folder Trend: \${state.currentFolder}\` : 'Overall Coverage Trend', trendPoints, state.trendMetric) : ''}
          \${renderTable()}
        \`;
      }

      mainContent = \`
        <div class="files-layout \${state.sidebarVisible ? '' : 'sidebar-collapsed'}">
          <aside class="files-sidebar" aria-label="Files tree">
            \${renderSidebar()}
          </aside>
          <div class="files-main">
            \${mainPane}
          </div>
        </div>
      \`;
    } else if (state.activeTab === 'trends') {
      mainContent = renderTrendsTab();
    } else if (state.activeTab === 'commits') {
      mainContent = renderCommitsTab();
    }

    container.innerHTML = \`
      \${renderHeader()}
      <main class="gh-container">
        \${mainContent}
      </main>
      <footer class="gh-footer">
        Generated by <a href="https://github.com/yongjhih/covpages" target="_blank" rel="noopener">covpages</a> • 
        \${escapeHtml(data.generatedAt ? formatDate(data.generatedAt) : new Date().toISOString())}
      </footer>
    \`;

    bindEvents();
  }

  function bindEmptyEvents() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        render();
      });
    }

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('lcov-file-input');
    const selectBtn = document.getElementById('select-file-btn');

    if (selectBtn && fileInput) {
      selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => fileInput.click());

      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--color-accent-fg)';
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--color-border-default)';
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--color-border-default)';
        if (e.dataTransfer?.files?.length) {
          handleFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files?.length) {
          handleFile(e.target.files[0]);
        }
      });
    }

    function handleFile(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          data = parseClientLcov(text);
          initState();
          render();
        }
      };
      reader.readAsText(file);
    }
  }

  // Event handlers
  function bindEvents() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        render();
      });
    }

    // Ref selector dropdown
    const refBtn = document.getElementById('ref-selector-btn');
    if (refBtn) {
      refBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.refPopoverOpen = !state.refPopoverOpen;
        state.refSearchText = '';
        render();
        if (state.refPopoverOpen) {
          const input = document.getElementById('ref-search-input');
          if (input) input.focus();
        }
      });
    }

    const refCloseBtn = document.getElementById('ref-popover-close');
    if (refCloseBtn) {
      refCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.refPopoverOpen = false;
        render();
      });
    }

    document.querySelectorAll('.ref-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        state.refActiveTab = tab.getAttribute('data-ref-tab');
        render();
        const input = document.getElementById('ref-search-input');
        if (input) input.focus();
      });
    });

    const refSearchInput = document.getElementById('ref-search-input');
    if (refSearchInput) {
      refSearchInput.addEventListener('click', (e) => e.stopPropagation());
      refSearchInput.addEventListener('input', (e) => {
        state.refSearchText = e.target.value;
        const popoverEl = document.getElementById('ref-popover');
        if (popoverEl) {
          popoverEl.outerHTML = renderRefPopover();
          bindEvents();
          const inp = document.getElementById('ref-search-input');
          if (inp) {
            inp.focus();
            inp.selectionStart = inp.selectionEnd = inp.value.length;
          }
        }
      });
    }

    document.querySelectorAll('.ref-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const refType = item.getAttribute('data-ref-type');
        const refName = item.getAttribute('data-ref-name');
        const refSha = item.getAttribute('data-ref-sha');
        selectRef(refType, refName, refSha);
      });
    });

    if (state.refPopoverOpen) {
      const handleOutsideClick = (e) => {
        if (!e.target.closest('.ref-selector-wrap')) {
          state.refPopoverOpen = false;
          document.removeEventListener('click', handleOutsideClick);
          render();
        }
      };
      setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
      }, 0);
    }

    // Commits tab click to view commit coverage snapshot
    document.querySelectorAll('[data-commit-sha]').forEach(row => {
      row.addEventListener('click', () => {
        const sha = row.getAttribute('data-commit-sha');
        state.selectedCommitSha = sha;
        const found = data?.commits?.find(c => c.commit.sha === sha);
        if (found) {
          if (found.commit.tag) {
            state.activeRefType = 'tag';
            state.activeRefName = found.commit.tag;
          } else if (found.commit.branch) {
            state.activeRefType = 'branch';
            state.activeRefName = found.commit.branch;
          }
        }
        state.activeTab = 'files';
        state.selectedFile = null;
        updateRoute();
        render();
      });
    });

    // Badge copy buttons (header, folder, file)
    document.querySelectorAll('[data-badge-copy]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const scope = btn.getAttribute('data-badge-copy');
        let label = 'coverage';
        let pct = activeView?.summary?.lines?.pct || 100;
        let filename = 'badge.svg';

        if (scope === 'folder') {
          const folder = btn.getAttribute('data-badge-folder') || state.currentFolder || '';
          const parts = folder ? folder.split('/') : [];
          label = parts.length > 0 ? parts[parts.length - 1] : (data?.repoName || 'coverage');
          const fCov = activeView?.folders?.[folder] || activeView?.summary;
          pct = fCov?.lines?.pct || 100;
          filename = folder ? 'folder-' + sanitizeBadgeName(folder) + '.svg' : 'badge.svg';
        } else if (scope === 'file') {
          const file = btn.getAttribute('data-badge-file') || state.selectedFile || '';
          const parts = file.split('/');
          label = parts[parts.length - 1];
          const fCov = activeView?.files?.[file];
          pct = fCov?.lines?.pct || 100;
          filename = 'file-' + sanitizeBadgeName(file) + '.svg';
        } else if (scope === 'ref') {
          label = state.activeRefName || data?.currentCommit?.branch || 'coverage';
          pct = activeView?.summary?.lines?.pct || 100;
          filename = 'branch-' + sanitizeBadgeName(label) + '.svg';
        }

        copyBadgeMarkdown(label, pct, filename);
      });
    });

    // Sidebar toggle and collapse
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => {
        state.sidebarVisible = false;
        localStorage.setItem('covpages-sidebar', 'false');
        render();
      });
    }

    const expandBtn = document.getElementById('sidebar-expand-btn');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        state.sidebarVisible = true;
        localStorage.setItem('covpages-sidebar', 'true');
        render();
      });
    }

    // Go to file search
    const gotoInput = document.getElementById('goto-input');
    if (gotoInput) {
      gotoInput.addEventListener('input', (e) => {
        state.gotoFilterText = e.target.value;
        state.gotoActiveIndex = 0;
        const sidebar = document.querySelector('.files-sidebar');
        if (sidebar) {
          sidebar.innerHTML = renderSidebar();
          bindEvents();
          const gi = document.getElementById('goto-input');
          if (gi) {
            gi.focus();
            gi.selectionStart = gi.selectionEnd = gi.value.length;
          }
        }
      });

      gotoInput.addEventListener('keydown', (e) => {
        const query = state.gotoFilterText.trim().toLowerCase();
        const allFiles = Object.keys(data.files || {}).filter(f => f.toLowerCase().includes(query));
        allFiles.sort((a, b) => {
          const aBase = a.split('/').pop()?.toLowerCase() || '';
          const bBase = b.split('/').pop()?.toLowerCase() || '';
          const aStarts = aBase.startsWith(query);
          const bStarts = bBase.startsWith(query);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.localeCompare(b);
        });

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (allFiles.length > 0) {
            state.gotoActiveIndex = Math.min(state.gotoActiveIndex + 1, Math.min(allFiles.length, 50) - 1);
            updateGotoActive();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (allFiles.length > 0) {
            state.gotoActiveIndex = Math.max(state.gotoActiveIndex - 1, 0);
            updateGotoActive();
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (allFiles.length > 0 && allFiles[state.gotoActiveIndex]) {
            const target = allFiles[state.gotoActiveIndex];
            state.selectedFile = target;
            state.gotoFilterText = '';
            ensureExpanded(target);
            updateRoute();
            render();
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          state.gotoFilterText = '';
          render();
        }
      });
    }

    function updateGotoActive() {
      const items = document.querySelectorAll('.goto-item');
      items.forEach((item, idx) => {
        if (idx === state.gotoActiveIndex) {
          item.classList.add('active');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('active');
        }
      });
    }

    const gotoClear = document.getElementById('goto-clear');
    if (gotoClear) {
      gotoClear.addEventListener('click', () => {
        state.gotoFilterText = '';
        render();
        const gi = document.getElementById('goto-input');
        if (gi) gi.focus();
      });
    }

    // Go to file item click
    document.querySelectorAll('[data-goto-file]').forEach(el => {
      el.addEventListener('click', () => {
        const file = el.getAttribute('data-goto-file');
        state.selectedFile = file;
        state.gotoFilterText = '';
        ensureExpanded(file);
        updateRoute();
        render();
      });
    });

    // File tree folder toggle (chevron)
    document.querySelectorAll('[data-tree-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const folder = btn.getAttribute('data-tree-toggle');
        if (state.expandedFolders.has(folder)) {
          state.expandedFolders.delete(folder);
        } else {
          state.expandedFolders.add(folder);
        }
        render();
      });
    });

    // File tree folder row click
    document.querySelectorAll('[data-tree-folder]').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('[data-tree-toggle]')) return;
        const folder = el.getAttribute('data-tree-folder');
        state.currentFolder = folder;
        state.selectedFile = null;
        state.expandedFolders.add(folder);
        updateRoute();
        render();
      });
    });

    // File tree file click
    document.querySelectorAll('[data-tree-file]').forEach(el => {
      el.addEventListener('click', () => {
        const file = el.getAttribute('data-tree-file');
        state.selectedFile = file;
        ensureExpanded(file);
        updateRoute();
        render();
      });
    });

    const brandLink = document.getElementById('brand-link');
    if (brandLink) {
      brandLink.addEventListener('click', (e) => {
        e.preventDefault();
        state.activeTab = 'files';
        state.currentFolder = '';
        state.selectedFile = null;
        updateRoute();
        render();
      });
    }

    document.querySelectorAll('.gh-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        state.activeTab = tab.getAttribute('data-tab');
        updateRoute();
        render();
      });
    });

    document.querySelectorAll('.breadcrumb-item').forEach(item => {
      item.addEventListener('click', () => {
        const folder = item.getAttribute('data-folder');
        state.currentFolder = folder || '';
        state.selectedFile = null;
        updateRoute();
        render();
      });
    });

    document.querySelectorAll('[data-nav-folder]').forEach(el => {
      el.addEventListener('click', () => {
        state.currentFolder = el.getAttribute('data-nav-folder');
        state.selectedFile = null;
        updateRoute();
        render();
      });
    });

    document.querySelectorAll('[data-nav-file]').forEach(el => {
      el.addEventListener('click', () => {
        state.selectedFile = el.getAttribute('data-nav-file');
        updateRoute();
        render();
      });
    });

    const filterInput = document.getElementById('filter-input');
    if (filterInput) {
      filterInput.addEventListener('input', (e) => {
        state.filterText = e.target.value;
        const tableContainer = document.querySelector('.gh-box');
        if (tableContainer) {
          const newHtml = renderTable();
          const toolbar = document.querySelector('.file-toolbar');
          if (toolbar) {
            toolbar.outerHTML = newHtml;
            bindEvents();
            const refocusedInput = document.getElementById('filter-input');
            if (refocusedInput) {
              refocusedInput.focus();
              refocusedInput.selectionStart = refocusedInput.selectionEnd = refocusedInput.value.length;
            }
          }
        }
      });
    }

    document.querySelectorAll('.gh-table th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const sortCol = th.getAttribute('data-sort');
        if (state.sortColumn === sortCol) {
          state.sortAsc = !state.sortAsc;
        } else {
          state.sortColumn = sortCol;
          state.sortAsc = true;
        }
        render();
      });
    });

    document.querySelectorAll('.chart-actions button[data-metric]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.trendMetric = btn.getAttribute('data-metric');
        render();
      });
    });

    document.querySelectorAll('button[data-scope]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.trendScope = btn.getAttribute('data-scope');
        if (state.trendScope === 'folder') {
          const firstFolder = Object.keys(data.trends?.folders || {})[0] || '';
          state.trendTarget = firstFolder;
        } else if (state.trendScope === 'file') {
          const firstFile = Object.keys(data.trends?.files || {})[0] || '';
          state.trendTarget = firstFile;
        } else {
          state.trendTarget = '';
        }
        render();
      });
    });

    const trendFolderSelect = document.getElementById('trend-folder-select');
    if (trendFolderSelect) {
      trendFolderSelect.addEventListener('change', (e) => {
        state.trendTarget = e.target.value;
        render();
      });
    }

    const trendFileSelect = document.getElementById('trend-file-select');
    if (trendFileSelect) {
      trendFileSelect.addEventListener('change', (e) => {
        state.trendTarget = e.target.value;
        render();
      });
    }

    const jumpBtn = document.getElementById('jump-next-uncovered');
    if (jumpBtn) {
      jumpBtn.addEventListener('click', () => {
        const uncoveredRows = document.querySelectorAll('tr.line-uncovered');
        if (uncoveredRows.length === 0) return;
        const scrollY = window.scrollY;
        let targetRow = null;
        for (const row of uncoveredRows) {
          const top = row.getBoundingClientRect().top + scrollY;
          if (top > scrollY + 50) {
            targetRow = row;
            break;
          }
        }
        if (!targetRow) targetRow = uncoveredRows[0];
        targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    document.querySelectorAll('.chart-dot').forEach(dot => {
      dot.addEventListener('mouseenter', (e) => {
        if (!tooltipEl) return;
        const sha = dot.getAttribute('data-sha')?.slice(0, 7);
        const date = formatDate(dot.getAttribute('data-date'));
        const msg = dot.getAttribute('data-msg');
        const lines = dot.getAttribute('data-lines');
        const fn = dot.getAttribute('data-fn');
        const br = dot.getAttribute('data-br');

        tooltipEl.innerHTML = \`
          <div style="font-weight:600; margin-bottom:4px;">\${escapeHtml(msg)}</div>
          <div style="color:var(--color-fg-muted); margin-bottom:6px;">\${sha} • \${date}</div>
          <div>Lines: <strong>\${lines}</strong> • Functions: <strong>\${fn}</strong> • Branches: <strong>\${br}</strong></div>
        \`;
        tooltipEl.style.opacity = '1';
        tooltipEl.style.left = (e.pageX + 10) + 'px';
        tooltipEl.style.top = (e.pageY - 40) + 'px';
      });

      dot.addEventListener('mousemove', (e) => {
        if (!tooltipEl) return;
        tooltipEl.style.left = (e.pageX + 10) + 'px';
        tooltipEl.style.top = (e.pageY - 40) + 'px';
      });

      dot.addEventListener('mouseleave', () => {
        if (!tooltipEl) return;
        tooltipEl.style.opacity = '0';
      });
    });
  }

  // Keyboard shortcut '/' to focus search input
  window.addEventListener('keydown', (e) => {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
      return;
    }
    if (e.key === 't') {
      e.preventDefault();
      if (!state.sidebarVisible) {
        state.sidebarVisible = true;
        localStorage.setItem('covpages-sidebar', 'true');
        render();
      }
      const gotoInput = document.getElementById('goto-input');
      if (gotoInput) {
        gotoInput.focus();
        gotoInput.select();
      }
    } else if (e.key === 'b') {
      e.preventDefault();
      state.sidebarVisible = !state.sidebarVisible;
      localStorage.setItem('covpages-sidebar', String(state.sidebarVisible));
      render();
    } else if (e.key === '/') {
      const input = document.getElementById('filter-input');
      if (input) {
        e.preventDefault();
        input.focus();
      }
    } else if (e.key === 'n' && state.selectedFile) {
      const jumpBtn = document.getElementById('jump-next-uncovered');
      if (jumpBtn) jumpBtn.click();
    } else if (e.key === 'Escape' && state.refPopoverOpen) {
      e.preventDefault();
      state.refPopoverOpen = false;
      render();
    }
  });

  window.addEventListener('popstate', () => {
    parseRoute();
    render();
  });

  window.addEventListener('hashchange', () => {
    parseRoute();
    render();
  });

  // Dynamic bootstrapping for Drop-in mode
  async function bootstrap() {
    if (data) {
      if (!data.refs) {
        try {
          const rr = await fetch('./refs.json');
          if (rr.ok) data.refs = await rr.json();
        } catch {}
      }
      initState();
      render();
      return;
    }

    // Try fetching covpages-data.json
    try {
      const r = await fetch('./covpages-data.json');
      if (r.ok) {
        data = await r.json();
        if (!data.refs) {
          try {
            const rr = await fetch('./refs.json');
            if (rr.ok) data.refs = await rr.json();
          } catch {}
        }
        initState();
        render();
        return;
      }
    } catch {}

    // Try fetching history.json
    let historyCommits = [];
    try {
      const hr = await fetch('./history.json');
      if (hr.ok) {
        historyCommits = await hr.json();
      }
    } catch {}

    // Try fetching lcov.info
    const candidates = ['./lcov.info', './coverage/lcov.info'];
    for (const cand of candidates) {
      try {
        const lr = await fetch(cand);
        if (lr.ok) {
          const lcovText = await lr.text();
          data = parseClientLcov(lcovText, historyCommits);
          try {
            const rr = await fetch('./refs.json');
            if (rr.ok) data.refs = await rr.json();
          } catch {}
          initState();
          render();
          return;
        }
      } catch {}
    }

    // Fallback: render empty state with drag-and-drop
    render();
  }

  bootstrap();
})();
`;
