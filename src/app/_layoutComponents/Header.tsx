'use client'

import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

const UserIcon = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={size}
    height={size}
    fill="white"
  >
    <title>Abstract user icon</title>

    <defs>
      <clipPath id="circular-border">
        <circle cx="50" cy="50" r="41.67" />
      </clipPath>
    </defs>

    <circle cx="50" cy="50" r="46.67" fill="black" />
    <circle cx="50" cy="38.33" r="16.67" />
    <circle cx="50" cy="91.67" r="31.67" clip-path="url(#circular-border)" />
  </svg>
)

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const session = useSession()
  const pathname = usePathname()

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  if (session.status !== 'authenticated' || pathname.includes('/auth')) {
    return null
  }

  return (
    <header className="bg-white p-1">
      <nav className="flex justify-end items-center">
        {pathname !== '/chat/setup' && (
          <Link href="/chat/setup" className="hover:underline-magical mr-6">
            New Chat
          </Link>
        )}
        <div className="relative">
          <button onClick={toggleDropdown} className="focus:outline-none">
            <UserIcon />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' })
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
