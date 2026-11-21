import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Award, MapPin, FileText, Search, Send, IndianRupee, FlaskConical, Phone, ArrowRight } from 'lucide-react'
import { Shell, Header, Field, Select } from '../components/ui'
import { useApp } from '../contexts/AppContext'
import { MATERIALS, GRADES } from '../services/store'
import { supabase } from '../services/supabase'
import { MAX_FILE, OK_TYPES } from '../utils'

export function Buy() {
  const { state, addRequirement } = useApp()
  const [f, setF] = useState({ material: '', qty: '', quality: '', location: '', additional: '' }); const [e, setE] = useState<Record<string, string>>({}); const [done, setDone] = useState(false)
  const set = (k: string) => (ev: any) => setF({ ...f, [k]: ev.target.value })
  const submit = () => {
    const x: Record<string, string> = {}
    if (!f.material) x.material = 'Select an element'; if (!(+f.qty > 0)) x.qty = 'Enter a quantity greater than 0'
    setE(x); if (Object.keys(x).length) return
    addRequirement({ ...f, qty: +f.qty }); setDone(true)
  }
  if (done) {
    const matches = state.listings.filter(l => l.material === f.material && !l.mine).sort((a, b) => a.km - b.km)
    return (
      <Shell w="mid"><Header title="Your Buy Requirement" />
        <div className="px-4 lg:px-8 space-y-3">
          <div className="card bg-brand-100 font-semibold">{f.material} · {f.qty} MT · {f.quality || 'Any grade'} · {f.location || 'Any location'} <span className="chip ml-1">Active</span></div>
          <p className="font-bold">Nearby Industries ({matches.length})</p>
          {matches.map(l => (
            <div key={l.id} className="card text-sm"><div className="flex justify-between"><b>{l.company}</b><a href="tel:+919876543210" className="chip"><Phone size={12} />Contact</a></div>
              <p>{l.km} km · {l.location} · Experience {l.exp} · Available {l.available} MT</p><p className="font-bold text-brand-700">₹{l.price} / MT</p></div>))}
          {!matches.length && <p className="text-slate-500">No suppliers for this material yet. Your requirement is visible to all industries.</p>}
          <button className="btn2" onClick={() => setDone(false)}>Post another requirement</button>
        </div></Shell>
    )
  }
  return (
    <Shell w="narrow"><Header title="Buy By-Product" />
      <div className="px-4 lg:px-8"><p className="font-bold text-center text-lg text-brand-900">What do you want to buy?</p><p className="text-center text-sm text-slate-600 mb-4">Tell us your requirements and we’ll help you find the best matches.</p>
        <Select label="Select Element *" options={MATERIALS} value={f.material} onChange={set('material')} error={e.material} />
        <Field label="Required Quantity (MT) *" icon={Package} type="number" min="0" value={f.qty} onChange={set('qty')} error={e.qty} placeholder="Enter quantity (e.g. 500 MT)" />
        <Select label="Quality Required" icon={Award} options={GRADES} value={f.quality} onChange={set('quality')} />
        <Field label="Preferred Location" icon={MapPin} value={f.location} onChange={set('location')} placeholder="e.g. Pune, MH" />
        <Field area label="Additional Requirements (Optional)" icon={FileText} value={f.additional} onChange={set('additional')} />
        <button className="btn" onClick={submit}><Search size={18} />Post Requirement</button></div></Shell>
  )
}

function FileBox({ label, file, onFile, error }: { label: string; file: File | null; onFile: (f: File | null) => void; error?: string }) {
  return (
    <label className="block mb-3"><span className="text-xs text-slate-600">{label}</span>
      <div className="border border-dashed border-brand-500 rounded-2xl p-3 flex items-center gap-2 bg-white text-sm"><FlaskConical className="text-brand-700" /><span className="flex-1 truncate">{file ? file.name : 'PDF, JPG or PNG (Max 5 MB)'}</span><span className="chip">Choose File</span></div>
      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={ev => onFile(ev.target.files?.[0] ?? null)} />{error && <span className="text-xs text-red-500">{error}</span>}</label>
  )
}
export function Sell() {
  const { state, addListing } = useApp(); const nav = useNavigate()
  const [f, setF] = useState({ material: '', qty: '', price: '', location: '', grade: 'Class F', note: '' })
  const [cert, setCert] = useState<File | null>(null); const [rep, setRep] = useState<File | null>(null); const [e, setE] = useState<Record<string, string>>({}); const [busy, setBusy] = useState(false)
  const set = (k: string) => (ev: any) => setF({ ...f, [k]: ev.target.value })
  const chk = (file: File | null) => (file && (!OK_TYPES.includes(file.type) ? 'Only PDF, JPG or PNG allowed' : file.size > MAX_FILE ? 'File exceeds 5 MB' : '')) || ''
  const submit = async () => {
    const x: Record<string, string> = {}
    if (!f.material) x.material = 'Select a product'; if (!(+f.qty > 0)) x.qty = 'Enter a quantity greater than 0'; if (!f.location.trim()) x.location = 'Required'
    if (f.price && !(+f.price > 0)) x.price = 'Invalid price'; if (chk(cert)) x.cert = chk(cert); if (chk(rep)) x.rep = chk(rep)
    setE(x); if (Object.keys(x).length) return
    setBusy(true)
    try {
      const docs: string[] = []
      for (const file of [cert, rep]) if (file) {
        if (supabase) {
          const { data: u } = await supabase.auth.getUser(); const path = `${u.user?.id}/${Date.now()}_${file.name}`
          const { error } = await supabase.storage.from('lab-documents').upload(path, file); if (error) throw error; docs.push(path)
        } else docs.push(file.name)
      }
      await addListing({ material: f.material, qty: +f.qty, price: +f.price || 0, location: f.location, grade: f.grade, note: f.note, docs })
      nav('/marketplace')
    } catch (er: any) { setE({ form: er.message }) } finally { setBusy(false) }
  }
  return (
    <Shell w="narrow"><Header title="Sell By-Product" />
      <div className="px-4 lg:px-8"><p className="text-sm text-slate-600 mb-3">List your by-product and connect with interested buyers.</p>
        <Select label="Select Product *" options={MATERIALS} value={f.material} onChange={set('material')} error={e.material} />
        <Field label="Available Quantity (MT) *" icon={Package} type="number" min="0" value={f.qty} onChange={set('qty')} error={e.qty} />
        <Field label="Expected Price per MT (Optional)" icon={IndianRupee} type="number" min="0" value={f.price} onChange={set('price')} error={e.price} />
        <Select label="Quality / Grade" options={GRADES} value={f.grade} onChange={set('grade')} />
        <Field label="Location *" icon={MapPin} value={f.location} onChange={set('location')} error={e.location} placeholder="e.g. Pune, MH" />
        <FileBox label="Upload Laboratory Testing Certificate" file={cert} onFile={setCert} error={e.cert} />
        <FileBox label="Upload Quality Analysis Report" file={rep} onFile={setRep} error={e.rep} />
        <Field area label="Additional Details (Optional)" icon={FileText} value={f.note} onChange={set('note')} />
        {e.form && <p className="text-sm text-red-500 mb-2">{e.form}</p>}
        <button className="btn" disabled={busy} onClick={submit}><Send size={18} />{busy ? 'Listing…' : 'List for Sale'}<ArrowRight size={16} /></button>
        <p className="text-[11px] text-slate-500 mt-2">{state.listings.filter(l => l.mine).length} of your listings are live.</p></div></Shell>
  )
}
