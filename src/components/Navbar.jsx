import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard, Command } from 'lucide-react'
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
        { to: '/student/events', label: 'Events' },
        { to: '/docs', label: 'Docs' },
      ]

  return (
    <header className="no-print sticky top-0 z-50 bg-black/75 backdrop-blur-2xl border-b border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-display font-extrabold tracking-tight text-lg" aria-label="AuraEvent home">
          <span className="size-8 rounded-lg danger-button flex items-center justify-center"><Command size={17} /></span>
          AURA<span className="text-primary-500">//EVENT</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm" aria-label="Primary navigation">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary-500/10 text-primary-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="danger-outline rounded-lg px-3 py-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                  <LayoutDashboard size={16} /> Admin Panel
                </Link>
              )}
              <span className="text-xs text-slate-500 hidden lg:inline">OPERATOR · <span className="text-slate-300">{user.full_name?.split(' ')[0]}</span></span>
              <button type="button" onClick={handleLogout} className="danger-outline flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg" aria-label="Log out">
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-300 hover:text-white px-3 py-2">Login</Link>
              <Link to="/register" className="danger-button text-sm px-4 py-2 rounded-lg font-bold">Get Access</Link>
            </>
          )}
        </div>

        <button type="button" className="md:hidden danger-outline p-2 rounded-lg" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/8 bg-black/95 px-4 py-4 flex flex-col gap-1 text-sm text-slate-300">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={({ isActive }) => `px-3 py-3 rounded-lg ${isActive ? 'bg-primary-500/10 text-primary-300' : 'hover:bg-white/5'}`}>{l.label}</NavLink>
          ))}
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-primary-400">Admin Panel</Link>}
              <button type="button" onClick={handleLogout} className="text-left px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg hover:bg-white/5">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="danger-button text-center rounded-lg px-3 py-3 mt-1">Get Access</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
