'use client'

import React, { useState } from 'react'

import { Scenario, scenarios } from '@/_prompting/prompts'
import { ILanguage, languages } from '@/_config/languages'
import { useMessage } from '@/_hooks/useMessage'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/_context/AppContext'
import { ILanguageCode } from '@/_context/types'

interface OptionProps {
  value: string
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}

const levels: string[] = ['1', '2', '3', '4']

const ChatbotSetup: React.FC = () => {
  const [language, setLanguage] = useState<string>(languages.Japanese.name)
  const [level, setLevel] = useState<string>(levels[0])
  const [partner, setPartner] = useState<string>(
    languages.Japanese.voices[0].name
  )
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(
    Object.keys(scenarios)[0] as Scenario
  )

  const { dispatch } = useAppContext()
  const router = useRouter()
  const { initialiseChat } = useMessage()

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
    dispatch({ type: 'SET_LANGUAGE', language: languageCode })
    setLanguage(lang.name)
    setPartner(lang.voices[0].name)
  }

  const handleVoiceChange = (voiceId: string) => {
    setPartner(voiceId)
    dispatch({ type: 'SET_VOICE', voiceId })
  }

  const handleStartChatting = () => {
    initialiseChat({
      level: level,
      scenario: selectedScenario,
      language: languages[language].main as ILanguageCode,
    })
    router.push('/chat')
  }

  console.log('language', language)
  console.log('voice', languages[language])

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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
            <div className="grid grid-cols-2 gap-3">
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
            <div className="grid grid-cols-2 gap-3">
              {languages[language].voices.map(({ name, languageName }) => (
                <Option
                  key={name}
                  value={name}
                  selected={partner === name}
                  onClick={() => handleVoiceChange(name)}
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
