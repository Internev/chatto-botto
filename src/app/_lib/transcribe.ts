'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const transcribe = async (formData: FormData) => {
  console.log('sending request to openai', formData)
  const audio = formData.get('audio') as Blob
  const language = formData.get('language') as string
  if (!audio) {
    throw new Error('No audio file found')
  }
  const audioFile = await OpenAI.toFile(audio, 'audio.webm')
  try {
    const [transcription, translation] = await Promise.all([
      openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language,
      }),
      openai.audio.translations.create({
        file: audioFile,
        model: 'whisper-1',
      }),
    ])
    console.log('transcription:', transcription)
    console.log('translation:', translation)
    return [transcription.text, translation.text]
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export default transcribe
