// app/api/chat-process/route.ts

import { NextResponse } from 'next/server'
import { continueClaudeConversation } from '@/app/_lib/claude'
import speak from '@/app/_lib/speak'
import {
  appendMessageToConversation,
  getConversation,
} from '@/app/_lib/dynamodb'
import { IMessage } from '@/_context/types'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  const { userId, conversationId, language } = await request.json()

  if (!userId) {
    return NextResponse.json({ error: 'No user id provided' }, { status: 400 })
  }

  if (!conversationId) {
    return NextResponse.json(
      { error: 'No conversation id provided' },
      { status: 400 }
    )
  }

  try {
    const conversation = await getConversation(userId, conversationId)

    const claudeResponse = await continueClaudeConversation(conversation)

    const botMessage: IMessage = {
      id: uuidv4(),
      timestamp: new Date(Date.now()).toISOString(),
      userId: userId,
      languages: claudeResponse,
      originalLanguage: language,
      agent: 'bot',
    }
    await appendMessageToConversation(conversationId, botMessage)
    const audioToSpeak = claudeResponse.main.join(' ')
    const audioUrl = await speak(audioToSpeak, conversation.voiceId)

    return NextResponse.json({
      botMessage: {
        ...botMessage,
        audioUrls: {
          main: 'data:audio/mp3;base64,' + audioUrl,
        },
      },
    })
  } catch (error) {
    console.error('Error in chat process:', error)
    return NextResponse.json(
      { error: 'An error occurred during processing' },
      { status: 500 }
    )
  }
}
