import React, { useEffect, useRef } from 'react'
import { useAppContext } from '@/_context/AppContext'
import Message from './Message'
import Link from 'next/link'

const MessageDisplay: React.FC = () => {
  const { state } = useAppContext()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [state.conversation.messages])

  const { messages } = state.conversation
  if (state.initialising) {
    return (
      <div className="flex justify-center items-center flex-col">
        <div className="animate-spin rounded-full border-t-2 border-b-2 border-blue-500 w-12 h-12"></div>
        Chatto-Botto is working hard!
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex justify-center items-center flex-col">
        No messages, maybe you`&apos;d like to{' '}
        <Link href="/chat/setup">start a new chat</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen items-center">
      <div
        className="p-4 space-y-4 container mx-auto max-w-prose"
        ref={containerRef}
      >
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </div>
  )
}

export default MessageDisplay
