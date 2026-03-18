// src/pages/TransactionsPage.tsx

import React, { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { walletApi } from '../services/api'
import DashboardLayout from '../components/layout/DashboardLayout'
import { TransactionItem, LoadingSpinner, EmptyState } from '../components/ui'
import { formatNaira } from '../utils/helpers'
import type { Transaction, TransactionType, TransactionStatus } from '../types'

const TYPES: { label: string; value: string }[] = [
  { label: 'All',      value: '' },
  { label: 'Deposits', value: 'DEPOSIT' },
  { label: 'Received', value: 'TRANSFER_IN' },
  { label: 'Sent',     value: 'TRANSFER_OUT' },
  { label: 'Airtime',  value: 'AIRTIME' },
  { label: 'Data',     value: 'DATA' },
]

const TransactionsPage: React.FC = () => {
  const [txns, setTxns]         = useState<Transaction[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [type, setType]         = useState('')
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(0)
  const [pages, setPages]       = useState(1)

  const totalIn  = txns.filter(t => ['DEPOSIT','TRANSFER_IN'].includes(t.type) && t.status === 'SUCCESS')
    .reduce((s, t) => s + parseFloat(String(t.amount)), 0)
  const totalOut = txns.filter(t => !['DEPOSIT','TRANSFER_IN'].includes(t.type) && t.status === 'SUCCESS')
    .reduce((s, t) => s + parseFloat(String(t.amount)), 0)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await walletApi.getTransactions({ page, limit: 15, type: type || undefined, search: search || undefined })
      setTxns(res.data.transactions)
      setTotal(res.data.pagination.total)
      setPages(res.data.pagination.pages)
    } catch {
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }, [page, type, search])

  useEffect(() => { load() }, [load])

  return (
    <DashboardLayout title="Transactions" subtitle="Your complete transaction history">
      <div className="max-w-3xl space-y-5">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card py-4">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Received</div>
            <div className="text-lg font-bold text-accent">{formatNaira(totalIn)}</div>
          </div>
          <div className="card py-4">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Sent</div>
            <div className="text-lg font-bold text-danger">{formatNaira(totalOut)}</div>
          </div>
          <div className="card py-4">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Transactions</div>
            <div className="text-lg font-bold text-gray-800">{total}</div>
          </div>
        </div>

        <div className="card">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="Search by reference or description..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
            <div className="flex gap-2 flex-wrap">
              {TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => { setType(t.value); setPage(1) }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                    ${type === t.value ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          ) : txns.length === 0 ? (
            <EmptyState icon="📭" title="No transactions found" subtitle="Try adjusting your filters" />
          ) : (
            <div>
              {txns.map(t => <TransactionItem key={t.id} txn={t} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-gray-100">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:border-primary"
              >← Prev</button>
              <span className="text-sm text-gray-500 px-3">{page} / {pages}</span>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:border-primary"
              >Next →</button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TransactionsPage
