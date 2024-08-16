import { useCallback, useEffect } from 'react'
import { uuid } from 'uuidv4'

import { useAppContext } from '@/_context/AppContext'
import { IMessage } from '@/_context/types'
import {
  continueClaudeConversation,
  initClaude,
  parseClaudeResponse,
} from '@/_actions/claude'
import speak from '@/_actions/speak'
import { ISystemPromptInput } from '@/_prompting/prompts'
import { Message } from '@anthropic-ai/sdk/resources/messages.mjs'

export const useMessage = () => {
  const { state, dispatch } = useAppContext()

  type AddMessageParams = Partial<Omit<IMessage, 'id'>>
  type UpdateMessageParams = { id: string } & Partial<Omit<IMessage, 'id'>>

  function createMessageHandler(
    actionType: 'ADD_MESSAGE'
  ): (params: AddMessageParams) => void
  function createMessageHandler(
    actionType: 'UPDATE_MESSAGE'
  ): (params: UpdateMessageParams) => void

  function createMessageHandler(actionType: 'ADD_MESSAGE' | 'UPDATE_MESSAGE') {
    return (params: AddMessageParams | UpdateMessageParams) => {
      const {
        id = Date.now().toString(),
        timestamp = Date.now(),
        languages = {},
        audioUrls = {},
        userId = 'user-1',
        originalLanguage = 'ja',
        agent = 'user',
      } = params as IMessage

      const message: IMessage = {
        id,
        timestamp,
        languages,
        audioUrls,
        userId,
        originalLanguage,
        agent,
      }

      console.log('useMessage fired with action:', actionType, message)
      dispatch({ type: actionType, message })
    }
  }

  const addMessage = createMessageHandler('ADD_MESSAGE')
  const updateMessage = createMessageHandler('UPDATE_MESSAGE')

  const initialiseChat = async (systemPrompt: ISystemPromptInput) => {
    if (!state.initialising) {
      dispatch({
        type: 'SET_INITIALISING',
        initialising: true,
      })

      const message = await initClaude(systemPrompt)

      const newConversationId = uuid()
      dispatch({
        type: 'SET_CONVERSATION',
        conversation: {
          id: newConversationId,
          messages: [
            {
              id: uuid(),
              userId: 'botto',
              timestamp: Date.now(),
              languages: message,
              originalLanguage: 'ja', // TODO: generalise
              agent: 'bot',
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      })
    }
  }

  // Continue conversation
  useEffect(() => {
    const continueConversation = async () => {
      const conversation = state.conversation
      const lastMessage =
        conversation &&
        conversation.messages[conversation.messages.length - 1 || 0]
      if (lastMessage?.agent === 'user') {
        console.log('🧐 User message detected. Getting new Claude response...')
        const languages = await continueClaudeConversation(conversation)
        addMessage({
          languages,
          userId: 'botto',
          originalLanguage: 'ja',
          agent: 'bot',
        })
      } else if (lastMessage?.agent === 'bot' && !lastMessage.audioUrls?.main) {
        console.log('🤖 Bot message detected. Generating audio...', lastMessage)
        const activeText = lastMessage.languages?.['main']?.join(' ')
        if (!activeText) {
          console.log('🚨 No main language found in last message', lastMessage)
          throw new Error('No main language found in last message')
        }
        const speechBase64 = await speak(activeText)
        const audioUrl = 'data:audio/mp3;base64,' + speechBase64
        updateMessage({
          ...lastMessage,
          audioUrls: {
            ...lastMessage.audioUrls,
            main: audioUrl,
          },
        })
      }
    }
    continueConversation()
  }, [state.conversation, addMessage, updateMessage])

  return { addMessage, updateMessage, initialiseChat }
}
