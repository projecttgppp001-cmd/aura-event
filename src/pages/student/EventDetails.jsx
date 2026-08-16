import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarDays, MapPin, Users, Trophy, Building2, Clock, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { eventService, registrationService } from '../../services/database'
import { useToast } from '../../components/useToast'

export default function EventDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [seatsTaken, setSeatsTaken] = useState(0)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)

  const load = async () => {
    setLoading(true)
    const ev = await eventService.get(id)
    setEvent(ev)
    if (ev) setSeatsTaken(await eventService.seatsTaken(ev.id))
    if (user) {
      const regs = await registrationService.listForUser(user.id)
      setAlreadyRegistered(regs.some(r => r.event_id === id && r.status === 'Registered'))
    }
    setLoading(false)
  }

  useEffect(() => { load() /* eslint-disable-next-line */ }, [id, user])

  const handleRegister = async () => {
    if (!user) return navigate('/login')
    setRegistering(true)
    try {
      await registrationService.register(user.id, id)
      showToast('Registered! Your QR ticket is ready in My Tickets.', 'success')
      await load()
      navigate('/student/registrations')
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary-400" size={28} /></div>
  if (!event) return <p className="text-center py-24 text-slate-500">Event not found.</p>

  const remaining = Math.max(event.capacity - seatsTaken, 0)
  const deadlinePassed = new Date(event.registration_deadline) < new Date(new Date().toDateString())
  const isFull = remaining === 0
  const registrationUnavailable = !['Published', 'Registration Open'].includes(event.status)

  let buttonLabel = 'Register Now'
  let disabled = false
  if (alreadyRegistered) { buttonLabel = 'Already Registered'; disabled = true }
  else if (registrationUnavailable) { buttonLabel = 'Registration Closed'; disabled = true }
  else if (isFull) { buttonLabel = 'Event Full'; disabled = true }
  else if (deadlinePassed) { buttonLabel = 'Registration Closed'; disabled = true }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 route-enter">
      <span className="text-xs px-2.5 py-1 rounded-full bg-primary-500/15 text-primary-300 border border-primary-500/30">{event.category}</span>
      <h1 className="danger-title text-4xl sm:text-5xl mt-4 mb-3">{event.title}</h1>
      <p className="text-slate-500 mb-8 leading-relaxed">{event.description}</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <InfoRow icon={CalendarDays} label="Date" value={new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
        <InfoRow icon={Clock} label="Time" value={`${event.start_time} – ${event.end_time}`} />
        <InfoRow icon={MapPin} label="Venue" value={event.venue} />
        <InfoRow icon={Building2} label="Organizer" value={event.organizer} />
        <InfoRow icon={Users} label="Seats" value={`${remaining} / ${event.capacity} remaining`} />
        {event.prize && <InfoRow icon={Trophy} label="Prize" value={event.prize} />}
      </div>

      <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Registration deadline</p>
          <p className="font-medium">{new Date(event.registration_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <button type="button" onClick={handleRegister} disabled={disabled || registering}
          className="danger-button disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-bold">
          {registering ? 'Registering…' : buttonLabel}
        </button>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-3">
      <Icon className="text-primary-400 shrink-0" size={18} />
      <div><p className="text-xs text-slate-500">{label}</p><p className="text-sm font-medium">{value}</p></div>
    </div>
  )
}
