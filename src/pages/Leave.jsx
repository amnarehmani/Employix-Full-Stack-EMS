import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/auth'
import { apiRequest } from '../lib/api'

const Leave = () => {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [form, setForm] = useState({ type: 'annual', startDate: '', endDate: '', reason: '' })

  const load = useCallback(() => apiRequest(`/leaves?page=${page}`).then((data) => { setLeaves(data.items); setPages(data.pages) }).catch((err) => toast.error(err.message)), [page])
  useEffect(() => { load() }, [load])

  const submit = async (e) => {
    e.preventDefault()
    await apiRequest('/leaves', { method: 'POST', body: JSON.stringify(form) })
    toast.success('Leave request submitted')
    setForm({ type: 'annual', startDate: '', endDate: '', reason: '' })
    load()
  }

  const review = async (id, status) => {
    await apiRequest(`/leaves/${id}/review`, { method: 'PATCH', body: JSON.stringify({ status }) })
    toast.success(`Leave ${status}`)
    load()
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1 className="page-title">Leave Management</h1><p className="page-subtitle">Request, approve, and monitor employee leave.</p></div>
      {user?.role === 'employee' && <form onSubmit={submit} className="card p-5 grid gap-4 md:grid-cols-5"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="annual">Annual</option><option value="sick">Sick</option><option value="casual">Casual</option><option value="unpaid">Unpaid</option></select><input required type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /><input required type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /><input required placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /><button className="btn-primary">Request Leave</button></form>}
      <div className="card mt-6 overflow-x-auto"><table className="table-modern"><thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Reason</th><th>Status</th><th></th></tr></thead><tbody>{leaves.map((leave) => <tr key={leave._id}><td>{leave.employee?.firstName} {leave.employee?.lastName}</td><td>{leave.type}</td><td>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</td><td>{leave.reason}</td><td><span className="badge badge-warning">{leave.status}</span></td><td>{user?.role === 'admin' && leave.status === 'pending' && <div className="flex gap-2"><button className="text-sm text-emerald-600" onClick={() => review(leave._id, 'approved')}>Approve</button><button className="text-sm text-rose-600" onClick={() => review(leave._id, 'rejected')}>Reject</button></div>}</td></tr>)}</tbody></table></div>
      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  )
}

export default Leave
