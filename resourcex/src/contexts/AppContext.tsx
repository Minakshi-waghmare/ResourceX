import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import type { AppState, Feedback, Industry, Listing, Status } from '../types'
import { load, save } from '../services/store'
import * as auth from '../services/auth'
import { supabase } from '../services/supabase'
import { today, uid } from '../utils'

interface Ctx {
  state: AppState
  signIn: (i: Industry) => void
  logout: () => Promise<void>
  addListing: (l: { material: string; qty: number; price: number; location: string; grade: string; note?: string; docs?: string[] }) => Promise<void>
  addRequirement: (r: { material: string; qty: number; quality: string; location: string; additional: string }) => void
  setStatus: (id: string, s: Status) => void
  addFeedback: (f: Omit<Feedback, 'id' | 'by' | 'date'>) => void
  notify: (text: string) => void
  readNotices: () => void
}
const C = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(C)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)
  useEffect(() => save(state), [state])
  const upd = (f: (s: AppState) => AppState) => setState(f)
  const note = (s: AppState, text: string) => [{ id: uid(), text, read: false }, ...s.notices]
  const value: Ctx = {
    state,
    notify: text => upd(s => ({ ...s, notices: note(s, text) })),
    signIn: industry => upd(s => ({ ...s, industry })),
    logout: async () => { await auth.signOut(); upd(s => ({ ...s, industry: null })) },
    addListing: async l => {
      const me = state.industry!
      if (supabase) {
        const { data: u } = await supabase.auth.getUser()
        const { error } = await supabase.from('sell_listings').insert({ user_id: u.user?.id, material: l.material, quantity_mt: l.qty, price_per_mt: l.price, location: l.location, grade: l.grade, details: l.note })
        if (error) throw error
      }
      upd(s => ({ ...s, listings: [{ ...l, id: uid(), company: me.name, km: 0, exp: me.experience, available: l.qty, rating: 0, reviews: 0, verified: me.verified, mine: true, suit: 90 }, ...s.listings], notices: note(s, `Your ${l.material} listing is live.`) }))
    },
    addRequirement: r => upd(s => ({ ...s, requests: [{ id: uid(), kind: 'buy', company: s.industry!.name, location: r.location, km: 0, material: r.material, qty: r.qty, quality: r.quality, additional: r.additional, remarks: 'Posted by you', posted: 'just now', status: 'pending' }, ...s.requests], notices: note(s, `Requirement for ${r.qty} MT ${r.material} posted.`) })),
    setStatus: (id, st) => upd(s => {
      const r = s.requests.find(x => x.id === id)!
      const trades = st === 'accepted' ? [{ id: uid(), material: r.material, qty: r.qty, partner: r.company, date: today(), location: r.location, type: (r.kind === 'buy' ? 'sold' : 'bought') as 'sold' | 'bought' }, ...s.trades] : s.trades
      return { ...s, trades, requests: s.requests.map(x => (x.id === id ? { ...x, status: st } : x)), notices: note(s, `Request from ${r.company} ${st}.`) }
    }),
    addFeedback: f => upd(s => ({ ...s, feedback: [{ ...f, id: uid(), by: s.industry!.name, date: today() }, ...s.feedback] })),
    readNotices: () => upd(s => ({ ...s, notices: s.notices.map(n => ({ ...n, read: true })) }))
  }
  return <C.Provider value={value}>{children}</C.Provider>
}
