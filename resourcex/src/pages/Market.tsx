import { useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Phone, Mail, MessageCircle, FlaskConical, MapPin, Briefcase, Package, Send } from 'lucide-react'
import { Shell, Header, ListingCard, Stars, Select, Field } from '../components/ui'
import { useApp } from '../contexts/AppContext'
import { MATERIALS, GRADES, PARAMS } from '../services/store'

export function Marketplace() {
  const { state } = useApp(); const [sp] = useSearchParams()
  const [q, setQ] = useState(sp.get('q') || ''); const [mat, setMat] = useState(''); const [grade, setGrade] = useState(''); const [minQty, setMinQty] = useState(''); const [loc, setLoc] = useState(''); const [show, setShow] = useState(false)
  const list = useMemo(() => state.listings.filter(l =>
    (!q || `${l.material} ${l.company}`.toLowerCase().includes(q.toLowerCase())) && (!mat || l.material === mat) && (!grade || l.grade === grade) &&
    (!minQty || l.available >= +minQty) && (!loc || l.location.toLowerCase().includes(loc.toLowerCase()))), [state.listings, q, mat, grade, minQty, loc])
  return (
    <Shell>
      <Header title="Marketplace" />
      <div className="px-4 lg:px-8">
        <div className="flex gap-2 lg:max-w-xl"><div className="flex-1 flex items-center gap-2 bg-white border border-brand-200 rounded-full px-3"><Search size={18} /><input className="flex-1 py-2 text-sm outline-none bg-transparent" placeholder="Search products or suppliers" value={q} onChange={e => setQ(e.target.value)} /></div>
          <button aria-label="Filters" className="w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center" onClick={() => setShow(!show)}><SlidersHorizontal size={18} /></button></div>
        {show && <div className="card mt-3"><Select label="Material" options={MATERIALS} value={mat} onChange={(e: any) => setMat(e.target.value)} /><Select label="Quality / Grade" options={GRADES} value={grade} onChange={(e: any) => setGrade(e.target.value)} />
          <Field label="Minimum quantity (MT)" type="number" value={minQty} onChange={(e: any) => setMinQty(e.target.value)} /><Field label="Location" value={loc} onChange={(e: any) => setLoc(e.target.value)} />
          <button className="btn2" onClick={() => { setMat(''); setGrade(''); setMinQty(''); setLoc(''); setQ('') }}>Clear filters</button></div>}
        <p className="text-sm text-slate-500 my-3">{list.length} listing(s) found</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{list.map(l => <ListingCard key={l.id} l={l} />)}{!list.length && <p className="text-center text-slate-500 py-10">No products match your filters.</p>}</div>
      </div>
    </Shell>
  )
}

