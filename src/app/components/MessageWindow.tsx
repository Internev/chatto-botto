import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Anthropic from '@anthropic-ai/sdk'

const MessageWindowContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

// const anthropic = new Anthropic({
//   apiKey: process.env['ANTHROPIC_API_KEY'],
// });

// const anthropic = new Anthropic()

// async function main() {
//   const message = await anthropic.messages.create({
//     max_tokens: 1024,
//     messages: [{ role: 'user', content: 'Hello, Claude' }],
//     model: 'claude-3-opus-20240229',
//   })

//   console.log(message.content)
// }

const MessageWindow: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null)

  useEffect(() => {
    const fetchApiKey = async () => {
      const key = await window.electronAPI.getEnv('ANTHROPIC_API_KEY')
      console.log('API key:', key)
      setApiKey(key)
      const anthropic = new Anthropic({
        apiKey: key,
      })

      async function main() {
        const message = await anthropic.messages.create({
          max_tokens: 1024,
          messages: [{ role: 'user', content: 'Hello, Claude' }],
          model: 'claude-3-opus-20240229',
        })

        console.log(message.content)
      }

      main()
    }

    fetchApiKey()
  }, [])
  return <MessageWindowContainer>chat goes here</MessageWindowContainer>
}

export default MessageWindow
