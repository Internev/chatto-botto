import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { v4 as uuidv4 } from 'uuid'
import { Message } from '../context/types'
import styled from 'styled-components'

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

const Message = styled.div<{ agent: 'user' | 'bot' }>`
  background-color: ${(props) =>
    props.agent === 'user' ? 'lightblue' : 'lightgreen'};
  padding: 8px;
  margin-top: 8px;
  border-radius: 8px;
  width: 500px;
  max-width: 80%;
  ${(props) =>
    props.agent === 'bot' ? 'margin-right: auto;' : 'margin-left: auto;'}
`

export const MessageDisplay = () => {
  const { state, dispatch } = useAppContext()
  const [newMessageText, setNewMessageText] = useState('')

  const currentConversation = state.currentConversationId
    ? state.conversations[state.currentConversationId]
    : null

  const handleSendMessage = () => {
    if (!currentConversation || !newMessageText.trim()) return

    const newMessage: Message = {
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
          <Message agent={message.agent}>
            {message.translations[message.originalLanguage]}
          </Message>
        </MessageBox>
      ))}
    </MessageContainer>
  ) : (
    <div>No conversation selected</div>
  )
}
