'use client'
// app/chat/page.tsx
import React, { useState } from 'react'
import MessageDisplay from './_components/MessageDisplay'
import ChatInput from './_components/ChatInput'
import Temp from './_components/Temp'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender: 'user',
    }
    setMessages([...messages, newMessage])
    // Here you would typically call an API to get the bot's response
    // For this example, we'll just echo the message back
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: `Echo: ${text}`,
        sender: 'bot',
      }
      setMessages((prevMessages) => [...prevMessages, botResponse])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-screen content-center">
      <div className="flex-grow overflow-auto">
        <MessageDisplay messages={messages} />
      </div>
      <div className="h-16 bg-gray-100">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
