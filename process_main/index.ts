import { app, BrowserWindow } from 'electron';
import { overlayWindow } from 'electron-overlay-window';

const rendererEntry = 
const preloadEntry = 

let mainWindow:BrowserWindow;
let readyWindow:BrowserWindow|null = null;

app.disableHardwareAcceleration();

const createReady = (url="/"):void =>{
  let already = false;
  BrowserWindow.getAllWindows().forEach((w)=>{
    w.title =='너 쌩배지 - 닷지 경보기' ? already=true: false;
  })
  if(already){return}
  readyWindow = new BrowserWindow({
    width: 400,
    height: 720,
    titleBarStyle:'hidden',
    title:'너 쌩배지 - 닷지 경보기',
    show: false,
    backgroundColor:'#7d4f82',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })
  readyWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY+url)
  readyWindow.webContents.openDevTools({ mode: 'detach' });

  readyWindow.on('closed', () => {
    readyWindow = false;
  })
  readyWindow.once('ready-to-show', () => {
    readyWindow?readyWindow.show():false;
  })
  
};

app.whenReady().then(()=>{
  new BrowserWindow().loadURL('http://localhost:3000')
})