// app/api/chat-process/route.ts

import { NextResponse } from 'next/server'
import transcribe from '@/app/_lib/transcribe'
import { appendMessageToConversation } from '@/app/_lib/dynamodb'
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
    const response = await transcribe(formData)
    const transcription = response?.[0]
    const translation = response?.[1]

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
        en: [translation || ''],
      },
      originalLanguage: language,
      agent: 'user',
    }
    await appendMessageToConversation(conversationId, userMessage)

    return NextResponse.json({
      userMessage: userMessage,
    })
  } catch (error) {
    console.error('Error in chat process:', error)
    return NextResponse.json(
      { error: 'An error occurred during processing' },
      { status: 500 }
    )
  }
}
