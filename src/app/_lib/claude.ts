'use server'

import '@anthropic-ai/sdk/shims/node'
import Anthropic from '@anthropic-ai/sdk'
import { ContentBlock, TextBlock } from '@anthropic-ai/sdk/resources/messages'

import { IConversation } from '@/_context/types'
import {
  generateSystemPrompt,
  ISystemPromptInput,
} from '@/app/_lib/_prompting/prompts'

// {
//   "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
//   "type": "message",
//   "role": "assistant",
//   "content": [
//     {
//       "type": "text",
//       "text": "Hello!"
//     }
//   ],
//   "model": "claude-3-5-sonnet-20240620",
//   "stop_reason": "end_turn",
//   "stop_sequence": null,
//   "usage": {
//     "input_tokens": 12,
//     "output_tokens": 6
//   }
// }

export const parseClaudeResponse = (response: Anthropic.Messages.Message) => {
  const isTextBlock = (block: ContentBlock): block is TextBlock => {
    return block.type === 'text'
  }
  if (!response.content.every(isTextBlock)) {
    throw new Error('Unexpected content')
  }
  const text = response.content[0].text

  const mainRegex = /<main>(.*?)<\/main>/g
  const altRegex = /<alt>(.*?)<\/alt>/g
  const enRegex = /<en>(.*?)<\/en>/g
  const corRegex = /<cor>(.*?)<\/cor>/g

  const mainMatches = Array.from(text.matchAll(mainRegex)).map(
    (match) => match[1]
  )
  const altMatches = Array.from(text.matchAll(altRegex)).map(
    (match) => match[1]
  )
  const enMatches = Array.from(text.matchAll(enRegex)).map((match) => match[1])
  const corMatches = Array.from(text.matchAll(corRegex)).map(
    (match) => match[1]
  )

  return Promise.resolve({
    main: mainMatches,
    alt: altMatches,
    en: enMatches,
    cor: corMatches,
  })
}

// Models:
// claude-3-5-sonnet-20240620
// claude-3-opus-20240229
// claude-3-haiku-20240307

export const initClaude = async (systemPrompt: string) => {
  const key = process.env.ANTHROPIC_API_KEY
  const anthropic = new Anthropic({
    apiKey: key,
  })

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: `I'm ready` }],
  })

  return parseClaudeResponse(response)
}

const cleanConversation = (conversation: IConversation) => {
  const cleanedMessages = []
  let prevAgent = null
  let prevMessage = null

  for (const message of conversation.messages) {
    if (message.agent !== prevAgent) {
      cleanedMessages.push(message)
      prevAgent = message.agent
      prevMessage = message
    } else {
      const mLength = message.languages.main?.length || 0
      const pLength = prevMessage?.languages.main?.length || 0
      if (prevMessage && mLength > pLength) {
        cleanedMessages.pop()
        cleanedMessages.push(message)
        prevMessage = message
      }
    }
  }

  return cleanedMessages
}

export const parseStateToClaude = async (conversation: IConversation) => {
  console.log('Conversation:', conversation)
  const santisedMessages = cleanConversation(conversation)

  const messages = santisedMessages.map((message) => {
    if (!message.languages.main) {
      throw new Error('Expected main language in message languages')
    }
    const mLength = message.languages.main.length
    let content = ''
    if (message.agent === 'bot') {
      for (let i = 0; i < mLength; i++) {
        const main = message.languages.main[i]
          ? `<main>${message.languages.main[i]}</main>`
          : ''
        const alt = message.languages.alt?.[i]
          ? `<alt>${message.languages.alt[i]}</alt>`
          : ''
        const en = message.languages.en?.[i]
          ? `<en>${message.languages.en[i]}</en>`
          : ''
        const cor = message.languages.cor?.[i]
          ? `<cor>${message.languages.cor[i]}</cor>`
          : ''

        content += `${main} ${alt} ${en} ${cor}`
      }
    } else {
      content = message.languages.main.join(' ')
    }
    return {
      role:
        message.agent === 'bot'
          ? 'assistant'
          : ('user' as 'user' | 'assistant'),
      content,
    }
  })
  return Promise.resolve(messages)
}

export const continueClaudeConversation = async (
  conversation: IConversation
) => {
  const key = process.env.ANTHROPIC_API_KEY
  const anthropic = new Anthropic({
    apiKey: key,
  })

  const { systemPrompt } = conversation

  const claudeConversation = await parseStateToClaude(conversation)

  console.log('Claude conversation:', JSON.stringify(claudeConversation))

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: `I'm ready` }, ...claudeConversation],
  })

  console.log('Response usage:', response.usage)
  return parseClaudeResponse(response)
}
