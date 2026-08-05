import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/auth'
import { useRealtimeRefresh } from '../hooks/useRealtimeRefresh'
import { apiRequest } from '../lib/api'

const monthName = (month) => new Date(2024, month - 1, 1).toLocaleString('default', { month: 'long' })
const current = new Date()
const emptyForm = { employee: '', month: current.getMonth() + 1, year: current.getFullYear(), basicSalary: '', allowances: 0, deductions: 0, tax: 0, notes: '' }

const Payslips = () => {
  const { user } = useAuth()
  const [payslips, setPayslips] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const load = useCallback(() => {
    apiRequest(`/payslips?search=${encodeURIComponent(search)}&page=${page}`).then((data) => {
      setPayslips(data.items)
      setPages(data.pages)
    }).catch((err) => toast.error(err.message))
  }, [page, search])

  useEffect(() => { load() }, [load])
  useEffect(() => { if (user?.role === 'admin') apiRequest('/employees?limit=50').then((data) => setEmployees(data.items)).catch(() => {}) }, [user?.role])
  useRealtimeRefresh(['payslip:changed'], load)

  const submit = async (e) => {
    e.preventDefault()
    try {
      await apiRequest('/payslips', { method: 'POST', body: JSON.stringify(form) })
      toast.success('Payslip generated')
      setForm(emptyForm)
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const markPaid = async (id) => {
    await apiRequest(`/payslips/${id}/pay`, { method: 'PATCH', body: JSON.stringify({}) })
    toast.success('Payslip marked paid')
    load()
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1 className="page-title">Payroll & Payslips</h1><p className="page-subtitle">Generate monthly payroll, mark salary payments, and let employees view payslips.</p></div>
      {user?.role === 'admin' && <form onSubmit={submit} className="card p-5 grid gap-4 md:grid-cols-4 xl:grid-cols-8"><select required value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })}><option value="">Employee</option>{employees.map((employee) => <option key={employee._id} value={employee._id}>{employee.firstName} {employee.lastName}</option>)}</select><select value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{monthName(index + 1)}</option>)}</select><input required type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} /><input required type="number" placeholder="Basic salary" value={form.basicSalary} onChange={(e) => setForm({ ...form, basicSalary: Number(e.target.value) })} /><input type="number" placeholder="Allowances" value={form.allowances} onChange={(e) => setForm({ ...form, allowances: Number(e.target.value) })} /><input type="number" placeholder="Deductions" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: Number(e.target.value) })} /><input type="number" placeholder="Tax" value={form.tax} onChange={(e) => setForm({ ...form, tax: Number(e.target.value) })} /><button className="btn-primary">Generate</button></form>}
      <div className="card mt-6 overflow-hidden">
        <div className="p-4 flex gap-3"><input placeholder="Search payroll" value={search} onChange={(e) => setSearch(e.target.value)} /><button className="btn-secondary" onClick={() => { setPage(1); load() }}>Search</button></div>
        <div className="overflow-x-auto"><table className="table-modern"><thead><tr><th>Employee</th><th>Period</th><th>Gross</th><th>Deductions</th><th>Net Pay</th><th>Status</th><th></th></tr></thead><tbody>{payslips.map((payslip) => <tr key={payslip._id}><td>{payslip.employee?.firstName} {payslip.employee?.lastName}<p className="text-xs text-slate-500">{payslip.employee?.employeeId}</p></td><td>{monthName(payslip.month)} {payslip.year}</td><td>${Number(payslip.basicSalary + payslip.allowances).toLocaleString()}</td><td>${Number(payslip.deductions + payslip.tax).toLocaleString()}</td><td className="font-semibold">${Number(payslip.netPay).toLocaleString()}</td><td><span className={`badge ${payslip.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{payslip.status}</span></td><td><div className="flex gap-3"><Link className="text-sm text-violet-600" to={`/print/payslips/${payslip._id}`}>View</Link>{user?.role === 'admin' && payslip.status !== 'paid' && <button className="text-sm text-emerald-600" onClick={() => markPaid(payslip._id)}>Pay</button>}</div></td></tr>)}</tbody></table></div>
      </div>
      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  )
}

export default Payslips
