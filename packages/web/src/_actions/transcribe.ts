'use server'

import speech from '@google-cloud/speech'

const client = new speech.SpeechClient()

const transcribe = async (audioString: string) => {
  const config = {
    encoding: 'WEBM_OPUS' as 'WEBM_OPUS',
    sampleRateHertz: 48000,
    languageCode: 'ja-JP', // TODO: make this configurable
  }

  const request = {
    audio: { content: audioString },
    config,
  }

  console.log('sending request to google')
  const startTime = Date.now()
  try {
    const data = await client.recognize(request)
    if (!data || !data[0] || !data[0].results) {
      return null
    }
    const transcription = data[0].results
      .map((result) => result?.alternatives?.[0].transcript)
      .join('\n')

    console.log('time taken:', Date.now() - startTime)
    return transcription
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export default transcribe
