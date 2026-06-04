import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function InsightPage({ userId, userName }) {
  const navigate = useNavigate()
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(false)
  const [growth, setGrowth] = useState([])
  const [entries, setEntries] = useState([])
  const abortRef = useRef(null)

  useEffect(() => {
    fetch(`/api/growth/${userId}`).then(r => r.json()).then(setGrowth).catch(() => {})
    fetch(`/api/entries/${userId}`).then(r => r.json()).then(setEntries).catch(() => {})
  }, [userId])

  const fetchInsight = async () => {
    setLoading(true)
    setInsight('')
    const ctrl = new AbortController()
    abortRef.current = ctrl
    let acc = ''
    try {
      const res = await fetch('/api/insight/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({ user_id: userId })
      })
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.text) { acc += data.text; setInsight(acc) }
              if (data.done) setLoading(false)
            } catch {}
          }
        }
      }
    } catch { setLoading(false) }
  }

  // Stats
  const projCount = entries.filter(e => e.module === 'projection').length
  const regCount = entries.filter(e => e.module === 'regulation').length
  const totalDays = [...new Set(entries.map(e => e.created_at?.slice(0, 10)))].length

  return (
    <div className="min-h-screen px-6 py-12 relative">
      <div className="orb w-80 h-80 top-0 right-0 opacity-8" style={{ background: 'radial-gradient(circle, #2d2040, transparent)' }} />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <button onClick={() => navigate('/dashboard')} className="text-sm mb-4 block" style={{ color: '#78716c' }}>← 대시보드</button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl" style={{ color: '#b09dcc' }}>◇</span>
            <h1 className="font-display text-4xl font-light" style={{ color: '#f5f0eb' }}>성장 통찰</h1>
          </div>
          <p className="text-sm" style={{ color: '#78716c' }}>{userName}님의 심리 성장 패턴을 분석합니다</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: '투사 인식 세션', val: projCount, color: '#7a957a', icon: '◎' },
            { label: '감정 조절 세션', val: regCount, color: '#c9a84c', icon: '◈' },
            { label: '활동 일수', val: totalDays, color: '#b09dcc', icon: '◇' },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-5 text-center">
              <div className="text-xl mb-1" style={{ color: s.color }}>{s.icon}</div>
              <div className="font-display text-4xl font-light mb-1" style={{ color: s.color }}>{s.val}</div>
              <div className="text-xs" style={{ color: '#78716c' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* AI Insight */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: '#44403c' }}>AI 성장 분석</div>
              <div className="font-display text-xl" style={{ color: '#f5f0eb' }}>Mirror의 통찰</div>
            </div>
            <button
              onClick={fetchInsight}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #4a3570, #2d2040)', color: '#c9bde8', border: '1px solid rgba(176,157,204,0.3)' }}>
              {loading ? '분석 중...' : insight ? '다시 분석' : '분석 시작 →'}
            </button>
          </div>

          {insight ? (
            <div className="prose-chat text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: '#d6d3d1' }}>
              {insight}
              {loading && <span className="typing-cursor" />}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: '#44403c' }}>
              <div className="text-4xl mb-3 animate-pulse-soft">◇</div>
              <p className="text-sm">세션 기록을 분석하여 성장 통찰을 생성합니다</p>
            </div>
          )}
        </motion.div>

        {/* Recent entries */}
        {entries.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6">
            <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: '#44403c' }}>최근 기록</div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {entries.slice(0, 10).map(e => (
                <div key={e.id} className="flex items-start gap-3 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <span className="text-xs font-mono px-2 py-1 rounded flex-shrink-0 mt-0.5"
                    style={{ background: e.module === 'projection' ? 'rgba(122,149,122,0.15)' : 'rgba(201,168,76,0.15)',
                             color: e.module === 'projection' ? '#7a957a' : '#c9a84c' }}>
                    {e.module === 'projection' ? '◎' : '◈'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: '#a8a29e' }}>{e.content}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#57534e' }}>{e.created_at?.slice(0, 10)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
