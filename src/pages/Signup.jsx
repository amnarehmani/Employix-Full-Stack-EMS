import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import LoginLeftSide from '../components/LoginLeftSide'
import { useAuth } from '../context/auth'

const Signup = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'employee' })
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signup(form)
      toast.success('Account created')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">Create Account</h1>
          <p className="text-slate-600 text-sm sm:text-base mb-8">The first registered account becomes admin. Later signups are employee accounts.</p>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4"><input required placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /><input required placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
            <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input required type="password" minLength={6} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create Account'}</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link className="font-semibold text-violet-600" to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup
