import { useAuthStore } from '@/store/authStore'
import { useAppStore }  from '@/store/appStore'

// ── Hook de autenticação ──
// Agora usa zustand. Quando o backend estiver pronto,
// substitua as funções login/cadastrar por chamadas à api.ts
export function useAuth() {
  const { usuarioLogado, setUsuarioLogado, logout: logoutStore } = useAuthStore()

  function hashSenha(senha: string): string {
    return btoa(unescape(encodeURIComponent(senha + ':precifique')))
  }

  // TODO: substituir por api.post(endpoints.auth.login, { email, senha })
  function login(email: string, senha: string): boolean {
    // Lê usuários do localStorage (legado) durante a migração
    const usuarios: Array<{ id: string; email: string; senha: string; nome: string }> =
      JSON.parse(localStorage.getItem('usuarios') || '[]')
    const hash = hashSenha(senha)
    const u = usuarios.find(u => u.email === email && (u.senha === hash || u.senha === senha))
    if (u) {
      const { senha: _s, ...semSenha } = u
      setUsuarioLogado({ ...semSenha, role: 'user', createdAt: new Date().toISOString() })
      return true
    }
    return false
  }

  // TODO: substituir por api.post(endpoints.auth.register, { nome, email, senha })
  function cadastrar(nome: string, email: string, senha: string): boolean {
    const usuarios: Array<{ id: string; email: string; senha: string; nome: string }> =
      JSON.parse(localStorage.getItem('usuarios') || '[]')
    if (usuarios.find(u => u.email === email)) return false
    const novo = { id: String(Date.now()), nome, email, senha: hashSenha(senha) }
    localStorage.setItem('usuarios', JSON.stringify([...usuarios, novo]))
    return true
  }

  function logout(): void {
    logoutStore()
    useAppStore.getState().setCustosFixos({ aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] })
  }

  return { usuarioLogado, login, cadastrar, logout, isLoggedIn: !!usuarioLogado }
}
