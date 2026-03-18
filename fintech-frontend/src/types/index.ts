// src/types/index.ts

export interface User {
  id: number
  fullname: string
  email: string
  phone: string
  role: 'USER' | 'ADMIN'
  isVerified: boolean
  pinSet: boolean
  isFrozen?: boolean
  lastLoginAt?: string
  createdAt?: string
  wallet?: Wallet
  account?: BankAccount
}

export interface Wallet {
  balance: string | number
  currency: string
}

export interface BankAccount {
  accountNumber: string
  accountName: string
  bankName: string
}

export interface Transaction {
  id: number
  userId: number
  type: TransactionType
  amount: string | number
  status: TransactionStatus
  reference: string
  description?: string
  meta?: Record<string, unknown>
  createdAt: string
  user?: { fullname: string; email: string }
}

export type TransactionType =
  | 'DEPOSIT' | 'WITHDRAWAL'
  | 'TRANSFER_OUT' | 'TRANSFER_IN'
  | 'AIRTIME' | 'DATA'

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean
  message: string
  token?: string
  user?: User
  [key: string]: unknown
}

export interface DashboardData {
  user: User & {
    wallet: Wallet
    account: BankAccount
    transactions: Transaction[]
  }
}

export interface Network {
  id: string
  name: string
  color: string
}

export interface DataPlan {
  id: string
  name: string
  amount: number
  validity: string
}
