'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <header className="bg-white p-1">
      <nav className="flex justify-end items-center">
        <Link href="/chat/setup" className="hover:underline mr-6">
          New Chat
        </Link>
        <div className="relative">
          <button onClick={toggleDropdown} className="focus:outline-none">
            user
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
                  signOut()
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
