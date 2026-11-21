import type { AppState, Industry } from '../types'
export const MATERIALS = ['Fly Ash', 'Gypsum', 'GGBS', 'Slag', 'Bottom Ash', 'Red Mud', 'Limestone', 'Coal', 'Mill Scale']
export const INDUSTRY_TYPES = ['Manufacturing', 'Power Generation', 'Chemical', 'Steel', 'Mining', 'Other']
export const MFG_TYPES = ['Cement', 'Steel', 'Chemical', 'Paper', 'Textile', 'Fertilizer', 'Other']
export const GRADES = ['Class F', 'Class C', 'Grade A', 'Grade B', 'Standard']
export const PARAMS: Record<string, [string, string][]> = {
  'Fly Ash': [['Moisture Content', '0.5% – 1.0%'], ['SiO₂', '52% – 58%'], ['Loss on Ignition', '2% – 5%'], ['SO₃', '0.5% – 1.5%'], ['MgO', '1% – 2%'], ['Chloride Content', '0.01% – 0.05%']],
  default: [['Moisture Content', '1% – 3%'], ['Purity', '85% – 95%'], ['Loss on Ignition', '2% – 6%'], ['Chloride Content', '0.01% – 0.08%']]
}
export const DEMO: Industry = { name: 'ABC Industries Ltd.', gst: '27ABCDE1234F1Z5', type: 'Manufacturing', mfg: 'Cement', address: 'Plot No. 12, MIDC, Chakan, Pune, Maharashtra - 410501', contact: 'Vaishnavi Vitkar', designation: 'Process Engineer', email: 'demo@resourcex.in', phone: '+91 98765 43210', materials: ['Limestone', 'Gypsum', 'Coal'], location: 'MIDC, Chakan, Pune, Maharashtra 410501', experience: '8+ Years', verified: true }
const L = (id: string, material: string, company: string, km: number, exp: string, available: number, price: number, rating: number, reviews: number, grade = 'Class F', suit = 92) =>
  ({ id, material, qty: available, grade, price, location: 'Pune, MH', company, km, exp, available, rating, reviews, verified: true, suit })
const R = (id: string, company: string, km: number, qty: number, quality: string, additional: string, remarks: string, posted: string) =>
  ({ id, kind: 'buy' as const, company, location: 'Pune, Maharashtra', km, material: 'Fly Ash', qty, quality, additional, remarks, posted, status: 'pending' as const })
export const SEED: AppState = {
  industry: null,
  listings: [
    L('l1', 'Fly Ash', 'ABC Industries Ltd.', 2.5, '8+ years', 600, 850, 4.5, 120), L('l2', 'Fly Ash', 'Shree Cement Works', 4.1, '8+ years', 800, 820, 4.3, 86, 'Class F', 88),
    L('l3', 'Fly Ash', 'Pune Power & Industrial Ltd.', 5.3, '10+ years', 1000, 800, 4.6, 140, 'Class C', 90), L('l4', 'Gypsum', 'Pune Power & Industrial Ltd.', 5.3, '10+ years', 400, 1200, 4.4, 64, 'Grade A', 85),
    L('l5', 'GGBS', 'Shree Cement Works', 4.1, '8+ years', 300, 2100, 4.2, 51, 'Grade A', 87), L('l6', 'Slag', 'ABC Industries Ltd.', 2.5, '8+ years', 700, 950, 4.5, 120, 'Grade B', 80)
  ],
  requests: [
    R('r1', 'ABC Industries Ltd.', 2.5, 500, 'Class F', 'Low chloride content preferred', 'For our cement plant', '2 hrs ago'),
    R('r2', 'Shree Cement Works', 4.1, 800, 'Class F', 'Timely delivery required', 'Urgent requirement', '4 hrs ago'),
    R('r3', 'Pune Power & Industrial Ltd.', 5.3, 1000, 'Class F', 'As per specification', 'Regular monthly demand', '1 day ago'),
    { id: 'r4', kind: 'sell', company: 'Shree Cement Works', location: 'Pune, Maharashtra', km: 4.1, material: 'Gypsum', qty: 200, quality: 'Grade A', additional: 'Need lab report', remarks: 'Interested in your listing', posted: '6 hrs ago', status: 'pending' }
  ],
  feedback: [
    { id: 'f1', by: 'Shree Cement Works', supplier: 'ABC Industries Ltd.', stars: 5, quality: 5, delivery: 4, comms: 5, behaviour: 5, text: 'Consistent quality and on-time delivery.', date: '2026-08-12' },
    { id: 'f2', by: 'Pune Power & Industrial Ltd.', supplier: 'ABC Industries Ltd.', stars: 4, quality: 4, delivery: 4, comms: 4, behaviour: 5, text: 'Good fly ash, documentation was complete.', date: '2026-06-03' }
  ],
  trades: [
    { id: 't1', material: 'Fly Ash', qty: 500, partner: 'Shree Cement Works', date: '2026-06-16', location: 'Pune, MH', type: 'bought' },
    { id: 't2', material: 'Gypsum', qty: 200, partner: 'Pune Power & Industrial Ltd.', date: '2026-04-10', location: 'Pune, MH', type: 'bought' },
    { id: 't3', material: 'GGBS', qty: 300, partner: 'ABC Industries Ltd.', date: '2026-01-22', location: 'Pune, MH', type: 'bought' },
    { id: 't4', material: 'Slag', qty: 450, partner: 'Shree Cement Works', date: '2026-05-02', location: 'Pune, MH', type: 'sold' }
  ],
  notices: [{ id: 'n1', text: 'Welcome to ResourceX! Complete your first listing.', read: false }, { id: 'n2', text: 'New Fly Ash listing near you in Pune.', read: false }]
}
const KEY = 'rx_state'
export const load = (): AppState => { try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch { /* ignore */ } return SEED }
export const save = (s: AppState) => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ } }
