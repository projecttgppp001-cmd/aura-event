import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, LogIn } from 'lucide-react'
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

  const fillDemo = (role) => {
    setForm(role === 'admin'
      ? { email: 'admin@college.edu', password: 'admin123' }
      : { email: 'student@college.edu', password: 'student123' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel rounded-2xl p-8">
        <div className="flex items-center gap-2 justify-center mb-6 font-display font-semibold text-xl">
          <Sparkles className="text-primary-400" /> AuraEvent
        </div>
        <h1 className="text-xl font-semibold text-center mb-1">Welcome back</h1>
        <p className="text-sm text-slate-400 text-center mb-6">Sign in to continue</p>

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

          <button disabled={loading} className="mt-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 rounded-lg py-2.5 font-medium flex items-center justify-center gap-2 transition-colors">
            <LogIn size={16} /> {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 flex gap-2 text-xs">
          <button onClick={() => fillDemo('student')} className="flex-1 bg-slate-800/60 hover:bg-slate-700/60 rounded-lg py-2 text-slate-300">Use Student Demo</button>
          <button onClick={() => fillDemo('admin')} className="flex-1 bg-slate-800/60 hover:bg-slate-700/60 rounded-lg py-2 text-slate-300">Use Admin Demo</button>
        </div>

        <p className="text-sm text-slate-400 text-center mt-6">
          Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
