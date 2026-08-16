import React from 'react'
import { UserCircle2, Mail, Building2, GraduationCap, IdCard } from 'lucide-react'
import { useAuth } from '../../context/useAuth'

export default function Profile() {
  const { user } = useAuth()

  const rows = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: IdCard, label: 'Student ID', value: user.student_id },
    { icon: Building2, label: 'Department', value: user.department },
    { icon: GraduationCap, label: 'Year', value: user.year },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center text-center mb-6">
        <UserCircle2 className="text-primary-400 mb-3" size={64} />
        <h1 className="font-display text-2xl font-semibold">{user.full_name}</h1>
        <p className="text-slate-400 text-sm">Student Account</p>
      </div>

      <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="text-primary-400" size={18} />
            <div><p className="text-xs text-slate-500">{label}</p><p className="text-sm font-medium">{value || '—'}</p></div>
          </div>
        ))}
      </div>
    </div>
  )
}
