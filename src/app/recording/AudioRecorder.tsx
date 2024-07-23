import React from 'react'
import useAudioRecorder from './useAudioRecorder'
import MicrophoneButton from '../components/MicrophoneButton'

const AudioRecorder: React.FC = () => {
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    transcription,
  } = useAudioRecorder()

  return (
    <div>
      <MicrophoneButton
        isRecording={isRecording}
        onClick={isRecording ? stopRecording : startRecording}
      />
      {audioBlob && <audio src={URL.createObjectURL(audioBlob)} controls />}
      {transcription && <p>Transcription: {transcription}</p>}
    </div>
  )
}

export default AudioRecorder
