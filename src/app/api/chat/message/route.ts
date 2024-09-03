// app/api/chat-process/route.ts

import { NextResponse } from 'next/server'
import transcribe from '@/app/_lib/transcribe'
import { continueClaudeConversation } from '@/app/_lib/claude'
import speak from '@/app/_lib/speak'
import {
  appendMessageToConversation,
  getConversation,
} from '@/app/_lib/dynamodb'
import { ILanguageCode, IMessage } from '@/_context/types'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  const formData = await request.formData()
  const audioFile = formData.get('audio') as File
  const language = formData.get('language') as ILanguageCode
  const conversationId = formData.get('conversationId') as string
  const userId = 'user-1' // TODO: Get user ID from session

  if (!audioFile) {
    return NextResponse.json(
      { error: 'No audio file provided' },
      { status: 400 }
    )
  }

  try {
    const transcription = await transcribe(formData)

    if (!transcription) {
      return NextResponse.json(
        { error: 'Failed to transcribe audio' },
        { status: 500 }
      )
    }

    const userMessage: IMessage = {
      id: uuidv4(),
      timestamp: new Date(Date.now()).toISOString(),
      userId: userId,
      languages: {
        main: [transcription],
      },
      originalLanguage: language,
      agent: 'user',
    }
    await appendMessageToConversation(conversationId, userMessage)

    console.log('transcription:', transcription)
    const conversation = await getConversation(userId, conversationId)
    // console.log('🌃🌃🌃Conversation:', conversation)

    const claudeResponse = await continueClaudeConversation(conversation)
    console.log('🤖🤖🤖Claude response:', claudeResponse)

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
      userMessage: userMessage,
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
