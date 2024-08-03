import { parseStateToClaude, parseClaudeResponse } from '../claude'
import { IConversation } from '../../context/types'

describe('parseStateToClaude', () => {
  it('should return the last message content', () => {
    const conversation: IConversation = {
      id: 'e7e720be-be64-4559-9483-d8203f345719',
      messages: [
        {
          id: '1d96fd6a-3070-40b8-9289-ae46146a8f1b',
          userId: 'botto',
          timestamp: 1722642677934,
          languages: {
            main: ['こんにちは、友達!', '今日はどうですか?'],
            alt: ['Konnichiwa, tomodachi!', 'Kyō wa dō desu ka?'],
            en: ['Hello, friend!', 'How are you today?'],
            cor: [''],
          },
          originalLanguage: 'ja',
          agent: 'bot',
        },
        {
          id: '6696fd6a-3070-40b8-9289-ae46146a8f1b',
          userId: 'user-1',
          timestamp: 1722642977934,
          languages: {
            main: ['おかげさまで私は元気です。あなたはどうですか？'],
          },
          originalLanguage: 'ja',
          agent: 'user',
        },
      ],
      createdAt: 1722642677934,
      updatedAt: 1722642977934,
    }

    const correctOutput = [
      {
        role: 'assistant',
        content:
          '<main>こんにちは、友達!</main> <alt>Konnichiwa, tomodachi!</alt> <en>Hello, friend!</en> <main>今日はどうですか?</main> <alt>Kyō wa dō desu ka?</alt> <en>How are you today?</en> ',
      },
      {
        role: 'user',
        content: 'おかげさまで私は元気です。あなたはどうですか？',
      },
    ]

    const parsedConversation = parseStateToClaude(conversation)
    expect(parsedConversation).toEqual(correctOutput)
  })
})

describe('parseClaudeResponse', () => {
  it('should parse the response correctly', () => {
    // Claude sometimes adds newlines 🤷
    const message =
      '<main>こんにちは、友達!</main> <alt>Konnichiwa, tomodachi!</alt> <en>Hello, friend!</en>\n\nHow are you today? \n<main>今日はどうですか?</main> <alt>Kyō wa dō desu ka?</alt> <en>How are you today?</en>'

    const parsed = parseClaudeResponse(message)

    expect(parsed).toEqual({
      main: ['こんにちは、友達!', '今日はどうですか?'],
      alt: ['Konnichiwa, tomodachi!', 'Kyō wa dō desu ka?'],
      en: ['Hello, friend!', 'How are you today?'],
      cor: [],
    })
  })
})
