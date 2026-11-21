import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Building2, FileText, Factory, Settings, MapPin, User, Briefcase, Phone, X, ChevronLeft } from 'lucide-react'
import { Shell, Logo, Field, Select, LocationPicker } from '../components/ui'
import { useApp } from '../contexts/AppContext'
import { INDUSTRY_TYPES, MFG_TYPES, MATERIALS } from '../services/store'
import * as auth from '../services/auth'
import { isEmail, isGST, isPhone } from '../utils'

export function Welcome() {
  return (
    <Shell nav={false} w="narrow">
      <div className="p-6 lg:p-10 pt-10">
        <Logo size={40} />
        <h1 className="mt-10 text-5xl font-extrabold text-brand-900 leading-tight">Waste is a <span className="text-brand-500">Resource.</span></h1>
        <p className="mt-4 text-xl font-semibold text-brand-900">Find it. Match it. Exchange it.</p>
        <p className="mt-2 text-slate-600">Join industries in building a circular economy.</p>
        <div className="my-8 h-44 rounded-3xl bg-gradient-to-br from-brand-200 to-brand-500 flex items-center justify-center text-white"><Factory size={80} /></div>
        <div className="space-y-3"><Link to="/login" className="btn">Login</Link><Link to="/register" className="btn2">Create Account</Link></div>
        <p className="text-center text-sm mt-6 text-slate-600">A smarter, greener tomorrow ♻️</p>
      </div>
    </Shell>
  )
}

export function Login() {
  const { signIn } = useApp(); const nav = useNavigate()
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [show, setShow] = useState(false)
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [remember, setRemember] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('')
    if (!isEmail(email)) return setErr('Enter a valid email address')
    if (pw.length < 6) return setErr('Password must be at least 6 characters')
    setBusy(true)
    try { signIn(await auth.login(email, pw)); nav('/home') } catch (x: any) { setErr(x.message) } finally { setBusy(false) }
  }
  const social = async (p: 'google' | 'azure') => { const i = await auth.socialLogin(p); if (i) { signIn(i); nav('/home') } }
  return (
    <Shell nav={false} w="narrow">
      <form onSubmit={submit} className="p-6 lg:p-10 pt-10">
        <div className="flex justify-center"><Logo size={34} /></div>
        <h1 className="mt-8 text-3xl font-extrabold">Welcome Back!</h1>
        <p className="text-slate-600 mb-6">Login to continue your journey</p>
        <Field label="Email Address" icon={Mail} type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
        <div className="relative"><Field label="Password" icon={Lock} type={show ? 'text' : 'password'} value={pw} onChange={(e: any) => setPw(e.target.value)} />
          <button type="button" aria-label="Toggle password" className="absolute right-3 top-7 text-slate-500" onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
        <div className="flex justify-between text-sm mb-4"><label className="flex gap-2"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />Remember Me</label><Link to="/forgot" className="text-brand-700 font-semibold">Forgot Password?</Link></div>
        {err && <p className="text-sm text-red-500 mb-2">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Signing in…' : 'Login'} <ArrowRight size={18} /></button>
        {auth.demoMode && <p className="text-xs text-center text-slate-500 mt-2">Demo mode · demo@resourcex.in / demo1234</p>}
        <p className="text-center text-sm text-slate-500 my-3">or</p>
        <button type="button" className="btn2 !border-slate-200 !text-slate-800 mb-2" onClick={() => social('google')}>Continue with Google</button>
        <button type="button" className="btn2 !border-slate-200 !text-slate-800" onClick={() => social('azure')}>Continue with Microsoft</button>
        <p className="text-center text-sm mt-6">Don’t have an account? <Link to="/register" className="text-brand-700 font-bold">Sign Up</Link></p>
      </form>
    </Shell>
  )
}

export function Forgot() {
  const [email, setEmail] = useState(''); const [msg, setMsg] = useState(''); const [err, setErr] = useState('')
  const go = async (e: React.FormEvent) => { e.preventDefault(); setErr(''); if (!isEmail(email)) return setErr('Enter a valid email')
    try { await auth.resetPassword(email); setMsg(auth.demoMode ? 'Demo mode: no email is sent. Configure Supabase to enable resets.' : 'Reset link sent. Check your inbox.') } catch (x: any) { setErr(x.message) } }
  return (
    <Shell nav={false} w="narrow"><form onSubmit={go} className="p-6 lg:p-10 pt-10">
      <Link to="/login"><ChevronLeft /></Link><h1 className="text-2xl font-extrabold my-4">Forgot password</h1>
      <Field label="Registered email" icon={Mail} value={email} onChange={(e: any) => setEmail(e.target.value)} error={err} />
      <button className="btn">Send reset link</button>{msg && <p className="text-sm text-brand-700 mt-3">{msg}</p>}
    </form></Shell>
  )
}

