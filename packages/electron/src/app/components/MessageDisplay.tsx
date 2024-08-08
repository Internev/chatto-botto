import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { v4 as uuidv4 } from 'uuid'
import { IMessage } from '../context/types'
import styled from 'styled-components'
import Message from './Message'
import { useInitialise } from '../fetchers/claude'
import { useAddMessage } from '../hooks/useAddMessage'
import { continueClaudeConversation } from '../fetchers/claude'

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
  const { addMessage, updateMessage } = useAddMessage()

  useEffect(() => {
    const fetchAndAddMessage = async () => {
      console.log('useEffect triggered', state.currentConversationId)
      const conversation = state.conversations[state.currentConversationId]
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
        const activeText = lastMessage.languages['main'].join(' ')
        const speechBase64 = await window.electronAPI.textToSpeech(activeText)
        const audioUrl = 'data:audio/mp3;base64,' + speechBase64
        updateMessage({
          ...lastMessage,
          audioUrls: {
            ...lastMessage.audioUrls,
            main: audioUrl,
          },
        })
      }
    }
    fetchAndAddMessage()
  }, [state.conversations[state.currentConversationId]])

  const currentConversation = state.currentConversationId
    ? state.conversations[state.currentConversationId]
    : null

  console.log('Current conversation:', currentConversation)
  return currentConversation ? (
    <MessageContainer>
      {currentConversation.messages.map((message) => (
        <MessageBox key={message.id}>
          <Message
            agent={message.agent}
            languages={message.languages}
            audioUrls={message.audioUrls}
          />
        </MessageBox>
      ))}
    </MessageContainer>
  ) : (
    <div onClick={initialiseChat}>Start chatting</div>
  )
}
