// src/pages/TransferPage.tsx

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { walletApi } from '../services/api'
import DashboardLayout from '../components/layout/DashboardLayout'
import { LoadingSpinner } from '../components/ui'
import { BANKS, formatNaira } from '../utils/helpers'

type Tab = 'internal' | 'external'

interface RecipientInfo {
  accountNumber: string
  accountName: string
  bankName: string
}

const TransferPage: React.FC = () => {
  const [tab, setTab]               = useState<Tab>('internal')
  const [loading, setLoading]       = useState(false)
  const [looking, setLooking]       = useState(false)
  const [recipient, setRecipient]   = useState<RecipientInfo | null>(null)
  const [success, setSuccess]       = useState<{ ref: string; msg: string; balance: string } | null>(null)

  // Internal form
  const [intForm, setIntForm] = useState({ recipientAccountNumber: '', amount: '', description: '' })
  // External form
  const [extForm, setExtForm] = useState({ bankCode: '', accountNumber: '', accountName: '', amount: '', description: '' })

  const lookupAccount = async () => {
    if (intForm.recipientAccountNumber.length !== 10) return
    setLooking(true)
    try {
      const res = await walletApi.lookupAccount(intForm.recipientAccountNumber)
      setRecipient(res.data.account)
    } catch {
      setRecipient(null)
      toast.error('Account not found on this platform')
    } finally {
      setLooking(false)
    }
  }

  const handleInternal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipient) return toast.error('Please verify recipient account first')
    if (!intForm.amount || parseFloat(intForm.amount) < 1) return toast.error('Enter a valid amount')
    setLoading(true)
    try {
      const res = await walletApi.internalTransfer({
        recipientAccountNumber: intForm.recipientAccountNumber,
        amount: parseFloat(intForm.amount),
        description: intForm.description,
      })
      setSuccess({ ref: res.data.reference, msg: res.data.message, balance: res.data.new_balance })
      setIntForm({ recipientAccountNumber: '', amount: '', description: '' })
      setRecipient(null)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  const handleExternal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!extForm.bankCode) return toast.error('Select a bank')
    if (extForm.accountNumber.length !== 10) return toast.error('Enter valid 10-digit account number')
    if (!extForm.accountName) return toast.error('Enter account name')
    if (!extForm.amount || parseFloat(extForm.amount) < 10) return toast.error('Minimum transfer is ₦10')
    setLoading(true)
    try {
      const res = await walletApi.externalTransfer({
        bankCode: extForm.bankCode,
        accountNumber: extForm.accountNumber,
        accountName: extForm.accountName,
        amount: parseFloat(extForm.amount),
        description: extForm.description,
      })
      setSuccess({ ref: res.data.reference, msg: res.data.message, balance: res.data.new_balance })
      setExtForm({ bankCode: '', accountNumber: '', accountName: '', amount: '', description: '' })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <DashboardLayout title="Transfer">
      <div className="max-w-md mx-auto">
        <div className="card text-center py-10">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Transfer Successful!</h2>
          <p className="text-gray-500 text-sm mb-4">{success.msg}</p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm font-mono text-gray-600 mb-6 break-all">
            Ref: {success.ref}
          </div>
          <div className="text-sm text-gray-500 mb-6">
            New balance: <span className="font-bold text-gray-800">{formatNaira(success.balance)}</span>
          </div>
          <div className="flex gap-3 justify-center">
            <button className="btn-outline" onClick={() => setSuccess(null)}>New Transfer</button>
            <a href="/dashboard" className="btn-primary">Dashboard</a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Send Money" subtitle="Transfer to any account">
      <div className="max-w-lg">
        {/* Tabs */}
        <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden mb-6">
          {(['internal', 'external'] as Tab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setRecipient(null); setSuccess(null) }}
              className={`flex-1 py-3 text-sm font-semibold transition-all
                ${tab === t ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'internal' ? '🏦 Internal Transfer' : '🏛 Bank Transfer'}
            </button>
          ))}
        </div>

        {tab === 'internal' && (
          <div className="card">
            <p className="text-sm text-gray-500 mb-5">Transfer instantly to any FintechWallet account.</p>
            <form onSubmit={handleInternal} className="space-y-4">
              <div>
                <label className="input-label">Recipient Account Number</label>
                <div className="flex gap-2">
                  <input
                    className="input-field flex-1"
                    placeholder="10-digit account"
                    maxLength={10}
                    value={intForm.recipientAccountNumber}
                    onChange={e => {
                      setIntForm({ ...intForm, recipientAccountNumber: e.target.value })
                      if (e.target.value.length !== 10) setRecipient(null)
                    }}
                    onBlur={lookupAccount}
                  />
                  <button type="button" onClick={lookupAccount} disabled={looking}
                    className="btn-outline px-4 py-2 text-sm whitespace-nowrap">
                    {looking ? <LoadingSpinner size="sm" /> : 'Verify'}
                  </button>
                </div>
                {recipient && (
                  <div className="mt-2 flex items-center gap-3 bg-green-50 rounded-xl p-3 border border-green-200">
                    <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">
                      {recipient.accountName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-800">{recipient.accountName}</div>
                      <div className="text-xs text-gray-500">{recipient.bankName}</div>
                    </div>
                    <span className="ml-auto text-accent text-lg">✓</span>
                  </div>
                )}
              </div>
              <div>
                <label className="input-label">Amount (NGN)</label>
                <input type="number" className="input-field" placeholder="e.g. 5000" min="1"
                  value={intForm.amount} onChange={e => setIntForm({ ...intForm, amount: e.target.value })} />
              </div>
              <div>
                <label className="input-label">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <input className="input-field" placeholder="e.g. Rent payment"
                  value={intForm.description} onChange={e => setIntForm({ ...intForm, description: e.target.value })} />
              </div>
              <button type="submit" disabled={loading || !recipient} className="btn-primary w-full py-3">
                {loading ? <span className="spinner" /> : 'Send Money →'}
              </button>
            </form>
          </div>
        )}

        {tab === 'external' && (
          <div className="card">
            <p className="text-sm text-gray-500 mb-5">Transfer to any Nigerian bank account (simulated).</p>
            <form onSubmit={handleExternal} className="space-y-4">
              <div>
                <label className="input-label">Bank</label>
                <select className="input-field" value={extForm.bankCode}
                  onChange={e => setExtForm({ ...extForm, bankCode: e.target.value })}>
                  <option value="">Select bank...</option>
                  {BANKS.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Account Number</label>
                <input className="input-field" placeholder="10-digit NUBAN" maxLength={10}
                  value={extForm.accountNumber} onChange={e => setExtForm({ ...extForm, accountNumber: e.target.value })} />
              </div>
              <div>
                <label className="input-label">Account Name</label>
                <input className="input-field" placeholder="Recipient full name"
                  value={extForm.accountName} onChange={e => setExtForm({ ...extForm, accountName: e.target.value })} />
              </div>
              <div>
                <label className="input-label">Amount (NGN)</label>
                <input type="number" className="input-field" placeholder="Minimum ₦10" min="10"
                  value={extForm.amount} onChange={e => setExtForm({ ...extForm, amount: e.target.value })} />
              </div>
              <div>
                <label className="input-label">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <input className="input-field" placeholder="Transfer reason"
                  value={extForm.description} onChange={e => setExtForm({ ...extForm, description: e.target.value })} />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                ℹ️ External transfers are simulated. Connect Flutterwave/Paystack payout in production.
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? <span className="spinner" /> : 'Send Transfer →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TransferPage
