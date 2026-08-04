import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Usuario } from '@/types'

interface AuthStore {
  usuarioLogado: Omit<Usuario, 'senha'> | null
  isLoading: boolean
  setUsuarioLogado: (user: Omit<Usuario, 'senha'> | null) => void
  setLoading: (v: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      usuarioLogado: null,
      isLoading: false,
      setUsuarioLogado: (user) => set({ usuarioLogado: user }),
      setLoading: (v) => set({ isLoading: v }),
      logout: () => {
        localStorage.removeItem('auth_token')
        set({ usuarioLogado: null })
      },
    }),
    { name: 'precifique-auth' },
  ),
)
