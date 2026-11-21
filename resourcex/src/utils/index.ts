export const uid = () => Math.random().toString(36).slice(2, 10)
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
export const isGST = (s: string) => /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(s.toUpperCase())
export const isPhone = (s: string) => s.replace(/\D/g, '').length >= 10
export const today = () => new Date().toISOString().slice(0, 10)
export const MAX_FILE = 5 * 1024 * 1024
export const OK_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
