import React, { useEffect, useState } from 'react'
import { Send, Trash2 } from 'lucide-react'
import { announcementService } from '../../services/database'
import { useToast } from '../../components/useToast'

const PRIORITY_STYLE = {
  Urgent: 'border-red-500/30 bg-red-500/10 text-red-300',
  Important: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Normal: 'border-primary-500/30 bg-primary-500/10 text-primary-300',
}

export default function ManageAnnouncements() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', message: '', priority: 'Normal' })
  const [sending, setSending] = useState(false)

  const load = () => announcementService.list().then(setItems)
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await announcementService.create(form)
      showToast('Announcement published.', 'success')
      setForm({ title: '', message: '', priority: 'Normal' })
      load()
    } catch (err) {
      showToast(err.message || 'Could not publish.', 'error')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return
    try {
      await announcementService.remove(id)
      showToast('Announcement deleted.', 'info')
      load()
    } catch (err) {
      showToast(err.message || 'Could not delete announcement.', 'error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
      <h1 className="font-display text-2xl font-semibold mb-6">Announcements</h1>

      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 flex flex-col gap-4 mb-8">
        <input required placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          className="bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none" />
        <textarea required rows={3} placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          className="bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none" />
        <div className="flex gap-3">
          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
            className="bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm">
            {['Normal', 'Important', 'Urgent'].map(p => <option key={p} value={p} className="bg-slate-800">{p}</option>)}
          </select>
          <button type="submit" disabled={sending} className="danger-button flex items-center gap-1.5 disabled:opacity-60 px-5 py-2.5 rounded-lg text-sm font-bold">
            <Send size={14} /> {sending ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {items.map(a => (
          <div key={a.id} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{a.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full border ${PRIORITY_STYLE[a.priority]}`}>{a.priority}</span>
                <button type="button" onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400" aria-label={`Delete announcement ${a.title}`}><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-sm text-slate-400">{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
