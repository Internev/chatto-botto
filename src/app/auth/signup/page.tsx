'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { validatePassword } from '@/app/_lib/password'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })
    console.log('signup response', response)

    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: '/chat/setup',
    })

    console.log('(signup)sign in result:', result)
    if (result?.error) {
      console.log('error', result.error)
      setError(result.error)
    } else {
      router.push('/chat/setup')
    }
  }

  const [betaPassword, setBetaPassword] = useState('')
  const [valid, setValid] = useState(false)

  const handleBetaPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetaPassword(e.target.value)
  }

  const handleValidation = async () => {
    const ok = await validatePassword(betaPassword)
    console.log('ok', ok)
    setValid(ok)
  }

  if (!valid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Closed Beta</h1>
        <p className="w-96 mb-4">
          Hi! We're in closed beta right now. If you have a beta password, come
          on in! Otherwise, please contact me for the password.
        </p>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Beta Password
          </label>
          <input
            type="password"
            id="password"
            value={betaPassword}
            onChange={handleBetaPasswordChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleValidation}
          className="w-64 py-2 px-4 rounded-md bg-gradient-to-r from-pink-500 to-violet-500 text-white border-white"
        >
          Validate
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Signup</h1>
      <form onSubmit={handleSignup} className="w-64">
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Name
          </label>
          <input
            type="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md bg-gradient-to-r from-pink-500 to-violet-500 text-white border-white"
        >
          Sign up
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <p className="w-2/4 mt-4">
        Hey thanks for testing out Chatto-Botto! You'll soon discover that it's
        pretty rough around the edges, I'm working on it! Hopefully it's still
        good enough to mess around with.
      </p>
      <p className="w-2/4 mt-4">
        I would really appreciate any feedback - good, bad, ideas, whatever.
        I'll be actively working on it for the next little (minus my Japan trip)
        so hopefully changes will be coming in fast. Again, feedback please, and
        thanks for testing!
      </p>
    </div>
  )
}
