'use client'

import { useAppContext } from '@/_context/AppContext'
import { ILanguageCode } from '@/_context/types'
import { ISystemPromptInput } from '@/app/_lib/_prompting/prompts'
import { useCallback, useEffect, useState } from 'react'

export function useChat() {
  const [transcription, setTranscription] = useState<null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { state, dispatch } = useAppContext()

  const processAudio = useCallback(async (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'audio.mp3')
    formData.append('language', 'ja')

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process audio')
      }

      const data = await response.json()
      console.log('🤖🤖🤖🤖processed audio:', data)
      setTranscription(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsProcessing(false)
    }
  }, [])

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
    processAudio,
    initialiseChat,
    isProcessing,
    error,
    transcription,
  }
}
