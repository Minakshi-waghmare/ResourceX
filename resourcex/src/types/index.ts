export type Status = 'pending' | 'accepted' | 'rejected'
export interface Industry { name: string; gst: string; type: string; mfg: string; address: string; contact: string; designation: string; email: string; phone: string; materials: string[]; location: string; experience: string; verified: boolean }
export interface Listing { id: string; material: string; qty: number; grade: string; price: number; location: string; company: string; km: number; exp: string; available: number; rating: number; reviews: number; verified: boolean; mine?: boolean; suit: number; note?: string; docs?: string[] }
export interface Req { id: string; kind: 'buy' | 'sell'; company: string; location: string; km: number; material: string; qty: number; quality: string; additional: string; remarks: string; posted: string; status: Status }
export interface Feedback { id: string; by: string; supplier: string; stars: number; quality: number; delivery: number; comms: number; behaviour: number; text: string; date: string }
export interface Trade { id: string; material: string; qty: number; partner: string; date: string; location: string; type: 'bought' | 'sold' }
export interface Notice { id: string; text: string; read: boolean }
export interface AppState { industry: Industry | null; listings: Listing[]; requests: Req[]; feedback: Feedback[]; trades: Trade[]; notices: Notice[] }