export function Supplier() {
  const { id } = useParams(); const { state, notify } = useApp()
  const l = state.listings.find(x => x.id === id)
  const [tab, setTab] = useState<'d' | 's'>('d'); const [chat, setChat] = useState(false); const [msgs, setMsgs] = useState<string[]>([]); const [m, setM] = useState(''); const [toast, setToast] = useState('')
  if (!l) return <Shell><Header title="Supplier" /><p className="p-6">Listing not found.</p></Shell>
  const transport = Math.round(l.km * 100) || 0, handling = 300, total = l.price + transport + handling
  const reviews = state.feedback.filter(f => f.supplier === l.company)
  const params = PARAMS[l.material] || PARAMS.default
  const C = 2 * Math.PI * 40
  return (
    <Shell w="mid">
      <Header title={l.company} />
      <div className="px-4 lg:px-8 space-y-3">
        <div className="card text-sm"><p className="font-bold text-lg">{l.company}</p><p className="flex gap-1 items-center"><MapPin size={14} />{l.location} · {l.km} km</p>
          <p className="flex gap-2 items-center"><Stars value={l.rating} size={14} /> {l.rating} ({l.reviews}+ Reviews)</p>
          <p className="flex gap-1 items-center"><Briefcase size={14} />Experience: {l.exp}</p><p className="flex gap-1 items-center"><Package size={14} />Available: {l.available} MT · {l.material} ({l.grade})</p></div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <a className="btn !py-2" href="tel:+919876543210"><Phone size={14} />Contact</a><a className="btn2 !py-2" href={`mailto:contact@${l.company.split(' ')[0].toLowerCase()}.com`}><Mail size={14} />Email</a>
          <button className="btn2 !py-2" onClick={() => setChat(true)}><MessageCircle size={14} />Chat</button></div>
        <div className="card text-sm"><p className="font-semibold mb-1">Estimated Price for Your Requirement</p>
          <p>Material ₹{l.price}/MT + Transport ₹{transport}/MT + Handling ₹{handling}/MT = <b className="text-brand-700">₹{total}/MT (approx.)</b></p><p className="text-[11px] text-slate-500">Price may vary based on final quantity and delivery location.</p></div>
        <div className="grid grid-cols-2 gap-2">{(['d', 's'] as const).map(t => <button key={t} onClick={() => setTab(t)} className={`rounded-xl py-2 text-sm font-semibold ${tab === t ? 'bg-brand-900 text-white' : 'bg-white border border-brand-200'}`}>{t === 'd' ? `${l.material} Details` : 'Suitability Analysis'}</button>)}</div>
        {tab === 'd' ? <div className="card text-sm"><p className="font-semibold flex gap-2 mb-2"><FlaskConical size={18} />Quality Parameters</p>{params.map(([k, v]) => <p key={k} className="flex justify-between py-0.5"><span>{k}</span><span>{v}</span></p>)}</div> :
          <div className="card text-center text-sm"><svg width="110" height="110" viewBox="0 0 100 100" className="mx-auto -rotate-90"><circle cx="50" cy="50" r="40" fill="none" stroke="#dcf3e6" strokeWidth="10" /><circle cx="50" cy="50" r="40" fill="none" stroke="#22a35a" strokeWidth="10" strokeDasharray={C} strokeDashoffset={C * (1 - l.suit / 100)} strokeLinecap="round" /></svg>
            <p className="text-2xl font-extrabold -mt-20 mb-12">{l.suit}%</p><p className="font-semibold">Suitable for Your Process</p><p className="text-slate-500">Ideal range: ≥ 85%</p>
            <p className="mt-2 bg-brand-50 rounded-xl p-2 text-left">This industry’s {l.material} meets {l.suit}% of your process requirements{l.suit >= 85 ? ', making it highly suitable.' : '; review parameters before ordering.'}</p></div>}
        <div className="card text-sm"><p className="font-semibold mb-1">Sustainability</p><p>Reusing {l.available} MT of {l.material} avoids landfill and saves about {(l.available * 0.375 / 1000).toFixed(2)} t CO₂ (estimate).</p></div>
        <div className="card text-sm"><p className="font-semibold mb-1">Reviews</p>{reviews.length ? reviews.map(r => <div key={r.id} className="border-t border-brand-100 py-1"><Stars value={r.stars} size={12} /><p>{r.text}</p><p className="text-xs text-slate-500">— {r.by}</p></div>) : <p className="text-slate-500">No reviews yet.</p>}</div>
        <button className="btn" onClick={() => { notify(`Sample order requested from ${l.company}.`); setToast('Sample order request sent!'); setTimeout(() => setToast(''), 2500) }}><FlaskConical size={18} />Request Sample Order</button>
        {toast && <p className="text-center text-brand-700 font-semibold">{toast}</p>}
      </div>
      {chat && <div className="fixed inset-0 z-30 bg-black/50 flex items-end justify-center"><div className="bg-white w-full max-w-md rounded-t-3xl p-4 h-96 flex flex-col">
        <div className="flex justify-between mb-2"><b>Chat with {l.company}</b><button onClick={() => setChat(false)}>✕</button></div>
        <div className="flex-1 overflow-y-auto text-sm space-y-1">{msgs.map((x, i) => <p key={i} className={i % 2 ? 'text-slate-500' : 'text-right text-brand-700'}>{x}</p>)}</div>
        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (!m.trim()) return; setMsgs([...msgs, m, 'Thanks! We will get back to you shortly.']); setM('') }}>
          <input className="flex-1 border border-brand-200 rounded-full px-3 py-2 text-sm" value={m} onChange={e => setM(e.target.value)} placeholder="Type a message" /><button className="w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center" aria-label="Send"><Send size={16} /></button></form></div></div>}
    </Shell>
  )
}
