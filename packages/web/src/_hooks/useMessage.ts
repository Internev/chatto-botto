import { useCallback, useEffect } from 'react'
import { useAppContext } from '@/_context/AppContext'
import { IMessage } from '@/_context/types'
import { continueClaudeConversation } from '@/_actions/claude'
import speak from '@/_actions/speak'

export const useMessage = () => {
  const { state, dispatch } = useAppContext()

  type AddMessageParams = Partial<Omit<IMessage, 'id'>>
  type UpdateMessageParams = { id: string } & Partial<Omit<IMessage, 'id'>>

  function createMessageHandler(
    actionType: 'ADD_MESSAGE'
  ): (params: AddMessageParams) => void
  function createMessageHandler(
    actionType: 'UPDATE_MESSAGE'
  ): (params: UpdateMessageParams) => void

  function createMessageHandler(actionType: 'ADD_MESSAGE' | 'UPDATE_MESSAGE') {
    return (params: AddMessageParams | UpdateMessageParams) => {
      const {
        id = Date.now().toString(),
        timestamp = Date.now(),
        languages = {},
        audioUrls = {},
        userId = 'user-1',
        originalLanguage = 'ja',
        agent = 'user',
      } = params as IMessage

      const message: IMessage = {
        id,
        timestamp,
        languages,
        audioUrls,
        userId,
        originalLanguage,
        agent,
      }

      console.log('useMessage fired with action:', actionType, message)
      dispatch({ type: actionType, message })
    }
  }

  const addMessage = useCallback(createMessageHandler('ADD_MESSAGE'), [
    dispatch,
  ])
  const updateMessage = useCallback(createMessageHandler('UPDATE_MESSAGE'), [
    dispatch,
  ])

  useEffect(() => {
    const continueConversation = async () => {
      const conversation = state.conversation
      const lastMessage =
        conversation &&
        conversation.messages[conversation.messages.length - 1 || 0]
      if (lastMessage?.agent === 'user') {
        console.log('🧐 User message detected. Getting new Claude response...')
        const languages = await continueClaudeConversation(conversation)
        addMessage({
          languages,
          userId: 'botto',
          originalLanguage: 'ja',
          agent: 'bot',
        })
      } else if (lastMessage?.agent === 'bot' && !lastMessage.audioUrls?.main) {
        console.log('🤖 Bot message detected. Generating audio...')
        const activeText = lastMessage.languages?.['main']?.join(' ')
        if (!activeText) {
          throw new Error('No main language found in last message')
        }
        const speechBase64 = await speak(activeText)
        const audioUrl = 'data:audio/mp3;base64,' + speechBase64
        console.log('🔊 Audio URL:', audioUrl)
        updateMessage({
          ...lastMessage,
          audioUrls: {
            ...lastMessage.audioUrls,
            main: audioUrl,
          },
        })
      }
    }
    continueConversation()
  }, [state.conversation])

  return { addMessage, updateMessage }
}
