import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { AppProvider } from '@/_context/AppContext'
import Header from './chat/_components/Header'

import { PHProvider } from './providers'
import dynamic from 'next/dynamic'

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chatto-Botto',
  description: 'Your friendly interlocutor',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <PHProvider>
        <body className={inter.className}>
          <AppProvider>
            <PostHogPageView />
            <Header />
            <main>{children}</main>
          </AppProvider>
        </body>
      </PHProvider>
    </html>
  )
}
