import Anthropic from '@anthropic-ai/sdk'
import { v4 as uuid } from 'uuid'
import { useAppContext } from '../context/AppContext'
import { basicLevel1 } from '../../prompting/prompts'
import { IConversation } from '../context/types'

// Models:
// claude-3-5-sonnet-20240620
// claude-3-opus-20240229
// claude-3-haiku-20240307

const initClaude = async () => {
  // basicLevel1
  const key = await window.electronAPI.getEnv('ANTHROPIC_API_KEY')
  console.log('API key:', key)
  const anthropic = new Anthropic({
    apiKey: key,
  })

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    system: basicLevel1,
    messages: [{ role: 'user', content: `I'm ready` }],
  })

  return response
}

export const continueClaudeConversation = async (
  conversation: IConversation
) => {
  const key = await window.electronAPI.getEnv('ANTHROPIC_API_KEY')
  console.log('API key:', key)
  const anthropic = new Anthropic({
    apiKey: key,
  })

  const claudeConversation = parseStateToClaude(conversation)

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    system: basicLevel1,
    messages: [{ role: 'user', content: `I'm ready` }, ...claudeConversation],
  })

  return response
}

export const parseStateToClaude = (
  conversation: IConversation
): Anthropic.Messages.MessageParam[] => {
  const messages = conversation.messages.map((message) => {
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
  return messages
}

export const parseClaudeResponse = (text: string) => {
  const mainRegex = /<main>(.*?)<\/main>/g
  const altRegex = /<alt>(.*?)<\/alt>/g
  const enRegex = /<en>(.*?)<\/en>/g
  const corRegex = /<cor>(.*?)<\/cor>/g

  const mainMatches = [...text.matchAll(mainRegex)].map((match) => match[1])
  const altMatches = [...text.matchAll(altRegex)].map((match) => match[1])
  const enMatches = [...text.matchAll(enRegex)].map((match) => match[1])
  const corMatches = [...text.matchAll(corRegex)].map((match) => match[1])

  return {
    main: mainMatches,
    alt: altMatches,
    en: enMatches,
    cor: corMatches,
  }
}

export function useInitialise() {
  const { state, dispatch } = useAppContext()

  const initialiseChat = async () => {
    if (!state.initialising) {
      dispatch({
        type: 'SET_INITIALISING',
        initialising: true,
      })
      // Call API to initialise chat
      // const message = await initClaude()
      const message =
        '<main>こんにちは、友達!</main> <alt>Konnichiwa, tomodachi!</alt> <en>Hello, friend!</en>\n\nHow are you today? \n<main>今日はどうですか?</main> <alt>Kyō wa dō desu ka?</alt> <en>How are you today?</en>'
      console.log('Message:', message)
      const parsed = parseClaudeResponse(message)
      console.log('Parsed:', parsed)
      const newConversationId = uuid()
      dispatch({
        type: 'ADD_CONVERSATION',
        conversation: {
          id: newConversationId,
          messages: [
            {
              id: uuid(),
              userId: 'botto',
              timestamp: Date.now(),
              languages: parsed,
              originalLanguage: 'ja', // TODO: generalise
              agent: 'bot',
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      })
      dispatch({
        type: 'SET_CURRENT_CONVERSATION',
        conversationId: newConversationId,
      })
    }
  }

  return { initialiseChat }
}
