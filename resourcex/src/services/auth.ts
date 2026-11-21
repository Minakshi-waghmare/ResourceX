import { supabase } from './supabase'
import { DEMO } from './store'
import type { Industry } from '../types'
type U = { industry: Industry; password: string }
const KEY = 'rx_users'
const users = (): U[] => { try { const u = JSON.parse(localStorage.getItem(KEY) || 'null'); if (u) return u } catch { /* ignore */ } return [{ industry: DEMO, password: 'demo1234' }] }
const fromRow = (r: any): Industry => ({ name: r.company_name, gst: r.gst_number, type: r.industry_type, mfg: r.manufacturing_type, address: r.business_address, contact: r.contact_person, designation: r.designation, email: r.official_email, phone: r.phone, materials: r.raw_materials || [], location: r.factory_location || '', experience: r.experience || 'New', verified: !!r.verified })
export const demoMode = !supabase
export async function login(email: string, password: string): Promise<Industry> {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const { data: row } = await supabase.from('industries').select('*').eq('user_id', data.user.id).maybeSingle()
    return row ? fromRow(row) : { ...DEMO, email, name: email.split('@')[0], contact: email.split('@')[0] }
  }
  const u = users().find(x => x.industry.email.toLowerCase() === email.toLowerCase() && x.password === password)
  if (!u) throw new Error('Invalid email or password (demo account: demo@resourcex.in / demo1234)')
  return u.industry
}
export async function register(i: Industry, password: string): Promise<Industry> {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({ email: i.email, password })
    if (error) throw error
    if (!data.session) throw new Error('Account created. Confirm the email we sent, then log in.')
    const { error: e2 } = await supabase.from('industries').insert({ user_id: data.user!.id, company_name: i.name, gst_number: i.gst, industry_type: i.type, manufacturing_type: i.mfg, business_address: i.address, contact_person: i.contact, designation: i.designation, official_email: i.email, phone: i.phone, raw_materials: i.materials, factory_location: i.location })
    if (e2) throw e2
    return i
  }
  const list = users()
  if (list.some(x => x.industry.email.toLowerCase() === i.email.toLowerCase())) throw new Error('An account with this email already exists')
  localStorage.setItem(KEY, JSON.stringify([...list, { industry: i, password }]))
  return i
}
export async function socialLogin(provider: 'google' | 'azure'): Promise<Industry | null> {
  if (supabase) { await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin + '/home' } }); return null }
  return DEMO
}
export async function resetPassword(email: string) {
  if (supabase) { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/login' }); if (error) throw error }
}
export async function signOut() { if (supabase) await supabase.auth.signOut() }
