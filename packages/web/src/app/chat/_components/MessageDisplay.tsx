import React from 'react'
import { useAppContext } from '@/_context/AppContext'

const MessageDisplay: React.FC = () => {
  const { state } = useAppContext()

  const { messages } = state.conversation
  console.log('MessageDisplay re-rendered at', new Date().toISOString())
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="p-4 space-y-4 container mx-auto max-w-prose">
        {messages.map((message, i) => (
          <div
            key={message.id + i}
            className={`p-2 rounded-lg ${
              message.agent === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            } max-w-[70%]`}
          >
            {message.languages.main?.join(' ')}
            {message.audioUrls?.main && (
              <audio controls autoPlay>
                <source src={message.audioUrls.main} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MessageDisplay
