// src/pages/DashboardPage.tsx

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { walletApi } from '../services/api'
import DashboardLayout from '../components/layout/DashboardLayout'
import { BalanceCard, QuickAction, TransactionItem, StatCard, LoadingSpinner, EmptyState } from '../components/ui'
import { formatNaira } from '../utils/helpers'
import type { DashboardData, Transaction } from '../types'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [data, setData]       = useState<DashboardData['user'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    walletApi.getDashboard()
      .then(res => setData(res.data.user))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <DashboardLayout title="Dashboard">
      <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
    </DashboardLayout>
  )

  const txns  = data?.transactions || []
  const bal   = data?.wallet?.balance || 0
  const acc   = data?.account
  const credits  = txns.filter(t => ['DEPOSIT','TRANSFER_IN'].includes(t.type) && t.status === 'SUCCESS')
    .reduce((s, t) => s + parseFloat(String(t.amount)), 0)
  const debits   = txns.filter(t => !['DEPOSIT','TRANSFER_IN'].includes(t.type) && t.status === 'SUCCESS')
    .reduce((s, t) => s + parseFloat(String(t.amount)), 0)

  return (
    <DashboardLayout title="Dashboard" subtitle="Here's your account overview">
      <div className="space-y-6 max-w-5xl">

        {/* Balance card */}
        {acc && (
          <BalanceCard
            balance={bal}
            accountNumber={acc.accountNumber}
            accountName={acc.accountName}
            bankName={acc.bankName}
          />
        )}

        {/* Quick actions */}
        <div className="flex gap-3 flex-wrap">
          <QuickAction icon="+" label="Deposit"      onClick={() => navigate('/deposit')} />
          <QuickAction icon="→" label="Transfer"     onClick={() => navigate('/transfer')} />
          <QuickAction icon="📱" label="Airtime"     onClick={() => navigate('/airtime')} />
          <QuickAction icon="📶" label="Data"        onClick={() => navigate('/data')} />
          <QuickAction icon="≡" label="History"      onClick={() => navigate('/transactions')} />
          <QuickAction icon="👤" label="Profile"     onClick={() => navigate('/profile')} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Total Received"   value={formatNaira(credits)} icon="↓" color="bg-green-50 text-accent" />
          <StatCard label="Total Sent"       value={formatNaira(debits)}  icon="↑" color="bg-red-50 text-danger" />
          <StatCard label="Transactions"     value={String(txns.length)}  icon="≡" color="bg-blue-50 text-primary" />
        </div>

        {/* Recent transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
            <button onClick={() => navigate('/transactions')}
              className="text-sm text-primary font-medium hover:underline">
              View all →
            </button>
          </div>
          {txns.length === 0
            ? <EmptyState icon="📭" title="No transactions yet" subtitle="Make your first deposit to get started" />
            : txns.map(t => <TransactionItem key={t.id} txn={t} />)
          }
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage;
