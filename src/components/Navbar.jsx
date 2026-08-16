import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const links = user?.role === 'student'
    ? [
        { to: '/student/dashboard', label: 'Dashboard' },
        { to: '/student/events', label: 'Events' },
        { to: '/student/registrations', label: 'My Tickets' },
        { to: '/student/announcements', label: 'Announcements' },
        { to: '/docs', label: 'Docs' },
      ]
    : [
        { to: '/docs', label: 'Docs' },
      ]

  return (
    <header className="no-print sticky top-0 z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
          <Sparkles className="text-primary-400" size={22} />
          Aura<span className="text-primary-400">Event</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          {links.map(l => (
            <Link key={l.to} to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300">
                  <LayoutDashboard size={16} /> Admin Panel
                </Link>
              )}
              <span className="text-sm text-slate-400">Hi, {user.full_name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-300 hover:text-white">Login</Link>
              <Link to="/register" className="text-sm bg-primary-600 hover:bg-primary-500 px-4 py-1.5 rounded-lg font-medium transition-colors">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-slate-300" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 px-4 py-3 flex flex-col gap-3 text-sm text-slate-300">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="text-primary-400">Admin Panel</Link>}
              <button onClick={handleLogout} className="text-left text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="text-primary-400">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
