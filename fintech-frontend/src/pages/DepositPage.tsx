// src/pages/DepositPage.tsx

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { walletApi } from '../services/api'
import DashboardLayout from '../components/layout/DashboardLayout'
import {  LoadingSpinner } from '../components/ui'
import { formatNaira as fmt } from '../utils/helpers'

const PRESETS = [1000, 5000, 10000, 20000, 50000]

type Provider = 'paystack' | 'flutterwave'
type CallbackState = 'success' | 'pending' | 'failed' | null

const DepositPage: React.FC = () => {
  const [params] = useSearchParams()
  const [amount, setAmount]         = useState('')
  const [provider, setProvider]     = useState<Provider>('paystack')
  const [loading, setLoading]       = useState(false)
  const [verifying, setVerifying]   = useState(false)
  const [balance, setBalance]       = useState<string | null>(null)
  const [accountInfo, setAccountInfo] = useState<{ accountNumber: string; bankName: string; accountName: string } | null>(null)
  const [callbackState, setCallbackState] = useState<CallbackState>(null)
  const [callbackMsg, setCallbackMsg]     = useState('')
  const [callbackBalance, setCallbackBalance] = useState('')

  // Load balance and account info
  useEffect(() => {
    walletApi.getDashboard().then(res => {
      setBalance(res.data.user.wallet.balance)
      setAccountInfo(res.data.user.account)
    }).catch(() => {})
  }, [])

  // Handle callback from payment provider
  useEffect(() => {
    const status    = params.get('status')
    const reference = params.get('reference') || params.get('trxref')
    const txId      = params.get('transaction_id')

    if (!status && !reference && !txId) return

    // Clean URL
    window.history.replaceState({}, '', '/deposit')

    if (status === 'cancelled' || status === 'failed') {
      setCallbackState('failed')
      setCallbackMsg('Your payment was cancelled. No funds were deducted.')
      return
    }

    if (reference) {
      setVerifying(true)
      walletApi.verifyPayment(reference, txId || undefined)
        .then(res => {
          const data = res.data
          if (data.success) {
            setCallbackState('success')
            setCallbackMsg(`₦${parseFloat(data.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })} has been added to your wallet.`)
            setCallbackBalance(String(data.new_balance))
            setBalance(String(data.new_balance))
          } else {
            setCallbackState('pending')
            setCallbackMsg(data.message || 'Payment is being processed. Your wallet will be credited shortly.')
          }
        })
        .catch(() => {
          setCallbackState('pending')
          setCallbackMsg('Payment received. Your wallet will be credited automatically within a few minutes.')
        })
        .finally(() => setVerifying(false))
    } else if (status === 'success' || status === 'successful') {
      setCallbackState('pending')
      setCallbackMsg('Payment received. Wallet will be credited automatically.')
    }
  }, [])

  const handlePay = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt < 100) return toast.error('Minimum deposit is ₦100')
    setLoading(true)
    try {
      const endpoint = provider === 'paystack'
        ? walletApi.depositPaystack(amt)
        : walletApi.depositFlutterwave(amt)
      const res = await endpoint
      const url = res.data.authorization_url || res.data.payment_link
      if (url) {
        window.location.href = url
      } else {
        toast.error('No payment URL returned — check your API keys in .env')
        setLoading(false)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not initialize payment')
      setLoading(false)
    }
  }

  // Callback result overlay
  if (verifying) return (
    <DashboardLayout title="Deposit">
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500">Verifying your payment...</p>
      </div>
    </DashboardLayout>
  )

  if (callbackState) return (
    <DashboardLayout title="Deposit">
      <div className="max-w-md mx-auto">
        <div className="card text-center py-10">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl
            ${callbackState === 'success' ? 'bg-green-50' : callbackState === 'pending' ? 'bg-amber-50' : 'bg-red-50'}`}>
            {callbackState === 'success' ? '✅' : callbackState === 'pending' ? '⏳' : '❌'}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {callbackState === 'success' ? 'Deposit Successful!' : callbackState === 'pending' ? 'Payment Processing' : 'Payment Cancelled'}
          </h2>
          <p className="text-gray-500 text-sm mb-4">{callbackMsg}</p>
          {callbackBalance && (
            <div className="bg-gray-50 rounded-xl p-3 text-sm mb-5">
              New Balance: <span className="font-bold text-gray-900">{fmt(callbackBalance)}</span>
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <a href="/dashboard" className="btn-primary">Go to Dashboard</a>
            <button className="btn-outline" onClick={() => setCallbackState(null)}>Make Another</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Fund Wallet" subtitle="Add money to your wallet">
      <div className="max-w-lg space-y-5">

        {/* Current balance */}
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-primary text-xl">💰</div>
          <div>
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Current Balance</div>
            <div className="text-xl font-bold text-gray-900">{balance !== null ? fmt(balance) : 'Loading...'}</div>
          </div>
        </div>

        {/* Virtual account */}
        {accountInfo && (
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-accent text-lg">🏦</span>
              <h3 className="font-semibold text-gray-800">Bank Transfer</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Transfer to this account — your wallet is credited automatically.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Account Number</div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-gray-900">{accountInfo.accountNumber}</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(accountInfo.accountNumber); toast.success('Copied!') }}
                    className="text-xs bg-primary text-white px-3 py-1 rounded-lg"
                  >Copy</button>
                </div>
              </div>
              <div className="flex gap-8">
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Bank</div>
                  <div className="font-semibold text-sm text-gray-800">{accountInfo.bankName}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Account Name</div>
                  <div className="font-semibold text-sm text-gray-800">{accountInfo.accountName}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pay online */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-1">Pay Online</h3>
          <p className="text-sm text-gray-500 mb-5">Use card or bank transfer via payment gateway.</p>

          {/* Amount */}
          <div className="mb-4">
            <label className="input-label">Amount (NGN)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESETS.map(p => (
                <button key={p} type="button"
                  onClick={() => setAmount(String(p))}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all
                    ${amount === String(p) ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200 text-gray-600'}`}>
                  ₦{p.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="number"
              className="input-field"
              placeholder="Enter amount"
              min="100"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">Minimum deposit: ₦100</p>
          </div>

          {/* Provider */}
          <div className="mb-5">
            <label className="input-label">Payment Provider</label>
            <div className="flex flex-col gap-3">
              {[
                { id: 'paystack' as Provider, label: 'Paystack', sub: 'Card, Bank, USSD', color: '#00C3F7' },
                { id: 'flutterwave' as Provider, label: 'Flutterwave', sub: 'Card, Bank, Mobile Money', color: '#F5A623' },
              ].map(p => (
                <button key={p.id} type="button" onClick={() => setProvider(p.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                    ${provider === p.id ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: p.color }}>
                    {p.id === 'paystack' ? 'PS' : 'FW'}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-sm text-gray-800">{p.label}</div>
                    <div className="text-xs text-gray-400">{p.sub}</div>
                  </div>
                  {provider === p.id && <span className="text-primary text-xl">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handlePay} disabled={loading} className="btn-primary w-full py-3">
            {loading ? <span className="spinner" /> : '🔒 Proceed to Payment'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DepositPage
