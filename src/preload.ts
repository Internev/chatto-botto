// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

export const electronAPI = {
  ping: (message: string) => ipcRenderer.invoke('ping', message),
  transcribe: async (audio: Blob) => {
    try {
      const result = await ipcRenderer.invoke('transcribe', audio)
      return result
    } catch (error) {
      console.error('Error transcribing:', error)
      throw error
    }
  },
}

process.once('loaded', () => {
  contextBridge.exposeInMainWorld('electronAPI', electronAPI)
})
