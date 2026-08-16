import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { CalendarDays, MapPin, Printer, XCircle } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { registrationService } from '../../services/database'
import { useToast } from '../../components/useToast'

export default function MyRegistrations() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [regs, setRegs] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    registrationService.listForUser(user.id).then(setRegs).finally(() => setLoading(false))
  }

  useEffect(() => { load() /* eslint-disable-next-line */ }, [user.id])

  const handleCancel = async (regId) => {
    if (!confirm('Cancel this registration? This cannot be undone.')) return
    try {
      await registrationService.cancel(regId, user.id)
      showToast('Registration cancelled.', 'info')
      load()
    } catch (err) {
      showToast(err.message || 'Could not cancel.', 'error')
    }
  }

  const active = regs.filter(r => r.status === 'Registered')

  if (loading) return null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 route-enter">
      <p className="eyebrow mb-2"><span className="status-dot" /> Secured access</p>
      <h1 className="danger-title text-3xl sm:text-4xl mb-7">My tickets.</h1>

      {active.length === 0 ? (
        <p className="text-slate-500 text-center py-16">No active tickets yet — register for an event to get your QR pass.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {active.map(r => (
            <div key={r.id} className="glass-panel print-card rounded-2xl p-6 flex flex-col items-center text-center gap-3">
              <h3 className="font-display font-semibold text-lg">{r.event?.title}</h3>
              <p className="flex items-center gap-1.5 text-xs text-slate-400"><CalendarDays size={13} /> {r.event && new Date(r.event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p className="flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={13} /> {r.event?.venue}</p>

              <div className="bg-white p-3 rounded-xl my-2">
                <QRCode value={r.qr_data} size={140} />
              </div>
              <p className="text-[11px] text-slate-500 break-all">Ticket ID: {r.id}</p>
              <p className="text-[11px] text-slate-500">{user.full_name} · {user.student_id}</p>

              <div className="no-print flex gap-2 mt-2 w-full">
                <button type="button" onClick={() => window.print()} className="danger-outline flex-1 rounded-lg py-2.5 text-sm flex items-center justify-center gap-1.5">
                  <Printer size={14} /> Print / Download
                </button>
                <button type="button" onClick={() => handleCancel(r.id)} className="flex-1 bg-red-600/15 border border-red-500/25 hover:bg-red-600/25 text-red-300 rounded-lg py-2.5 text-sm flex items-center justify-center gap-1.5">
                  <XCircle size={14} /> Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
