import { useState, useRef, useCallback } from 'react'

const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const transcribeAudio = async (blob: Blob) => {
    try {
      const transcriptionResult = await window.electronAPI.transcribe(blob)
      setTranscription(transcriptionResult)
      console.log('Transcription:', transcriptionResult)
    } catch (error) {
      console.error('Transcription error:', error)
      setTranscription(null)
    }
  }

  const startRecording = useCallback(async () => {
    console.log('startRecording')
    setIsRecording(true)
    setTranscription(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
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
