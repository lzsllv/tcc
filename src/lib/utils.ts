import { type ClassValue, clsx } from 'clsx'

// ── cn: combina classes condicionalmente (estilo shadcn/ui) ──
// Instale clsx: npm i clsx
export function cn(...inputs: ClassValue[]): string {
  // Fallback manual caso clsx não esteja instalado
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ── Formatadores de moeda (BRL) ──
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const formatPercent = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value / 100)

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('pt-BR').format(value)

// ── Formatadores de data ──
export const formatDate = (date: string | Date): string =>
  new Intl.DateTimeFormat('pt-BR').format(new Date(date))

export const formatDateTime = (date: string | Date): string =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date))

// ── Truncar texto ──
export const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max)}…` : text

// ── Iniciais para avatar ──
export const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

// ── Validação de email ──
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// ── Delay (útil para loading states em dev) ──
export const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

// ── Gerar ID único simples ──
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
