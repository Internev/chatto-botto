import { useAudioRecorder } from '@/_hooks/useAudioRecorder'

const MicIcon: React.FC<{ isRecording: boolean }> = ({ isRecording }) => (
  <svg
    fill={isRecording ? '#ffffff' : '#2e2e2e'}
    width="38px"
    height="38px"
    viewBox="0 0 32 32"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>microphone</title>
    <path d="M16.4 25.936v2.993c2.992 0.161 5.305 1.151 5.305 2.075 0 0.023-12.268 0.023-12.268 0 0-0.889 2.142-1.849 4.973-2.062v-3.018c-3.614-0.518-6.402-3.597-6.402-7.354v-1.555h0.995v1.555c0 3.57 2.894 6.465 6.464 6.466h0.004c3.57-0.001 6.464-2.896 6.464-6.466v-1.555h1.058v1.555c-0.001 3.801-2.917 6.903-6.593 7.366zM15.5 23.955c-3.035 0-5.494-2.459-5.494-5.494v-2.477h4.495v-0.999h-4.495v-0.999h4.495v-0.998h-4.495v-0.999h4.495v-0.999h-4.495v-0.999h4.495v-0.999h-4.495v-1.582c0-3.034 2.459-5.432 5.494-5.432 3.034 0 5.494 2.397 5.494 5.432v1.582h-4.496v0.999h4.496v0.999h-4.496v0.999h4.496v0.999h-4.496v0.998h4.496v0.999h-4.496v0.999h4.496v2.477c0 3.035-2.46 5.494-5.494 5.494z"></path>
  </svg>
)

const ChatInput: React.FC = () => {
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    transcription,
  } = useAudioRecorder()

  return (
    <div className="h-full flex items-center justify-center container mx-auto">
      <button
        className={`rounded-lg border-2 border-gray-500 p-2 hover:border-l-teal-200 hover:border-r-teal-300 hover:border-t-teal-100 hover:border-b-teal-400 ${
          isRecording
            ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
            : 'hover:bg-gradient-to-r from-gray-300 to-gray-200'
        }`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        <MicIcon isRecording={isRecording} />
      </button>
    </div>
  )
}

export default ChatInput
