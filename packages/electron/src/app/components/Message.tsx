import React, { useState } from 'react'
import styled from 'styled-components'

const MessageBox = styled.div<{ agent: string }>`
  border-radius: 8px;
  width: 500px;
  max-width: 80%;
  ${(props) =>
    props.agent === 'bot' ? 'margin-right: auto;' : 'margin-left: auto;'}
`

const PlayButton = styled.button`
  background-color: lightgray;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  margin-top: 8px;
  cursor: pointer;
`

interface MessageProps {
  languages: { [key: string]: string[] }
  audioUrls: { [key: string]: string }
  agent: 'user' | 'bot'
}

const Message: React.FC<MessageProps> = ({ languages, agent, audioUrls }) => {
  const [activeText, setActiveText] = useState<string>(
    languages['main'].join(' ')
  )
  const [audioUrl, setAudioUrl] = useState<string | undefined>(audioUrls?.main)

  const handleTabClick = (language: string) => {
    const text = languages[language as keyof typeof languages]
    setActiveText(text.join(' '))
  }

  const handlePlayClick = async () => {
    const speechBase64 = await window.electronAPI.textToSpeech(activeText)
    setAudioUrl('data:audio/mp3;base64,' + speechBase64)
  }

  return (
    // todo: fix indexing
    <MessageBox agent={agent}>
      <div>
        {Object.keys(languages).map((language) => (
          <button key={language} onClick={() => handleTabClick(language)}>
            {language}
          </button>
        ))}
      </div>
      <div>
        <PlayButton onClick={handlePlayClick}>play</PlayButton>
        {activeText}
      </div>
      {audioUrl && (
        <audio controls autoPlay>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </MessageBox>
  )
}

export default Message
