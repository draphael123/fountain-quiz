'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Nav() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'admin'

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              Fountain Quiz
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/quiz"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Quiz
              </Link>
              <Link
                href="/search"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Search
              </Link>
              {isAdmin && (
                <>
                  <Link
                    href="/admin/import"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Import
                  </Link>
                  <Link
                    href="/admin/review"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Review
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

