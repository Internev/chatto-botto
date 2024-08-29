// app/api/chat-process/route.ts

import { NextResponse } from 'next/server'
import transcribe from '@/app/_lib/transcribe'
import { continueClaudeConversation } from '@/app/_lib/claude'
import speak from '@/app/_lib/speak'
import {
  appendMessageToConversation,
  getConversation,
} from '@/app/_lib/dynamodb'
import { languages } from '@/_config/languages'
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

    const newMessage: IMessage = {
      id: uuidv4(),
      timestamp: new Date(Date.now()).toISOString(),
      userId: userId,
      languages,
      originalLanguage: language,
      agent: 'user',
    }
    await appendMessageToConversation(conversationId, newMessage)

    console.log('transcription:', transcription)
    const conversation = await getConversation(userId, conversationId)
    console.log('🌃🌃🌃Conversation:', conversation)
    // export interface IConversation {
    //   id: string
    //   messages: IMessage[]
    //   createdAt: string
    //   updatedAt: string
    // }

    return NextResponse.json({
      transcription,
      botResponse: 'claudeResponse',
      audioUrl: 'audioResponse',
    })
  } catch (error) {
    console.error('Error in chat process:', error)
    return NextResponse.json(
      { error: 'An error occurred during processing' },
      { status: 500 }
    )
  }
}
