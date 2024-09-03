'use client'

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react'
import { IAppState, IAction, IConversation } from './types'

const exampleConversation: IConversation = {
  id: '',
  messages: [],
  createdAt: new Date(Date.now()).toISOString(),
  updatedAt: new Date(Date.now()).toISOString(),
  voiceId: 'Takumi',
}

const initialState: IAppState = {
  conversation: exampleConversation,
  initialising: false,
  language: 'ja',
  voiceId: 'Takumi',
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
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.language,
      }
    case 'SET_VOICE':
      return {
        ...state,
        voiceId: action.voiceId,
      }
    case 'SET_CONVERSATION':
      return {
        ...state,
        conversation: { ...action.conversation },
        initialising: false,
      }
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversation: {
          ...state.conversation,
          messages: [...state.conversation.messages, action.message],
        },
      }
    case 'ADD_MESSAGES':
      return {
        ...state,
        conversation: {
          ...state.conversation,
          messages: [...state.conversation.messages, ...action.messages],
        },
      }
    case 'UPDATE_MESSAGE':
      const newUpdateMessageConversation = { ...state.conversation }
      newUpdateMessageConversation.messages =
        newUpdateMessageConversation.messages.map((m) =>
          m.id === action.message.id ? action.message : m
        )
      return {
        ...state,
        conversation: newUpdateMessageConversation,
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
