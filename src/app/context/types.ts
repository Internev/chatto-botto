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

export interface IMessage {
  id: string
  userId: string
  timestamp: number
  translations: {
    [key in ILanguageCode]?: string
  }
  originalLanguage: ILanguageCode
  audioUrl?: string
  agent: 'user' | 'bot'
}

export interface IConversation {
  id: string
  participants: string[]
  messages: IMessage[]
  createdAt: number
  updatedAt: number
}

export interface IAppState {
  conversations: {
    [id: string]: IConversation
  }
  currentConversationId: string | null
}

export type IAction =
  | { type: 'ADD_CONVERSATION'; conversation: IConversation }
  | { type: 'SET_CURRENT_CONVERSATION'; conversationId: string }
  | { type: 'ADD_MESSAGE'; conversationId: string; message: IMessage }
  | {
      type: 'UPDATE_MESSAGE_TRANSLATION'
      conversationId: string
      messageId: string
      language: ILanguageCode
      translation: string
    }
  | {
      type: 'SET_AUDIO_URL'
      conversationId: string
      messageId: string
      audioUrl: string
    }
