import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/auth'
import { apiRequest } from '../lib/api'

const Tasks = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium' })

  const load = useCallback(() => apiRequest(`/tasks?page=${page}`).then((data) => { setTasks(data.items); setPages(data.pages) }).catch((err) => toast.error(err.message)), [page])
  useEffect(() => { load() }, [load])
  useEffect(() => { if (user?.role === 'admin') apiRequest('/employees?limit=50').then((data) => setEmployees(data.items)).catch(() => {}) }, [user?.role])

  const submit = async (e) => {
    e.preventDefault()
    await apiRequest('/tasks', { method: 'POST', body: JSON.stringify(form) })
    toast.success('Task assigned')
    setForm({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium' })
    load()
  }

  const updateStatus = async (id, status) => {
    await apiRequest(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
    toast.success('Task updated')
    load()
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1 className="page-title">Task Assignment</h1><p className="page-subtitle">Assign, track, and complete employee work.</p></div>
      {user?.role === 'admin' && <form onSubmit={submit} className="card p-5 grid gap-4 md:grid-cols-6"><input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><select required value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}><option value="">Assignee</option>{employees.map((employee) => <option key={employee._id} value={employee._id}>{employee.firstName} {employee.lastName}</option>)}</select><input required type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select><button className="btn-primary">Assign</button></form>}
      <div className="grid gap-4 mt-6 lg:grid-cols-2">{tasks.map((task) => <div key={task._id} className="card p-5"><div className="flex justify-between gap-4"><div><h3 className="font-semibold text-slate-900">{task.title}</h3><p className="text-sm text-slate-500">Assigned to {task.assignedTo?.firstName} {task.assignedTo?.lastName}</p></div><span className="badge badge-warning">{task.priority}</span></div><p className="mt-3 text-sm text-slate-600">{task.description || 'No description'}</p><div className="mt-4 flex items-center justify-between"><span className="text-sm text-slate-500">Due {new Date(task.dueDate).toLocaleDateString()}</span><select className="max-w-40" value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)}><option value="todo">Todo</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select></div></div>)}</div>
      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  )
}

export default Tasks