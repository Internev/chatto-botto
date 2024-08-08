// components/MessageDisplay.tsx
import React from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

interface MessageDisplayProps {
  messages: Message[]
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="p-4 space-y-4 container mx-auto max-w-prose">
        {messages.map((message, i) => (
          <div
            key={message.id + i}
            className={`p-2 rounded-lg ${
              message.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            } max-w-[70%]`}
          >
            {message.text}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MessageDisplay
