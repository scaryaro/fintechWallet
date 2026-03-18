// src/pages/AirtimePage.tsx

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { walletApi } from '../services/api'
import DashboardLayout from '../components/layout/DashboardLayout'
import { NETWORKS, formatNaira } from '../utils/helpers'

const AMOUNTS = [50, 100, 200, 500, 1000, 2000]

const AirtimePage: React.FC = () => {
  const [network, setNetwork] = useState('')
  const [phone, setPhone]     = useState('')
  const [amount, setAmount]   = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<{ ref: string; msg: string; balance: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!network) return toast.error('Select a network')
    if (!phone || phone.length < 10) return toast.error('Enter valid phone number')
    if (!amount || parseFloat(amount) < 50) return toast.error('Minimum airtime is ₦50')
    setLoading(true)
    try {
      const res = await walletApi.buyAirtime({ network, phone, amount: parseFloat(amount) })
      setResult({ ref: res.data.reference, msg: res.data.message, balance: String(res.data.new_balance) })
      toast.success('Airtime purchased!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Purchase failed')
    } finally {
      setLoading(false)
    }
  }

  if (result) return (
    <DashboardLayout title="Airtime">
      <div className="max-w-md mx-auto">
        <div className="card text-center py-10">
          <div className="text-5xl mb-4">📱</div>
          <h2 className="text-xl font-bold mb-2">Airtime Purchased!</h2>
          <p className="text-gray-500 text-sm mb-4">{result.msg}</p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm font-mono text-gray-600 mb-4 break-all">Ref: {result.ref}</div>
          <div className="text-sm text-gray-500 mb-6">Balance: <span className="font-bold text-gray-800">{formatNaira(result.balance)}</span></div>
          <div className="flex gap-3 justify-center">
            <button className="btn-outline" onClick={() => setResult(null)}>Buy Again</button>
            <a href="/dashboard" className="btn-primary">Dashboard</a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Buy Airtime" subtitle="Instant top-up for any network">
      <div className="max-w-md">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Network selection */}
            <div>
              <label className="input-label">Select Network</label>
              <div className="grid grid-cols-4 gap-3">
                {NETWORKS.map(n => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setNetwork(n.id)}
                    className={`py-3 rounded-xl border-2 text-sm font-bold transition-all
                      ${network === n.id ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ background: n.color }} />
                    {n.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone number */}
            <div>
              <label className="input-label">Phone Number</label>
              <input
                type="tel"
                className="input-field"
                placeholder="08012345678"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                required
              />
            </div>

            {/* Amount presets */}
            <div>
              <label className="input-label">Amount (NGN)</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {AMOUNTS.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(String(a))}
                    className={`py-2 rounded-xl border-2 text-sm font-semibold transition-all
                      ${amount === String(a) ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200 text-gray-600'}`}
                  >
                    ₦{a.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                className="input-field"
                placeholder="Or enter custom amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="50"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <span className="spinner" /> : `Buy Airtime${amount ? ` — ₦${parseFloat(amount || '0').toLocaleString()}` : ''}`}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AirtimePage
