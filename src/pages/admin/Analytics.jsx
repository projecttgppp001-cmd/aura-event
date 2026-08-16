import React, { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { eventService, registrationService } from '../../services/database'

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#64748b']

export default function Analytics() {
  const [events, setEvents] = useState([])
  const [regs, setRegs] = useState([])

  useEffect(() => {
    eventService.list().then(setEvents)
    registrationService.listAll().then(setRegs)
  }, [])

  const participationData = useMemo(() =>
    events.map(e => ({ name: e.title.length > 14 ? e.title.slice(0, 14) + '…' : e.title, registrations: regs.filter(r => r.event_id === e.id && r.status === 'Registered').length }))
  , [events, regs])

  const categoryData = useMemo(() => {
    const counts = {}
    events.forEach(e => { counts[e.category] = (counts[e.category] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [events])

  const timelineData = useMemo(() => {
    const counts = {}
    regs.filter(r => r.status === 'Registered').forEach(r => {
      const day = new Date(r.registration_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      counts[day] = (counts[day] || 0) + 1
    })
    return Object.entries(counts).map(([date, count]) => ({ date, count }))
  }, [regs])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
      <h1 className="font-display text-2xl font-semibold mb-8">Analytics</h1>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Registrations per Event">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={participationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Bar dataKey="registrations" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={({ name }) => name}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Registration Timeline">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
            <Legend />
            <Line type="monotone" dataKey="count" name="Registrations" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <h2 className="font-semibold mb-4">{title}</h2>
      {children}
    </div>
  )
}
