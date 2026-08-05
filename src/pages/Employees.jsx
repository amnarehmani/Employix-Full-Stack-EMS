import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Pagination from '../components/Pagination'
import { apiRequest } from '../lib/api'

const emptyForm = { firstName: '', lastName: '', email: '', password: '', employeeId: '', designation: '', salary: '', phone: '', department: '' }

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const loadEmployees = useCallback(() => {
    apiRequest(`/employees?search=${encodeURIComponent(search)}&page=${page}`).then((data) => {
      setEmployees(data.items)
      setPages(data.pages)
    }).catch((err) => toast.error(err.message))
  }, [page, search])

  useEffect(() => { loadEmployees() }, [loadEmployees])
  useEffect(() => { apiRequest('/departments').then(setDepartments).catch(() => {}) }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, salary: Number(form.salary || 0), department: form.department || null }
      await apiRequest('/employees', { method: 'POST', body: JSON.stringify(payload) })
      toast.success('Employee created')
      setForm(emptyForm)
      loadEmployees()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this employee?')) return
    await apiRequest(`/employees/${id}`, { method: 'DELETE' })
    toast.success('Employee deleted')
    loadEmployees()
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1 className="page-title">Employees</h1><p className="page-subtitle">Create, search, paginate, and manage employee records.</p></div>
      <form onSubmit={submit} className="card p-5 grid gap-4 md:grid-cols-4">
        {['firstName', 'lastName', 'email', 'employeeId', 'designation', 'salary', 'phone'].map((field) => <input key={field} type={field === 'email' ? 'email' : field === 'salary' ? 'number' : 'text'} required={['firstName','lastName','email','employeeId'].includes(field)} placeholder={field.replace(/([A-Z])/g, ' $1')} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />)}
        <input type="password" required placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}><option value="">No department</option>{departments.map((dept) => <option key={dept._id} value={dept._id}>{dept.name}</option>)}</select>
        <button className="btn-primary md:col-span-4">Add Employee</button>
      </form>

      <div className="card mt-6 overflow-hidden">
        <div className="p-4 flex gap-3"><input placeholder="Search employees" value={search} onChange={(e) => setSearch(e.target.value)} /><button className="btn-secondary" onClick={() => { setPage(1); loadEmployees() }}>Search</button></div>
        <div className="overflow-x-auto"><table className="table-modern"><thead><tr><th>Name</th><th>Email</th><th>ID</th><th>Department</th><th>Status</th><th></th></tr></thead><tbody>{employees.map((employee) => <tr key={employee._id}><td>{employee.firstName} {employee.lastName}<p className="text-xs text-slate-500">{employee.designation}</p></td><td>{employee.email}</td><td>{employee.employeeId}</td><td>{employee.department?.name || '-'}</td><td><span className="badge badge-success">{employee.status}</span></td><td><button className="text-sm text-rose-600" onClick={() => remove(employee._id)}>Delete</button></td></tr>)}</tbody></table></div>
      </div>
      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  )
}

export default Employees
