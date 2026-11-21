import { ReactNode, useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { Recycle, Home, Store, Clock, User, ChevronLeft, Star, MapPin, Factory, BadgeCheck } from 'lucide-react'
import type { Listing } from '../types'

export const Logo = ({ size = 28 }: { size?: number }) => (
  <div className="flex items-center gap-2 font-bold text-brand-900"><Recycle size={size} className="text-brand-500" /><span style={{ fontSize: size * 0.8 }}>ResourceX</span></div>
)
const tabs = [['/home', 'Home', Home], ['/marketplace', 'Marketplace', Store], ['/requests', 'Requests', Clock], ['/profile', 'Profile', User]] as const
export function Shell({ children, nav = true, w = 'wide' }: { children: ReactNode; nav?: boolean; w?: 'wide' | 'mid' | 'narrow' }) {
  const width = { wide: 'lg:max-w-6xl', mid: 'lg:max-w-3xl', narrow: 'lg:max-w-xl' }[w]
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-brand-100 lg:flex">
      {nav && (
        <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen bg-white border-r border-brand-100 p-6 gap-1">
          <div className="mb-6"><Logo size={30} /><p className="text-xs text-slate-500 mt-1">Waste is a Resource.</p></div>
          {tabs.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 font-medium ${isActive ? 'bg-brand-900 text-white' : 'text-slate-600 hover:bg-brand-50'}`}><Icon size={20} />{label}</NavLink>
          ))}
          <NavLink to="/feedback" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 font-medium ${isActive ? 'bg-brand-900 text-white' : 'text-slate-600 hover:bg-brand-50'}`}><Star size={20} />Feedback</NavLink>
        </aside>
      )}
      <div className="flex-1 min-w-0">
        <div className={`w-full mx-auto min-h-screen pb-24 lg:pb-12 ${nav ? 'max-w-md md:max-w-2xl' : 'max-w-md'} ${width} ${nav ? '' : 'bg-white/70 lg:my-10 lg:min-h-0 lg:rounded-3xl lg:shadow-xl lg:pb-8'}`}>
          {children}
        </div>
        {nav && (
          <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-brand-100 grid grid-cols-4 py-2 z-20 rounded-t-3xl">
            {tabs.map(([to, label, Icon]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center text-xs gap-1 py-1 ${isActive ? 'text-brand-700 font-semibold' : 'text-slate-500'}`}><Icon size={22} />{label}</NavLink>
            ))}
          </nav>
        )}
      </div>
    </div>
  )
}
export function Header({ title, right }: { title: string; right?: ReactNode }) {
  const nav = useNavigate()
  return (
    <div className="flex items-center justify-between px-4 lg:px-8 pt-5 lg:pt-8 pb-2">
      <button aria-label="Back" onClick={() => nav(-1)}><ChevronLeft /></button>
      <h1 className="font-bold text-brand-900 text-lg">{title}</h1>
      <div className="w-6">{right}</div>
    </div>
  )
}
export const Stars = ({ value, onChange, size = 18 }: { value: number; onChange?: (n: number) => void; size?: number }) => (
  <span className="inline-flex">
    {[1, 2, 3, 4, 5].map(n => (
      <button type="button" key={n} disabled={!onChange} onClick={() => onChange?.(n)} aria-label={`${n} star`}>
        <Star size={size} className={n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
      </button>
    ))}
  </span>
)
interface FP { label: string; icon?: any; error?: string; area?: boolean; [k: string]: any }
export function Field({ label, icon: Icon, error, area, ...p }: FP) {
  const cls = 'w-full bg-transparent outline-none text-sm py-1'
  return (
    <label className="block mb-3">
      <span className="text-xs text-slate-600">{label}</span>
      <div className={`flex items-center gap-2 rounded-2xl border px-3 bg-white ${error ? 'border-red-400' : 'border-brand-200'}`}>
        {Icon && <Icon size={18} className="text-brand-700 shrink-0" />}
        {area ? <textarea rows={2} className={cls} {...p} /> : <input className={cls} {...p} />}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  )
}
export function Select({ label, options, error, icon: Icon, ...p }: { label: string; options: string[]; error?: string; icon?: any; [k: string]: any }) {
  return (
    <label className="block mb-3">
      <span className="text-xs text-slate-600">{label}</span>
      <div className={`flex items-center gap-2 rounded-2xl border px-3 bg-white ${error ? 'border-red-400' : 'border-brand-200'}`}>
        {Icon && <Icon size={18} className="text-brand-700" />}
        <select className="w-full bg-transparent py-2 text-sm outline-none" {...p}><option value="">Select…</option>{options.map(o => <option key={o}>{o}</option>)}</select>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  )
}
export function LocationPicker({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const [show, setShow] = useState(false)
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
  const q = encodeURIComponent(value || 'Pune, Maharashtra')
  return (
    <div className="card mb-3">
      <p className="font-semibold text-brand-900 flex items-center gap-2"><MapPin size={18} /> Factory Location</p>
      <Field label="Search or type location *" icon={MapPin} value={value} onChange={(e: any) => onChange(e.target.value)} placeholder="e.g. MIDC, Chakan, Pune" error={error} />
      {key ? (
        <>
          <button type="button" className="btn mb-2" onClick={() => setShow(true)}>Choose on Google Maps</button>
          {show && <iframe title="map" className="w-full h-40 rounded-xl border-0" loading="lazy" src={`https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}`} />}
        </>
      ) : (
        <a className="btn mb-1" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${q}`}>Choose on Google Maps</a>
      )}
      {!key && <p className="text-[11px] text-slate-500">Add VITE_GOOGLE_MAPS_API_KEY to .env to show the map inline.</p>}
    </div>
  )
}
export function ListingCard({ l, action }: { l: Listing; action?: ReactNode }) {
  return (
    <div className="card flex gap-3">
      <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-brand-200 to-brand-500 flex items-center justify-center text-white"><Factory size={34} /></div>
      <div className="flex-1 text-sm">
        <p className="font-bold text-brand-900 flex items-center gap-1">{l.material} {l.verified && <BadgeCheck size={14} className="text-brand-500" />}</p>
        <p className="text-slate-600">{l.company}</p>
        <p className="text-xs text-slate-500">Qty: {l.available} MT · {l.grade} · {l.location}</p>
        <p className="font-semibold text-brand-700">₹{l.price} / MT</p>
        <div className="flex items-center gap-2 mt-1"><span className="chip">Available</span>{action ?? <Link className="text-xs font-semibold text-brand-700" to={`/supplier/${l.id}`}>View details →</Link>}</div>
      </div>
    </div>
  )
}
