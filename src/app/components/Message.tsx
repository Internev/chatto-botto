import React, { useState } from 'react'
import styled from 'styled-components'
import { IMessage } from '../context/types'

interface MessageProps {
  translations: IMessage['translations']
  agent: IMessage['agent']
}

const MessageBox = styled.div<{ agent: 'user' | 'bot' }>`
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

const Message: React.FC<MessageProps> = ({ translations, agent }) => {
  const [activeText, setactiveText] = useState(translations['ja'])

  const handleTabClick = (language: string) => {
    const text = translations[language as keyof typeof translations]
    setactiveText(text)
  }

  return (
    <MessageBox agent={agent}>
      <div>
        {Object.keys(translations).map((language) => (
          <button key={language} onClick={() => handleTabClick(language)}>
            {language}
          </button>
        ))}
      </div>
      <div>{activeText}</div>
    </MessageBox>
  )
}

export default Message
