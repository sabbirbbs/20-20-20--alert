import { app, BrowserWindow, ipcMain, Notification, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('show-notification', (event, { title, body }) => {
  new Notification({ title, body }).show();
});

ipcMain.on('trigger-blink', () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(true);
    setTimeout(() => mainWindow.setAlwaysOnTop(false), 20000);
  }

  // Create a full-screen transparent window for the blink effect
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  let blinkWin = new BrowserWindow({
    width,
    height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: { nodeIntegration: true }
  });

  blinkWin.setIgnoreMouseEvents(true);

  // Load a simple HTML string that flashes and fades out
  const blinkHtml = `
    <html style="margin:0; padding:0; width:100%; height:100%; background: transparent;">
      <body style="margin:0; padding:0; width:100%; height:100%; background: rgba(16, 185, 129, 0.4); animation: fadeOut 1s forwards;">
        <style>
          @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
          }
        </style>
      </body>
    </html>
  `;
  blinkWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(blinkHtml));

  setTimeout(() => {
    if (blinkWin && !blinkWin.isDestroyed()) {
      blinkWin.close();
    }
  }, 1000);
});
