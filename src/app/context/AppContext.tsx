import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import {
  IAppState,
  IAction,
  IConversation,
  IMessage,
  ILanguageCode,
} from './types'

const exampleConversations: IConversation[] = [
  {
    id: '1',
    participants: ['user-1', 'user-2'],
    messages: [
      {
        id: '1',
        userId: 'user-1',
        timestamp: Date.now(),
        translations: {
          en: `Hello. How was your weekend?`,
          ja: 'こんにちは。休みは どうでしたか？',
          ro: 'Konnichiwa. Yasumi wa dou deshita ka?',
        },
        originalLanguage: 'ja',
        agent: 'bot',
      },
      {
        id: '2',
        userId: 'user-2',
        timestamp: Date.now(),
        translations: {
          en: `On the weekend, I ate dinner with a friend.`,
          ja: 'しゅうまつは ともだちと ばんごはんを たべました',
          ro: 'Shuumatsu wa tomodachi to bangohan wo tabemashita.',
        },
        originalLanguage: 'ja',
        agent: 'user',
      },
      {
        id: '1',
        userId: 'user-1',
        timestamp: Date.now(),
        translations: {
          en: `That sounds fun. What did you eat?`,
          ja: 'たのしかったですね。なにを たべましたか？',
          ro: 'Tanoshikatta desu ne. Nani wo tabemashita ka?',
        },
        originalLanguage: 'ja',
        agent: 'bot',
      },
      {
        id: '1',
        userId: 'user-1',
        timestamp: Date.now(),
        translations: {
          en: `Um, egg on rice. It was delicious!`,
          ja: 'ええと、たまごごはんです。おいしかったです！',
          ro: 'Eeto, tamagogohan desu. Oishikatta desu!',
        },
        originalLanguage: 'ja',
        agent: 'user',
      },
      {
        id: '2',
        userId: 'user-2',
        timestamp: Date.now(),
        translations: {
          en: `Sounds delicious! Where did you eat?`,
          ja: 'おいしそう！ どこで たべましたか？',
          ro: 'Oishisou! Doko de tabemashita ka?',
        },
        originalLanguage: 'ja',
        agent: 'bot',
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    participants: ['user-1', 'user-3'],
    messages: [
      {
        id: '1',
        userId: 'user-1',
        timestamp: Date.now(),
        translations: {
          en: 'Hey, how are you?',
        },
        originalLanguage: 'en',
        agent: 'user',
      },
      {
        id: '2',
        userId: 'user-3',
        timestamp: Date.now(),
        translations: {
          en: 'I am doing well, thank you!',
        },
        originalLanguage: 'en',
        agent: 'user',
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

const initialState: IAppState = {
  conversations: {
    1: exampleConversations[0],
  },
  currentConversationId: '1',
}

function appReducer(state: IAppState, action: IAction): IAppState {
  switch (action.type) {
    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.conversation.id]: action.conversation,
        },
      }
    case 'SET_CURRENT_CONVERSATION':
      return {
        ...state,
        currentConversationId: action.conversationId,
      }
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.conversationId]: {
            ...state.conversations[action.conversationId],
            messages: [
              ...state.conversations[action.conversationId].messages,
              action.message,
            ],
            updatedAt: Date.now(),
          },
        },
      }
    case 'UPDATE_MESSAGE_TRANSLATION':
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.conversationId]: {
            ...state.conversations[action.conversationId],
            messages: state.conversations[action.conversationId].messages.map(
              (message) =>
                message.id === action.messageId
                  ? {
                      ...message,
                      translations: {
                        ...message.translations,
                        [action.language]: action.translation,
                      },
                    }
                  : message
            ),
          },
        },
      }
    case 'SET_AUDIO_URL':
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.conversationId]: {
            ...state.conversations[action.conversationId],
            messages: state.conversations[action.conversationId].messages.map(
              (message) =>
                message.id === action.messageId
                  ? { ...message, audioUrl: action.audioUrl }
                  : message
            ),
          },
        },
      }
    default:
      return state
  }
}

const AppContext = createContext<
  | {
      state: IAppState
      dispatch: React.Dispatch<IAction>
    }
  | undefined
>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
