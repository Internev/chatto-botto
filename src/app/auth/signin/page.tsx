'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const { data: session, status } = useSession()

  useEffect(() => {
    if (session) {
      console.log('Session established:', session, status)
      router.push('/chat/setup')
    }
  }, [session, router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      console.log('Attempting sign in...')
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      console.log('Sign in result:', result)

      if (result?.error) {
        console.error('Sign in error:', result.error)
        setError(result.error)
      } else if (result?.ok) {
        console.log('Sign in successful', result)
        // The useEffect hook will handle the navigation once the session is established
      }
    } catch (error) {
      console.error('Unexpected sign in error:', error)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Sign in</h1>
      <form onSubmit={handleSignIn} className="w-64">
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
          Sign in
        </button>
      </form>
      <Link href="/auth/signup">No account yet?</Link>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}
