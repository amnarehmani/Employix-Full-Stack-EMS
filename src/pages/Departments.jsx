import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../lib/api'

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({ name: '', code: '', description: '' })

  const load = () => apiRequest('/departments').then(setDepartments).catch((err) => toast.error(err.message))
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await apiRequest('/departments', { method: 'POST', body: JSON.stringify(form) })
    toast.success('Department created')
    setForm({ name: '', code: '', description: '' })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this department?')) return
    await apiRequest(`/departments/${id}`, { method: 'DELETE' })
    toast.success('Department deleted')
    load()
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1 className="page-title">Departments</h1><p className="page-subtitle">Organize employees by department.</p></div>
      <form onSubmit={submit} className="card p-5 grid gap-4 md:grid-cols-4">
        <input required placeholder="Department name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn-primary">Add Department</button>
      </form>
      <div className="grid gap-4 mt-6 md:grid-cols-2 xl:grid-cols-3">{departments.map((dept) => <div key={dept._id} className="card p-5"><div className="flex items-start justify-between"><div><h3 className="font-semibold text-slate-900">{dept.name}</h3><p className="text-sm text-slate-500">{dept.code}</p></div><button className="text-sm text-rose-600" onClick={() => remove(dept._id)}>Delete</button></div><p className="mt-3 text-sm text-slate-600">{dept.description || 'No description'}</p></div>)}</div>
    </div>
  )
}

export default Departments
