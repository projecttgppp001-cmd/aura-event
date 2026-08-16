import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Command, LayoutDashboard, CalendarDays, Users, Megaphone, BarChart3, LogOut, FileText } from 'lucide-react'
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
    <aside className="no-print fixed lg:sticky bottom-0 lg:top-0 inset-x-0 lg:inset-x-auto z-50 lg:w-72 shrink-0 h-[4.5rem] lg:h-screen bg-black/90 backdrop-blur-2xl border-t lg:border-t-0 lg:border-r border-white/10 flex lg:flex-col">
      <div className="h-20 hidden lg:flex items-center gap-3 px-5 font-display font-extrabold text-lg border-b border-white/8">
        <span className="size-9 rounded-lg danger-button flex items-center justify-center"><Command size={18} /></span>
        AURA<span className="text-primary-500">//CTRL</span>
      </div>

      <nav className="flex-1 px-2 lg:px-3 py-2 lg:py-5 flex flex-row lg:flex-col gap-1 overflow-x-auto" aria-label="Admin navigation">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `min-w-16 lg:min-w-0 flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-3 px-2 lg:px-3 py-2.5 rounded-lg text-[10px] lg:text-sm transition-colors ${
                isActive ? 'bg-primary-500/12 text-primary-300 border border-primary-500/35 shadow-[0_0_24px_rgba(225,29,72,.08)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200 border border-transparent'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden lg:block p-4 border-t border-white/8">
        <p className="eyebrow mb-1">Active operator</p>
        <p className="text-sm text-slate-300 mb-3 truncate">{user?.full_name}</p>
        <button type="button" onClick={handleLogout} className="danger-outline w-full flex items-center gap-2 text-sm text-red-300 px-3 py-2.5 rounded-lg">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  )
}
