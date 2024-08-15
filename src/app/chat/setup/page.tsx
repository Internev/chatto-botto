'use client'

import { useMessage } from '@/_hooks/useMessage'
import { Scenario, scenarios } from '@/_prompting/prompts'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type IGender = 'male' | 'female'

export default function SetupPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('1')
  const [botGender, setBotGender] = useState<IGender>('female')
  const [userGender, setUserGender] = useState<IGender>('female')
  const [selectedLevel, setSelectedLevel] = useState('1')
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(
    Object.keys(scenarios)[0] as Scenario
  )

  const { initialiseChat } = useMessage()
  const router = useRouter()

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLanguage(event.target.value)
  }

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBotGender(event.target.value as IGender)
  }

  const handleSpeakAsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserGender(event.target.value as IGender)
  }

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(event.target.value)
  }

  const handleScenarioChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedScenario(event.target.value as Scenario)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    initialiseChat({
      level: selectedLevel,
      scenario: selectedScenario,
      language: 'Japanese',
    })
    router.push('/chat')
  }

  return (
    <div className="flex flex-col h-screen content-center">
      <div className="flex-grow overflow-auto mx-auto">
        <h2>Setup</h2>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          I would like to speak:
          <select
            name="language"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <option value="1">Japanese</option>
            <option value="2">Japanese</option>
            <option value="3">Japanese</option>
            <option value="4">Japanese</option>
            <option value="5">Japanese</option>
          </select>
          I would like to speak with:
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={botGender === 'male'}
              onChange={handleGenderChange}
            />
            🕺
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={botGender === 'female'}
              onChange={handleGenderChange}
            />
            💃
          </label>
          I would like to speak as:
          <label>
            <input
              type="radio"
              name="speakAs"
              value="male"
              checked={userGender === 'male'}
              onChange={handleSpeakAsChange}
            />
            🕺
          </label>
          <label>
            <input
              type="radio"
              name="speakAs"
              value="female"
              checked={userGender === 'female'}
              onChange={handleSpeakAsChange}
            />
            💃
          </label>
          Level:
          <select
            name="level"
            value={selectedLevel}
            onChange={handleLevelChange}
          >
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
          </select>
          Scenario:
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
          <button type="submit">Start Chat</button>
        </form>
      </div>
    </div>
  )
}
