import { app, BrowserWindow, ipcMain, Notification, Tray, Menu, nativeImage, shell, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    title: "Zenith OS",
    icon: path.join(__dirname, '../build/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true,
    backgroundColor: '#0f172a'
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function createTray() {
  // Use the generated icon for the tray
  const icon = nativeImage.createFromPath(path.join(__dirname, '../build/icon.png')).resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Zenith OS', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Quit', click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Zenith OS');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.zenith.os');
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: app.getPath('exe')
    });
  }
  createWindow();
  createTray();

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

app.on('before-quit', () => {
  app.isQuitting = true;
});

ipcMain.on('trigger-alert', (event, { title, body }) => {
  // 1. Play standard system beep
  shell.beep();
  
  // 2. Show Desktop Notification
  new Notification({ 
    title, 
    body,
    icon: path.join(__dirname, '../build/icon.png')
  }).show();
  
  // 3. Screen Blink Overlay (Aggressive flash)
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  let blinkWin = new BrowserWindow({
    width, 
    height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    hasShadow: false,
    webPreferences: { nodeIntegration: false }
  });
  
  blinkWin.setIgnoreMouseEvents(true);
  blinkWin.loadURL(`data:text/html;charset=utf-8,
    <body style="background: rgba(59,130,246,0.25); margin:0; height:100vh; overflow:hidden;"></body>
  `);
  
  blinkWin.showInactive();
  
  setTimeout(() => {
    if (blinkWin && !blinkWin.isDestroyed()) {
      blinkWin.close();
    }
  }, 1500); // Flashes the screen blue for 1.5 seconds
});

ipcMain.on('trigger-20-20', () => {
  shell.beep();
  
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  let blockWin = new BrowserWindow({
    width, 
    height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: true,
    hasShadow: false,
    webPreferences: { nodeIntegration: false }
  });
  
  blockWin.setAlwaysOnTop(true, "screen-saver");
  blockWin.setVisibleOnAllWorkspaces(true);
  blockWin.setFullScreen(true);
  
  blockWin.loadURL(`data:text/html;charset=utf-8,
    <body style="background: rgba(15, 23, 42, 0.95); margin:0; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; font-family:sans-serif; overflow:hidden; position:relative;">
      <button id="skip-btn" style="position: absolute; top: 30px; right: 30px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 1.1rem; transition: background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">Skip (Esc)</button>
      <h1 style="font-size: 5rem; margin-bottom: 20px;">Rest Your Eyes</h1>
      <p style="font-size: 2rem; color: #94a3b8;">Look 20 feet away for 20 seconds.</p>
      <div id="countdown" style="font-size: 8rem; font-weight: bold; color: #3b82f6; margin-top: 40px;">20</div>
      <script>
        document.getElementById('skip-btn').addEventListener('click', () => {
          window.close();
        });
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            window.close();
          }
        });
        let count = 20;
        setInterval(() => {
          count--;
          if (count > 0) {
            document.getElementById('countdown').innerText = count;
          } else {
            window.close();
          }
        }, 1000);
      </script>
    </body>
  `);
  
  blockWin.show();
  
  setTimeout(() => {
    if (blockWin && !blockWin.isDestroyed()) {
      shell.beep();
      blockWin.close();
    }
  }, 20000); // Closes after 20 seconds
});

