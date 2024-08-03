import { useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import { ILanguageCode, IMessage } from '../context/types'

export const useAddMessage = () => {
  const { dispatch } = useAppContext()

  const addMessage = useCallback(
    (
      languages: { [key in ILanguageCode]?: string[] },
      userId = 'user-1',
      originalLanguage = 'ja' as ILanguageCode,
      agent = 'user' as 'user' | 'bot'
    ) => {
      const message: IMessage = {
        id: Date.now().toString(),
        userId,
        timestamp: Date.now(),
        languages,
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

  return addMessage
}

// Example usage in another hook or component:
// const SomeComponent = () => {
//   const addMessage = useAddMessage();

//   const handleSomeEvent = (transcriptionResult) => {
//     addMessage(transcriptionResult);
//   };

//   // ... rest of the component
// };
