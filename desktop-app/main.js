const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;
let whatsappWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#e0f2fe',
    icon: path.join(__dirname, 'icon.png')
  });

  mainWindow.loadFile('index.html');
  
  // Open DevTools in development
  // mainWindow.webContents.openDevTools();
}

function createWhatsAppWindow() {
  whatsappWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: true,
    title: 'WhatsApp Web - Login'
  });

  whatsappWindow.loadURL('https://web.whatsapp.com');
  
  return whatsappWindow;
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('open-whatsapp', async () => {
  if (!whatsappWindow || whatsappWindow.isDestroyed()) {
    whatsappWindow = createWhatsAppWindow();
  } else {
    whatsappWindow.focus();
  }
  return true;
});

ipcMain.handle('check-whatsapp-ready', async () => {
  if (!whatsappWindow || whatsappWindow.isDestroyed()) {
    return false;
  }
  
  try {
    // Check if WhatsApp is loaded and logged in
    const isLoggedIn = await whatsappWindow.webContents.executeJavaScript(`
      !!document.querySelector('[data-icon="chat"]') || 
      !!document.querySelector('[data-testid="chat"]')
    `);
    return isLoggedIn;
  } catch {
    return false;
  }
});

ipcMain.handle('send-message', async (event, { phoneNumber, message }) => {
  if (!whatsappWindow || whatsappWindow.isDestroyed()) {
    return { success: false, error: 'WhatsApp window not open' };
  }

  try {
    // Format phone number
    let formatted = phoneNumber.replace(/[\s\-\.]/g, '');
    if (formatted.startsWith('0')) {
      formatted = '94' + formatted.slice(1);
    } else if (formatted.startsWith('7')) {
      formatted = '94' + formatted;
    } else if (!formatted.startsWith('94')) {
      formatted = '94' + formatted;
    }

    // Navigate to chat
    const url = `https://web.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(message)}`;
    await whatsappWindow.loadURL(url);

    // Wait for page to load and message input to be ready
    await new Promise(resolve => setTimeout(resolve, 8000));

    // Click send button or press Enter
    const sent = await whatsappWindow.webContents.executeJavaScript(`
      (async () => {
        // Wait for send button
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Try to find and click send button
        const sendBtn = document.querySelector('[data-icon="send"]') || 
                        document.querySelector('[data-testid="send"]') ||
                        document.querySelector('button[aria-label="Send"]') ||
                        document.querySelector('span[data-icon="send"]');
        
        if (sendBtn) {
          sendBtn.click();
          return true;
        }
        
        // Try pressing Enter on the input
        const input = document.querySelector('[contenteditable="true"]') ||
                      document.querySelector('div[data-tab="10"]');
        if (input) {
          input.focus();
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
          });
          input.dispatchEvent(enterEvent);
          return true;
        }
        
        return false;
      })()
    `);

    // Wait for message to send
    await new Promise(resolve => setTimeout(resolve, 3000));

    return { success: sent, error: sent ? null : 'Could not find send button' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('close-window', () => {
  mainWindow.close();
});

ipcMain.handle('save-contacts', (event, contacts) => {
  store.set('contacts', contacts);
});

ipcMain.handle('load-contacts', () => {
  return store.get('contacts', []);
});

ipcMain.handle('save-message', (event, message) => {
  store.set('message', message);
});

ipcMain.handle('load-message', () => {
  return store.get('message', '');
});
