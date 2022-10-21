import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { overlayWindow } from 'electron-overlay-window';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';

import { authenticate, Credentials } from 'league-connect';
import {
  readdirSync, readFileSync, writeFileSync, renameSync, unlinkSync,
} from 'fs-extra';
import LcuAPI from './apis/lcu';
import RiotAPI from './apis/riot';

import configureStore from '../store';

const rendererEntry = app.isPackaged ? path.join(__dirname, '../index.html') : 'http://localhost:3000';
const preloadEntry = path.join(__dirname, '/preload/index.js');
const algoEntry = app.isPackaged ? path.join(app.getAppPath(), '../algorithms') : `${app.getAppPath()}\\dist\\algorithms`;

let mainWindow:BrowserWindow;
let readyWindow:BrowserWindow|null = null;
let riotConnection:RiotAPI;
let lolClientCredentials:Credentials;

app.disableHardwareAcceleration();

const createReady = (url = '/'):void => {
  let already = false;
  BrowserWindow.getAllWindows().forEach((w) => {
    if (w.title === '너 쌩배지 - 닷지 경보기') already = true;
  });
  if (already) { return; }
  readyWindow = new BrowserWindow({
    width: 400,
    height: 720,
    titleBarStyle: 'hidden',
    title: '너 쌩배지 - 닷지 경보기',
    show: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      preload: preloadEntry,
      nodeIntegration: true,
    },
  });

  if (app.isPackaged) {
    readyWindow.loadFile(rendererEntry + url);
  } else {
    readyWindow.loadURL(rendererEntry + url);
    readyWindow.webContents.openDevTools({ mode: 'detach' });
  }

  readyWindow.on('closed', () => {
    readyWindow = null;
  });
  readyWindow.once('ready-to-show', () => {
    if (readyWindow) readyWindow.show();
  });
};

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: preloadEntry,
      nodeIntegration: true,
    },
    ...overlayWindow.WINDOW_OPTS,
  });

  if (app.isPackaged) {
    mainWindow.loadFile(rendererEntry, { hash: 'main_window' });
  } else {
    mainWindow.loadURL(`${rendererEntry}#main_window`);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // attach overlay window
  overlayWindow.attachTo(mainWindow, 'League of Legends');
};

app.on('ready', async () => {
  // install devtools
  if (app.isPackaged) {
    installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }

  ipcMain.on('Quit-Process', () => {
    app.quit();
  });

  ipcMain.on('Ready-Window', () => {
    if (readyWindow)readyWindow.focus();
    else createReady();
  });

  ipcMain.on('Close-Window', () => {
    if (readyWindow) {
      readyWindow.close();
    } else {
      readyWindow = null;
    }
  });

  ipcMain.on('Minimize-Window', () => {
    if (readyWindow) readyWindow.minimize();
  });

  ipcMain.on('Open-Detail', (e, id) => {
    if (readyWindow) {
      readyWindow.focus();
      readyWindow.loadURL(`${rendererEntry}/#/info?index=${id}`);
    } else (createReady(`/#/info?index=${id}`));
  });

  // init status
  createReady();

  riotConnection = new RiotAPI();
  const store = configureStore({
    Main: ipcMain,
    Win: BrowserWindow.getAllWindows,
    RiotConnection: riotConnection,
    fs: {
      readDir: readdirSync,
      readFile: readFileSync,
      writeFile: writeFileSync,
      renameFile: renameSync,
      unlinkFile: unlinkSync,
      algoPath: algoEntry,
    },
  });

  lolClientCredentials = await authenticate({ awaitConnection: true });
  await new LcuAPI(lolClientCredentials, createReady, store);

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
