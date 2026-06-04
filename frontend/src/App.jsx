import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import OnboardPage from './pages/OnboardPage'
import DashboardPage from './pages/DashboardPage'
import ProjectionModule from './pages/ProjectionModule'
import RegulationModule from './pages/RegulationModule'
import InsightPage from './pages/InsightPage'

export default function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem('ms_user_id'))
  const [userName, setUserName] = useState(() => localStorage.getItem('ms_user_name') || '')

  const handleOnboard = (id, name) => {
    localStorage.setItem('ms_user_id', id)
    localStorage.setItem('ms_user_name', name)
    setUserId(id)
    setUserName(name)
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage userId={userId} />} />
      <Route path="/onboard" element={<OnboardPage onComplete={handleOnboard} />} />
      <Route path="/dashboard" element={userId ? <DashboardPage userId={userId} userName={userName} /> : <Navigate to="/onboard" />} />
      <Route path="/projection" element={userId ? <ProjectionModule userId={userId} /> : <Navigate to="/onboard" />} />
      <Route path="/regulation" element={userId ? <RegulationModule userId={userId} /> : <Navigate to="/onboard" />} />
      <Route path="/insight" element={userId ? <InsightPage userId={userId} userName={userName} /> : <Navigate to="/onboard" />} />
    </Routes>
  )
}
