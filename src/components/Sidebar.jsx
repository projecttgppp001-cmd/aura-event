import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Sparkles, LayoutDashboard, CalendarDays, Users, Megaphone, BarChart3, LogOut, FileText } from 'lucide-react'
import { useAuth } from '../context/useAuth'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/participants', label: 'Participants', icon: Users },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/docs', label: 'Docs', icon: FileText },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <aside className="no-print w-64 shrink-0 h-screen sticky top-0 glass-panel border-r border-white/5 flex flex-col">
      <div className="h-16 flex items-center gap-2 px-5 font-display font-semibold text-lg border-b border-white/5">
        <Sparkles className="text-primary-400" size={22} />
        Aura<span className="text-primary-400">Event</span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <p className="text-xs text-slate-500 mb-2 truncate">{user?.full_name}</p>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  )
}
