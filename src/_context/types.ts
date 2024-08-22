export type ILanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ru'
  | 'ja'
  | 'ko'
  | 'zh'
  | 'ro'
  | 'hu'
  | 'main'
  | 'alt'
  | 'cor'

export interface IMessage {
  id: string
  userId: string
  timestamp: number
  languages: {
    [key in ILanguageCode]?: string[]
  }
  audioUrls?: {
    [key in ILanguageCode]?: string
  }
  originalLanguage: ILanguageCode
  agent: 'user' | 'bot'
}

export interface IConversation {
  id: string
  messages: IMessage[]
  createdAt: number
  updatedAt: number
}

export interface IAppState {
  conversation: IConversation
  initialising: boolean
  language?: ILanguageCode
}

export type IAction =
  | { type: 'SET_INITIALISING'; initialising: boolean }
  | { type: 'SET_LANGUAGE'; language: ILanguageCode }
  | { type: 'SET_CONVERSATION'; conversation: IConversation }
  | { type: 'ADD_MESSAGE'; message: IMessage }
  | { type: 'UPDATE_MESSAGE'; message: IMessage }
