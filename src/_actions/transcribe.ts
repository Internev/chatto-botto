'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const transcribe = async (audioBlob: FormData, language: string) => {
  console.log('sending request to openai', audioBlob)
  const audio = audioBlob.get('audio') as Blob
  if (!audio) {
    throw new Error('No audio file found')
  }
  const audioFile = await OpenAI.toFile(audio, 'audio.webm')
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language,
    })
    console.log('transcription:', transcription)
    return transcription.text
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export default transcribe
