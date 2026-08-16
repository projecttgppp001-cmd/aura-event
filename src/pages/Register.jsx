import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, UserPlus } from 'lucide-react'
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg glass-panel rounded-2xl p-8">
        <div className="flex items-center gap-2 justify-center mb-6 font-display font-semibold text-xl">
          <Sparkles className="text-primary-400" /> AuraEvent
        </div>
        <h1 className="text-xl font-semibold text-center mb-1">Create your student account</h1>
        <p className="text-sm text-slate-400 text-center mb-6">Register to book events and get QR passes</p>

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="text-slate-400">Full Name</span>
            <div className={wrapCls}><input required value={form.full_name} onChange={set('full_name')} className={inputCls} placeholder="Rahul Verma" /></div>
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
            <div className={wrapCls}><input required value={form.student_id} onChange={set('student_id')} className={inputCls} placeholder="CS2026041" /></div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-slate-400">Department</span>
            <div className={wrapCls}><input required value={form.department} onChange={set('department')} className={inputCls} placeholder="Computer Science" /></div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="text-slate-400">Year</span>
            <div className={wrapCls}>
              <select value={form.year} onChange={set('year')} className={inputCls}>
                {YEARS.map(y => <option key={y} value={y} className="bg-slate-800">{y}</option>)}
              </select>
            </div>
          </label>

          <button disabled={loading} className="sm:col-span-2 mt-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 rounded-lg py-2.5 font-medium flex items-center justify-center gap-2 transition-colors">
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
