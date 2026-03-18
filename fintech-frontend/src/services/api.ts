// src/services/api.ts

import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fw_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message
    if (err.response?.status === 401) {
      localStorage.removeItem('fw_token')
      localStorage.removeItem('fw_user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  register: (data: { fullname: string; email: string; phone: string; password: string; bvn?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { fullname: string; phone: string }) =>
    api.put('/auth/profile', data),
  verifyEmail: (data: { otp?: string; token?: string; email?: string }) =>
    api.post('/auth/verify-email', data),
  resendOTP: (data: { email: string; type?: string }) =>
    api.post('/auth/resend-otp', data),
  forgotPassword: (data: { email: string }) =>
    api.post('/auth/forgot-password', data),
  resetPassword: (data: { otp?: string; token?: string; email?: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
}

// ── Wallet ────────────────────────────────────────────────────
export const walletApi = {
  getDashboard: () => api.get('/wallet/dashboard'),
  depositPaystack: (amount: number) => api.post('/wallet/deposit/paystack', { amount }),
  depositFlutterwave: (amount: number) => api.post('/wallet/deposit/flutterwave', { amount }),
  verifyPayment: (reference: string, transactionId?: string) =>
    api.get(`/wallet/deposit/verify/${reference}${transactionId ? `?transaction_id=${transactionId}` : ''}`),
  lookupAccount: (account: string) => api.get(`/wallet/transfer/lookup?account=${account}`),
  internalTransfer: (data: { recipientAccountNumber: string; amount: number; description?: string }) =>
    api.post('/wallet/transfer/internal', data),
  externalTransfer: (data: { bankCode: string; accountNumber: string; accountName: string; amount: number; description?: string }) =>
    api.post('/wallet/transfer/external', data),
  buyAirtime: (data: { network: string; phone: string; amount: number }) =>
    api.post('/wallet/airtime', data),
  buyData: (data: { network: string; phone: string; plan: string; amount: number }) =>
    api.post('/wallet/data', data),
  getTransactions: (params?: { page?: number; limit?: number; type?: string; status?: string; search?: string }) =>
    api.get('/wallet/transactions', { params }),
}

// ── PIN ───────────────────────────────────────────────────────
export const pinApi = {
  status: () => api.get('/pin/status'),
  set: (data: { pin: string; confirmPin: string; password: string }) =>
    api.post('/pin/set', data),
  change: (data: { currentPin: string; newPin: string; confirmNewPin: string }) =>
    api.post('/pin/change', data),
  verify: (pin: string) => api.post('/pin/verify', { pin }),
}

// ── Admin ─────────────────────────────────────────────────────
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getTransactions: () => api.get('/admin/transactions'),
  freezeUser: (userId: number, freeze: boolean) =>
    api.post(`/admin/freeze/${userId}`, { freeze }),
}

export default api
