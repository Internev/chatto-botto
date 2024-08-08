'use client'

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react'
import { IAppState, IAction, IConversation } from './types'
// import { continueClaudeConversation } from '../fetchers/claude'
import { useAddMessage } from '@/_hooks/useAddMessage'

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
      audioUrls: {},
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
      audioUrls: {},
      originalLanguage: 'ja',
      agent: 'user',
    },
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

const initialState: IAppState = {
  conversation: exampleConversation,
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
    case 'SET_CONVERSATION':
      return {
        ...state,
        conversation: action.conversation,
      }
    case 'ADD_MESSAGE':
      const newAddMessageConversation = { ...state.conversation }
      newAddMessageConversation.messages.push(action.message)
      return {
        ...state,
        conversation: newAddMessageConversation,
      }
    case 'UPDATE_MESSAGE':
      const newUpdateMessageConversation = { ...state.conversation }
      console.log(
        'orig message length:',
        newUpdateMessageConversation.messages.length
      )

      newUpdateMessageConversation.messages =
        newUpdateMessageConversation.messages.map((m) =>
          m.id === action.message.id ? action.message : m
        )
      console.log(
        'message length:',
        newUpdateMessageConversation.messages.length
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

const getNewClaudeResponse = async (conversation: IConversation) => {
  console.log('Getting new Claude response...')
  // const languages = await continueClaudeConversation(conversation)
  const languages = {
    en: 'Hello. How was your weekend?',
    main: 'こんにちは。休みは どうでしたか？',
    alt: 'Konnichiwa. Yasumi wa dou deshita ka?',
  }
  return languages
}

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
