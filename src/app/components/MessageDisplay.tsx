import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { v4 as uuidv4 } from 'uuid'
import { IMessage } from '../context/types'
import styled from 'styled-components'
import Message from './Message'
import { useInitialise } from '../fetchers/claude'

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
  const { state } = useAppContext()
  const { initialiseChat } = useInitialise()

  const currentConversation = state.currentConversationId
    ? state.conversations[state.currentConversationId]
    : null

  console.log('Current conversation:', currentConversation)
  return currentConversation ? (
    <MessageContainer>
      {currentConversation.messages.map((message) => (
        <MessageBox key={message.id}>
          <Message agent={message.agent} translations={message.translations} />
        </MessageBox>
      ))}
    </MessageContainer>
  ) : (
    <div onClick={initialiseChat}>Start chatting</div>
  )
}
