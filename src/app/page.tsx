'use client'

import { validatePassword } from '@/app/_lib/password'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [password, setPassword] = useState('')
  const [valid, setValid] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleValidation = async () => {
    const ok = await validatePassword(password)
    console.log('ok', ok)
    setValid(ok)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 pb-4 underline decoration-wavy">
          🤖 Chatto-Botto 🤖
        </h1>
        <div>
          Please enter alpha access password:
          <input
            type="password"
            className="border-2 border-gray-500 rounded-md p-2 m-2"
            onChange={handlePasswordChange}
          />
          <button
            className="bg-gradient-to-r from-pink-500 to-violet-500 border-gray-500 text-white rounded-md p-2 m-2"
            onClick={handleValidation}
          >
            Validate
          </button>
        </div>
        {valid && (
          <p className="text-xl mt-4">
            {`Let's have a `}
            <Link className="underline-magical" href="/chat/setup">
              conversation!
            </Link>
          </p>
        )}
      </div>
    </main>
  )
}
