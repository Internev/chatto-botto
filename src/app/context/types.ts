export type LanguageCode =
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

export interface Message {
  id: string
  userId: string
  timestamp: number
  translations: {
    [key in LanguageCode]?: string
  }
  originalLanguage: LanguageCode
  audioUrl?: string
  agent: 'user' | 'bot'
}

export interface Conversation {
  id: string
  participants: string[]
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export interface AppState {
  conversations: {
    [id: string]: Conversation
  }
  currentConversationId: string | null
}

export type Action =
  | { type: 'ADD_CONVERSATION'; conversation: Conversation }
  | { type: 'SET_CURRENT_CONVERSATION'; conversationId: string }
  | { type: 'ADD_MESSAGE'; conversationId: string; message: Message }
  | {
      type: 'UPDATE_MESSAGE_TRANSLATION'
      conversationId: string
      messageId: string
      language: LanguageCode
      translation: string
    }
  | {
      type: 'SET_AUDIO_URL'
      conversationId: string
      messageId: string
      audioUrl: string
    }
