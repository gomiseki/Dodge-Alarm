/*eslint-disable*/
import { ipcRenderer, contextBridge } from 'electron';

declare global {
    interface Window {
     api:{
        send: (channel: string, data?:any) => void;
        on: (channel: string, func: (event: any, ...arg: any) => void) => void;
        invoke: (channel: string, data?:any)=>Promise<any>;
    }
  }
}
process.once('loaded', () => {
  contextBridge.exposeInMainWorld('api', {

    send: (channel:string, data:any) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel:string, func:(event: any, ...arg: any) => void) => {
      ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
    },
    invoke: async (channel:string, data:any) => await ipcRenderer.invoke(channel, data),
    /*
            removeAllListeners: (channel) => {
                return ipcRenderer.removeAllListeners(channel);
            */
  });
});
