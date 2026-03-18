// // src/pages/RegisterPage.tsx

// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import toast from 'react-hot-toast'
// import { authApi } from '../services/api'
// import { useAuth } from '../context/AuthContext'
// import type { User } from '../types'

// const RegisterPage: React.FC = () => {
//   const { login } = useAuth()
//   const navigate  = useNavigate()

//   const [form, setForm] = useState({
//     fullname: '', email: '', phone: '', password: '', bvn: '',
//   })
//   const [loading, setLoading] = useState(false)
//   const [showPw, setShowPw]   = useState(false)

//   const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
//     setForm({ ...form, [k]: e.target.value })

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
//     setLoading(true)
//     try {
//       const res  = await authApi.register(form)
//       const data = res.data
//       login(data.token, data.user as User)
//       toast.success('Account created! Please verify your email.')
//       navigate('/verify-email', { replace: true })
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || 'Registration failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex">
//       {/* Left panel */}
//       <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary-dark to-primary-light flex-col items-center justify-center p-12 text-white">
//         <div className="max-w-sm">
//           <div className="text-3xl font-bold mb-4">Fintech<span className="text-accent">Wallet</span></div>
//           <h2 className="text-2xl font-bold mb-3">Bank smarter, not harder</h2>
//           <p className="text-white/70 text-sm leading-relaxed mb-8">
//             Join thousands managing their money with FintechWallet.
//           </p>
//           {['Free virtual bank account', 'Instant transfers to any bank', 'Buy airtime & data instantly',
//             'Paystack & Flutterwave deposits', 'Secure with JWT & bcrypt'].map(f => (
//             <div key={f} className="flex items-center gap-3 mb-3">
//               <span className="text-accent text-lg">✓</span>
//               <span className="text-white/80 text-sm">{f}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right panel */}
//       <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
//         <div className="w-full max-w-md fade-up py-8">
//           <div className="mb-6 text-center lg:text-left">
//             <div className="text-2xl font-bold text-primary lg:hidden mb-2">
//               Fintech<span className="text-accent">Wallet</span>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
//             <p className="text-gray-500 mt-1 text-sm">
//               Already have an account?{' '}
//               <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="input-label">Full Name</label>
//               <input className="input-field" placeholder="Ada Okafor" value={form.fullname} onChange={set('fullname')} required />
//             </div>
//             <div>
//               <label className="input-label">Email Address</label>
//               <input type="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
//             </div>
//             <div>
//               <label className="input-label">Phone Number</label>
//               <input type="tel" className="input-field" placeholder="08012345678" value={form.phone} onChange={set('phone')} required />
//             </div>
//             <div>
//               <label className="input-label">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPw ? 'text' : 'password'}
//                   className="input-field pr-11"
//                   placeholder="Min. 6 characters"
//                   value={form.password}
//                   onChange={set('password')}
//                   required
//                 />
//                 <button type="button" onClick={() => setShowPw(v => !v)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//                   {showPw ? '🙈' : '👁'}
//                 </button>
//               </div>
//             </div>
//             <div>
//               <label className="input-label">
//                 BVN <span className="text-gray-400 font-normal">(optional — simulation)</span>
//               </label>
//               <input className="input-field" placeholder="11-digit BVN" maxLength={11} value={form.bvn} onChange={set('bvn')} />
//             </div>

//             <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
//               {loading ? <span className="spinner" /> : 'Create Account →'}
//             </button>

//             <p className="text-center text-xs text-gray-400">
//               By registering you agree to our Terms of Service
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default RegisterPage



// src/pages/RegisterPage.tsx

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import type { User } from '../types'

const RegisterPage: React.FC = () => {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm] = useState({
    fullname: '', email: '', phone: '', password: '', bvn: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res  = await authApi.register(form)
      const data = res.data
      login(data.token, data.user as User)
      toast.success('Account created! Welcome to FintechWallet 🎉')
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary-dark to-primary-light flex-col items-center justify-center p-12 text-white">
        <div className="max-w-sm">
          <div className="text-3xl font-bold mb-4">Fintech<span className="text-accent">Wallet</span></div>
          <h2 className="text-2xl font-bold mb-3">Bank smarter, not harder</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            Join thousands managing their money with FintechWallet.
          </p>
          {['Free virtual bank account', 'Instant transfers to any bank', 'Buy airtime & data instantly',
            'Paystack & Flutterwave deposits', 'Secure with JWT & bcrypt'].map(f => (
            <div key={f} className="flex items-center gap-3 mb-3">
              <span className="text-accent text-lg">✓</span>
              <span className="text-white/80 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md fade-up py-8">
          <div className="mb-6 text-center lg:text-left">
            <div className="text-2xl font-bold text-primary lg:hidden mb-2">
              Fintech<span className="text-accent">Wallet</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Full Name</label>
              <input className="input-field" placeholder="Ada Okafor" value={form.fullname} onChange={set('fullname')} required />
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <input type="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="input-label">Phone Number</label>
              <input type="tel" className="input-field" placeholder="08012345678" value={form.phone} onChange={set('phone')} required />
            </div>
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={set('password')}
                  required
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <div>
              <label className="input-label">
                BVN <span className="text-gray-400 font-normal">(optional — simulation)</span>
              </label>
              <input className="input-field" placeholder="11-digit BVN" maxLength={11} value={form.bvn} onChange={set('bvn')} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? <span className="spinner" /> : 'Create Account →'}
            </button>

            <p className="text-center text-xs text-gray-400">
              By registering you agree to our Terms of Service
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage