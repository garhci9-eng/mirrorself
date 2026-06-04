import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useChat } from '../hooks/useChat'
import ChatInterface from '../components/ChatInterface'

const TECHNIQUES = [
  { id: 'breathe', icon: '◌', label: '4-7-8 호흡', desc: '4초 흡입 · 7초 유지 · 8초 호출', color: '#7a957a' },
  { id: 'label', icon: '◉', label: '감정 명명', desc: '감정에 이름 붙이기 (affect labeling)', color: '#c9a84c' },
  { id: 'grounding', icon: '◆', label: '5감 그라운딩', desc: '5·4·3·2·1 감각 집중법', color: '#b09dcc' },
  { id: 'reframe', icon: '◈', label: '인지 재구성', desc: '생각의 증거 탐색하기', color: '#a87c7c' },
  { id: 'opposite', icon: '◐', label: '반대 행동', desc: 'DBT 반대행동 활성화', color: '#7ca8a8' },
]

const EMOTION_LEVELS = [
  { val: 1, label: '매우 안정' }, { val: 2, label: '약간 불편' }, { val: 3, label: '불편함' },
  { val: 4, label: '강한 감정' }, { val: 5, label: '압도됨' }
]

const INITIAL_MSG = {
  role: 'assistant',
  content: '안녕하세요. Mirror입니다 ✦\n\n오늘 감정 조절 프로토콜을 함께 진행할게요. 지금 이 순간 느끼는 감정의 강도를 1-5로 먼저 말씀해 주시겠어요?\n\n그런 다음 어떤 상황인지 이야기해주시면, 당신에게 가장 적합한 감정 조절 기술을 함께 찾아보겠습니다.'
}

export default function RegulationModule({ userId }) {
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedTech, setSelectedTech] = useState(null)
  const [breatheActive, setBreatheActive] = useState(false)
  const [breathePhase, setBreathePhase] = useState('inhale')
  const [breatheCount, setBreatheCount] = useState(0)

  const { messages, streaming, streamText, sendMessage } = useChat({
    module: 'regulation', userId, sessionId
  })

  useEffect(() => {
    fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, module: 'regulation' })
    }).then(r => r.json()).then(d => setSessionId(d.session_id)).catch(() => {})
  }, [userId])

  // 호흡 타이머
  useEffect(() => {
    if (!breatheActive) return
    const phases = [
      { phase: 'inhale', label: '흡입', duration: 4000 },
      { phase: 'hold', label: '유지', duration: 7000 },
      { phase: 'exhale', label: '호출', duration: 8000 },
    ]
    let idx = 0
    const run = () => {
      setBreathePhase(phases[idx].phase)
      return setTimeout(() => {
        idx = (idx + 1) % phases.length
        if (idx === 0) setBreatheCount(c => c + 1)
        run()
      }, phases[idx].duration)
    }
    const t = run()
    return () => clearTimeout(t)
  }, [breatheActive])

  const PHASE_LABELS = { inhale: '코로 흡입...', hold: '잠깐 유지...', exhale: '천천히 내쉬기...' }
  const PHASE_SCALE = { inhale: 1.2, hold: 1.15, exhale: 1.0 }

  const allMessages = [INITIAL_MSG, ...messages]

  return (
    <div className="min-h-screen flex flex-col" style={{ maxHeight: '100vh' }}>
      {/* Top bar */}
      <div className="glass border-b px-6 py-4 flex items-center justify-between flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/dashboard')} className="text-sm" style={{ color: '#78716c' }}>← 대시보드</button>
        <div className="flex items-center gap-3">
          <span className="text-2xl" style={{ color: '#c9a84c' }}>◈</span>
          <div>
            <div className="font-display text-base" style={{ color: '#f5f0eb' }}>감정 조절 모듈</div>
            <div className="text-xs font-mono" style={{ color: '#57534e' }}>Emotion Regulation</div>
          </div>
        </div>
        <div />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 border-r p-5 overflow-y-auto hidden md:flex md:flex-col gap-5"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>

          {/* Emotion level */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#44403c' }}>감정 강도</div>
            <div className="flex gap-1.5">
              {EMOTION_LEVELS.map(e => (
                <button key={e.val} onClick={() => setSelectedLevel(e.val)}
                  className="flex-1 py-2 rounded-lg text-xs font-mono transition-all"
                  style={{
                    background: selectedLevel === e.val ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.03)',
                    border: selectedLevel === e.val ? '1px solid rgba(201,168,76,0.4)' : '1px solid transparent',
                    color: selectedLevel === e.val ? '#c9a84c' : '#78716c'
                  }}>
                  {e.val}
                </button>
              ))}
            </div>
            {selectedLevel && <p className="text-xs mt-1.5" style={{ color: '#78716c' }}>{EMOTION_LEVELS[selectedLevel - 1].label}</p>}
          </div>

          {/* Techniques */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#44403c' }}>조절 기술</div>
            <div className="space-y-1.5">
              {TECHNIQUES.map(t => (
                <button key={t.id} onClick={() => { setSelectedTech(t.id); if (t.id === 'breathe') setBreatheActive(false) }}
                  className="w-full text-left px-3 py-2.5 rounded-xl transition-all"
                  style={{
                    background: selectedTech === t.id ? `rgba(122,149,122,0.08)` : 'transparent',
                    border: selectedTech === t.id ? `1px solid ${t.color}44` : '1px solid transparent'
                  }}>
                  <div className="flex items-center gap-2">
                    <span style={{ color: t.color }}>{t.icon}</span>
                    <div>
                      <div className="text-sm" style={{ color: '#d6d3d1' }}>{t.label}</div>
                      <div className="text-xs" style={{ color: '#78716c' }}>{t.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Breathing exercise */}
          {selectedTech === 'breathe' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl text-center"
              style={{ background: 'rgba(122,149,122,0.06)', border: '1px solid rgba(122,149,122,0.15)' }}>
              <div className="text-xs font-mono mb-4" style={{ color: '#567056' }}>4-7-8 호흡법 ({breatheCount}회)</div>
              <motion.div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                animate={{ scale: breatheActive ? PHASE_SCALE[breathePhase] : 1 }}
                transition={{ duration: breathePhase === 'inhale' ? 4 : breathePhase === 'hold' ? 0.2 : 8, ease: 'easeInOut' }}
                style={{ background: 'radial-gradient(circle, rgba(86,112,86,0.6), rgba(86,112,86,0.1))' }}>
                <div className="text-xs font-mono text-center leading-tight" style={{ color: '#a3b5a3' }}>
                  {breatheActive ? (breathePhase === 'inhale' ? '4' : breathePhase === 'hold' ? '7' : '8') : '○'}
                </div>
              </motion.div>
              {breatheActive && <p className="text-xs mb-3" style={{ color: '#a8a29e' }}>{PHASE_LABELS[breathePhase]}</p>}
              <button onClick={() => setBreatheActive(a => !a)}
                className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
                style={{ background: breatheActive ? 'rgba(255,100,100,0.1)' : 'rgba(122,149,122,0.2)', color: breatheActive ? '#f08080' : '#7a957a' }}>
                {breatheActive ? '중지' : '시작'}
              </button>
            </motion.div>
          )}
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={allMessages}
            streaming={streaming}
            streamText={streamText}
            onSend={sendMessage}
            placeholder="지금 느끼는 것을 자유롭게 이야기해주세요..."
          />
        </div>
      </div>
    </div>
  )
}
