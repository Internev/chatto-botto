// components/MessageDisplay.tsx
import { useAppContext } from '@/_context/AppContext'
import { join } from 'path'
import React from 'react'

const MessageDisplay: React.FC = () => {
  const { state } = useAppContext()

  console.log('state:', state)
  const { messages } = state.conversation
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
          </div>
        ))}
      </div>
    </div>
  )
}

export default MessageDisplay
