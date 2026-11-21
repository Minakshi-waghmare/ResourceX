import { useState } from 'react'
import { Shell, Header, Stars, Select } from '../components/ui'
import { useApp } from '../contexts/AppContext'

const AREAS = [['quality', 'Product quality'], ['delivery', 'Delivery experience'], ['comms', 'Communication'], ['behaviour', 'Seller / buyer behaviour']] as const
export default function Feedback() {
  const { state, addFeedback } = useApp()
  const [tab, setTab] = useState<'give' | 'view'>('give')
  const blank = { supplier: '', stars: 0, quality: 0, delivery: 0, comms: 0, behaviour: 0, text: '' }
  const [f, setF] = useState(blank); const [err, setErr] = useState(''); const [ok, setOk] = useState(false)
  const partners = Array.from(new Set(state.listings.filter(l => !l.mine).map(l => l.company)))
  const submit = () => {
    if (!f.supplier) return setErr('Choose who you are rating')
    if (!f.stars) return setErr('Give an overall star rating')
    if (f.text.trim().length < 5) return setErr('Write a short review (min 5 characters)')
    addFeedback(f); setF(blank); setErr(''); setOk(true); setTab('view')
  }
  const mine = state.feedback.filter(x => x.by === state.industry!.name); const others = state.feedback.filter(x => x.by !== state.industry!.name)
  const Row = ({ r }: { r: (typeof state.feedback)[0] }) => (
    <div className="card text-sm"><div className="flex justify-between"><b>{r.supplier}</b><span className="text-xs text-slate-500">{r.date}</span></div><Stars value={r.stars} size={14} /><p>{r.text}</p><p className="text-xs text-slate-500">By {r.by} · Quality {r.quality} · Delivery {r.delivery} · Comms {r.comms} · Behaviour {r.behaviour}</p></div>
  )
  return (
    <Shell w="mid"><Header title="Feedback" />
      <div className="px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-2 mb-4">{(['give', 'view'] as const).map(t => <button key={t} onClick={() => { setTab(t); setOk(false) }} className={`rounded-full py-2 text-sm font-semibold ${tab === t ? 'bg-brand-900 text-white' : 'bg-white border border-brand-200'}`}>{t === 'give' ? 'Give Feedback' : 'View My Feedback'}</button>)}</div>
        {tab === 'give' ? (<div>
          <Select label="Rate your experience with *" options={partners} value={f.supplier} onChange={(e: any) => setF({ ...f, supplier: e.target.value })} />
          <div className="card mb-3 text-center"><p className="font-semibold mb-1">Overall product experience *</p><Stars size={30} value={f.stars} onChange={n => setF({ ...f, stars: n })} /></div>
          <div className="card mb-3 space-y-2">{AREAS.map(([k, label]) => <div key={k} className="flex justify-between items-center text-sm"><span>{label}</span><Stars value={f[k]} onChange={n => setF({ ...f, [k]: n })} /></div>)}</div>
          <textarea className="w-full border border-brand-200 rounded-2xl p-3 text-sm mb-3" rows={3} placeholder="Write your review…" value={f.text} onChange={e => setF({ ...f, text: e.target.value })} />
          {err && <p className="text-sm text-red-500 mb-2">{err}</p>}<button className="btn" onClick={submit}>Share Your Experience</button></div>)
          : (<div className="space-y-3">{ok && <p className="text-brand-700 font-semibold">Thanks! Your feedback was submitted.</p>}
            <p className="font-bold">My feedback ({mine.length})</p>{mine.map(r => <Row key={r.id} r={r} />)}{!mine.length && <p className="text-slate-500 text-sm">You haven’t submitted any feedback yet.</p>}
            <p className="font-bold pt-2">Reviews from other industries</p>{others.map(r => <Row key={r.id} r={r} />)}</div>)}
      </div></Shell>
  )
}