export function Register() {
  const { signIn } = useApp(); const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [f, setF] = useState({ name: '', gst: '', type: 'Manufacturing', mfg: 'Cement', address: '', contact: '', designation: '', email: '', phone: '', location: '', password: '', confirm: '' })
  const [mats, setMats] = useState<string[]>([]); const [e, setE] = useState<Record<string, string>>({}); const [top, setTop] = useState(''); const [busy, setBusy] = useState(false)
  const set = (k: string) => (ev: any) => setF({ ...f, [k]: ev.target.value })
  const next = () => {
    const x: Record<string, string> = {}
    if (!f.name.trim()) x.name = 'Required'
    if (!isGST(f.gst)) x.gst = 'Enter a valid 15-character GST number'
    if (!f.type) x.type = 'Required'; if (!f.mfg) x.mfg = 'Required'
    if (!f.address.trim()) x.address = 'Required'; if (!f.contact.trim()) x.contact = 'Required'; if (!f.designation.trim()) x.designation = 'Required'
    if (!isEmail(f.email)) x.email = 'Valid email required'; if (!isPhone(f.phone)) x.phone = 'Valid phone required'
    if (!mats.length) x.mats = 'Pick at least one raw material'; if (!f.location.trim()) x.location = 'Choose your factory location'
    setE(x); if (!Object.keys(x).length) { setStep(2); window.scrollTo(0, 0) }
  }
  const finish = async () => {
    const x: Record<string, string> = {}
    if (f.password.length < 6) x.password = 'Minimum 6 characters'; if (f.password !== f.confirm) x.confirm = 'Passwords do not match'
    setE(x); if (Object.keys(x).length) return
    setBusy(true); setTop('')
    try {
      const ind = await auth.register({ name: f.name, gst: f.gst.toUpperCase(), type: f.type, mfg: f.mfg, address: f.address, contact: f.contact, designation: f.designation, email: f.email, phone: f.phone, materials: mats, location: f.location, experience: 'New', verified: true }, f.password)
      signIn(ind); nav('/home', { state: { verified: true } })
    } catch (er: any) { setTop(er.message) } finally { setBusy(false) }
  }
  return (
    <Shell nav={false} w="narrow">
      <div className="p-5 lg:p-10 pt-6">
        <button onClick={() => (step === 1 ? nav(-1) : setStep(1))}><ChevronLeft /></button>
        {step === 1 ? (<>
          <h1 className="text-2xl font-extrabold text-brand-900">Industry Registration</h1><p className="text-slate-600 mb-4">Tell us about your organization</p>
          <Field label="Company Name *" icon={Building2} value={f.name} onChange={set('name')} error={e.name} />
          <Field label="GST Number *" icon={FileText} value={f.gst} onChange={set('gst')} error={e.gst} placeholder="27ABCDE1234F1Z5" />
          <Select label="Industry Type *" icon={Factory} options={INDUSTRY_TYPES} value={f.type} onChange={set('type')} error={e.type} />
          <Select label="Manufacturing Type *" icon={Settings} options={MFG_TYPES} value={f.mfg} onChange={set('mfg')} error={e.mfg} />
          <Field area label="Business Address *" icon={MapPin} value={f.address} onChange={set('address')} error={e.address} />
          <Field label="Contact Person *" icon={User} value={f.contact} onChange={set('contact')} error={e.contact} />
          <Field label="Designation *" icon={Briefcase} value={f.designation} onChange={set('designation')} error={e.designation} />
          <Field label="Official Email *" icon={Mail} type="email" value={f.email} onChange={set('email')} error={e.email} />
          <Field label="Phone Number *" icon={Phone} value={f.phone} onChange={set('phone')} error={e.phone} />
          <div className="card mb-3"><p className="font-semibold text-brand-900">Main Raw Material Used</p>
            <div className="flex flex-wrap gap-2 mt-2">{MATERIALS.map(m => (
              <button type="button" key={m} onClick={() => setMats(mats.includes(m) ? mats.filter(x => x !== m) : [...mats, m])} className={`chip ${mats.includes(m) ? '!bg-brand-900 !text-white' : ''}`}>{m}{mats.includes(m) && <X size={12} />}</button>))}</div>
            {e.mats && <p className="text-xs text-red-500 mt-1">{e.mats}</p>}</div>
          <LocationPicker value={f.location} onChange={v => setF({ ...f, location: v })} error={e.location} />
          <button className="btn" onClick={next}>Next <ArrowRight size={18} /></button>
        </>) : (<>
          <h1 className="text-2xl font-extrabold text-brand-900 mb-4">Create your login</h1>
          <Field label="Email" icon={Mail} value={f.email} readOnly />
          <Field label="Password *" icon={Lock} type="password" value={f.password} onChange={set('password')} error={e.password} />
          <Field label="Confirm Password *" icon={Lock} type="password" value={f.confirm} onChange={set('confirm')} error={e.confirm} />
          {top && <p className="text-sm text-red-500 mb-2">{top}</p>}
          <button className="btn" disabled={busy} onClick={finish}>{busy ? 'Creating…' : 'Create Account'}</button>
        </>)}
      </div>
    </Shell>
  )
}
