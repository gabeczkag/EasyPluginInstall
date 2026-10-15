// Thin wrapper around the Modrinth v2 API.
// All requests are proxied through the main process (window.bridge.api.get)
// so that a compliant User-Agent is sent with every call.
(function () {
  // This is a server-plugin downloader, so we only ever browse project_type:plugin.
  const PROJECT_TYPE = 'plugin';

  // Server plugin loaders (Paper first — it's the default).
  const LOADERS = [
    'paper',
    'spigot',
    'bukkit',
    'purpur',
    'folia',
    'velocity',
    'waterfall',
    'bungeecord',
    'sponge',
  ];

  const CATEGORIES = [
    'game-mechanics',
    'economy',
    'management',
    'utility',
    'worldgen',
    'technology',
    'magic',
    'adventure',
    'decoration',
    'library',
    'minigame',
    'optimization',
  ];

  const LOADER_COLORS = {
    paper: '#f7cf0d',
    purpur: '#a45af2',
    spigot: '#e08a2b',
    bukkit: '#d17a3a',
    folia: '#5cc98c',
    velocity: '#38d6d6',
    waterfall: '#3d8dd6',
    bungeecord: '#c6c62b',
    sponge: '#f5c542',
  };

  function buildFacets(filters) {
    const facets = [[`project_type:${PROJECT_TYPE}`]];
    if (filters.loaders && filters.loaders.length) {
      facets.push(filters.loaders.map((l) => `categories:${l}`));
    }
    if (filters.categories && filters.categories.length) {
      facets.push(filters.categories.map((c) => `categories:${c}`));
    }
    if (filters.gameVersions && filters.gameVersions.length) {
      facets.push(filters.gameVersions.map((v) => `versions:${v}`));
    }
    return facets;
  }

  async function search({ query = '', filters = {}, index = 'relevance', offset = 0, limit = 20 }) {
    const params = new URLSearchParams();
    params.set('query', query);
    params.set('index', index);
    params.set('offset', String(offset));
    params.set('limit', String(limit));
    const facets = buildFacets(filters);
    if (facets.length) params.set('facets', JSON.stringify(facets));
    return window.bridge.api.get(`/search?${params.toString()}`);
  }

  const getProject = (id) => window.bridge.api.get(`/project/${id}`);
  const getVersions = (id, loaders, gameVersions) => {
    const params = new URLSearchParams();
    if (loaders && loaders.length) params.set('loaders', JSON.stringify(loaders));
    if (gameVersions && gameVersions.length) params.set('game_versions', JSON.stringify(gameVersions));
    const q = params.toString();
    return window.bridge.api.get(`/project/${id}/version${q ? '?' + q : ''}`);
  };
  const getMembers = (id) => window.bridge.api.get(`/project/${id}/members`);
  const getGameVersions = () => window.bridge.api.get('/tag/game_version');
  const getLoaders = () => window.bridge.api.get('/tag/loader');

  window.MR = {
    PROJECT_TYPE,
    LOADERS,
    CATEGORIES,
    LOADER_COLORS,
    search,
    getProject,
    getVersions,
    getMembers,
    getGameVersions,
    getLoaders,
  };
})();
