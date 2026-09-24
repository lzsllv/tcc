import { useState, useCallback } from 'react'

let _id = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((type, message, duration = 4000) => {
    const id = ++_id
    setToasts(prev => [...prev, { id, type, message, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    sucesso: (msg, dur) => addToast('sucesso', msg, dur),
    erro:    (msg, dur) => addToast('erro',    msg, dur),
    aviso:   (msg, dur) => addToast('aviso',   msg, dur),
    info:    (msg, dur) => addToast('info',    msg, dur),
  }

  return { toasts, toast, removeToast }
}
