import { Building2, CalendarCheck, ClipboardList, LayoutDashboard, LogOut, MenuIcon, Settings, Users, WalletCards, X } from "lucide-react"
import { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from '../context/auth'

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(user?.role === 'admin' ? [{ to: '/employees', label: 'Employees', icon: Users }] : []),
    ...(user?.role === 'admin' ? [{ to: '/departments', label: 'Departments', icon: Building2 }] : []),
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/leave', label: 'Leave', icon: CalendarCheck },
    { to: '/tasks', label: 'Tasks', icon: ClipboardList },
    { to: '/payslips', label: 'Payslips', icon: WalletCards },
    { to: '/settings', label: 'Profile', icon: Settings },
  ]

const handleLogout = () => {
  logout()
  navigate('/login', { replace: true })
}

const sidebarContent =(
  <>
    <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Employix</h1>
        <p className="text-xs text-violet-200">Management System</p>
      </div>
      <button className="lg:hidden text-white/70" onClick={() => setMobileOpen(false)}>
        <X size={20} />
      </button>
    </div>

    <div className="m-4 rounded-2xl bg-white/8 p-4 border border-white/10">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 grid place-items-center font-bold">
        {user?.firstName?.[0]}{user?.lastName?.[0]}
      </div>
      <p className="mt-3 font-semibold">{user?.firstName} {user?.lastName}</p>
      <p className="text-xs text-slate-300 capitalize">{user?.role}</p>
    </div>

    <nav className="flex-1 px-3 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${isActive ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Icon size={18} />
            {item.label}
          </NavLink>
        )
      })}
    </nav>

    <div className="p-4 border-t border-white/10">
      <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all">
        <LogOut size={18} />
        Logout
      </button>
    </div>
  </>
)

  return (
  <>

  {/* hamburger button */}
  <button onClick={()=>setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/10">
    <MenuIcon size={20}/>
</button>
    {/* mobile overlay */}
    {mobileOpen && <div className='lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40' onClick={()=>setMobileOpen(false)}/>}

{/* sidebar -desktop */}
<aside className="hidden lg:flex flex-col min-h-screen w-[260px] bg-linear-to-b from-slate-900 via-slate-900 to-slate-950
 text-white shrink-0 border-r border-white/4">
{sidebarContent}

</aside>


{/* sidebar mobile */}


<aside className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950
 text-white z-50 flex flex-col 
  transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
  {sidebarContent}
</aside>
  </>
  )
}

export default Sidebar
