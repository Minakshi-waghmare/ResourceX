import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Tag, Recycle, Leaf, Phone, MapPin, Briefcase, BadgeCheck, Star, LogOut, ShieldCheck } from 'lucide-react'
import { Shell, Stars } from '../components/ui'
import { useApp } from '../contexts/AppContext'

export default function Profile() {
  const { state, logout } = useApp(); const nav = useNavigate(); const me = state.industry!
  const [tab, setTab] = useState<'bought' | 'sold'>('bought'); const [all, setAll] = useState(false)
  const bought = state.trades.filter(t => t.type === 'bought'); const sold = state.trades.filter(t => t.type === 'sold')
  const total = state.trades.reduce((a, t) => a + t.qty, 0)
  const mineReviews = state.feedback.filter(f => f.supplier === me.name); const rating = mineReviews.length ? mineReviews.reduce((a, f) => a + f.stars, 0) / mineReviews.length : 0
  const rows = (tab === 'bought' ? bought : sold); const shown = all ? rows : rows.slice(0, 3)
  const Stat = ({ i: I, n, l }: { i: any; n: string | number; l: string }) => <div className="text-center"><I size={20} className="mx-auto text-brand-700" /><p className="font-bold">{n}</p><p className="text-[11px] text-slate-500">{l}</p></div>
  return (
    <Shell w="mid">
      <div className="px-4 lg:px-8 pt-6 lg:pt-10 space-y-3">
        <div className="flex justify-between items-start"><div><h1 className="text-xl font-extrabold text-brand-900 flex items-center gap-1">{me.name}{me.verified && <span className="chip"><BadgeCheck size={12} />Verified</span>}</h1>
          <p className="text-sm text-slate-600">{me.type} · {me.mfg}</p></div>
          <button aria-label="Logout" onClick={async () => { await logout(); nav('/') }} className="text-slate-500"><LogOut /></button></div>
        <div className="card text-sm space-y-1"><p className="flex gap-1 items-center"><Star size={14} className="text-amber-400 fill-amber-400" />{rating ? rating.toFixed(1) : 'No ratings'} ({mineReviews.length} reviews)</p>
          <p className="flex gap-1 items-center"><Phone size={14} />{me.contact} · {me.designation} · {me.phone}</p><p>{me.email}</p><p className="flex gap-1 items-center"><MapPin size={14} />{me.location}</p><p className="flex gap-1 items-center"><Briefcase size={14} />{me.experience} Experience</p><p className="text-xs text-slate-500">GST: {me.gst}</p></div>
        <div className="grid grid-cols-4 gap-1 bg-brand-100 rounded-2xl p-3"><Stat i={ShoppingCart} n={bought.length} l="Buy Orders" /><Stat i={Tag} n={state.listings.filter(l => l.mine).length} l="Sell Listings" /><Stat i={Recycle} n={`${total} MT`} l="Total Trade" /><Stat i={Leaf} n={`${(total * 0.000375).toFixed(2)} t`} l="CO₂ Saved" /></div>
        <div className="card"><div className="flex justify-between mb-2"><b>Trade History</b><button className="text-sm text-brand-700 font-semibold" onClick={() => setAll(!all)}>{all ? 'Show less' : 'View All'}</button></div>
          <div className="grid grid-cols-2 gap-2 mb-2">{(['bought', 'sold'] as const).map(t => <button key={t} onClick={() => setTab(t)} className={`rounded-full py-2 text-sm font-semibold ${tab === t ? 'bg-brand-900 text-white' : 'bg-brand-50'}`}>What I {t === 'bought' ? 'Bought' : 'Sold'} ({(t === 'bought' ? bought : sold).length})</button>)}</div>
          {shown.map(t => (<div key={t.id} className="flex justify-between items-center border-t border-brand-100 py-2 text-sm"><div><p className="font-semibold">{t.material} – {t.qty} MT</p><p className="text-xs text-slate-500">{tab === 'bought' ? 'from' : 'to'} {t.partner} · {t.date}</p></div>
            {tab === 'bought' && <button className="chip" onClick={() => nav(`/marketplace?q=${encodeURIComponent(t.material)}`)}>Buy Again</button>}</div>))}
          {!shown.length && <p className="text-sm text-slate-500">No trades yet.</p>}</div>
        <div className="card flex justify-between items-center"><div><p className="font-semibold">My Ratings & Reviews</p><p className="text-2xl font-extrabold">{rating ? rating.toFixed(1) : '–'}<span className="text-sm">/5</span> <Stars value={rating} size={14} /></p></div>
          <div className="text-right text-sm"><ShieldCheck className="inline text-brand-700" /> {me.verified ? 'Trusted Industry' : 'Unverified'}<br /><Link className="text-brand-700 font-semibold" to="/feedback">View Details →</Link></div></div>
        <div className="grid grid-cols-2 gap-2"><Link to="/sell" className="btn2">My Sell Listings</Link><Link to="/feedback" className="btn2">Feedback</Link></div>
      </div></Shell>
  )
}
