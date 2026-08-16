import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save } from 'lucide-react'
import { eventService } from '../../services/database'
import { useToast } from '../../components/useToast'

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Competition', 'Other']
const STATUSES = ['Draft', 'Published', 'Registration Open', 'Registration Closed', 'Completed', 'Cancelled']

const EMPTY = {
  title: '', description: '', category: CATEGORIES[0], event_date: '', start_time: '', end_time: '',
  venue: '', organizer: '', capacity: 50, registration_deadline: '', prize: '', status: 'Registration Open',
}

export default function EventForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      eventService.get(id).then(ev => { if (ev) setForm(ev) }).finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const inputCls = "bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-primary-500/50 w-full"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, capacity: Number(form.capacity) }
      if (isEdit) {
        await eventService.update(id, payload)
        showToast('Event updated.', 'success')
      } else {
        await eventService.create(payload)
        showToast('Event created.', 'success')
      }
      navigate('/admin/events')
    } catch (err) {
      showToast(err.message || 'Could not save event.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
      <h1 className="font-display text-2xl font-semibold mb-6">{isEdit ? 'Edit Event' : 'Create Event'}</h1>

      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
        <Field label="Title" span2><input required value={form.title} onChange={set('title')} className={inputCls} /></Field>
        <Field label="Description" span2><textarea required rows={3} value={form.description} onChange={set('description')} className={inputCls} /></Field>

        <Field label="Category">
          <select value={form.category} onChange={set('category')} className={inputCls}>
            {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={set('status')} className={inputCls}>
            {STATUSES.map(s => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
          </select>
        </Field>

        <Field label="Event Date"><input required type="date" value={form.event_date} onChange={set('event_date')} className={inputCls} /></Field>
        <Field label="Registration Deadline"><input required type="date" value={form.registration_deadline} onChange={set('registration_deadline')} className={inputCls} /></Field>
        <Field label="Start Time"><input required type="time" value={form.start_time} onChange={set('start_time')} className={inputCls} /></Field>
        <Field label="End Time"><input required type="time" value={form.end_time} onChange={set('end_time')} className={inputCls} /></Field>

        <Field label="Venue"><input required value={form.venue} onChange={set('venue')} className={inputCls} /></Field>
        <Field label="Organizer"><input required value={form.organizer} onChange={set('organizer')} className={inputCls} /></Field>
        <Field label="Capacity"><input required type="number" min={1} value={form.capacity} onChange={set('capacity')} className={inputCls} /></Field>
        <Field label="Prize (optional)"><input value={form.prize} onChange={set('prize')} className={inputCls} /></Field>

        <button disabled={saving} className="sm:col-span-2 mt-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 rounded-lg py-2.5 font-medium flex items-center justify-center gap-2">
          <Save size={16} /> {saving ? 'Saving…' : 'Save Event'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children, span2 }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${span2 ? 'sm:col-span-2' : ''}`}>
      <span className="text-slate-400">{label}</span>
      {children}
    </label>
  )
}
