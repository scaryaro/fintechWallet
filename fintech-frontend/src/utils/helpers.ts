// src/utils/helpers.ts

import type { TransactionType, TransactionStatus } from '../types'

export const formatNaira = (amount: string | number): string => {
  return '₦' + parseFloat(String(amount || 0)).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-NG', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

export const txnMeta = (type: TransactionType) => {
  const map = {
    DEPOSIT:      { label: 'Deposit',    isCredit: true,  color: 'text-accent' },
    TRANSFER_IN:  { label: 'Received',   isCredit: true,  color: 'text-accent' },
    TRANSFER_OUT: { label: 'Sent',       isCredit: false, color: 'text-danger' },
    WITHDRAWAL:   { label: 'Withdrawal', isCredit: false, color: 'text-danger' },
    AIRTIME:      { label: 'Airtime',    isCredit: false, color: 'text-orange-500' },
    DATA:         { label: 'Data',       isCredit: false, color: 'text-purple-500' },
  }
  return map[type] ?? { label: type, isCredit: false, color: 'text-gray-500' }
}

export const statusBadge = (status: TransactionStatus) => {
  const map = {
    SUCCESS: 'badge-success',
    FAILED:  'badge-danger',
    PENDING: 'badge-warning',
  }
  return map[status] ?? 'badge-info'
}

export const NETWORKS = [
  { id: 'MTN',   name: 'MTN',       color: '#FFCC00' },
  { id: 'AIRTEL',name: 'Airtel',    color: '#FF0000' },
  { id: 'GLO',   name: 'Glo',       color: '#00A651' },
  { id: '9MOBILE',name: '9Mobile',  color: '#006E34' },
]

export const DATA_PLANS: Record<string, Array<{ id: string; name: string; amount: number; validity: string }>> = {
  MTN: [
    { id: 'mtn-100mb', name: '100MB', amount: 100, validity: '1 day' },
    { id: 'mtn-1gb',   name: '1GB',   amount: 300, validity: '7 days' },
    { id: 'mtn-2gb',   name: '2GB',   amount: 500, validity: '30 days' },
    { id: 'mtn-5gb',   name: '5GB',   amount: 1000, validity: '30 days' },
    { id: 'mtn-10gb',  name: '10GB',  amount: 2000, validity: '30 days' },
  ],
  AIRTEL: [
    { id: 'airt-200mb', name: '200MB', amount: 100, validity: '1 day' },
    { id: 'airt-1gb',   name: '1GB',   amount: 350, validity: '7 days' },
    { id: 'airt-3gb',   name: '3GB',   amount: 750, validity: '30 days' },
    { id: 'airt-10gb',  name: '10GB',  amount: 2000, validity: '30 days' },
  ],
  GLO: [
    { id: 'glo-200mb', name: '200MB', amount: 100, validity: '1 day' },
    { id: 'glo-1gb',   name: '1GB',   amount: 300, validity: '7 days' },
    { id: 'glo-5gb',   name: '5GB',   amount: 1000, validity: '30 days' },
    { id: 'glo-10gb',  name: '10GB',  amount: 2000, validity: '30 days' },
  ],
  '9MOBILE': [
    { id: '9m-500mb', name: '500MB', amount: 200, validity: '7 days' },
    { id: '9m-1gb',   name: '1GB',   amount: 500, validity: '30 days' },
    { id: '9m-5gb',   name: '5GB',   amount: 2000, validity: '30 days' },
  ],
}

export const BANKS = [
  { code: '044', name: 'Access Bank' },
  { code: '058', name: 'Guaranty Trust Bank (GTB)' },
  { code: '033', name: 'United Bank for Africa (UBA)' },
  { code: '057', name: 'Zenith Bank' },
  { code: '011', name: 'First Bank' },
  { code: '214', name: 'First City Monument Bank (FCMB)' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '999999', name: 'OPay' },
  { code: '305', name: 'PalmPay' },
  { code: '526', name: 'Moniepoint' },
  { code: '301', name: 'Fintech Bank' },
]
