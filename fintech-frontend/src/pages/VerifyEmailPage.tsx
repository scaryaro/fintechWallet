// src/pages/VerifyEmailPage.tsx

import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { OTPInput } from '../components/ui'

const VerifyEmailPage: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [otp, setOtp]         = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const email = user?.email || params.get('email') || ''
  const token = params.get('token')

  // Auto-verify if token in URL
  useEffect(() => {
    if (token) handleVerify(undefined, token)
  }, [token])

  const handleVerify = async (e?: React.FormEvent, linkToken?: string) => {
    e?.preventDefault()
    if (!linkToken && otp.length < 6) return toast.error('Enter the 6-digit code')
    setLoading(true)
    try {
      await authApi.verifyEmail(linkToken ? { token: linkToken } : { otp, email })
      toast.success('Email verified! Welcome aboard 🎉')
      await refreshUser()
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    setResending(true)
    try {
      await authApi.resendOTP({ email, type: 'EMAIL_VERIFICATION' })
      toast.success('New verification code sent to your email')
      setCountdown(60)
      const t = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(t); return 0 } return c - 1 }), 1000)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md fade-up">
        <div className="card text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            📧
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
          <p className="text-gray-500 text-sm mb-6">
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-gray-800">{email}</span>
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <OTPInput value={otp} onChange={setOtp} length={6} />

            <button type="submit" disabled={loading || otp.length < 6} className="btn-primary w-full py-3">
              {loading ? <span className="spinner" /> : 'Verify Email'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resending || countdown > 0}
              className="text-primary font-semibold text-sm hover:underline disabled:opacity-40"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : resending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
