// src/components/ui/index.tsx — reusable components

import React from 'react'
import { formatNaira, txnMeta, statusBadge, formatDate } from '../../utils/helpers'
import type { Transaction } from '../../types'

// ── LoadingSpinner ────────────────────────────────────────────
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div className={`${s} border-2 border-primary/20 border-t-primary rounded-full animate-spin`} />
  )
}

// ── BalanceCard ───────────────────────────────────────────────
interface BalanceCardProps {
  balance: string | number
  accountNumber: string
  accountName: string
  bankName: string
  currency?: string
}
export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance, accountNumber, accountName, bankName, currency = 'NGN'
}) => {
  const [visible, setVisible] = React.useState(true)
  return (
    <div className="relative bg-gradient-to-br from-primary-dark to-primary-light rounded-2xl p-6 text-white overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-8" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Available Balance</span>
          <button onClick={() => setVisible(v => !v)} className="text-white/60 hover:text-white transition-colors text-lg">
            {visible ? '👁' : '🙈'}
          </button>
        </div>
        <div className="text-3xl font-bold tracking-tight my-2">
          {visible ? formatNaira(balance) : '₦ ••••••'}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <span className="font-mono text-sm text-white/80">{accountNumber}</span>
          <span className="text-white/40">•</span>
          <span className="text-sm text-white/70">{bankName}</span>
        </div>
        <div className="text-xs text-white/60 mt-1">{accountName}</div>
      </div>
    </div>
  )
}

// ── QuickAction ───────────────────────────────────────────────
interface QuickActionProps {
  icon: string
  label: string
  onClick?: () => void
  href?: string
}
export const QuickAction: React.FC<QuickActionProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100
               hover:border-primary hover:bg-blue-50 transition-all group min-w-[90px]"
  >
    <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-xs font-semibold text-gray-600 group-hover:text-primary">{label}</span>
  </button>
)

// ── TransactionItem ───────────────────────────────────────────
export const TransactionItem: React.FC<{ txn: Transaction }> = ({ txn }) => {
  const meta = txnMeta(txn.type)
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm flex-shrink-0
        ${meta.isCredit ? 'bg-green-50 text-accent' : 'bg-red-50 text-danger'}`}>
        {meta.isCredit ? '↓' : '↑'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800 truncate">
          {txn.description || meta.label}
        </div>
        <div className="text-xs text-gray-400">{formatDate(txn.createdAt)}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className={`text-sm font-bold font-mono ${meta.color}`}>
          {meta.isCredit ? '+' : '-'}{formatNaira(txn.amount)}
        </div>
        <span className={statusBadge(txn.status)}>{txn.status}</span>
      </div>
    </div>
  )
}

// ── StatCard ──────────────────────────────────────────────────
export const StatCard: React.FC<{
  label: string; value: string; icon: string; color?: string
}> = ({ label, value, icon, color = 'bg-blue-50 text-primary' }) => (
  <div className="card">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${color}`}>
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
)

// ── OTPInput ──────────────────────────────────────────────────
export const OTPInput: React.FC<{
  value: string
  onChange: (val: string) => void
  length?: number
}> = ({ value, onChange, length = 6 }) => {
  const digits = value.split('').slice(0, length)
  while (digits.length < length) digits.push('')
  const refs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = d
    onChange(next.join(''))
    if (d && i < length - 1) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted.padEnd(length, '').slice(0, length))
    const lastFilled = Math.min(pasted.length, length - 1)
    refs.current[lastFilled]?.focus()
  }

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className={`w-12 h-14 text-center text-xl font-bold font-mono border-2 rounded-xl outline-none transition-all
            ${d ? 'border-primary bg-blue-50' : 'border-gray-200'} focus:border-primary`}
        />
      ))}
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────
export const EmptyState: React.FC<{ icon: string; title: string; subtitle?: string }> = ({
  icon, title, subtitle
}) => (
  <div className="text-center py-12">
    <div className="text-5xl mb-3">{icon}</div>
    <div className="font-semibold text-gray-700">{title}</div>
    {subtitle && <div className="text-sm text-gray-400 mt-1">{subtitle}</div>}
  </div>
)
