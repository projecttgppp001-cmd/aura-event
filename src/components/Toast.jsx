import React, { useCallback, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { ToastContext } from './useToast'

const STYLES = {
  success: { icon: CheckCircle2, border: 'border-emerald-500/30', text: 'text-emerald-400' },
  error: { icon: XCircle, border: 'border-red-500/30', text: 'text-red-400' },
  info: { icon: Info, border: 'border-primary-500/30', text: 'text-primary-400' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info') => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
        {toasts.map(t => {
          const style = STYLES[t.type] || STYLES.info
          const Icon = style.icon
          return (
            <div key={t.id} className={`glass-panel ${style.border} border rounded-xl p-3 flex items-start gap-2 shadow-xl animate-[fadeIn_0.2s_ease-out]`}>
              <Icon size={18} className={`${style.text} mt-0.5 shrink-0`} />
              <p className="text-sm text-slate-200 flex-1">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-slate-500 hover:text-slate-300">
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
