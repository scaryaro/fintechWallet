// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import type { User, AuthState } from '../types'
import { authApi } from '../services/api'

// ── State & Actions ───────────────────────────────────────────
type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'LOGOUT' }

const initialState: AuthState = {
  user:            null,
  token:           null,
  isLoading:       true,
  isAuthenticated: false,
}

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, isLoading: false }
    case 'UPDATE_USER':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...initialState, isLoading: false }
    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────
interface AuthContextType extends AuthState {
  login:       (token: string, user: User) => void
  logout:      () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

// ── Provider ──────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // On mount — restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('fw_token')
    const stored = localStorage.getItem('fw_user')
    if (token && stored) {
      try {
        const user = JSON.parse(stored) as User
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } })
        // Silently refresh user data from server
        authApi.getMe()
          .then((res) => dispatch({ type: 'UPDATE_USER', payload: res.data.user }))
          .catch(() => {
            localStorage.removeItem('fw_token')
            localStorage.removeItem('fw_user')
            dispatch({ type: 'LOGOUT' })
          })
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem('fw_token', token)
    localStorage.setItem('fw_user', JSON.stringify(user))
    dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('fw_token')
    localStorage.removeItem('fw_user')
    dispatch({ type: 'LOGOUT' })
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe()
      const user = res.data.user as User
      localStorage.setItem('fw_user', JSON.stringify(user))
      dispatch({ type: 'UPDATE_USER', payload: user })
    } catch {}
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
