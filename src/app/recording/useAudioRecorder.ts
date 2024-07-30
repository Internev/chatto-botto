import { useState, useRef, useCallback } from 'react'

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

const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const transcribeAudio = async (blob: Blob) => {
    try {
      const base64String = await blobToBase64(blob)
      const transcriptionResult = await window.electronAPI.transcribe(
        base64String
      )
      setTranscription(transcriptionResult)
      console.log('Transcription:', transcriptionResult)
    } catch (error) {
      console.error('Transcription error:', error)
      setTranscription(null)
    }
  }

  const startRecording = useCallback(async () => {
    setIsRecording(true)
    setTranscription(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // const audioTracks = stream.getAudioTracks()
      // const sampleRate = audioTracks[0].getSettings().sampleRate
      // console.log('audioTracks:', audioTracks)
      // console.log('sampleRate:', sampleRate)
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
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

export default useAudioRecorder
