import { useCallback } from 'react'
import { useAppContext } from '@/_context/AppContext'
import { IMessage } from '@/_context/types'

export const useMessage = () => {
  const { dispatch } = useAppContext()

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

      dispatch({ type: actionType, message })
    }
  }

  const addMessage = useCallback(createMessageHandler('ADD_MESSAGE'), [
    dispatch,
  ])
  const updateMessage = useCallback(createMessageHandler('UPDATE_MESSAGE'), [
    dispatch,
  ])

  return { addMessage, updateMessage }
}
