import React, { useEffect, useState } from 'react'
import { authService, usingSupabase } from '../services/database'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getSession()
      .then(setUser)
      .finally(() => setLoading(false))
  }, [])

  const signUp = async (payload) => {
    const newUser = await authService.signUp(payload)
    if (!newUser.requiresEmailConfirmation) setUser(newUser)
    return newUser
  }

  const signIn = async (email, password) => {
    const loggedIn = await authService.signIn(email, password)
    setUser(loggedIn)
    return loggedIn
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, usingSupabase }}>
      {children}
    </AuthContext.Provider>
  )
}
