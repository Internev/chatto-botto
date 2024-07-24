import speech from '@google-cloud/speech'

const client = new speech.SpeechClient()

const dataReceiver = async (audioString: string) => {
  const config = {
    encoding: 'WEBM_OPUS' as 'WEBM_OPUS',
    sampleRateHertz: 48000,
    languageCode: 'en-US',
  }

  const request = {
    audio: { content: audioString },
    config,
  }

  console.log('sending request to google')
  try {
    const data = await client.recognize(request)
    const transcription = data[0].results
      .map((result) => result.alternatives[0].transcript)
      .join('\n')

    console.log('Transcription:', transcription)
    return transcription
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export default dataReceiver
