import React, { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { eventService, registrationService } from '../../services/database'

export default function ManageParticipants() {
  const [events, setEvents] = useState([])
  const [regs, setRegs] = useState([])
  const [eventFilter, setEventFilter] = useState('All')
  const [deptFilter, setDeptFilter] = useState('All')

  useEffect(() => {
    eventService.list().then(setEvents)
    registrationService.listAll().then(setRegs)
  }, [])

  const departments = useMemo(() => ['All', ...new Set(regs.map(r => r.department).filter(Boolean))], [regs])

  const filtered = useMemo(() => regs.filter(r =>
    r.status === 'Registered' &&
    (eventFilter === 'All' || r.event_id === eventFilter) &&
    (deptFilter === 'All' || r.department === deptFilter)
  ), [regs, eventFilter, deptFilter])

  const exportCsv = () => {
    const header = ['Student Name', 'Department', 'Event', 'Registration Date', 'Status']
    const rows = filtered.map(r => [r.student_name, r.department, r.event_title, new Date(r.registration_date).toLocaleString('en-IN'), r.status])
    const csv = [header, ...rows].map(row => row.map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `auraevent-participants-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-2xl font-semibold">Participants</h1>
        <button type="button" onClick={exportCsv} disabled={filtered.length === 0} className="danger-button disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-lg font-bold">
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select value={eventFilter} onChange={e => setEventFilter(e.target.value)} className="bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm">
          <option value="All" className="bg-slate-800">All Events</option>
          {events.map(e => <option key={e.id} value={e.id} className="bg-slate-800">{e.title}</option>)}
        </select>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm">
          {departments.map(d => <option key={d} value={d} className="bg-slate-800">{d}</option>)}
        </select>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="text-left text-slate-500 border-b border-white/5">
            <tr><th className="px-5 py-3 font-medium">Student</th><th className="px-5 py-3 font-medium">Department</th><th className="px-5 py-3 font-medium">Event</th><th className="px-5 py-3 font-medium">Registered</th></tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3">{r.student_name}</td>
                <td className="px-5 py-3 text-slate-400">{r.department}</td>
                <td className="px-5 py-3 text-slate-400">{r.event_title}</td>
                <td className="px-5 py-3 text-slate-400">{new Date(r.registration_date).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-slate-500 py-10">No participants match the current filters.</p>}
      </div>
    </div>
  )
}
