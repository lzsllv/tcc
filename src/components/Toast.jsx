import { useEffect, useRef } from 'react'
import '../styles/Toast.css'

/**
 * Toast — notificação flutuante
 * Props: toasts (array), removeToast (fn)
 * Cada toast: { id, type: 'sucesso'|'erro'|'aviso'|'info', message }
 */
export default function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container" role="region" aria-label="Notificações" aria-live="polite">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }) {
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(onClose, toast.duration ?? 4000)
    return () => clearTimeout(timerRef.current)
  }, [onClose, toast.duration])

  const icons = {
    sucesso: '🟢',
    erro:    '🔴',
    aviso:   '🟡',
    info:    '🔵',
  }

  return (
    <div className={`toast toast-${toast.type ?? 'info'}`} role="alert">
      <span className="toast-icon" aria-hidden="true">{icons[toast.type] ?? icons.info}</span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Fechar notificação">
        ✕
      </button>
      <div className="toast-progress" />
    </div>
  )
}
