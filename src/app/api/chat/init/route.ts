import { IMessage } from '@/_context/types'
import { generateSystemPrompt } from '@/app/_lib/_prompting/prompts'
import { initClaude } from '@/app/_lib/claude'
import {
  appendMessageToConversation,
  initializeConversation,
} from '@/app/_lib/dynamodb'
import speak from '@/app/_lib/speak'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const { systemPrompt, voiceId } = await request.json()
    const userId = 'user-1'
    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    }

    const generatedSystemPrompt = generateSystemPrompt(systemPrompt)

    const { language } = systemPrompt
    console.log('init chat language:', language)
    const conversation = await initializeConversation(userId, {
      language,
      systemPrompt: generatedSystemPrompt,
      voiceId,
    }) // TODO: type this

    const claudeResponse = await initClaude(generatedSystemPrompt)
    const audioToSpeak = claudeResponse.main.join(' ')
    const audioUrl = await speak(audioToSpeak, voiceId)

    const newMessage: IMessage = {
      id: uuidv4(),
      timestamp: new Date(Date.now()).toISOString(),
      userId: userId,
      languages: claudeResponse,
      originalLanguage: language,
      agent: 'bot',
      // We don't want to save audioUrls in the database, TODO put in s3
      // audioUrls: {
      //   main: 'data:audio/mp3;base64,' + audioUrl,
      // },
    }
    await appendMessageToConversation(conversation.id, newMessage)

    return NextResponse.json({
      conversation,
      initialMessage: {
        ...newMessage,
        audioUrls: {
          main: 'data:audio/mp3;base64,' + audioUrl,
        },
      },
    })
  } catch (error) {
    console.error('Error initializing chat:', error)
    return NextResponse.json(
      { error: 'Failed to initialize chat' },
      { status: 500 }
    )
  }
}
