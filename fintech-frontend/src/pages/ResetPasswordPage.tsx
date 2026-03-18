// src/pages/ResetPasswordPage.tsx

import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'
import { OTPInput } from '../components/ui'

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const email = params.get('email') || ''
  const token = params.get('token') || ''

  const [otp, setOtp]           = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token && otp.length < 6) return toast.error('Enter the 6-digit reset code')
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    if (password !== confirm) return toast.error('Passwords do not match')

    setLoading(true)
    try {
      await authApi.resetPassword(
        token
          ? { token, newPassword: password }
          : { otp, email, newPassword: password }
      )
      toast.success('Password reset! You can now log in.')
      navigate('/login', { replace: true })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md fade-up">
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
            {!token && (
              <p className="text-gray-500 text-sm mt-1">
                Enter the code sent to <span className="font-semibold text-gray-700">{email}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!token && (
              <div>
                <label className="input-label text-center block mb-3">Reset Code</label>
                <OTPInput value={otp} onChange={setOtp} length={6} />
              </div>
            )}

            <div>
              <label className="input-label">New Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div>
              <label className="input-label">Confirm Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Repeat new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <span className="spinner" /> : 'Reset Password'}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-primary">
              ← Request a new code
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
