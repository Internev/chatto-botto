'use client'

import { useCallback, useRef, useState } from 'react'
import { useChat } from './useChat'

interface ChatProcessResult {
  transcription: string
  botResponse: string
  audioUrl: string
}

export function useAudioRecorder() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<ChatProcessResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const { continueChat } = useChat()

  const startRecording = useCallback(async () => {
    setIsRecording(true)

    try {
      console.log('starting recording')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        console.log('stopping recording')
        const blob = new Blob(chunksRef.current, { type: 'audio/mp3' })
        setAudioBlob(blob)

        await continueChat(blob)
      }

      mediaRecorderRef.current.start()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setIsRecording(false)
    }
  }, [continueChat])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  // const processAudio = async (audioBlob: Blob) => {
  //   setIsProcessing(true)
  //   setError(null)

  //   const formData = new FormData()
  //   formData.append('audio', audioBlob, 'audio.mp3')
  //   formData.append('language', 'ja')

  //   try {
  //     const response = await fetch('/api/chat/message', {
  //       method: 'POST',
  //       body: formData,
  //     })

  //     if (!response.ok) {
  //       throw new Error('Failed to process audio')
  //     }

  //     const data = await response.json()
  //     console.log('processed audio:', data)
  //     setResult(data)
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'An unknown error occurred')
  //   } finally {
  //     setIsProcessing(false)
  //   }
  // }

  return {
    isProcessing,
    result,
    error,
    isRecording,
    startRecording,
    stopRecording,
    transcription,
  }
}
