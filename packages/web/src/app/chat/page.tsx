'use client'
// app/chat/page.tsx
import React, { useEffect } from 'react'
import MessageDisplay from './_components/MessageDisplay'
import ChatInput from './_components/ChatInput'

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen content-center">
      <div className="flex-grow overflow-auto">
        <MessageDisplay />
      </div>
      <div className="h-16 bg-gray-100">
        <ChatInput />
      </div>
    </div>
  )
}
