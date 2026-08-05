import { Banknote, Building2, CalendarCheck, ClipboardList, Clock, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'
import { useAuth } from '../context/auth'
import { useRealtimeRefresh } from '../hooks/useRealtimeRefresh'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ employees: 0, departments: 0, pendingLeaves: 0, openTasks: 0, attendance: 0, payroll: {} })

  const loadStats = useCallback(() => {
    apiRequest('/dashboard/stats').then(setStats).catch(() => {})
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  useRealtimeRefresh(['employee:changed', 'department:changed', 'attendance:changed', 'leave:changed', 'task:changed', 'payslip:changed'], loadStats)

  const cards = [
    { label: 'Employees', value: stats.employees, icon: Users },
    { label: 'Departments', value: stats.departments, icon: Building2 },
    { label: 'Pending Leaves', value: stats.pendingLeaves, icon: Clock },
    { label: 'Open Tasks', value: stats.openTasks, icon: ClipboardList },
    { label: 'Attendance Records', value: stats.attendance, icon: CalendarCheck },
    { label: 'Paid Payroll', value: `$${Number(stats.payroll?.paid?.total || 0).toLocaleString()}`, icon: Banknote },
  ]

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">{user?.role} dashboard</p>
        <h1 className="page-title">Welcome, {user?.firstName}</h1>
        <p className="page-subtitle">Monitor workforce activity, approvals, tasks, and core HR records.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="card card-hover p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
                </div>
                <div className="rounded-2xl bg-violet-50 p-3 text-violet-600"><Icon size={22} /></div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card mt-6 p-6 bg-gradient-to-br from-slate-900 to-violet-950 text-white">
        <h2 className="text-xl font-semibold">Production checklist</h2>
        <p className="mt-2 text-sm text-violet-100">JWT auth, protected routing, role-based screens, CRUD APIs, search, pagination, validation, and responsive layouts are wired into the app.</p>
      </div>
    </div>
  )
}

export default Dashboard
