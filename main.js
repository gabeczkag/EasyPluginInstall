const { app, BrowserWindow, ipcMain, dialog, shell, nativeTheme } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const https = require('node:https');
const { URL } = require('node:url');

const USER_AGENT = 'EasyPluginInstall/1.0.0 (github.com/easy-plugin-install; contact@easyplugininstall.dev)';
const API_BASE = 'https://api.modrinth.com/v2';
const isDev = process.argv.includes('--dev');

let mainWindow = null;
const activeDownloads = new Map();
const APP_ICON = path.join(__dirname, 'build', process.platform === 'win32' ? 'icon.ico' : 'icon.png');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 960,
    minHeight: 620,
    backgroundColor: '#16181c',
    show: false,
    autoHideMenuBar: true,
    frame: false,
    icon: APP_ICON,
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default',
    trafficLightPosition: process.platform === 'darwin' ? { x: 14, y: 20 } : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const rendererErrors = [];
  mainWindow.webContents.on('console-message', (_e, level, message) => {
    if (level >= 2) rendererErrors.push(message);
  });
  mainWindow.webContents.on('render-process-gone', (_e, details) => {
    console.error('[smoke] renderer gone:', JSON.stringify(details));
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWindow.once('ready-to-show', () => mainWindow.show());

  const sendWindowState = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window:state', { maximized: mainWindow.isMaximized() });
    }
  };
  mainWindow.on('maximize', sendWindowState);
  mainWindow.on('unmaximize', sendWindowState);

  // Headless smoke test: render, hit the API through IPC, report, quit.
  if (process.env.EPI_SMOKE) {
    mainWindow.webContents.once('did-finish-load', async () => {
      try {
        await new Promise((r) => setTimeout(r, 3500));
        const smokeDir = JSON.stringify(app.getPath('temp'));
        const report = await mainWindow.webContents.executeJavaScript(`(async () => {
          const require_temp_dir = ${smokeDir};
          if (window.__epi) window.__epi.settings.downloadDir = require_temp_dir;
          const cards = document.querySelectorAll('.card').length;
          const cardDownloadBtns = document.querySelectorAll('[data-download]').length;
          const sidebarLoader = (document.querySelector('#loaderSelect') || {}).value || null;
          let sampleTitle = null;
          try {
            const res = await window.bridge.api.get('/search?query=essentials&limit=1&facets=' + encodeURIComponent(JSON.stringify([['project_type:plugin']])));
            sampleTitle = res.total_hits + ':' + (res.hits[0] && res.hits[0].title);
          } catch (e) { sampleTitle = 'ERR ' + e.message; }
          const titlebar = ['#winMin', '#winMax', '#winClose'].map((s) => !!document.querySelector(s));
          // simulate clicking the first card's Download button (auto version pick)
          let autoDl = null;
          const btn = document.querySelector('[data-download]');
          if (btn) {
            btn.click();
            await new Promise((r) => setTimeout(r, 6000));
            const d = (window.__epi ? window.__epi.downloads : []).find((x) => x.status === 'done');
            autoDl = { anyDone: !!d, file: d ? d.filename : null, loaders: d ? d.loaders : null };
          }
          // open project detail -> check markdown + version list polish
          let detail = null;
          const card = document.querySelector('.card');
          if (card) {
            card.click();
            await new Promise((r) => setTimeout(r, 3500));
            const md = document.querySelector('.md');
            detail = {
              title: (document.querySelector('.detail-title') || {}).textContent || null,
              mdNodes: md ? md.querySelectorAll('h1,h2,h3,ul,ol,pre,p,blockquote').length : 0,
              mdSample: md ? md.innerHTML.slice(0, 60) : null,
              versions: document.querySelectorAll('.version').length,
              latestBadges: document.querySelectorAll('.version .version-badge').length,
            };
          }
          // downloads view -> check Version + engine tags
          let dlView = null;
          const dlTab = document.querySelector('.nav-tab[data-view="downloads"]');
          if (dlTab) {
            dlTab.click();
            await new Promise((r) => setTimeout(r, 600));
            dlView = { items: document.querySelectorAll('.dl-item').length, tags: [...document.querySelectorAll('.dl-tag')].map((t) => t.textContent.trim()).slice(0, 4) };
          }
          return { hasMR: !!window.MR, cards, cardDownloadBtns, sidebarLoader, sampleTitle, titlebar, autoDl, detail, dlView };
        })()`);
        console.log('[smoke]', JSON.stringify(report, null, 2));
        console.log('[smoke] renderer-errors:', JSON.stringify(rendererErrors));
      } catch (err) {
        console.error('[smoke] failed:', err.message);
      } finally {
        app.exit(0);
      }
    });
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
}

