import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, ShoppingCart, Tag, Leaf, CheckCircle2, ArrowRight } from 'lucide-react'
import { Shell, ListingCard, Logo } from '../components/ui'
import { useApp } from '../contexts/AppContext'

export default function Home() {
  const { state, readNotices } = useApp(); const nav = useNavigate()
  const loc = useLocation() as any
  const [q, setQ] = useState(''); const [open, setOpen] = useState(false); const [modal, setModal] = useState(!!loc.state?.verified)
  const me = state.industry!; const unread = state.notices.filter(n => !n.read).length
  return (
    <Shell>
      <div className="px-4 lg:px-8 pt-5 lg:pt-8">
        <div className="flex justify-between items-center"><Logo size={22} />
          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="relative" onClick={() => { setOpen(!open); if (open) readNotices() }}><Bell />{unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{unread}</span>}</button>
            <Link to="/profile" className="w-9 h-9 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold">{me.contact[0]?.toUpperCase()}</Link></div></div>
        {open && <div className="card mt-2 space-y-1 text-sm">{state.notices.slice(0, 6).map(n => <p key={n.id} className={n.read ? 'text-slate-500' : 'font-semibold'}>• {n.text}</p>)}</div>}
        <h1 className="mt-3 text-xl font-bold">Hello, {me.contact.split(' ')[0]}! 👋</h1><p className="text-sm text-slate-600">Let’s build a circular future together.</p>
        <div className="mt-3 rounded-2xl bg-brand-700 text-white p-4 flex items-center gap-3"><Leaf /><p className="font-semibold">Small changes. Big impact.</p></div>
        <form className="mt-3 flex items-center gap-2 bg-white border border-brand-200 rounded-full px-3" onSubmit={e => { e.preventDefault(); nav(`/marketplace?q=${encodeURIComponent(q)}`) }}>
          <Search size={18} /><input className="flex-1 py-2 outline-none text-sm bg-transparent" placeholder="Search by-product (e.g. Fly Ash)" value={q} onChange={e => setQ(e.target.value)} /></form>
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-brand-200 to-brand-100 p-4"><p className="font-bold text-brand-900 text-lg">Turn Industrial By-products into New Opportunities</p><p className="text-xs text-slate-600">Reduce Waste. Build a Greener Tomorrow.</p></div>
        <h2 className="font-bold mt-4 mb-2">Buy or Sell</h2>
        <div className="grid grid-cols-2 gap-3 lg:max-w-2xl">
          <Link to="/buy" className="card text-center"><ShoppingCart className="mx-auto text-brand-700" /><p className="font-bold">Buy</p><p className="text-xs text-slate-500">Find the by-product you need</p></Link>
          <Link to="/sell" className="card text-center"><Tag className="mx-auto text-brand-700" /><p className="font-bold">Sell</p><p className="text-xs text-slate-500">List your by-product for others</p></Link></div>
        <div className="flex justify-between items-center mt-4 mb-2"><h2 className="font-bold">Available Products</h2><Link to="/marketplace" className="text-sm text-brand-700 font-semibold">View All →</Link></div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{state.listings.slice(0, 6).map(l => <ListingCard key={l.id} l={l} />)}</div>
      </div>
      {modal && (
        <div className="fixed inset-0 z-30 bg-black/50 flex items-center justify-center p-6"><div className="bg-white rounded-3xl p-6 text-center max-w-sm w-full">
          <CheckCircle2 size={64} className="mx-auto text-brand-500" /><h2 className="text-2xl font-extrabold mt-2">Account Verified!</h2><p className="text-slate-600 mb-4">You are now a verified industry on ResourceX.</p>
          <button className="btn" onClick={() => { setModal(false); nav('/marketplace') }}>Explore Marketplace <ArrowRight size={18} /></button></div></div>)}
    </Shell>
  )
}
