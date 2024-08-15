import React from 'react'
import { useAppContext } from '@/_context/AppContext'
import Message from './Message'

const MessageDisplay: React.FC = () => {
  const { state } = useAppContext()

  const { messages } = state.conversation
  if (state.initialising) {
    return <div>Initialising...</div>
  }
  console.log('messages:', messages)
  return (
    <div className="flex flex-col min-h-screen items-center">
      <div className="p-4 space-y-4 container mx-auto max-w-prose">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </div>
  )
}

export default MessageDisplay
