import { create } from 'zustand'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

interface UIStore {
  sidebarOpen:   boolean
  toasts:        Toast[]
  theme:         'light' | 'dark' | 'system'

  toggleSidebar: () => void
  setSidebar:    (open: boolean) => void
  addToast:      (toast: Omit<Toast, 'id'>) => void
  removeToast:   (id: string) => void
  setTheme:      (t: UIStore['theme']) => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  sidebarOpen: true,
  toasts:      [],
  theme:       'system',

  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar:    (open) => set({ sidebarOpen: open }),

  addToast: (toast) => {
    const id = `toast-${Date.now()}`
    set(s => ({ toasts: [...s.toasts, { ...toast, id }] }))
    // Auto-dismiss
    setTimeout(() => get().removeToast(id), toast.duration ?? 4000)
  },

  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  setTheme: (theme) => set({ theme }),
}))
