'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counterRef = useRef(0)

  const show = useCallback((message: string, type: ToastType = 'success') => {
    const id = String(++counterRef.current)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-20 right-4 z-[200] flex flex-col gap-2 md:bottom-6"
      >
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastMessage({
  toast,
  onDismiss,
}: {
  toast: ToastItem
  onDismiss: (id: string) => void
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" aria-hidden="true" />,
    error: <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />,
    info: <Info className="w-4 h-4 text-cta flex-shrink-0" aria-hidden="true" />,
  }

  return (
    <div
      role="status"
      className={cn(
        'flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-2xl border border-gray-100',
        'max-w-xs w-full transition-all duration-300',
        visible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0',
      )}
    >
      {icons[toast.type]}
      <span className="text-sm text-forest flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Zavřít"
        className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