// ---------------------------------------------------------------------------
// Modrinth API proxy (kept in the main process so we can set a proper
// User-Agent, which Modrinth requires for API consumers).
// ---------------------------------------------------------------------------
function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return httpGetJson(res.headers.location).then(resolve, reject);
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(`Request failed (${res.statusCode}): ${body.slice(0, 300)}`));
          }
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error('Invalid JSON from Modrinth API'));
          }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('Request timed out')));
  });
}

ipcMain.handle('modrinth:get', async (_event, route) => {
  if (typeof route !== 'string' || !route.startsWith('/')) {
    throw new Error('Invalid API route');
  }
  return httpGetJson(`${API_BASE}${route}`);
});

ipcMain.handle('shell:openExternal', async (_event, url) => {
  if (/^https?:/.test(url)) await shell.openExternal(url);
});

// ---------------------------------------------------------------------------
// Download handling with live progress reporting.
// ---------------------------------------------------------------------------
function downloadFile(id, fileUrl, destination, sender) {
  return new Promise((resolve, reject) => {
    const request = https.get(fileUrl, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return downloadFile(id, res.headers.location, destination, sender).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`Download failed (${res.statusCode})`));
      }

      const total = Number(res.headers['content-length']) || 0;
      let received = 0;
      const tmp = `${destination}.part`;
      const out = fs.createWriteStream(tmp);

      res.on('data', (chunk) => {
        received += chunk.length;
        if (!sender.isDestroyed()) {
          sender.send('download:progress', {
            id,
            received,
            total,
            percent: total ? Math.min(100, (received / total) * 100) : 0,
          });
        }
      });

      res.pipe(out);
      out.on('finish', () => {
        out.close(() => {
          fs.rename(tmp, destination, (err) => (err ? reject(err) : resolve(destination)));
        });
      });
      out.on('error', reject);
      res.on('error', reject);
    });

    request.on('error', reject);
    request.setTimeout(60000, () => request.destroy(new Error('Download timed out')));
  });
}

function uniquePath(dir, filename) {
  const safe = filename.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
  let candidate = path.join(dir, safe);
  if (!fs.existsSync(candidate)) return candidate;
  const ext = path.extname(safe);
  const base = path.basename(safe, ext);
  let i = 1;
  while (fs.existsSync(candidate)) {
    candidate = path.join(dir, `${base} (${i})${ext}`);
    i += 1;
  }
  return candidate;
}

ipcMain.handle('download:start', async (event, payload) => {
  const { id, url, filename, directory } = payload || {};
  if (!id || !url || !filename) throw new Error('Invalid download payload');

  const sender = event.sender;
  const dir = directory || app.getPath('downloads');
  await fsp.mkdir(dir, { recursive: true });

  const destination = uniquePath(dir, filename);
  const controller = { cancelled: false };
  activeDownloads.set(id, controller);

  try {
    await downloadFile(id, url, destination, sender);
    activeDownloads.delete(id);
    return { ok: true, path: destination };
  } catch (err) {
    activeDownloads.delete(id);
    try {
      await fsp.rm(`${destination}.part`, { force: true });
    } catch (_) {}
    throw err;
  }
});

ipcMain.handle('download:cancel', async (_event, id) => {
  const c = activeDownloads.get(id);
  if (c) c.cancelled = true;
  return true;
});

// ---------------------------------------------------------------------------
// App / system helpers
// ---------------------------------------------------------------------------
ipcMain.handle('app:getPaths', async () => ({
  downloads: app.getPath('downloads'),
  home: app.getPath('home'),
}));

ipcMain.handle('dialog:chooseDirectory', async () => {
  const res = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
    title: 'Select download folder',
  });
  if (res.canceled || !res.filePaths.length) return null;
  return res.filePaths[0];
});

ipcMain.handle('shell:showInFolder', async (_event, filePath) => {
  if (filePath) shell.showItemInFolder(filePath);
});

ipcMain.handle('settings:load', async () => {
  try {
    const raw = await fsp.readFile(path.join(app.getPath('userData'), 'settings.json'), 'utf8');
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
});

ipcMain.handle('settings:save', async (_event, settings) => {
  await fsp.writeFile(
    path.join(app.getPath('userData'), 'settings.json'),
    JSON.stringify(settings, null, 2),
    'utf8'
  );
  return true;
});

ipcMain.handle('theme:set', async (_event, theme) => {
  nativeTheme.themeSource = theme === 'system' ? 'system' : theme;
  return true;
});

// ---------------------------------------------------------------------------
// Custom title-bar window controls
// ---------------------------------------------------------------------------
ipcMain.handle('window:minimize', () => mainWindow && mainWindow.minimize());
ipcMain.handle('window:toggleMaximize', () => {
  if (!mainWindow) return false;
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
  return mainWindow.isMaximized();
});
ipcMain.handle('window:close', () => mainWindow && mainWindow.close());
ipcMain.handle('window:isMaximized', () => !!(mainWindow && mainWindow.isMaximized()));

app.setAppUserModelId('com.gabeczkag.easyplugininstall');

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
