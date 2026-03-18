// src/pages/LandingPage.tsx

import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: '🏦', title: 'Virtual Bank Account', desc: 'Get a unique NUBAN-style account number instantly on signup.' },
  { icon: '⚡', title: 'Instant Transfers', desc: 'Send money to any Nigerian bank or FintechWallet user in seconds.' },
  { icon: '📱', title: 'Airtime & Data', desc: 'Buy airtime and data for MTN, Airtel, Glo, and 9Mobile instantly.' },
  { icon: '🔒', title: 'Bank-Grade Security', desc: 'JWT auth, bcrypt hashing, email OTP verification, and rate limiting.' },
  { icon: '📊', title: 'Full Transaction History', desc: 'Every naira logged with references, status, and timestamps.' },
  { icon: '💳', title: 'Multiple Payment Options', desc: 'Fund your wallet via Paystack or Flutterwave using card or bank.' },
]

const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 px-6 lg:px-16 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-primary">Fintech<span className="text-accent">Wallet</span></span>
        <div className="flex gap-3">
          {isAuthenticated ? (
            <Link to={user?.isVerified ? '/dashboard' : '/verify-email'}
              className="btn-primary px-5 py-2 text-sm">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-outline px-5 py-2 text-sm">Sign In</Link>
              <Link to="/register" className="btn-primary px-5 py-2 text-sm">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-16 py-20 lg:py-28 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-blue-50 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
            🇳🇬 Built for Nigeria
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Banking that works<br />
            <span className="text-primary">for you</span>, not against you
          </h1>
          <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Open a free wallet in minutes. Send money, buy airtime, receive payments — all in one place.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-primary px-8 py-3.5 text-base">
              ⚡ Open Free Wallet
            </Link>
            <Link to="/login" className="btn-outline px-8 py-3.5 text-base">
              Sign In
            </Link>
          </div>
        </div>

        {/* Mock wallet card */}
        <div className="max-w-xs mx-auto mt-14">
          <div className="bg-gradient-to-br from-primary-dark to-primary-light rounded-2xl p-6 text-white shadow-xl">
            <div className="text-white/60 text-xs mb-1">Available Balance</div>
            <div className="text-3xl font-bold mb-4">₦124,500.00</div>
            <div className="font-mono text-sm text-white/70">3010001234 • Fintech Bank</div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {['Send', 'Receive', 'Airtime', 'Data'].map(a => (
                <div key={a} className="bg-white/10 rounded-xl p-2 text-center text-xs font-medium">{a}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need</h2>
            <p className="text-gray-500">Powerful fintech features with a clean, fast interface.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="card hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 py-16 bg-primary">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-white/70 mb-8">Join thousands managing their money smarter.</p>
          <Link to="/register"
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-accent-dark transition-all">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-16 py-8 border-t border-gray-100 text-center text-sm text-gray-400">
        © 2025 FintechWallet. Built with React + TypeScript + Node.js + Prisma.
      </footer>
    </div>
  )
}

export default LandingPage
