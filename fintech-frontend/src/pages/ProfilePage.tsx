// src/pages/ProfilePage.tsx

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'
import { pinApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/layout/DashboardLayout'
import { OTPInput } from '../components/ui'

type PinView = 'none' | 'set' | 'change'

const ProfilePage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth()

  const [profileForm, setProfileForm] = useState({
    fullname: user?.fullname || '',
    phone:    user?.phone    || '',
  })
  const [savingProfile, setSavingProfile] = useState(false)

  // PIN states
  const [pinView, setPinView]   = useState<PinView>('none')
  const [setPin, setSetPin]     = useState('')
  const [confPin, setConfPin]   = useState('')
  const [curPin, setCurPin]     = useState('')
  const [newPin, setNewPin]     = useState('')
  const [confNew, setConfNew]   = useState('')
  const [password, setPassword] = useState('')
  const [pinLoading, setPinLoading] = useState(false)

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await authApi.updateProfile(profileForm)
      await refreshUser()
      toast.success('Profile updated!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (setPin.length < 4) return toast.error('Enter full PIN')
    if (setPin !== confPin) return toast.error('PINs do not match')
    if (!password) return toast.error('Enter your account password')
    setPinLoading(true)
    try {
      await pinApi.set({ pin: setPin, confirmPin: confPin, password })
      toast.success('Transaction PIN set!')
      await refreshUser()
      setPinView('none')
      setSetPin(''); setConfPin(''); setPassword('')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to set PIN')
    } finally {
      setPinLoading(false)
    }
  }

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (curPin.length < 4) return toast.error('Enter current PIN')
    if (newPin.length < 4) return toast.error('Enter new PIN')
    if (newPin !== confNew) return toast.error('New PINs do not match')
    setPinLoading(true)
    try {
      await pinApi.change({ currentPin: curPin, newPin, confirmNewPin: confNew })
      toast.success('PIN changed!')
      setPinView('none')
      setCurPin(''); setNewPin(''); setConfNew('')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change PIN')
    } finally {
      setPinLoading(false)
    }
  }

  return (
    <DashboardLayout title="Profile" subtitle="Manage your account settings">
      <div className="max-w-xl space-y-5">

        {/* Account info card */}
        <div className="card">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
              {user?.fullname?.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">{user?.fullname}</div>
              <div className="text-gray-500 text-sm">{user?.email}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`badge-${user?.isVerified ? 'success' : 'warning'}`}>
                  {user?.isVerified ? '✓ Verified' : '⚠ Unverified'}
                </span>
                <span className="badge-info">{user?.role}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="input-label">Full Name</label>
              <input className="input-field" value={profileForm.fullname}
                onChange={e => setProfileForm({ ...profileForm, fullname: e.target.value })} />
            </div>
            <div>
              <label className="input-label">Phone</label>
              <input className="input-field" value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input className="input-field" value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed" />
            </div>
            <button type="submit" disabled={savingProfile} className="btn-primary">
              {savingProfile ? <span className="spinner" /> : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* PIN Management */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-1">Transaction PIN</h3>
          <p className="text-sm text-gray-500 mb-4">
            {user?.pinSet ? 'Your PIN is active.' : 'Set a PIN to authorise transfers.'}
          </p>

          {pinView === 'none' && (
            <div className="flex gap-3">
              {!user?.pinSet && (
                <button onClick={() => setPinView('set')} className="btn-primary">Set PIN</button>
              )}
              {user?.pinSet && (
                <button onClick={() => setPinView('change')} className="btn-outline">Change PIN</button>
              )}
            </div>
          )}

          {pinView === 'set' && (
            <form onSubmit={handleSetPin} className="space-y-4">
              <div>
                <label className="input-label text-center block mb-2">New PIN</label>
                <OTPInput value={setPin} onChange={setSetPin} length={4} />
              </div>
              <div>
                <label className="input-label text-center block mb-2">Confirm PIN</label>
                <OTPInput value={confPin} onChange={setConfPin} length={4} />
              </div>
              <div>
                <label className="input-label">Account Password</label>
                <input type="password" className="input-field" placeholder="Your login password"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={pinLoading} className="btn-primary">
                  {pinLoading ? <span className="spinner" /> : 'Set PIN'}
                </button>
                <button type="button" onClick={() => setPinView('none')} className="btn-outline">Cancel</button>
              </div>
            </form>
          )}

          {pinView === 'change' && (
            <form onSubmit={handleChangePin} className="space-y-4">
              <div>
                <label className="input-label text-center block mb-2">Current PIN</label>
                <OTPInput value={curPin} onChange={setCurPin} length={4} />
              </div>
              <div>
                <label className="input-label text-center block mb-2">New PIN</label>
                <OTPInput value={newPin} onChange={setNewPin} length={4} />
              </div>
              <div>
                <label className="input-label text-center block mb-2">Confirm New PIN</label>
                <OTPInput value={confNew} onChange={setConfNew} length={4} />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={pinLoading} className="btn-primary">
                  {pinLoading ? <span className="spinner" /> : 'Change PIN'}
                </button>
                <button type="button" onClick={() => setPinView('none')} className="btn-outline">Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Danger zone */}
        <div className="card border-red-100">
          <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
          <button
            onClick={() => { logout(); window.location.href = '/login' }}
            className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all"
          >
            Sign out of all devices
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProfilePage
