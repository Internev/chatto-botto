'use client'

import { useAppContext } from '@/_context/AppContext'
import { ILanguageCode } from '@/_context/types'
import { ISystemPromptInput } from '@/app/_lib/_prompting/prompts'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useChat() {
  const [transcription, setTranscription] = useState<null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { state, dispatch } = useAppContext()
  const stateRef = useRef(state)

  // Update the ref whenever state changes
  useEffect(() => {
    stateRef.current = state
  }, [state])

  const continueChat = useCallback(
    async (audioBlob: Blob) => {
      const currentState = stateRef.current
      console.log('state', state)
      if (!currentState.conversation.id.length) {
        console.log(
          'state is still not updated',
          Date.now(),
          JSON.parse(JSON.stringify(state))
        )
        throw new Error('No conversation found')
      }
      const formData = new FormData()
      formData.append('audio', audioBlob, 'audio.mp3')
      formData.append('language', currentState.language as ILanguageCode)
      formData.append('conversationId', currentState.conversation.id)

      try {
        const response = await fetch('/api/chat/message', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to process audio')
        }

        const { userMessage, botMessage } = await response.json()
        console.log('🤖🤖🤖🤖 next messages:', userMessage, botMessage)
        setTranscription(userMessage.languages.main[0])

        dispatch({
          type: 'ADD_MESSAGES',
          messages: [
            {
              ...userMessage,
              audioUrls: { main: URL.createObjectURL(audioBlob) },
            },
            botMessage,
          ],
        })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        )
      } finally {
        setIsProcessing(false)
      }
    },
    [dispatch]
  )

  interface IInitialiseChat {
    systemPrompt: ISystemPromptInput
    voiceId: string
  }

  const initialiseChat = useCallback(async (initChat: IInitialiseChat) => {
    try {
      const response = await fetch('/api/chat/init', {
        method: 'POST',
        body: JSON.stringify(initChat),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to initialise chat')
      }

      const { conversation, initialMessage } = await response.json()

      console.log('we got conversation back, setting in state:', conversation)
      dispatch({
        type: 'SET_CONVERSATION',
        conversation: {
          ...conversation,
          messages: [initialMessage],
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }, [])

  return {
    continueChat,
    initialiseChat,
    isProcessing,
    error,
    transcription,
  }
}
