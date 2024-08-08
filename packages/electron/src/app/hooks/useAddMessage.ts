import { useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import { ILanguageCode, IMessage } from '../context/types'

export const useAddMessage = () => {
  const { dispatch } = useAppContext()

  const addMessage = useCallback(
    ({
      id = Date.now().toString(),
      timestamp = Date.now(),
      languages = {},
      audioUrls = {},
      userId = 'user-1',
      originalLanguage = 'ja',
      agent = 'user',
    }: Partial<IMessage>) => {
      const message: IMessage = {
        id,
        userId,
        timestamp,
        languages,
        audioUrls,
        originalLanguage,
        agent,
      }

      dispatch({
        type: 'ADD_MESSAGE',
        message,
      })
    },
    [dispatch]
  )

  const updateMessage = useCallback(
    ({
      id = Date.now().toString(),
      timestamp = Date.now(),
      languages = {},
      audioUrls = {},
      userId = 'user-1',
      originalLanguage = 'ja',
      agent = 'user',
    }: Partial<IMessage>) => {
      const message: IMessage = {
        id,
        userId,
        timestamp,
        languages,
        audioUrls,
        originalLanguage,
        agent,
      }

      dispatch({
        type: 'UPDATE_MESSAGE',
        message,
      })
    },
    [dispatch]
  )

  return { addMessage, updateMessage }
}

// Example usage in another hook or component:
// const SomeComponent = () => {
//   const addMessage = useAddMessage();

//   const handleSomeEvent = (transcriptionResult) => {
//     addMessage(transcriptionResult);
//   };

//   // ... rest of the component
// };
