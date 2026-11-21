import { useState } from 'react'
import { X, Check, MapPin, Package, Award, Clock } from 'lucide-react'
import { Shell, Header } from '../components/ui'
import { useApp } from '../contexts/AppContext'
import type { Status } from '../types'

export default function Requests() {
  const { state, setStatus } = useApp()
  const [kind, setKind] = useState<'buy' | 'sell'>('buy'); const [flt, setFlt] = useState<'all' | Status>('all'); const [open, setOpen] = useState('')
  const all = state.requests.filter(r => r.kind === kind); const list = all.filter(r => flt === 'all' || r.status === flt)
  return (
    <Shell><Header title="Requests" />
      <div className="px-4 lg:px-8">
        <p className="text-sm text-slate-600 mb-2">Manage your buy and sell requests</p>
        <div className="grid grid-cols-2 gap-2 mb-3 lg:max-w-md">{(['buy', 'sell'] as const).map(k => <button key={k} onClick={() => setKind(k)} className={`rounded-full py-2 text-sm font-semibold ${kind === k ? 'bg-brand-900 text-white' : 'bg-white border border-brand-200'}`}>{k === 'buy' ? 'Buy' : 'Sell'} Requests ({state.requests.filter(r => r.kind === k).length})</button>)}</div>
        <div className="flex gap-2 mb-3 overflow-x-auto">{(['all', 'pending', 'accepted', 'rejected'] as const).map(s => <button key={s} onClick={() => setFlt(s)} className={`chip capitalize ${flt === s ? '!bg-brand-900 !text-white' : ''}`}>{s}</button>)}</div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{list.map(r => (
          <div key={r.id} className="card text-sm">
            <div className="flex justify-between"><b>{r.company}</b><span className={`chip capitalize ${r.status === 'rejected' ? '!bg-red-100 !text-red-600' : ''}`}>{r.status}</span></div>
            <p className="flex gap-1 items-center text-slate-600"><MapPin size={13} />{r.location} · {r.km} km</p>
            <div className="flex gap-2 my-1"><span className="chip"><Package size={12} />{r.material}: {r.qty} MT</span><span className="chip"><Award size={12} />{r.quality}</span></div>
            <p>+ Additional: {r.additional || '—'}</p><p className="bg-brand-50 rounded-lg px-2 py-1 my-1">Remarks: {r.remarks}</p>
            <p className="text-xs text-slate-500 flex gap-1 items-center"><Clock size={12} />Posted {r.posted}</p>
            {open === r.id && <div className="mt-2 border-t border-brand-100 pt-2 text-xs"><p><b>{kind === 'buy' ? 'Buyer' : 'Seller'}:</b> {r.company}</p><p><b>Material:</b> {r.material} · {r.qty} MT · {r.quality}</p><p><b>Location:</b> {r.location}</p></div>}
            <button className="text-xs text-brand-700 font-semibold mt-1" onClick={() => setOpen(open === r.id ? '' : r.id)}>{open === r.id ? 'Hide details' : 'View details'}</button>
            {r.status === 'pending' && r.remarks !== 'Posted by you' && <div className="grid grid-cols-2 gap-2 mt-2"><button className="btn2 !py-2" onClick={() => setStatus(r.id, 'rejected')}><X size={14} />Reject</button><button className="btn !py-2" onClick={() => setStatus(r.id, 'accepted')}><Check size={14} />Accept</button></div>}
          </div>))}{!list.length && <p className="text-center text-slate-500 py-8">No requests here.</p>}</div>
      </div></Shell>
  )
}
