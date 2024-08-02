import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import {
  IAppState,
  IAction,
  IConversation,
  IMessage,
  ILanguageCode,
} from './types'

const exampleConversation: IConversation = {
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
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

const initialState: IAppState = {
  conversations: {
    1: exampleConversation,
  },
  currentConversationId: null,
  initialising: false,
}

function appReducer(state: IAppState, action: IAction): IAppState {
  console.log('Action dispatched:', action)
  console.log('Current state:', state)
  switch (action.type) {
    case 'SET_INITIALISING':
      return {
        ...state,
        initialising: action.initialising,
      }
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
      const cId = state.currentConversationId
      if (!cId) {
        return state
      }
      const newConversation = state.conversations[cId]
      newConversation.messages.push(action.message)
      return {
        ...state,
        conversations: {
          ...state.conversations,
          newConversation,
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
