'use client'

import React, { useState } from 'react'

import { Scenario, scenarios } from '@/_prompting/prompts'
import { languageOptions } from '@/_config/languages'
import { useMessage } from '@/_hooks/useMessage'
import { useRouter } from 'next/navigation'

interface OptionProps {
  value: string
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}

const levels: string[] = [
  'Beginner 1',
  'Beginner 2',
  'Beginner 3',
  'Beginner 4',
]

const ChatbotSetup: React.FC = () => {
  const [language, setLanguage] = useState<string>(languageOptions[0])
  const [level, setLevel] = useState<string>(levels[0])
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(
    Object.keys(scenarios)[0] as Scenario
  )

  const router = useRouter()
  const { initialiseChat } = useMessage()

  const Option: React.FC<OptionProps> = ({
    value,
    selected,
    onClick,
    children,
  }) => (
    <div
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
        selected
          ? 'bg-blue-500 text-white border-blue-600'
          : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400'
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

  const handleStartChatting = () => {
    console.log('Selected:', { language, level })
    //     event.preventDefault()
    initialiseChat({
      level: level,
      scenario: selectedScenario,
      language: 'Japanese',
    })
    router.push('/chat')
    // Add your logic here to start the chat or navigate to the next page
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {languageOptions.map((lang) => (
                <Option
                  key={lang}
                  value={lang}
                  selected={language === lang}
                  onClick={() => setLanguage(lang)}
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
                  {lvl}
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
            className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors duration-200"
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

// export default function SetupPage() {
//   const [selectedLanguage, setSelectedLanguage] = useState('1')
//   const [botGender, setBotGender] = useState<IGender>('female')
//   const [userGender, setUserGender] = useState<IGender>('female')
//   const [selectedLevel, setSelectedLevel] = useState('1')
//   const [selectedScenario, setSelectedScenario] = useState<Scenario>(
//     Object.keys(scenarios)[0] as Scenario
//   )

//   const { initialiseChat } = useMessage()
//   const router = useRouter()

//   const handleLanguageChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setSelectedLanguage(event.target.value)
//   }

//   const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setBotGender(event.target.value as IGender)
//   }

//   const handleSpeakAsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setUserGender(event.target.value as IGender)
//   }

//   const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedLevel(event.target.value)
//   }

//   const handleScenarioChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setSelectedScenario(event.target.value as Scenario)
//   }

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault()
//     initialiseChat({
//       level: selectedLevel,
//       scenario: selectedScenario,
//       language: 'Japanese',
//     })
//     router.push('/chat')
//   }

//   return (
//     <div className="flex flex-col h-screen content-center">
//       <div className="flex-grow overflow-auto mx-auto">
//         <h2>Setup</h2>
//         <form className="flex flex-col" onSubmit={handleSubmit}>
//           I would like to speak:
//           <select
//             name="language"
//             value={selectedLanguage}
//             onChange={handleLanguageChange}
//           >
//             <option value="1">Japanese</option>
//             <option value="2">Japanese</option>
//             <option value="3">Japanese</option>
//             <option value="4">Japanese</option>
//             <option value="5">Japanese</option>
//           </select>
//           I would like to speak with:
//           <label>
//             <input
//               type="radio"
//               name="gender"
//               value="male"
//               checked={botGender === 'male'}
//               onChange={handleGenderChange}
//             />
//             🕺
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="gender"
//               value="female"
//               checked={botGender === 'female'}
//               onChange={handleGenderChange}
//             />
//             💃
//           </label>
//           I would like to speak as:
//           <label>
//             <input
//               type="radio"
//               name="speakAs"
//               value="male"
//               checked={userGender === 'male'}
//               onChange={handleSpeakAsChange}
//             />
//             🕺
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="speakAs"
//               value="female"
//               checked={userGender === 'female'}
//               onChange={handleSpeakAsChange}
//             />
//             💃
//           </label>
//           Level:
//           <select
//             name="level"
//             value={selectedLevel}
//             onChange={handleLevelChange}
//           >
//             <option value="1">Level 1</option>
//             <option value="2">Level 2</option>
//             <option value="3">Level 3</option>
//             <option value="4">Level 4</option>
//             <option value="5">Level 5</option>
//           </select>
//           Scenario:
//           <select
//             name="scenario"
//             value={selectedScenario}
//             onChange={handleScenarioChange}
//           >
//             {Object.entries(scenarios).map(([key, { user }]) => (
//               <option key={key} value={key}>
//                 {user}
//               </option>
//             ))}
//           </select>
//           <button type="submit">Start Chat</button>
//         </form>
//       </div>
//     </div>
//   )
// }
