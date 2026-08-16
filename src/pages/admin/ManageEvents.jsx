import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { eventService } from '../../services/database'
import { useToast } from '../../components/useToast'

export default function ManageEvents() {
  const { showToast } = useToast()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    eventService.list().then(setEvents).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await eventService.remove(id)
      showToast('Event deleted.', 'info')
      load()
    } catch (err) {
      showToast(err.message || 'Could not delete event.', 'error')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Manage Events</h1>
        <Link to="/admin/events/new" className="danger-button flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-lg font-bold">
          <Plus size={15} /> New Event
        </Link>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="text-left text-slate-500 border-b border-white/5">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Capacity</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && events.map(e => (
              <tr key={e.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3 font-medium">{e.title}</td>
                <td className="px-5 py-3 text-slate-400">{e.category}</td>
                <td className="px-5 py-3 text-slate-400">{new Date(e.event_date).toLocaleDateString('en-IN')}</td>
                <td className="px-5 py-3 text-slate-400">{e.capacity}</td>
                <td className="px-5 py-3 text-slate-400">{e.status}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/events/edit/${e.id}`} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-primary-300" aria-label={`Edit ${e.title}`}><Pencil size={15} /></Link>
                    <button type="button" onClick={() => handleDelete(e.id, e.title)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400" aria-label={`Delete ${e.title}`}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && events.length === 0 && <p className="text-center text-slate-500 py-10">No events yet.</p>}
      </div>
    </div>
  )
}
