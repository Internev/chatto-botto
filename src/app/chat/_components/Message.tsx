import React, { useRef, useState } from 'react'
import { IMessage } from '@/_context/types'

interface IMessageProps {
  message: IMessage
  messagesLength: number
}

const Message: React.FC<IMessageProps> = ({ message, messagesLength }) => {
  const [showAlt, setShowAlt] = useState(false)
  const [showEn, setShowEn] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleAudio = () => {
    if (audioRef?.current?.paused) {
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      audioRef?.current?.pause()
      setIsPlaying(false)
    }
  }

  if (!message.languages?.main) {
    console.log('No main language in message:', message)
    return null
  }

  return (
    <div
      key={message.id}
      className={`px-2 rounded-lg flex flex-col justify-end mb-auto ${
        message.agent === 'user'
          ? 'bg-blue-100 ml-auto py-2'
          : 'bg-gray-100 pb-2'
      } max-w-[70%]`}
    >
      <div className="flex justify-end">
        {messagesLength < 4 && (
          <div className="ml-auto text-xs align-bottom text-gray-300">
            Show/hide translations →
          </div>
        )}
        {message.originalLanguage === 'ja' && message.agent === 'bot' && (
          <div className="ml-auto w-1/5">
            <button onClick={() => setShowAlt(!showAlt)}>
              <span className={showAlt ? 'text-gray-900' : 'text-gray-300'}>
                ro
              </span>
            </button>
          </div>
        )}
        <div className="ml-2 w-1/5">
          <button onClick={() => setShowEn(!showEn)}>
            <span className={showEn ? 'text-gray-900' : 'text-gray-300'}>
              en
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <button
          className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={toggleAudio}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        <span>{message.languages.main?.join(' ')}</span>
      </div>
      {message.languages.cor && (
        <div className="py-2 text-gray-500 italic">
          {message.languages.cor?.join(' ')}
        </div>
      )}

      {message.languages.alt && (
        <div className="py-2">{showAlt && message.languages.alt.join(' ')}</div>
      )}

      {message.languages.en && (
        <div className="py-2">{showEn && message.languages.en.join(' ')}</div>
      )}

      {message.audioUrls?.main && (
        <audio
          ref={audioRef}
          src={message.audioUrls.main}
          className="hidden"
          autoPlay={message.agent === 'bot'}
          controls
        />
      )}
    </div>
  )
}

export default Message
