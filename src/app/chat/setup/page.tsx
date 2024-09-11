'use client'

import React, { useState } from 'react'

import { Scenario, scenarios } from '@/app/_lib/_prompting/prompts'
import { ILanguage, languages } from '@/_config/languages'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/_context/AppContext'
import { ILanguageCode } from '@/_context/types'
import { useChat } from '@/app/_hooks/useChat'
import { VoiceId } from '@aws-sdk/client-polly'

interface OptionProps {
  value: string
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}

const getLanguageName = (language: ILanguageCode | undefined) => {
  if (!language) return undefined
  return Object.entries(languages).find(([_, l]) => l.main === language)?.[0]
}

const levels: string[] = ['1', '2', '3', '4']

const ChatbotSetup: React.FC = () => {
  const { state, dispatch } = useAppContext()

  const [language, setLanguage] = useState<string>(
    getLanguageName(state.language) || languages.Japanese.name
  )
  const [level, setLevel] = useState<string>(levels[0])
  const [partner, setPartner] = useState<VoiceId>(
    state.voiceId || languages.Japanese.voices[0].id
  )
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(
    Object.keys(scenarios)[0] as Scenario
  )

  const router = useRouter()
  const { initialiseChat } = useChat()

  const Option: React.FC<OptionProps> = ({ selected, onClick, children }) => (
    <div
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
        selected
          ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white border-white'
          : 'bg-white text-gray-800 border-teal-400 hover:border-teal-600'
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  )

  const handleScenarioChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedScenario(event.target.value as Scenario)
  }

  const handleLanguageChange = (lang: ILanguage) => {
    const languageCode = lang.main
    const voiceId = lang.voices[0].id as VoiceId
    setLanguage(lang.name)
    handleVoiceChange(voiceId)
    dispatch({ type: 'SET_LANGUAGE', language: languageCode })
  }

  const handleVoiceChange = (voiceId: VoiceId) => {
    setPartner(voiceId)
    dispatch({ type: 'SET_VOICE', voiceId })
  }

  const handleStartChatting = () => {
    initialiseChat({
      systemPrompt: {
        level: level,
        scenario: selectedScenario,
        language: languages[language].main as ILanguageCode,
      },
      voiceId: state.voiceId || 'Takumi',
    })
    router.push('/chat')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Setup
          </h1>
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-700">
              Choose a Language:
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(languages).map(([lang, l]) => (
                <Option
                  key={lang}
                  value={l.main}
                  selected={language === l.name}
                  onClick={() => handleLanguageChange(l)}
                >
                  {lang}
                </Option>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-700">
              Choose Your Level:
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {levels.map((lvl) => (
                <Option
                  key={lvl}
                  value={lvl}
                  selected={level === lvl}
                  onClick={() => setLevel(lvl)}
                >
                  Beginner {lvl}
                </Option>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-700">
              I want to speak with:
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {languages[language]?.voices.map(({ id, name, languageName }) => (
                <Option
                  key={name}
                  value={name}
                  selected={partner === id}
                  onClick={() => handleVoiceChange(id)}
                >
                  {name}
                  {languageName === language ? '' : ` (${languageName})`}
                </Option>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-700">
              Scenario:
            </h2>
            <select
              name="scenario"
              value={selectedScenario}
              onChange={handleScenarioChange}
            >
              {Object.entries(scenarios).map(([key, { user }]) => (
                <option key={key} value={key}>
                  {user}
                </option>
              ))}
            </select>
          </div>
          <button
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors duration-200"
            onClick={handleStartChatting}
          >
            Start Chatting
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatbotSetup
