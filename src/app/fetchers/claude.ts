import Anthropic from '@anthropic-ai/sdk'
import { v4 as uuid } from 'uuid'
import { useAppContext } from '../context/AppContext'
import { basicLevel1 } from '../../prompting/prompts'

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

  const message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    system: basicLevel1,
    messages: [{ role: 'user', content: `I'm ready` }],
  })

  return message
}

const parseClaudeResponse = (text: string) => {
  const mainRegex = /<main>(.*?)<\/main>/g
  const altRegex = /<alt>(.*?)<\/alt>/g
  const enRegex = /<en>(.*?)<\/en>/g
  const corRegex = /<cor>(.*?)<\/cor>/g

  const mainMatches = [...text.matchAll(mainRegex)].map((match) => match[1])
  const altMatches = [...text.matchAll(altRegex)].map((match) => match[1])
  const enMatches = [...text.matchAll(enRegex)].map((match) => match[1])
  const corMatches = [...text.matchAll(corRegex)].map((match) => match[1])

  return {
    main: mainMatches.join(' '),
    alt: altMatches.join(' '),
    en: enMatches.join(' '),
    cor: corMatches.join(' '),
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
          participants: ['user-1', 'user-2'],
          messages: [
            {
              id: '1',
              userId: 'user-1',
              timestamp: Date.now(),
              translations: {
                en: `Hello. How was your weekend?`,
                ja: 'こんにちは。休みは どうでしたか？',
                ro: 'Konnichiwa. Yasumi wa dou deshita ka?',
              },
              originalLanguage: 'ja',
              agent: 'bot',
            },
            {
              id: '2',
              userId: 'user-2',
              timestamp: Date.now(),
              translations: {
                en: `On the weekend, I ate dinner with a friend.`,
                ja: 'しゅうまつは ともだちと ばんごはんを たべました',
                ro: 'Shuumatsu wa tomodachi to bangohan wo tabemashita.',
              },
              originalLanguage: 'ja',
              agent: 'user',
            },
            {
              id: '1',
              userId: 'user-1',
              timestamp: Date.now(),
              translations: {
                en: `Hello. How was your weekend?`,
                ja: 'こんにちは。休みは どうでしたか？',
                ro: 'Konnichiwa. Yasumi wa dou deshita ka?',
              },
              originalLanguage: 'ja',
              agent: 'bot',
            },
            {
              id: '2',
              userId: 'user-2',
              timestamp: Date.now(),
              translations: {
                en: `On the weekend, I ate dinner with a friend.`,
                ja: 'しゅうまつは ともだちと ばんごはんを たべました',
                ro: 'Shuumatsu wa tomodachi to bangohan wo tabemashita.',
              },
              originalLanguage: 'ja',
              agent: 'user',
            },
            {
              id: '1',
              userId: 'user-1',
              timestamp: Date.now(),
              translations: {
                en: `Hello. How was your weekend?`,
                ja: 'こんにちは。休みは どうでしたか？',
                ro: 'Konnichiwa. Yasumi wa dou deshita ka?',
              },
              originalLanguage: 'ja',
              agent: 'bot',
            },
            {
              id: '2',
              userId: 'user-2',
              timestamp: Date.now(),
              translations: {
                en: `On the weekend, I ate dinner with a friend.`,
                ja: 'しゅうまつは ともだちと ばんごはんを たべました',
                ro: 'Shuumatsu wa tomodachi to bangohan wo tabemashita.',
              },
              originalLanguage: 'ja',
              agent: 'user',
            },
            {
              id: '1',
              userId: 'user-1',
              timestamp: Date.now(),
              translations: {
                en: `Hello. How was your weekend?`,
                ja: 'こんにちは。休みは どうでしたか？',
                ro: 'Konnichiwa. Yasumi wa dou deshita ka?',
              },
              originalLanguage: 'ja',
              agent: 'bot',
            },
            {
              id: '2',
              userId: 'user-2',
              timestamp: Date.now(),
              translations: {
                en: `On the weekend, I ate dinner with a friend.`,
                ja: 'しゅうまつは ともだちと ばんごはんを たべました',
                ro: 'Shuumatsu wa tomodachi to bangohan wo tabemashita.',
              },
              originalLanguage: 'ja',
              agent: 'user',
            },
            {
              id: '1',
              userId: 'user-1',
              timestamp: Date.now(),
              translations: {
                en: `Hello. How was your weekend?`,
                ja: 'こんにちは。休みは どうでしたか？',
                ro: 'Konnichiwa. Yasumi wa dou deshita ka?',
              },
              originalLanguage: 'ja',
              agent: 'bot',
            },
            {
              id: '2',
              userId: 'user-2',
              timestamp: Date.now(),
              translations: {
                en: `On the weekend, I ate dinner with a friend.`,
                ja: 'しゅうまつは ともだちと ばんごはんを たべました',
                ro: 'Shuumatsu wa tomodachi to bangohan wo tabemashita.',
              },
              originalLanguage: 'ja',
              agent: 'user',
            },
            {
              id: '1',
              userId: 'user-1',
              timestamp: Date.now(),
              translations: {
                en: `Hello. How was your weekend?`,
                ja: 'こんにちは。休みは どうでしたか？',
                ro: 'Konnichiwa. Yasumi wa dou deshita ka?',
              },
              originalLanguage: 'ja',
              agent: 'bot',
            },
            {
              id: '2',
              userId: 'user-2',
              timestamp: Date.now(),
              translations: {
                en: `On the weekend, I ate dinner with a friend.`,
                ja: 'しゅうまつは ともだちと ばんごはんを たべました',
                ro: 'Shuumatsu wa tomodachi to bangohan wo tabemashita.',
              },
              originalLanguage: 'ja',
              agent: 'user',
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
