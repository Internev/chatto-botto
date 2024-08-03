import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react'
import {
  IAppState,
  IAction,
  IConversation,
  IMessage,
  ILanguageCode,
} from './types'
import { continueClaudeConversation } from '../fetchers/claude'

const exampleConversation: IConversation = {
  id: '1',
  messages: [
    {
      id: '1',
      userId: 'botto',
      timestamp: Date.now(),
      languages: {
        en: [`Hello. How was your weekend?`],
        main: ['こんにちは。休みは どうでしたか？'],
        alt: ['Konnichiwa. Yasumi wa dou deshita ka?'],
      },
      originalLanguage: 'ja',
      agent: 'bot',
    },
    {
      id: '2',
      userId: 'user-1',
      timestamp: Date.now(),
      languages: {
        en: [`On the weekend, I ate dinner with a friend.`],
        main: ['しゅうまつは ともだちと ばんごはんを たべました'],
        alt: ['Shuumatsu wa tomodachi to bangohan wo tabemashita.'],
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

const getNewClaudeResponse = async (
  conversation: IConversation,
  dispatch: React.Dispatch<IAction>
) => {
  const newMessage = await continueClaudeConversation(conversation)
  // dispatch({
  //   type: 'ADD_MESSAGE',
  //   message: newMessage,
  // })
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    const conversation = state.conversations[state.currentConversationId]
    const lastMessage =
      conversation &&
      conversation.messages[conversation.messages.length - 1 || 0]
    if (lastMessage?.agent === 'user') {
      getNewClaudeResponse(conversation, dispatch)
    }
  }, [state.conversations[state.currentConversationId]])

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
