// ============================================================================
// Easy Plugin Install — renderer / UI logic (vanilla, no build step)
// ============================================================================
(function () {
  const { LOADERS, CATEGORIES, LOADER_COLORS } = window.MR;

  // ------------------------------------------------------------------ icons
  const I = {
    download:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
    downloads:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
    heart:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
    calendar:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    arrowLeft:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    warn:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    folder:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/></svg>',
    external:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
    search:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    empty:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    maximize:
      '<svg viewBox="0 0 12 12"><rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
    restore:
      '<svg viewBox="0 0 12 12"><rect x="2" y="4" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1"/><path d="M4 4V2h6v6H8" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
    mod: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M14 7h5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/><path d="M15 3h6v6"/></svg>',
    plug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6M15 2v6"/><path d="M6 8h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8Z"/><path d="M12 17v5"/></svg>',
    layers:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>',
    image:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></svg>',
    puzzle:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M19 13h-2v-2a2 2 0 0 0-4 0v2h-2a2 2 0 0 0 0 4h2v2a2 2 0 0 0 4 0v-2h2a2 2 0 0 0 0-4Z"/></svg>',
  };
  const typeIcon = { mod: I.mod, plugin: I.plug, datapack: I.layers, shader: I.sun, resourcepack: I.image, modpack: I.box };

  // ---------------------------------------------------------------- helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s = '') =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function fmtNum(n) {
    if (n == null) return '0';
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '');
  function fmtBytes(b) {
    if (!b) return '';
    const u = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (b >= 1024 && i < u.length - 1) {
      b /= 1024;
      i++;
    }
    return `${b.toFixed(b >= 10 || i === 0 ? 0 : 1)} ${u[i]}`;
  }
  const loaderChip = (l) =>
    `<span class="chip loader" style="--chip-color:${LOADER_COLORS[l] || '#42444a'}">${esc(l)}</span>`;
  const catChip = (c) => `<span class="chip">${esc(c)}</span>`;

  // ------------------------------------------------------- markdown (Modrinth-style)
  // Renders Modrinth project bodies (Markdown) to sanitized HTML.
  function inlineMd(s) {
    return s
      .replace(/!\[([^\]]*)\]\((https?:[^)\s]+)\)/g, (_m, alt, url) => `<img src="${url}" alt="${alt}" loading="lazy">`)
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, (_m, text, url) => `<a href="${url}" data-external>${text}</a>`)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
      .replace(/~~([^~]+)~~/g, '<del>$1</del>');
  }

  function renderMarkdown(md) {
    if (!md) return '';
    const lines = String(md).replace(/\r\n/g, '\n').split('\n');
    let html = '';
    let i = 0;
    let list = null;
    const closeList = () => {
      if (list) {
        html += list === 'ul' ? '</ul>' : '</ol>';
        list = null;
      }
    };
    while (i < lines.length) {
      const line = lines[i];
      if (/^```/.test(line)) {
        closeList();
        let code = '';
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) code += lines[i++] + '\n';
        i++;
        html += `<pre><code>${esc(code.replace(/\n$/, ''))}</code></pre>`;
        continue;
      }
      const h = line.match(/^(#{1,4})\s+(.*)$/);
      if (h) {
        closeList();
        const lvl = h[1].length;
        html += `<h${lvl}>${inlineMd(esc(h[2]))}</h${lvl}>`;
        i++;
        continue;
      }
      if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
        closeList();
        html += '<hr>';
        i++;
        continue;
      }
      if (/^>\s?/.test(line)) {
        closeList();
        let q = '';
        while (i < lines.length && /^>\s?/.test(lines[i])) q += lines[i++].replace(/^>\s?/, '') + ' ';
        html += `<blockquote>${inlineMd(esc(q.trim()))}</blockquote>`;
        continue;
      }
      const ul = line.match(/^\s*[-*+]\s+(.*)$/);
      const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
      if (ul || ol) {
        const kind = ul ? 'ul' : 'ol';
        if (list !== kind) {
          closeList();
          html += kind === 'ul' ? '<ul>' : '<ol>';
          list = kind;
        }
        html += `<li>${inlineMd(esc((ul || ol)[1]))}</li>`;
        i++;
        continue;
      }
      if (/^\s*$/.test(line)) {
        closeList();
        i++;
        continue;
      }
      closeList();
      let para = line;
      i++;
      while (
        i < lines.length &&
        !/^\s*$/.test(lines[i]) &&
        !/^(#{1,4})\s/.test(lines[i]) &&
        !/^```/.test(lines[i]) &&
        !/^\s*[-*+]\s/.test(lines[i]) &&
        !/^\s*\d+[.)]\s/.test(lines[i]) &&
        !/^>\s?/.test(lines[i])
      ) {
        para += '\n' + lines[i++];
      }
      html += `<p>${inlineMd(esc(para)).replace(/\n/g, '<br>')}</p>`;
    }
    closeList();
    return html;
  }

  // ------------------------------------------------------------------ state
  const state = {
    view: 'browse',
    query: '',
    filters: { loaders: ['paper'], gameVersions: [], categories: [] },
    index: 'relevance',
    offset: 0,
    limit: 20,
    totalHits: 0,
    results: null,
    loading: false,
    selectedVersion: 'any',
    project: null,
    projectVersions: [],
    downloads: [],
    tagVersions: [],
    tagLoaders: [],
    settings: { downloadDir: '', theme: 'dark', defaultLoader: 'paper', defaultGameVersion: 'any', autoDownload: true },
  };

  // ---------------------------------------------------------------- toasts
  function toast(message, kind = 'ok') {
    const node = document.createElement('div');
    node.className = `toast ${kind}`;
    node.innerHTML = `${kind === 'err' ? I.warn : I.check}<span>${esc(message)}</span>`;
    $('#toasts').appendChild(node);
    setTimeout(() => {
      node.style.opacity = '0';
      node.style.transition = 'opacity .3s';
      setTimeout(() => node.remove(), 300);
    }, 3200);
  }

  // ---------------------------------------------------------------- router
  function setView(view) {
    state.view = view;
    document.querySelectorAll('.nav-tab').forEach((t) => t.classList.toggle('active', t.dataset.view === view));
    $('#sidebar').classList.toggle('hidden', view !== 'browse');
    $('#view').scrollTop = 0;
    if (view === 'browse') renderBrowse();
    else if (view === 'downloads') renderDownloads();
    else if (view === 'settings') renderSettings();
  }

  // ---------------------------------------------------------------- sidebar
  function renderSidebar() {
    const f = state.filters;

    const releases = state.tagVersions.filter((v) => v.version_type === 'release');
    const versionOpts =
      `<option value="">Any version</option>` +
      releases.map((v) => `<option value="${esc(v.version)}" ${state.selectedVersion === v.version ? 'selected' : ''}>${esc(v.version)}</option>`).join('');

    const currentLoader = f.loaders[0] || '';
    const loaderOpts =
      `<option value="" ${!currentLoader ? 'selected' : ''}>Any loader</option>` +
      LOADERS.map(
        (l) => `<option value="${esc(l)}" ${currentLoader === l ? 'selected' : ''}>${esc(l.replace(/^\w/, (m) => m.toUpperCase()))}</option>`
      ).join('');

    const catChks = CATEGORIES.map(
      (c) =>
        `<label class="chk"><input type="checkbox" data-cat="${c}" ${
          f.categories.includes(c) ? 'checked' : ''
        }><span style="text-transform:capitalize">${esc(c.replace(/-/g, ' '))}</span></label>`
    ).join('');

    $('#sidebar').innerHTML = `
      <div class="filter-group">
        <div class="filter-title">Project type</div>
        <div class="seg"><div class="seg-item active">${I.plug}<span>Plugins</span></div></div>
      </div>
      <div class="filter-group">
        <div class="filter-title">Minecraft version</div>
        <select class="select" id="versionSelect">${versionOpts}</select>
      </div>
      <div class="filter-group">
        <div class="filter-title">Loader</div>
        <select class="select" id="loaderSelect">${loaderOpts}</select>
      </div>
      <div class="filter-group">
        <div class="filter-title">Categories</div>
        <div class="seg">${catChks}</div>
      </div>
    `;

    $('#sidebar').querySelectorAll('[data-cat]').forEach((c) =>
      c.addEventListener('change', () => {
        const cat = c.dataset.cat;
        state.filters.categories = c.checked ? [...state.filters.categories, cat] : state.filters.categories.filter((x) => x !== cat);
        state.offset = 0;
        runSearch();
      })
    );
    $('#versionSelect').addEventListener('change', (e) => {
      state.selectedVersion = e.target.value;
      state.filters.gameVersions = e.target.value ? [e.target.value] : [];
      state.offset = 0;
      runSearch();
    });
    $('#loaderSelect').addEventListener('change', (e) => {
      state.filters.loaders = e.target.value ? [e.target.value] : [];
      state.settings.defaultLoader = e.target.value || 'paper';
      saveSettings();
      state.offset = 0;
      runSearch();
    });
  }

  // ---------------------------------------------------------------- browse
  function cardHTML(hit) {
    const tags = [];
    (hit.display_categories || hit.categories || [])
      .filter((c) => LOADER_COLORS[c])
      .slice(0, 2)
      .forEach((l) => tags.push(loaderChip(l)));
    (hit.display_categories || hit.categories || [])
      .filter((c) => !LOADER_COLORS[c])
      .slice(0, 2)
      .forEach((c) => tags.push(catChip(c)));

    return `
      <div class="card" data-project="${esc(hit.project_id)}" tabindex="0">
        <img class="card-icon" loading="lazy" src="${esc(hit.icon_url || '')}" alt="">
        <div class="card-body">
          <div class="card-title">${esc(hit.title)}</div>
          <div class="card-author">by ${esc(hit.author)}</div>
          <div class="card-desc">${esc(hit.description)}</div>
          <div class="card-foot">
            <div class="card-meta">
              <span class="stat">${I.downloads}${fmtNum(hit.downloads)}</span>
              ${tags.join('')}
            </div>
            <button class="btn primary sm card-dl" data-download="${esc(hit.project_id)}" title="Download for the selected version">${I.download} Download</button>
          </div>
        </div>
      </div>`;
  }

  async function runSearch() {
    state.loading = true;
    const view = $('#view');
    const skeletons = Array.from({ length: 8 }).map(() => '<div class="skeleton sk-card"></div>').join('');
    const head = buildBrowseHead();
    if (state.results === null) view.innerHTML = head + `<div class="grid">${skeletons}</div>`;

    try {
      const res = await window.MR.search({
        query: state.query,
        filters: state.filters,
        index: state.index,
        offset: state.offset,
        limit: state.limit,
      });
      // Only list projects that actually have downloadable versions.
      state.results = (res.hits || []).filter((h) => h.versions && h.versions.length && h.latest_version);
      state.totalHits = res.total_hits;
    } catch (err) {
      state.results = [];
      state.totalHits = 0;
      toast('Search failed: ' + err.message, 'err');
    }
    state.loading = false;
    renderBrowse();
  }

  function buildBrowseHead() {
    const loader = state.filters.loaders[0];
    const ver = state.filters.gameVersions[0];
    const ctx = [loader, ver].filter(Boolean).join(' · ');
    return `
      <div class="page-head">
        <div>
          <h1>${state.query ? `Results for “${esc(state.query)}”` : 'Plugins'}</h1>
          <div class="result-count">${fmtNum(state.totalHits)} plugins found${ctx ? ` · auto-download for ${esc(ctx)}` : ''}</div>
        </div>
        <div class="controls">
          <select class="select" id="sortSelect" style="width:170px">
            <option value="relevance" ${state.index === 'relevance' ? 'selected' : ''}>Relevance</option>
            <option value="downloads" ${state.index === 'downloads' ? 'selected' : ''}>Downloads</option>
            <option value="follows" ${state.index === 'follows' ? 'selected' : ''}>Followers</option>
            <option value="newest" ${state.index === 'newest' ? 'selected' : ''}>Newest</option>
            <option value="updated" ${state.index === 'updated' ? 'selected' : ''}>Recently updated</option>
          </select>
        </div>
      </div>`;
  }

  function renderBrowse() {
    const view = $('#view');
    let body;
    if (state.loading && state.results === null) {
      body = `<div class="grid">${Array.from({ length: 8 }).map(() => '<div class="skeleton sk-card"></div>').join('')}</div>`;
    } else if (!state.results || state.results.length === 0) {
      body = `<div class="empty">${I.empty}<h2>No projects found</h2><p>Try a different search or clear some filters.</p></div>`;
    } else {
      const page = Math.floor(state.offset / state.limit) + 1;
      const pages = Math.max(1, Math.ceil(state.totalHits / state.limit));
      body = `
        <div class="grid">${state.results.map(cardHTML).join('')}</div>
        <div class="pagination">
          <button class="btn sm" id="prevPage" ${state.offset === 0 ? 'disabled' : ''}>${I.arrowLeft} Prev</button>
          <span class="result-count">Page ${page} of ${pages}</span>
          <button class="btn sm" id="nextPage" ${state.offset + state.limit >= state.totalHits ? 'disabled' : ''}>Next</button>
        </div>`;
    }
    view.innerHTML = buildBrowseHead() + body;

    const sort = $('#sortSelect');
    if (sort)
      sort.addEventListener('change', () => {
        state.index = sort.value;
        state.offset = 0;
        runSearch();
      });
    const prev = $('#prevPage');
    if (prev) prev.addEventListener('click', () => { state.offset = Math.max(0, state.offset - state.limit); runSearch(); });
    const next = $('#nextPage');
    if (next) next.addEventListener('click', () => { state.offset += state.limit; runSearch(); });

    view.querySelectorAll('[data-project]').forEach((c) =>
      c.addEventListener('click', () => openProject(c.dataset.project))
    );
    view.querySelectorAll('[data-download]').forEach((btn) =>
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const hit = (state.results || []).find((h) => h.project_id === btn.dataset.download);
        if (hit) downloadLatest(hit, btn);
      })
    );
  }

  // -------------------------------------------------- one-click auto download
  // Fetches the newest version that matches the selected loader + Minecraft
  // version and downloads its primary file. No need to open the project page.
  async function downloadLatest(hit, btn) {
    const project = { id: hit.project_id, title: hit.title, icon_url: hit.icon_url };
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width:15px;height:15px;border-width:2px;margin:0"></span> Finding...';
    try {
      const versions = await window.MR.getVersions(project.id, state.filters.loaders, state.filters.gameVersions);
      if (!versions || versions.length === 0) {
        toast(`No ${state.filters.loaders[0] || ''} ${state.filters.gameVersions[0] || ''} build for ${hit.title}`, 'err');
        return;
      }
      const v = versions[0];
      const file = v.files.find((f) => f.primary) || v.files[0];
      if (!file) {
        toast('No downloadable file found', 'err');
        return;
      }
      await startDownload(project, v, file);
    } catch (err) {
      toast('Download failed: ' + err.message, 'err');
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  }

  // ---------------------------------------------------------------- detail
  async function openProject(id) {
    state.view = 'project';
    $('#sidebar').classList.add('hidden');
    document.querySelectorAll('.nav-tab').forEach((t) => t.classList.remove('active'));
    const view = $('#view');
    view.scrollTop = 0;
    view.innerHTML = `<div class="spinner"></div>`;

    try {
      const [project, versions] = await Promise.all([
        window.MR.getProject(id),
        window.MR.getVersions(id),
      ]);
      state.project = project;
      state.projectVersions = versions;
      state.projectFilter = 'all';
      state.projectAuthor = 'unknown';
      try {
        const members = await window.MR.getMembers(id);
        const owner =
          members.find((m) => m.role === 'Owner' || m.role === 'owner') || members[0];
        if (owner && owner.user) state.projectAuthor = owner.user.username;
      } catch (_) {}
    } catch (err) {
      view.innerHTML = `<div class="empty">${I.warn}<h2>Could not load project</h2><p>${esc(err.message)}</p><button class="btn sm" id="backBtn">${I.arrowLeft} Go back</button></div>`;
      $('#backBtn').addEventListener('click', () => setView('browse'));
      return;
    }
    renderProject();
  }

  function renderProject() {
    const p = state.project;
    const versions = state.projectVersions;
    const view = $('#view');
    const cats = (p.categories || []).filter((c) => !LOADER_COLORS[c]);
    const loaders = [...new Set(versions.flatMap((v) => v.loaders))].slice(0, 8);

    const gameVersionsPresent = [...new Set(versions.flatMap((v) => v.game_versions))];
    const filterOpts = ['<option value="all">All versions</option>']
      .concat(gameVersionsPresent.slice(0, 40).map((g) => `<option value="${esc(g)}">${esc(g)}</option>`))
      .join('');

    const shown = state.projectFilter && state.projectFilter !== 'all'
      ? versions.filter((v) => v.game_versions.includes(state.projectFilter))
      : versions;

    const selLoader = state.filters.loaders[0];
    const selVersion = state.filters.gameVersions[0];
    const typeColor = { release: '#1bd96a', beta: '#ffa347', alpha: '#ff496e' };
    const hasFilter = !!(selLoader || selVersion);

    const versionRows = shown
      .slice(0, 40)
      .map((v, idx) => {
        const file = v.files.find((f) => f.primary) || v.files[0];
        const isLatest = idx === 0;
        const matches =
          (!selLoader || v.loaders.includes(selLoader)) && (!selVersion || v.game_versions.includes(selVersion));
        const tc = typeColor[v.version_type] || '#9fa4b3';
        return `
        <div class="version ${isLatest ? 'is-latest' : ''}">
          <div class="version-main">
            <div class="version-name">
              ${esc(v.name || v.version_number)}
              ${isLatest ? '<span class="version-badge">Latest</span>' : ''}
              ${matches && hasFilter ? '<span class="version-badge match">Matches</span>' : ''}
            </div>
            <div class="version-sub">
              <span class="dl-tag" style="background:${tc};color:#04140a;border-color:transparent;height:18px;vertical-align:middle">${esc(v.version_type)}</span>
              ${esc(v.version_number)} &nbsp;·&nbsp; ${fmtDate(v.date_published)} &nbsp;·&nbsp; ${fmtNum(v.downloads)} downloads
            </div>
            <div class="version-tags">
              ${v.loaders.map(loaderChip).join('')}
              ${v.game_versions.slice(0, 6).map((g) => `<span class="chip">${esc(g)}</span>`).join('')}
              ${v.game_versions.length > 6 ? `<span class="chip">+${v.game_versions.length - 6}</span>` : ''}
            </div>
            ${file ? `<div class="version-file">${esc(file.filename)} · ${fmtBytes(file.size)}</div>` : ''}
          </div>
          <div class="version-actions">
            <button class="btn primary sm" data-dl-version="${esc(v.id)}" ${file ? '' : 'disabled'}>${I.download} Download</button>
            ${file ? `<button class="btn sm" data-open-version="${esc(v.id)}">Details</button>` : ''}
          </div>
        </div>`;
      })
      .join('') || `<div class="empty">${I.empty}<h2>No versions</h2><p>No files available for this filter.</p></div>`;

    view.innerHTML = `
      <div class="detail">
        <button class="btn ghost sm back-btn" id="backBtn">${I.arrowLeft} Back to browse</button>
        <div class="detail-head">
          <img class="detail-icon" src="${esc(p.icon_url || '')}" alt="">
          <div style="flex:1">
            <h1 class="detail-title">${esc(p.title)}</h1>
            <div class="detail-author">by ${esc(state.projectAuthor || 'unknown')}</div>
            <div class="detail-desc">${esc(p.description)}</div>
            <div class="detail-tags">
              <span class="chip loader" style="--chip-color:var(--surface-5);color:var(--text-primary);text-transform:capitalize">${esc(p.project_type)}</span>
              ${loaders.map(loaderChip).join('')}
              ${cats.map(catChip).join('')}
            </div>
            <div class="detail-stats">
              <div class="detail-stat"><b>${fmtNum(p.downloads)}</b><span>Downloads</span></div>
              <div class="detail-stat"><b>${fmtNum(p.followers)}</b><span>Followers</span></div>
              <div class="detail-stat"><b>${versions.length}</b><span>Versions</span></div>
              ${p.updated ? `<div class="detail-stat"><b>${esc(fmtDate(p.updated))}</b><span>Updated</span></div>` : ''}
            </div>
            <div style="margin-top:16px;display:flex;gap:8px">
              <button class="btn sm" id="openModrinth">${I.external} Open on Modrinth</button>
            </div>
          </div>
        </div>

        ${
          p.body
            ? `<div class="section-title">Description</div>
               <div class="settings-card md" style="max-width:none">${renderMarkdown(p.body)}</div>`
            : ''
        }

        <div class="section-title" style="display:flex;justify-content:space-between;align-items:center">
          <span>Versions (${shown.length})</span>
          <select class="select" id="projFilter" style="width:200px">${filterOpts}</select>
        </div>
        <div>${versionRows}</div>
      </div>`;

    $('#backBtn').addEventListener('click', () => setView('browse'));
    $('#projFilter').addEventListener('change', (e) => {
      state.projectFilter = e.target.value;
      renderProject();
    });
    $('#openModrinth').addEventListener('click', () =>
      window.bridge.system.openExternal(`https://modrinth.com/project/${p.project_type === 'plugin' ? 'plugin' : p.project_type}/${p.slug || p.id}`)
    );
    view.querySelectorAll('[data-dl-version]').forEach((b) =>
      b.addEventListener('click', () => {
        const v = versions.find((x) => x.id === b.dataset.dlVersion);
        const file = v.files.find((f) => f.primary) || v.files[0];
        startDownload(p, v, file);
      })
    );
    view.querySelectorAll('[data-open-version]').forEach((b) =>
      b.addEventListener('click', () => {
        const v = versions.find((x) => x.id === b.dataset.openVersion);
        window.bridge.system.openExternal(`https://modrinth.com/project/${p.slug || p.id}/version/${v.version_number}`);
      })
    );
  }

  // -------------------------------------------------------------- downloads
  async function startDownload(project, version, file) {
    const id = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now() + Math.random());
    const item = {
      id,
      projectId: project.id,
      title: project.title,
      icon: project.icon_url,
      version: version.version_number,
      versionName: version.name || version.version_number,
      loaders: version.loaders || [],
      gameVersions: version.game_versions || [],
      filename: file.filename,
      url: file.url,
      total: file.size || 0,
      received: 0,
      percent: 0,
      status: 'downloading',
      path: null,
      error: null,
    };
    state.downloads.unshift(item);
    updateBadge();
    if (state.view === 'downloads') renderDownloads();
    toast(`Downloading ${file.filename}`);

    try {
      const res = await window.bridge.download.start({
        id,
        url: file.url,
        filename: file.filename,
        directory: state.settings.downloadDir || null,
      });
      item.status = 'done';
      item.path = res.path;
      item.percent = 100;
      toast(`Saved ${file.filename}`, 'ok');
      showDownloadToast(item);
    } catch (err) {
      item.status = 'error';
      item.error = err.message;
      toast('Download failed: ' + err.message, 'err');
    }
    updateBadge();
    if (state.view === 'downloads') renderDownloads();
  }

  function showDownloadToast(item) {
    const node = document.createElement('div');
    node.className = 'toast ok';
    node.innerHTML = `${I.check}<span><b>${esc(item.filename)}</b> downloaded</span>
      <button class="btn sm" style="margin-left:auto">Open</button>`;
    node.querySelector('button').addEventListener('click', () => {
      window.bridge.system.showInFolder(item.path);
    });
    $('#toasts').appendChild(node);
    setTimeout(() => node.remove(), 6000);
  }

  function updateBadge() {
    const active = state.downloads.filter((d) => d.status === 'downloading').length;
    const badge = $('#dlBadge');
    badge.hidden = active === 0;
    badge.textContent = String(active);
  }

  function renderDownloads() {
    const view = $('#view');
    if (state.downloads.length === 0) {
      view.innerHTML = `<div class="empty">${I.downloads}<h2>No downloads yet</h2><p>Browse for mods and plugins and hit download.</p></div>`;
      return;
    }
    view.innerHTML = `
      <div class="page-head">
        <div><h1>Downloads</h1><div class="result-count">${state.downloads.length} items</div></div>
        <div class="controls">
          <button class="btn sm ghost" id="openFolder">${I.folder} Open download folder</button>
          <button class="btn sm ghost" id="clearDone">Clear finished</button>
        </div>
      </div>
      ${state.downloads
        .map(
          (d) => `
        <div class="dl-item" data-id="${d.id}">
          <img class="dl-icon" src="${esc(d.icon || '')}" alt="">
          <div class="dl-body">
            <div class="dl-name">${esc(d.title)}</div>
            <div class="dl-file">${esc(d.filename)}${d.total ? ' · ' + fmtBytes(d.total) : ''}</div>
            <div class="dl-tags">
              <span class="dl-tag">Version <b>${esc(d.version)}</b></span>
              ${
                d.loaders && d.loaders.length
                  ? d.loaders
                      .map(
                        (l) =>
                          `<span class="dl-tag engine" style="--chip-color:${LOADER_COLORS[l] || '#42444a'}">${esc(l)}</span>`
                      )
                      .join('')
                  : '<span class="dl-tag">Engine <b>—</b></span>'
              }
            </div>
            ${
              d.status === 'downloading'
                ? `<div class="progress"><i data-bar="${d.id}" style="width:${d.percent}%"></i></div>`
                : ''
            }
            <div class="dl-status ${d.status === 'done' ? 'ok' : d.status === 'error' ? 'err' : ''}">
              ${
                d.status === 'downloading'
                  ? `${d.percent ? d.percent.toFixed(0) + '% · ' : ''}${fmtBytes(d.received)}${d.total ? ' / ' + fmtBytes(d.total) : ''}`
                  : d.status === 'done'
                  ? 'Completed'
                  : 'Error: ' + esc(d.error || '')
              }
            </div>
          </div>
          ${
            d.status === 'done'
              ? `<button class="btn sm" data-open="${d.id}">${I.folder} Show</button>`
              : d.status === 'error'
              ? `<button class="btn sm" data-retry="${d.id}">Retry</button>`
              : ''
          }
        </div>`
        )
        .join('')}`;

    $('#openFolder').addEventListener('click', () => window.bridge.system.showInFolder(state.settings.downloadDir || ''));
    $('#clearDone').addEventListener('click', () => {
      state.downloads = state.downloads.filter((d) => d.status === 'downloading');
      renderDownloads();
    });
    view.querySelectorAll('[data-open]').forEach((b) =>
      b.addEventListener('click', () => {
        const d = state.downloads.find((x) => x.id === b.dataset.open);
        if (d && d.path) window.bridge.system.showInFolder(d.path);
      })
    );
    view.querySelectorAll('[data-retry]').forEach((b) =>
      b.addEventListener('click', () => {
        const d = state.downloads.find((x) => x.id === b.dataset.retry);
        if (d) {
          d.status = 'downloading';
          d.percent = 0;
          d.received = 0;
          retryDownload(d);
        }
      })
    );
  }

  async function retryDownload(d) {
    try {
      const res = await window.bridge.download.start({
        id: d.id,
        url: d.url,
        filename: d.filename,
        directory: state.settings.downloadDir || null,
      });
      d.status = 'done';
      d.path = res.path;
      toast(`Saved ${d.filename}`, 'ok');
    } catch (err) {
      d.status = 'error';
      d.error = err.message;
    }
    updateBadge();
    renderDownloads();
  }

  // --------------------------------------------------------------- settings
  async function renderSettings() {
    const view = $('#view');
    const paths = await window.bridge.system.getPaths();
    const dir = state.settings.downloadDir || paths.downloads;
    const loaderOpts = LOADERS.map(
      (l) => `<option value="${esc(l)}" ${state.settings.defaultLoader === l ? 'selected' : ''}>${esc(l.replace(/^\w/, (m) => m.toUpperCase()))}</option>`
    ).join('');
    const releases = state.tagVersions.filter((v) => v.version_type === 'release');
    const verOpts =
      `<option value="any">Any</option>` +
      releases.map((v) => `<option value="${esc(v.version)}" ${state.settings.defaultGameVersion === v.version ? 'selected' : ''}>${esc(v.version)}</option>`).join('');

    view.innerHTML = `
      <div class="page-head"><div><h1>Settings</h1></div></div>

      <div class="settings-card">
        <h3>Download folder</h3>
        <p>Files downloaded from Modrinth will be saved here.</p>
        <div class="field-row">
          <input class="text" id="dirInput" value="${esc(dir)}" spellcheck="false">
          <button class="btn sm" id="browseDir">${I.folder} Browse</button>
        </div>
      </div>

      <div class="settings-card">
        <h3>Defaults</h3>
        <p>The Download button always fetches the newest build matching these.</p>
        <div class="field-row" style="flex-wrap:wrap">
          <label class="chk" style="gap:12px">Default loader
            <select class="select" id="defLoader" style="width:180px">${loaderOpts}</select>
          </label>
          <label class="chk" style="gap:12px">Default Minecraft version
            <select class="select" id="defVer" style="width:160px">${verOpts}</select>
          </label>
        </div>
      </div>

      <div class="settings-card">
        <h3>Appearance</h3>
        <p>Choose a color theme. Dark matches the Modrinth website.</p>
        <div class="theme-opts">
          <button class="theme-opt ${state.settings.theme === 'dark' ? 'active' : ''}" data-theme="dark">Dark</button>
          <button class="theme-opt ${state.settings.theme === 'light' ? 'active' : ''}" data-theme="light">Light</button>
          <button class="theme-opt ${state.settings.theme === 'system' ? 'active' : ''}" data-theme="system">System</button>
        </div>
      </div>

      <div class="settings-card">
        <h3>About</h3>
        <p>Easy Plugin Install — a simple Modrinth-powered mod & plugin downloader.<br>
        Data provided by the Modrinth API. Not affiliated with Modrinth.</p>
      </div>`;

    $('#browseDir').addEventListener('click', async () => {
      const chosen = await window.bridge.system.chooseDirectory();
      if (chosen) {
        state.settings.downloadDir = chosen;
        $('#dirInput').value = chosen;
        await saveSettings();
        toast('Download folder updated');
      }
    });
    $('#dirInput').addEventListener('change', async (e) => {
      state.settings.downloadDir = e.target.value.trim();
      await saveSettings();
    });
    $('#defLoader').addEventListener('change', async (e) => {
      state.settings.defaultLoader = e.target.value;
      state.filters.loaders = [e.target.value];
      await saveSettings();
    });
    $('#defVer').addEventListener('change', async (e) => {
      state.settings.defaultGameVersion = e.target.value;
      await saveSettings();
    });
    view.querySelectorAll('[data-theme]').forEach((b) =>
      b.addEventListener('click', async () => {
        state.settings.theme = b.dataset.theme;
        applyTheme();
        await saveSettings();
        renderSettings();
      })
    );
  }

  // -------------------------------------------------------------- settings io
  async function saveSettings() {
    try {
      await window.bridge.settings.save(state.settings);
    } catch (_) {}
  }

  function applyTheme() {
    const theme = state.settings.theme;
    const resolved =
      theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
    document.documentElement.classList.toggle('dark-mode', resolved === 'dark');
    document.documentElement.classList.toggle('light-mode', resolved === 'light');
    $('#themeToggle').innerHTML = resolved === 'dark' ? I.moon : I.sun;
    window.bridge.system.setTheme(theme);
  }

  // -------------------------------------------------------------------- init
  async function init() {
    // persisted settings
    try {
      const saved = await window.bridge.settings.load();
      if (saved) state.settings = { ...state.settings, ...saved };
    } catch (_) {}

    state.filters.loaders = state.settings.defaultLoader ? [state.settings.defaultLoader] : ['paper'];
    if (state.settings.defaultGameVersion && state.settings.defaultGameVersion !== 'any') {
      state.selectedVersion = state.settings.defaultGameVersion;
      state.filters.gameVersions = [state.settings.defaultGameVersion];
    }
    applyTheme();

    // tags
    try {
      const [versions, loaders] = await Promise.all([window.MR.getGameVersions(), window.MR.getLoaders()]);
      state.tagVersions = versions;
      state.tagLoaders = loaders.map((l) => l.name);
    } catch (_) {}

    renderSidebar();
    renderBrowse();
    runSearch();

    window.__epi = state;

    // nav
    document.querySelectorAll('.nav-tab').forEach((t) =>
      t.addEventListener('click', () => setView(t.dataset.view))
    );

    $('#view').addEventListener(
      'error',
      (e) => {
        const t = e.target;
        if (t && t.tagName === 'IMG') t.style.visibility = 'hidden';
      },
      true
    );

    // links (markdown + anywhere in the content) open in the system browser
    $('#view').addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (a && /^https?:/i.test(a.getAttribute('href'))) {
        e.preventDefault();
        window.bridge.system.openExternal(a.getAttribute('href'));
      }
    });

    // custom title-bar window controls
    const maxBtn = $('#winMax');
    const setMaxIcon = (max) => {
      maxBtn.innerHTML = max ? I.restore : I.maximize;
      maxBtn.title = max ? 'Restore' : 'Maximize';
    };
    $('#winMin').addEventListener('click', () => window.bridge.win.minimize());
    maxBtn.addEventListener('click', async () => setMaxIcon(await window.bridge.win.toggleMaximize()));
    $('#winClose').addEventListener('click', () => window.bridge.win.close());
    window.bridge.win.isMaximized().then(setMaxIcon);
    window.bridge.win.onState(({ maximized }) => setMaxIcon(maximized));
    document.querySelector('.navbar').addEventListener('dblclick', (e) => {
      if (!(e.target.closest && e.target.closest('button, input, a'))) {
        window.bridge.win.toggleMaximize().then(setMaxIcon);
      }
    });

    // search (debounced)
    const input = $('#searchInput');
    let t;
    input.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        state.query = input.value.trim();
        state.offset = 0;
        if (state.view !== 'browse') setView('browse');
        else runSearch();
      }, 380);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(t);
        state.query = input.value.trim();
        state.offset = 0;
        if (state.view !== 'browse') setView('browse');
        else runSearch();
      }
    });

    // theme toggle
    $('#themeToggle').addEventListener('click', () => {
      const order = ['dark', 'light'];
      const cur = state.settings.theme === 'light' ? 'light' : 'dark';
      state.settings.theme = order[(order.indexOf(cur) + 1) % order.length];
      applyTheme();
      saveSettings();
    });

    // download progress
    window.bridge.download.onProgress(({ id, received, total, percent }) => {
      const d = state.downloads.find((x) => x.id === id);
      if (!d) return;
      d.received = received;
      d.total = total || d.total;
      d.percent = percent;
      const bar = document.querySelector(`[data-bar="${id}"]`);
      if (bar) bar.style.width = percent + '%';
      const item = document.querySelector(`.dl-item[data-id="${id}"] .dl-status`);
      if (item && d.status === 'downloading') {
        item.textContent = `${percent ? percent.toFixed(0) + '% · ' : ''}${fmtBytes(received)}${total ? ' / ' + fmtBytes(total) : ''}`;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
