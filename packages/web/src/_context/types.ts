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
  conversations: {
    [id: string]: IConversation
  }
  currentConversationId: string | null
  initialising: boolean
}

export type IAction =
  | { type: 'SET_INITIALISING'; initialising: boolean }
  | { type: 'ADD_CONVERSATION'; conversation: IConversation }
  | { type: 'SET_CURRENT_CONVERSATION'; conversationId: string }
  | { type: 'ADD_MESSAGE'; message: IMessage }
  | { type: 'UPDATE_MESSAGE'; message: IMessage }
