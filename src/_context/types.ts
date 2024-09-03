import { VoiceId } from '@aws-sdk/client-polly'

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
  | 'sv'
  | 'main'
  | 'alt'
  | 'cor'

export interface IMessage {
  id: string
  userId: string
  timestamp: string
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
  createdAt: string
  updatedAt: string
  voiceId: VoiceId
  systemPrompt?: string
}

export interface IAppState {
  conversation: IConversation
  initialising: boolean
  language?: ILanguageCode
  voiceId: VoiceId
}

export type IAction =
  | { type: 'SET_INITIALISING'; initialising: boolean }
  | { type: 'SET_LANGUAGE'; language: ILanguageCode }
  | { type: 'SET_VOICE'; voiceId: VoiceId }
  | { type: 'SET_CONVERSATION'; conversation: IConversation }
  | { type: 'ADD_MESSAGE'; message: IMessage }
  | { type: 'ADD_MESSAGES'; messages: IMessage[] }
  | { type: 'UPDATE_MESSAGE'; message: IMessage }
