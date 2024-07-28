import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { v4 as uuidv4 } from 'uuid'
import { IMessage } from '../context/types'
import styled from 'styled-components'
import Message from './Message'

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  border: 1px solid black;
`

const MessageBox = styled.div`
  width: 100%;
`

export const MessageDisplay = () => {
  const { state, dispatch } = useAppContext()
  const [newMessageText, setNewMessageText] = useState('')

  const currentConversation = state.currentConversationId
    ? state.conversations[state.currentConversationId]
    : null

  const handleSendMessage = () => {
    if (!currentConversation || !newMessageText.trim()) return

    const newMessage: IMessage = {
      id: uuidv4(),
      userId: 'current-user-id', // Replace with actual user ID
      timestamp: Date.now(),
      translations: {
        en: newMessageText,
      },
      originalLanguage: 'en',
      agent: 'user',
    }

    dispatch({
      type: 'ADD_MESSAGE',
      conversationId: currentConversation.id,
      message: newMessage,
    })

    setNewMessageText('')
  }

  return currentConversation ? (
    <MessageContainer>
      {currentConversation.messages.map((message) => (
        <MessageBox key={message.id}>
          <Message agent={message.agent} translations={message.translations} />
        </MessageBox>
      ))}
    </MessageContainer>
  ) : (
    <div>No conversation selected</div>
  )
}
