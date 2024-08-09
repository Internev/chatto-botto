import React, { useEffect } from 'react'

import { useAppContext } from '@/_context/AppContext'
import { useMessage } from '@/_hooks/useMessage'
import { continueClaudeConversation } from '@/_actions/claude'

const MessageDisplay: React.FC = () => {
  const { state } = useAppContext()
  const { addMessage, updateMessage } = useMessage()

  useEffect(() => {
    const continueConversation = async () => {
      const conversation = state.conversation
      const lastMessage =
        conversation &&
        conversation.messages[conversation.messages.length - 1 || 0]
      if (lastMessage?.agent === 'user') {
        console.log('User message detected. Getting new Claude response...')
        const languages = await continueClaudeConversation(conversation)
        addMessage({
          languages,
          userId: 'botto',
          originalLanguage: 'ja',
          agent: 'bot',
        })
      } else if (lastMessage?.agent === 'bot' && !lastMessage.audioUrls?.main) {
        console.log('Bot message detected. Generating audio...')
        // const activeText = lastMessage.languages['main'].join(' ')
        // const speechBase64 = await window.electronAPI.textToSpeech(activeText)
        // const audioUrl = 'data:audio/mp3;base64,' + speechBase64
        // updateMessage({
        //   ...lastMessage,
        //   audioUrls: {
        //     ...lastMessage.audioUrls,
        //     main: audioUrl,
        //   },
        // })
      }
    }
    continueConversation()
  }, [state.conversation])

  const { messages } = state.conversation
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="p-4 space-y-4 container mx-auto max-w-prose">
        {messages.map((message, i) => (
          <div
            key={message.id + i}
            className={`p-2 rounded-lg ${
              message.agent === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            } max-w-[70%]`}
          >
            {message.languages.main?.join(' ')}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MessageDisplay
