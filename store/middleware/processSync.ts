import type { IpcMain, BrowserWindow } from 'electron';

interface mainProcess{
    Main:IpcMain,
    Win:()=>BrowserWindow[]
}
interface rendererProcess{
    Renderer:Window['api'],
}

// middleware function
const processSync = (ipc:mainProcess|rendererProcess) => () => (next:any) => (action:any) => {
  const result = next(action);
  if ('Main' in ipc) {
    ipc.Win().forEach((win) => {
      win.webContents.send('dispatch', action);
    });
  }
  return result;
};

export default processSync;
