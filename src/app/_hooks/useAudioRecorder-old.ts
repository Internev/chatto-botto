import { useState, useRef, useCallback } from 'react'

import { useMessage } from './useMessage'
import transcribe from '@/app/_lib/transcribe'
import { useAppContext } from '@/_context/AppContext'

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const { state } = useAppContext()
  const { addMessage } = useMessage()

  const startRecording = useCallback(async () => {
    setIsRecording(true)
    setTranscription(null)

    const transcribeAudio = async (blob: Blob) => {
      try {
        const formData = new FormData()
        formData.append('audio', blob, 'audio.webm')
        const transcriptionResult = await transcribe(
          formData,
          state.language || ''
        )
        if (!transcriptionResult) {
          throw new Error('Transcription failed')
        }
        setTranscription(transcriptionResult)
        addMessage({
          languages: { main: [transcriptionResult] },
          audioUrls: { main: URL.createObjectURL(blob) },
        })
      } catch (error) {
        console.error('Transcription error:', error)
        setTranscription(null)
      }
    }

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
        await transcribeAudio(blob)
      }

      mediaRecorderRef.current.start()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setIsRecording(false)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  return {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    transcription,
  }
}
