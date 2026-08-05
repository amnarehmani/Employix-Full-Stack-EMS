import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/auth'
import { apiRequest } from '../lib/api'

const Settings = () => {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '', address: user?.address || '' })

  const submit = async (e) => {
    e.preventDefault()
    const updated = await apiRequest('/profile', { method: 'PUT', body: JSON.stringify(form) })
    updateUser(updated)
    toast.success('Profile updated')
  }

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="page-header"><h1 className="page-title">Profile Management</h1><p className="page-subtitle">Maintain your personal account information.</p></div>
      <form onSubmit={submit} className="card p-6 grid gap-4 sm:grid-cols-2">
        <input required placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <input required placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Email" value={user?.email || ''} disabled />
        <textarea className="sm:col-span-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <button className="btn-primary sm:col-span-2">Save Profile</button>
      </form>
    </div>
  )
}

export default Settings
