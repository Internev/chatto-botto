// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

export const electronAPI = {
  transcribe: async (audioString: string) => {
    try {
      const result = await ipcRenderer.invoke('transcribe', audioString)
      return result
    } catch (error) {
      console.error('Error transcribing:', error)
      throw error
    }
  },
  getEnv: (envName: string) => ipcRenderer.invoke('get-env', envName),
  textToSpeech: async (text: string): Promise<string> => {
    try {
      return await ipcRenderer.invoke('text-to-speech', text)
    } catch (error) {
      console.error('Error transcribing:', error)
      throw error
    }
  },
}

process.once('loaded', () => {
  contextBridge.exposeInMainWorld('electronAPI', electronAPI)
})
