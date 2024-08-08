import { encode } from 'js-base64'

import transcribeAudio from './transcribe'

export async function POST(request: Request) {
  try {
    const { audioString } = await request.json()
    const transcription = await transcribeAudio(audioString)
    return Response.json({ transcription })
  } catch (error) {
    return { error: 'Failed to fetch data' }
  }
}
