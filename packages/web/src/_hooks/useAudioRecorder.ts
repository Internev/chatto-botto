import { useState, useRef, useCallback } from 'react'

import { useAppContext } from '@/_context/AppContext'
import { useAddMessage } from './useAddMessage'

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]
      resolve(base64String)
    }
    reader.onerror = () => {
      reject('Error converting blob to base64')
    }
  })
}

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const { addMessage } = useAddMessage()

  const transcribeAudio = async (blob: Blob) => {
    try {
      const base64String = await blobToBase64(blob)
      const transcriptionResponse = await fetch(
        'http://localhost:3000/api/transcribe',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audioString: base64String }),
        }
      )
      const transcriptionResult = (await transcriptionResponse.json())
        .transcription
      setTranscription(transcriptionResult)
      addMessage({ languages: { main: [transcriptionResult] } })
    } catch (error) {
      console.error('Transcription error:', error)
      setTranscription(null)
    }
  }

  const startRecording = useCallback(async () => {
    setIsRecording(true)
    setTranscription(null)
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
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
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
