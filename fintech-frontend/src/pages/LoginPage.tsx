// src/pages/LoginPage.tsx

import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import type { User } from '../types'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = (location.state as any)?.from?.pathname || '/dashboard'

  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res  = await authApi.login(form)
      const data = res.data
      login(data.token, data.user as User)
      toast.success('Welcome back!')
      navigate(data.user.isVerified ? from : '/verify-email', { replace: true })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-dark to-primary-light flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <div className="text-4xl font-bold mb-3">Fintech<span className="text-accent">Wallet</span></div>
          <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
          <p className="text-white/70 leading-relaxed">
            Sign in to manage your wallet, transfer funds, and track every transaction.
          </p>
          <div className="mt-10 bg-white/10 rounded-2xl p-6 text-left">
            <div className="text-white/60 text-xs mb-2 uppercase tracking-wider">Your balance</div>
            <div className="text-3xl font-bold">₦124,500.00</div>
            <div className="text-white/60 text-sm mt-1 font-mono">3010001234 • Fintech Bank</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md fade-up">
          <div className="mb-8 text-center lg:text-left">
            <div className="text-2xl font-bold text-primary lg:hidden mb-2">
              Fintech<span className="text-accent">Wallet</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">Create one free</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="input-label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
