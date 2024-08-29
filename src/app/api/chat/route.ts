// app/api/chat-process/route.ts

import { NextResponse } from 'next/server'
import transcribe from '@/app/_lib/transcribe'
import { continueClaudeConversation } from '@/app/_lib/claude'
import speak from '@/app/_lib/speak'
import client, {
  createConversationsTable,
  getOrCreateConversation,
} from '@/app/_lib/dynamodb'

export async function POST(request: Request) {
  await createConversationsTable()

  const formData = await request.formData()
  const audioFile = formData.get('audio') as File
  const language = formData.get('language') as string
  const userId = 'userId' // TODO: Get user ID from session

  if (!audioFile) {
    return NextResponse.json(
      { error: 'No audio file provided' },
      { status: 400 }
    )
  }

  try {
    // Get or create a conversation for this user
    const conversation = await getOrCreateConversation(userId, language)
    if (!conversation?.id) {
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      )
    }
    const conversationId = conversation.id
    // 1. Transcribe audio
    const transcription = await transcribe(formData)

    console.log('saving to DB conversation id:', conversationId)
    // Save to DynamoDB
    // await dynamodbClient
    //   .put({
    //     TableName: 'Conversations',
    //     Item: {
    //       convsersationId: 'conversationId',
    //       timestamp: Date.now(),
    //       transcription,
    //       botResponse: 'botResponse',
    //       audioUrl: 'audioUrl',
    //     },
    //   })
    //   .promise()
    // 2. Get response from Claude
    const claudeResponse = '' // await continueClaudeConversation(transcription)

    // 3. Convert Claude's response to speech
    const audioResponse = '' // await speak(claudeResponse)

    console.log('getting from DB')
    // const dbResult = await dynamodbClient
    //   .get({
    //     TableName: 'Conversations',
    //     Key: {
    //       convsersationId: 'conversationId',
    //     },
    //   })
    //   .promise()

    // console.log('DB result:', dbResult)

    return NextResponse.json({
      transcription,
      botResponse: claudeResponse,
      audioUrl: audioResponse,
    })
  } catch (error) {
    console.error('Error in chat process:', error)
    return NextResponse.json(
      { error: 'An error occurred during processing' },
      { status: 500 }
    )
  }
}
