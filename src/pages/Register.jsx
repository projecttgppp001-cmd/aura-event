import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Command, UserPlus } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useToast } from '../components/useToast'

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']

export default function Register() {
  const { signUp } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', student_id: '', department: '', year: YEARS[0] })
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const newUser = await signUp(form)
      if (newUser.requiresEmailConfirmation) {
        showToast('Account created. Check your email, then sign in.', 'success')
        navigate('/login')
        return
      }
      showToast('Account created! Welcome to AuraEvent.', 'success')
      navigate('/student/dashboard')
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "bg-transparent outline-none flex-1 text-slate-100"
  const wrapCls = "bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5"

  return (
    <div className="min-h-screen danger-grid flex items-center justify-center px-4 py-12 route-enter">
      <div className="w-full max-w-lg glass-panel rounded-2xl p-7 sm:p-9 border-primary-500/20 shadow-[0_0_100px_rgba(225,29,72,.1)]">
        <div className="flex items-center gap-2.5 justify-center mb-7 font-display font-extrabold text-xl">
          <span className="size-9 rounded-lg danger-button flex items-center justify-center"><Command size={18} /></span> AURA<span className="text-primary-500">//ACCESS</span>
        </div>
        <p className="eyebrow justify-center w-full mb-2"><span className="status-dot" /> New operator</p>
        <h1 className="danger-title text-3xl text-center mb-2">Activate access.</h1>
        <p className="text-sm text-slate-500 text-center mb-7">Build your identity. Own your event feed.</p>

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="text-slate-400">Full Name</span>
            <div className={wrapCls}><input required value={form.full_name} onChange={set('full_name')} className={inputCls} placeholder="Pavan" /></div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="text-slate-400">Email</span>
            <div className={wrapCls}><input required type="email" value={form.email} onChange={set('email')} className={inputCls} placeholder="you@college.edu" /></div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="text-slate-400">Password</span>
            <div className={wrapCls}><input required type="password" minLength={6} value={form.password} onChange={set('password')} className={inputCls} placeholder="At least 6 characters" /></div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-slate-400">Student ID</span>
            <div className={wrapCls}><input required value={form.student_id} onChange={set('student_id')} className={inputCls} placeholder="IT2026041" /></div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-slate-400">Department</span>
            <div className={wrapCls}><input required value={form.department} onChange={set('department')} className={inputCls} placeholder="Information Technology" /></div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="text-slate-400">Year</span>
            <div className={wrapCls}>
              <select value={form.year} onChange={set('year')} className={inputCls}>
                {YEARS.map(y => <option key={y} value={y} className="bg-slate-800">{y}</option>)}
              </select>
            </div>
          </label>

          <button type="submit" disabled={loading} className="danger-button sm:col-span-2 mt-2 disabled:opacity-60 rounded-lg py-3 font-bold flex items-center justify-center gap-2">
            <UserPlus size={16} /> {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-slate-400 text-center mt-6">
          Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
