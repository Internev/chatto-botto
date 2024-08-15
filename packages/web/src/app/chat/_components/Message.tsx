import React from 'react'
import { IMessage } from '@/_context/types'

interface IMessageProps {
  message: IMessage
}

const Message: React.FC<IMessageProps> = ({ message }) => {
  const [showAlt, setShowAlt] = React.useState(false)
  const [showEn, setShowEn] = React.useState(false)

  return (
    <div
      key={message.id}
      className={`px-2 pb-2 rounded-lg flex flex-col justify-end mb-auto ${
        message.agent === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
      } max-w-[70%]`}
    >
      <div className="flex justify-end">
        {message.agent === 'bot' && (
          <>
            <div className="ml-auto w-1/5">
              <button onClick={() => setShowAlt(!showAlt)}>
                <span className={showAlt ? 'text-gray-900' : 'text-gray-300'}>
                  ro
                </span>
              </button>
            </div>
            <div className="ml-2 w-1/5">
              <button onClick={() => setShowEn(!showEn)}>
                <span className={showEn ? 'text-gray-900' : 'text-gray-300'}>
                  en
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      {message.languages.main?.join(' ')}

      {message.languages.alt && (
        <div className="py-2">{showAlt && message.languages.alt.join(' ')}</div>
      )}

      {message.languages.en && (
        <div className="py-2">{showEn && message.languages.en.join(' ')}</div>
      )}

      {message.audioUrls?.main && message.agent === 'user' && (
        <audio controls>
          <source src={message.audioUrls.main} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      {message.audioUrls?.main && message.agent === 'bot' && (
        <audio controls autoPlay>
          <source src={message.audioUrls.main} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  )
}

export default Message
