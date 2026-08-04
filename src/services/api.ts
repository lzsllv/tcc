import type { ApiResponse } from '@/types'

// ── Configuração base ──
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
}

function getAuthHeader(): HeadersInit {
  // Em produção: pegar token do cookie httpOnly via interceptor
  // Por enquanto: localStorage (substituir ao integrar backend)
  const token = localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: { ...defaultHeaders, ...getAuthHeader() },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (res.status === 401) {
    // Interceptor de 401 — limpa sessão e redireciona
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Erro desconhecido' }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }

  return res.json() as Promise<ApiResponse<T>>
}

// ── API client ──
export const api = {
  get:    <T>(endpoint: string)                  => request<T>('GET',    endpoint),
  post:   <T>(endpoint: string, body: unknown)   => request<T>('POST',   endpoint, body),
  put:    <T>(endpoint: string, body: unknown)   => request<T>('PUT',    endpoint, body),
  patch:  <T>(endpoint: string, body: unknown)   => request<T>('PATCH',  endpoint, body),
  delete: <T>(endpoint: string)                  => request<T>('DELETE', endpoint),
}
