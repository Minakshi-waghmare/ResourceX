import { Navigate, Route, Routes } from 'react-router-dom'
import { ReactNode } from 'react'
import { useApp } from './contexts/AppContext'
import { Welcome, Login, Register, Forgot } from './pages/Auth'
import Home from './pages/Home'
import { Marketplace, Supplier } from './pages/Market'
import { Buy, Sell } from './pages/Forms'
import Requests from './pages/Requests'
import Feedback from './pages/Feedback'
import Profile from './pages/Profile'

const Guard = ({ children }: { children: ReactNode }) => {
  const { state } = useApp()
  return state.industry ? <>{children}</> : <Navigate to="/" replace />
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/home" element={<Guard><Home /></Guard>} />
      <Route path="/marketplace" element={<Guard><Marketplace /></Guard>} />
      <Route path="/supplier/:id" element={<Guard><Supplier /></Guard>} />
      <Route path="/buy" element={<Guard><Buy /></Guard>} />
      <Route path="/sell" element={<Guard><Sell /></Guard>} />
      <Route path="/requests" element={<Guard><Requests /></Guard>} />
      <Route path="/feedback" element={<Guard><Feedback /></Guard>} />
      <Route path="/profile" element={<Guard><Profile /></Guard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
