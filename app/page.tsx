'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error.message)
    } else {
      router.push('/auth/login')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="w-full max-w-4xl p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-md rounded-lg mb-8">
        <h1 className="text-3xl font-bold">Polling App</h1>
        <nav className="space-x-4">
          {!user ? (
            <>
              <Link href="/auth/login" passHref>
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register" passHref>
                <Button>Register</Button>
              </Link>
            </>
          ) : (
            <>
              <span className="mr-4">Hello, {user.email}</span>
              <Link href="/create-poll" passHref>
                <Button variant="outline">Create Poll</Button>
              </Link>
              <Button onClick={handleLogout} variant="destructive">Logout</Button>
            </>
          )}
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow text-center">
        <h2 className="text-4xl font-extrabold mb-4">Welcome to the Polling App</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">Create and participate in engaging polls!</p>
        {!user && (
          <p className="text-md text-gray-600 dark:text-gray-400">
            Please <Link href="/auth/login" className="text-blue-600 hover:underline">login</Link> or <Link href="/auth/register" className="text-blue-600 hover:underline">register</Link> to get started.
          </p>
        )}
      </main>
    </div>
  )
}