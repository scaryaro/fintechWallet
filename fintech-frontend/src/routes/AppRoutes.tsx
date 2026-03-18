// // src/routes/AppRoutes.tsx

// import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

// // Pages
// import LandingPage       from '../pages/LandingPage'
// import LoginPage         from '../pages/LoginPage'
// import RegisterPage      from '../pages/RegisterPage'
// import VerifyEmailPage   from '../pages/VerifyEmailPage'
// import ForgotPasswordPage from '../pages/ForgotPasswordPage'
// import ResetPasswordPage from '../pages/ResetPasswordPage'
// import DashboardPage     from '../pages/DashboardPage'
// import TransferPage      from '../pages/TransferPage'
// import AirtimePage       from '../pages/AirtimePage'
// import DataPage          from '../pages/DataPage'
// import TransactionsPage  from '../pages/TransactionsPage'
// import ProfilePage       from '../pages/ProfilePage'
// import DepositPage       from '../pages/DepositPage'

// // Loading spinner while auth restores
// const Spinner = () => (
//   <div className="min-h-screen flex items-center justify-center">
//     <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
//   </div>
// )

// // ── ProtectedRoute ─────────────────────────────────────────────
// // Redirects based on auth + verification state
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading, user } = useAuth()
//   const location = useLocation()

//   if (isLoading) return <Spinner />
//   if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
//   if (!user?.isVerified && location.pathname !== '/verify-email') {
//     return <Navigate to="/verify-email" replace />
//   }
//   return <>{children}</>
// }

// // ── GuestRoute ────────────────────────────────────────────────
// // Logged-in users get bounced to dashboard
// const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading, user } = useAuth()
//   if (isLoading) return <Spinner />
//   if (isAuthenticated) {
//     return <Navigate to={user?.isVerified ? '/dashboard' : '/verify-email'} replace />
//   }
//   return <>{children}</>
// }

// // ── App Routes ────────────────────────────────────────────────
// import React from 'react'

// const AppRoutes: React.FC = () => (
//   <Routes>
//     {/* Public */}
//     <Route path="/" element={<LandingPage />} />

//     {/* Guest only */}
//     <Route path="/login"          element={<GuestRoute><LoginPage /></GuestRoute>} />
//     <Route path="/register"       element={<GuestRoute><RegisterPage /></GuestRoute>} />
//     <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
//     <Route path="/reset-password"  element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

//     {/* Needs auth but not necessarily verified */}
//     <Route path="/verify-email" element={<VerifyEmailPage />} />

//     {/* Protected — needs auth + verified */}
//     <Route path="/dashboard"    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
//     <Route path="/deposit"      element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
//     <Route path="/transfer"     element={<ProtectedRoute><TransferPage /></ProtectedRoute>} />
//     <Route path="/airtime"      element={<ProtectedRoute><AirtimePage /></ProtectedRoute>} />
//     <Route path="/data"         element={<ProtectedRoute><DataPage /></ProtectedRoute>} />
//     <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
//     <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

//     {/* Catch-all */}
//     <Route path="*" element={<Navigate to="/" replace />} />
//   </Routes>
// )

// export default AppRoutes





// src/routes/AppRoutes.tsx
// Email verification bypassed — ProtectedRoute only checks auth, not isVerified

import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import LandingPage         from '../pages/LandingPage'
import LoginPage           from '../pages/LoginPage'
import RegisterPage        from '../pages/RegisterPage'
import ForgotPasswordPage  from '../pages/ForgotPasswordPage'
import ResetPasswordPage   from '../pages/ResetPasswordPage'
import DashboardPage       from '../pages/DashboardPage'
import TransferPage        from '../pages/TransferPage'
import AirtimePage         from '../pages/AirtimePage'
import DataPage            from '../pages/DataPage'
import TransactionsPage    from '../pages/TransactionsPage'
import ProfilePage         from '../pages/ProfilePage'
import DepositPage         from '../pages/DepositPage'

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
)

// ── ProtectedRoute ─────────────────────────────────────────────
// Only checks: is the user logged in?
// isVerified check removed — all registered users are auto-verified
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  if (isLoading) return <Spinner />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  return <>{children}</>
}

// ── GuestRoute ────────────────────────────────────────────────
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <Spinner />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<LandingPage />} />

    {/* Guest only */}
    <Route path="/login"           element={<GuestRoute><LoginPage /></GuestRoute>} />
    <Route path="/register"        element={<GuestRoute><RegisterPage /></GuestRoute>} />
    <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
    <Route path="/reset-password"  element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

    {/* Verify-email redirect → dashboard (bypassed) */}
    <Route path="/verify-email" element={<Navigate to="/dashboard" replace />} />

    {/* Protected */}
    <Route path="/dashboard"    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/deposit"      element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
    <Route path="/transfer"     element={<ProtectedRoute><TransferPage /></ProtectedRoute>} />
    <Route path="/airtime"      element={<ProtectedRoute><AirtimePage /></ProtectedRoute>} />
    <Route path="/data"         element={<ProtectedRoute><DataPage /></ProtectedRoute>} />
    <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
    <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRoutes