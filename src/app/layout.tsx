import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { AppProvider } from '@/_context/AppContext'
import Header from './_layoutComponents/Header'

import { PHProvider } from './providers'
import dynamic from 'next/dynamic'
import { ClientRootLayout } from './_layoutComponents/SessionProvider'

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
})

// const inter = Inter({ subsets: ['latin'] }) ??

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
        <body className="flex flex-col min-h-screen">
          <AppProvider>
            <ClientRootLayout>
              <PostHogPageView />
              <Header />
              <main className="flex-grow">{children}</main>
            </ClientRootLayout>
          </AppProvider>
        </body>
      </PHProvider>
    </html>
  )
}
