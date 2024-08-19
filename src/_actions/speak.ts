'use server'

import {
  PollyClient,
  SynthesizeSpeechCommand,
  SynthesizeSpeechCommandInput,
} from '@aws-sdk/client-polly'

const awsKey = process.env['AWS_ACCESS_KEY_ID'] || ''
const awsSecret = process.env['AWS_SECRET_ACCESS_KEY'] || ''

const streamToBuffer = (stream: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []
    stream.on('data', (chunk: any) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

const pollyClient =
  process.env.NODE_ENV === 'development'
    ? new PollyClient({
        region: 'ap-southeast-2',
        credentials: {
          accessKeyId: awsKey,
          secretAccessKey: awsSecret,
        },
      })
    : new PollyClient({ region: 'ap-southeast-2' })

const speak = async (text: string) => {
  const tempParams: SynthesizeSpeechCommandInput = {
    Engine: 'neural',
    OutputFormat: 'mp3',
    Text: text,
    TextType: 'text',
    VoiceId: 'Takumi',
    SampleRate: '24000',
  }

  try {
    const spokenAudio = await pollyClient.send(
      new SynthesizeSpeechCommand(tempParams)
    )
    const audioBuffer = await streamToBuffer(spokenAudio.AudioStream)
    return audioBuffer.toString('base64')
  } catch (err) {
    console.log('Error putting object', err)
  }
}

export default speak
