// src/pages/DataPage.tsx

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { walletApi } from '../services/api'
import DashboardLayout from '../components/layout/DashboardLayout'
import { NETWORKS, DATA_PLANS, formatNaira } from '../utils/helpers'
import type { DataPlan } from '../types'

const DataPage: React.FC = () => {
  const [network, setNetwork]   = useState('')
  const [phone, setPhone]       = useState('')
  const [plan, setPlan]         = useState<DataPlan | null>(null)
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<{ ref: string; msg: string; balance: string } | null>(null)

  const plans = network ? DATA_PLANS[network] || [] : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!network) return toast.error('Select a network')
    if (!phone || phone.length < 10) return toast.error('Enter valid phone number')
    if (!plan) return toast.error('Select a data plan')
    setLoading(true)
    try {
      const res = await walletApi.buyData({
        network, phone,
        plan: plan.name,
        amount: plan.amount,
      })
      setResult({ ref: res.data.reference, msg: res.data.message, balance: String(res.data.new_balance) })
      toast.success('Data purchased!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Purchase failed')
    } finally {
      setLoading(false)
    }
  }

  if (result) return (
    <DashboardLayout title="Data">
      <div className="max-w-md mx-auto">
        <div className="card text-center py-10">
          <div className="text-5xl mb-4">📶</div>
          <h2 className="text-xl font-bold mb-2">Data Purchased!</h2>
          <p className="text-gray-500 text-sm mb-4">{result.msg}</p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm font-mono text-gray-600 mb-4 break-all">Ref: {result.ref}</div>
          <div className="text-sm text-gray-500 mb-6">Balance: <span className="font-bold text-gray-800">{formatNaira(result.balance)}</span></div>
          <div className="flex gap-3 justify-center">
            <button className="btn-outline" onClick={() => { setResult(null); setPlan(null) }}>Buy Again</button>
            <a href="/dashboard" className="btn-primary">Dashboard</a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Buy Data" subtitle="Fast data plans for any network">
      <div className="max-w-md">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Network */}
            <div>
              <label className="input-label">Select Network</label>
              <div className="grid grid-cols-4 gap-3">
                {NETWORKS.map(n => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => { setNetwork(n.id); setPlan(null) }}
                    className={`py-3 rounded-xl border-2 text-sm font-bold transition-all
                      ${network === n.id ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200 text-gray-600'}`}
                  >
                    <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ background: n.color }} />
                    {n.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone */}
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

            {/* Plans */}
            {network && (
              <div>
                <label className="input-label">Select Plan</label>
                <div className="space-y-2">
                  {plans.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlan(p)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm
                        ${plan?.id === p.id ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="font-semibold text-gray-800">{p.name}</div>
                      <div className="flex items-center gap-4 text-gray-500">
                        <span>{p.validity}</span>
                        <span className={`font-bold ${plan?.id === p.id ? 'text-primary' : 'text-gray-700'}`}>
                          ₦{p.amount.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {plan && (
              <div className="bg-blue-50 rounded-xl p-4 text-sm">
                <div className="font-semibold text-primary mb-1">Order Summary</div>
                <div className="flex justify-between text-gray-600">
                  <span>{network} {plan.name} ({plan.validity})</span>
                  <span className="font-bold">₦{plan.amount.toLocaleString()}</span>
                </div>
                <div className="text-gray-500 mt-1">To: {phone || '—'}</div>
              </div>
            )}

            <button type="submit" disabled={loading || !plan} className="btn-primary w-full py-3">
              {loading ? <span className="spinner" /> : `Buy Data${plan ? ` — ₦${plan.amount.toLocaleString()}` : ''}`}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DataPage
