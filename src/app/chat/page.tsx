'use client'
// app/chat/page.tsx
import React, { useEffect } from 'react'
import MessageDisplay from './_components/MessageDisplay'
import ChatInput from './_components/ChatInput'
import Link from 'next/link'
import Header from '../_layoutComponents/Header'

export default function ChatPage() {
  return (
    <>
      <Header />
      <div className="flex flex-col h-screen content-center">
        <Link className="top-0 ml-auto mr-4" href="/chat/setup">
          Start a new chat
        </Link>
        <div className="flex-grow overflow-auto">
          <MessageDisplay />
        </div>
        <div className="h-16 bg-gray-100">
          <ChatInput />
        </div>
      </div>
    </>
  )
}
