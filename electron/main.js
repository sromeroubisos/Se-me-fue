// Versión de escritorio de Se me fue: abre la misma app web en una ventana propia.
// Los datos quedan en el almacenamiento local de la app (%APPDATA%\Se me fue en Windows).
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('node:path');

const WEB = path.join(__dirname, '..', 'web');

if (!app.requestSingleInstanceLock()) app.quit();

let win = null;

function openExternal(url) {
  if (/^(https?|mailto):/.test(url)) shell.openExternal(url);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 380,
    minHeight: 560,
    show: false,
    title: 'Se me fue',
    backgroundColor: '#0f0f0e',
    autoHideMenuBar: true,
    icon: path.join(WEB, 'icons', 'icon-512.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });

  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(WEB, 'index.html'));

  // La app solo navega entre sus propios archivos; cualquier link externo se abre en el navegador.
  win.webContents.setWindowOpenHandler(({ url }) => { openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) { event.preventDefault(); openExternal(url); }
  });
}

// Menú mínimo (se muestra con Alt): mantiene los atajos de edición y zoom.
const menu = Menu.buildFromTemplate([
  ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
  {
    label: 'Editar',
    submenu: [
      { role: 'undo', label: 'Deshacer' },
      { role: 'redo', label: 'Rehacer' },
      { type: 'separator' },
      { role: 'cut', label: 'Cortar' },
      { role: 'copy', label: 'Copiar' },
      { role: 'paste', label: 'Pegar' },
      { role: 'selectAll', label: 'Seleccionar todo' }
    ]
  },
  {
    label: 'Ver',
    submenu: [
      { role: 'reload', label: 'Recargar' },
      { type: 'separator' },
      { role: 'resetZoom', label: 'Tamaño real' },
      { role: 'zoomIn', label: 'Acercar' },
      { role: 'zoomOut', label: 'Alejar' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: 'Pantalla completa' }
    ]
  }
]);

app.on('second-instance', () => {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  win.focus();
});

app.whenReady().then(() => {
  Menu.setApplicationMenu(menu);
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
