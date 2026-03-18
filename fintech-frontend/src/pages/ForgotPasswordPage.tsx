// src/pages/ForgotPasswordPage.tsx

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.forgotPassword({ email })
      setSent(true)
      toast.success('Check your email for the reset code')
    } catch {
      // Always show success to prevent enumeration
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md fade-up">
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">🔑</div>
            <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
            <p className="text-gray-500 text-sm mt-1">
              {sent
                ? 'If that email exists, you\'ll receive a reset code shortly.'
                : 'Enter your email and we\'ll send you a reset code.'}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required autoFocus
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? <span className="spinner" /> : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <Link
              to={`/reset-password?email=${encodeURIComponent(email)}`}
              className="btn-primary w-full py-3"
            >
              Enter Reset Code →
            </Link>
          )}

          <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-gray-500 hover:text-primary">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
