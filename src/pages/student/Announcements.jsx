import React, { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import { announcementService } from '../../services/database'

const PRIORITY_STYLE = {
  Urgent: 'border-red-500/30 bg-red-500/10 text-red-300',
  Important: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Normal: 'border-primary-500/30 bg-primary-500/10 text-primary-300',
}

export default function Announcements() {
  const [items, setItems] = useState([])

  useEffect(() => {
    announcementService.list().then(setItems)
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
        <Megaphone className="text-primary-400" /> Announcements
      </h1>

      {items.length === 0 ? (
        <p className="text-slate-500 text-center py-16">No announcements yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map(a => (
            <div key={a.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{a.title}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${PRIORITY_STYLE[a.priority] || PRIORITY_STYLE.Normal}`}>{a.priority}</span>
              </div>
              <p className="text-sm text-slate-400">{a.message}</p>
              <p className="text-xs text-slate-600 mt-3">{new Date(a.created_at).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
