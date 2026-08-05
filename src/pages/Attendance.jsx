import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/auth'
import { apiRequest } from '../lib/api'

const Attendance = () => {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [form, setForm] = useState({ employee: '', date: new Date().toISOString().slice(0, 10), status: 'present', checkIn: '', checkOut: '', notes: '' })

  const load = useCallback(() => apiRequest(`/attendance?page=${page}`).then((data) => { setRecords(data.items); setPages(data.pages) }).catch((err) => toast.error(err.message)), [page])
  useEffect(() => { load() }, [load])
  useEffect(() => { if (user?.role === 'admin') apiRequest('/employees?limit=50').then((data) => setEmployees(data.items)).catch(() => {}) }, [user?.role])

  const submit = async (e) => {
    e.preventDefault()
    await apiRequest('/attendance', { method: 'POST', body: JSON.stringify(form) })
    toast.success('Attendance saved')
    load()
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1 className="page-title">Attendance</h1><p className="page-subtitle">Track daily attendance and check-in records.</p></div>
      {user?.role === 'admin' && <form onSubmit={submit} className="card p-5 grid gap-4 md:grid-cols-6"><select required value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })}><option value="">Select employee</option>{employees.map((employee) => <option key={employee._id} value={employee._id}>{employee.firstName} {employee.lastName}</option>)}</select><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="present">Present</option><option value="late">Late</option><option value="half-day">Half day</option><option value="absent">Absent</option></select><input placeholder="Check in" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} /><input placeholder="Check out" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} /><button className="btn-primary">Save</button></form>}
      <div className="card mt-6 overflow-x-auto"><table className="table-modern"><thead><tr><th>Employee</th><th>Date</th><th>Status</th><th>Check In</th><th>Check Out</th></tr></thead><tbody>{records.map((record) => <tr key={record._id}><td>{record.employee?.firstName} {record.employee?.lastName}</td><td>{new Date(record.date).toLocaleDateString()}</td><td><span className="badge badge-success">{record.status}</span></td><td>{record.checkIn || '-'}</td><td>{record.checkOut || '-'}</td></tr>)}</tbody></table></div>
      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  )
}

export default Attendance
