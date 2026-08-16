import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Command, Mail, Lock, LogIn } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useToast } from '../components/useToast'

export default function Login() {
  const { signIn } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await signIn(form.email, form.password)
      showToast(`Welcome back, ${user.full_name?.split(' ')[0]}!`, 'success')
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
    } catch (err) {
      showToast(err.message || 'Login failed.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen danger-grid flex items-center justify-center px-4 py-12 route-enter">
      <div className="w-full max-w-md glass-panel rounded-2xl p-7 sm:p-9 border-primary-500/20 shadow-[0_0_100px_rgba(225,29,72,.1)]">
        <div className="flex items-center gap-2.5 justify-center mb-7 font-display font-extrabold text-xl">
          <span className="size-9 rounded-lg danger-button flex items-center justify-center"><Command size={18} /></span> AURA<span className="text-primary-500">//LOGIN</span>
        </div>
        <p className="eyebrow justify-center w-full mb-2"><span className="status-dot" /> Secure access point</p>
        <h1 className="danger-title text-3xl text-center mb-2">Welcome back.</h1>
        <p className="text-sm text-slate-500 text-center mb-7">Authenticate to enter the command center</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-slate-400">Email</span>
            <div className="flex items-center gap-2 bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5">
              <Mail size={16} className="text-slate-500" />
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="bg-transparent outline-none flex-1 text-slate-100" placeholder="you@college.edu" />
            </div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-slate-400">Password</span>
            <div className="flex items-center gap-2 bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5">
              <Lock size={16} className="text-slate-500" />
              <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="bg-transparent outline-none flex-1 text-slate-100" placeholder="••••••••" />
            </div>
          </label>

          <button type="submit" disabled={loading} className="danger-button mt-2 disabled:opacity-60 rounded-lg py-3 font-bold flex items-center justify-center gap-2">
            <LogIn size={16} /> {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-slate-400 text-center mt-6">
          Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
