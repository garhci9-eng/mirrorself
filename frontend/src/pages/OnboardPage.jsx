import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function OnboardPage({ onComplete }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleStart = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      })
      const data = await res.json()
      onComplete(data.user_id, name.trim())
      navigate('/dashboard')
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="orb w-64 h-64 top-1/4 left-1/3 opacity-10" style={{ background: 'radial-gradient(circle, #567056, transparent)' }} />

      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
        className="glass rounded-3xl p-10 max-w-md w-full relative z-10">

        <div className="text-center mb-8">
          <div className="font-display text-5xl font-light mb-3" style={{ color: '#f5f0eb' }}>
            안녕하세요 <span className="gradient-text italic">✦</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#a8a29e' }}>
            MirrorSelf는 당신의 내면을 안전하게 탐색하는 공간입니다.<br />
            어떻게 불러드릴까요?
          </p>
        </div>

        <div className="mb-6">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            placeholder="이름 또는 닉네임"
            className="w-full px-5 py-4 rounded-2xl text-sm outline-none transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f5f0eb',
              fontFamily: 'DM Sans'
            }}
          />
        </div>

        <button
          onClick={handleStart}
          disabled={!name.trim() || loading}
          className="w-full py-4 rounded-2xl font-medium text-sm tracking-wide transition-all duration-300 disabled:opacity-40 hover:scale-[1.02] active:scale-100"
          style={{ background: 'linear-gradient(135deg, #567056, #3d5c3d)', color: '#e8ede8' }}>
          {loading ? '준비 중...' : '나의 여정 시작하기 →'}
        </button>

        <p className="text-center text-xs mt-6" style={{ color: '#57534e' }}>
          모든 대화는 로컬 데이터베이스에 저장되며<br />외부로 전송되지 않습니다
        </p>
      </motion.div>
    </div>
  )
}
