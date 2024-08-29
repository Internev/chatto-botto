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
    // Initialize a new conversation
    const { language } = systemPrompt
    const conversation = await initializeConversation(userId, {
      language,
      systemPrompt,
    })

    const languages = await initClaude(generatedSystemPrompt)
    const audioToSpeak = languages.main.join(' ')
    const audioUrl = await speak(audioToSpeak, voiceId)

    const newMessage: IMessage = {
      id: uuidv4(),
      timestamp: new Date(Date.now()).toISOString(),
      userId: userId,
      languages,
      originalLanguage: language,
      agent: 'bot',
      audioUrls: {
        main: 'data:audio/mp3;base64,' + audioUrl,
      },
    }
    await appendMessageToConversation(conversation.conversationId, newMessage)

    return NextResponse.json({
      conversation,
      initialMessage: newMessage,
    })
  } catch (error) {
    console.error('Error initializing chat:', error)
    return NextResponse.json(
      { error: 'Failed to initialize chat' },
      { status: 500 }
    )
  }
}
