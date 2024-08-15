// import { auth } from '@/auth'
// import { SignIn } from './components/SignIn'

import Link from 'next/link'

export default async function Home() {
  // const session = await auth()

  // if (!session) {
  //   return <SignIn />
  // }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 pb-4 underline decoration-wavy">
          🤖 Chatto-Botto 🤖
        </h1>
        <p className="text-xl mt-4">
          Let's have a{' '}
          <Link className="underline-magical" href="/chat/setup">
            conversation!
          </Link>
        </p>
      </div>
    </main>
  )
}
