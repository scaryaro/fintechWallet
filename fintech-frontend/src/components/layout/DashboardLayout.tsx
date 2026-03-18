// src/components/layout/DashboardLayout.tsx

import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard',    icon: '⊞',  label: 'Dashboard'     },
  { to: '/deposit',      icon: '+',   label: 'Deposit'       },
  { to: '/transfer',     icon: '→',   label: 'Transfer'      },
  { to: '/airtime',      icon: '📱',  label: 'Airtime'       },
  { to: '/data',         icon: '📶',  label: 'Data'          },
  { to: '/transactions', icon: '≡',   label: 'Transactions'  },
  { to: '/profile',      icon: '👤',  label: 'Profile'       },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.fullname?.charAt(0).toUpperCase() ?? 'U'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
    <aside
  className={`bg-gradient-to-b from-primary to-accent  fixed top-0 left-0 h-full w-60 bg-primary text-white z-50 flex flex-col transition-transform duration-300
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
>
  {/* Logo */}
  <div className="px-5 py-6 border-b border-white/10">
    <span className="font-bold text-xl tracking-tight">
      Fintech<span className="text-accent">Wallet</span>
    </span>
  </div>

  {/* Nav */}
  <nav className="flex-1 py-4 overflow-y-auto">
    {navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={() => setSidebarOpen(false)}
        className={({ isActive }) =>
          `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all
           border-l-[3px]
           ${
             isActive
               ? 'bg-white/10 text-white border-accent'
               : 'text-white/70 hover:text-white hover:bg-white/5 border-transparent'
           }`
        }
      >
        <span className="text-base w-5 text-center">{item.icon}</span>
        {item.label}
      </NavLink>
    ))}
  </nav>

  {/* Logout */}
  <div className="px-5 py-4 border-t border-white/10">
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 text-white/60 hover:text-white text-sm font-medium transition-colors w-full"
    >
      <span>⬚</span> Logout
    </button>
  </div>
</aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="text-xl text-gray-600">☰</span>
            </button>
            <div>
              {title && <h1 className="font-semibold text-gray-900 text-base">{title}</h1>}
              {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-semibold text-gray-800">
              {user?.fullname?.split(' ')[0]}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 fade-up">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
