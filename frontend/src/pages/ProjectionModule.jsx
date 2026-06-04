import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useChat } from '../hooks/useChat'
import ChatInterface from '../components/ChatInterface'

const STEPS = [
  { key: 'trigger', label: '01 · 상황 파악', title: '어떤 상황이었나요?', prompt: '최근 누군가에 대해 강한 감정을 느꼈던 상황을 자유롭게 이야기해주세요. (예: 짜증, 불쾌함, 분노, 실망 등)' },
  { key: 'emotion', label: '02 · 감정 탐색', title: '그때 어떤 감정이었나요?', prompt: '그 순간 내 몸과 마음에서 무엇을 느꼈나요? 최대한 구체적으로 표현해보세요.' },
  { key: 'attribution', label: '03 · 귀인 점검', title: '그 감정은 누구의 것인가요?', prompt: '"그 사람이 ___해서 내가 화났다"가 아닌, "나는 ___ 상황에서 ___ 감정을 느꼈다"로 바꿔보면 어떨까요?' },
  { key: 'imessage', label: '04 · 나 전달법', title: '나 전달법으로 표현해보기', prompt: '"나는 [상황]에서 [감정]을 느꼈어. 왜냐하면 나에게는 [이유]가 중요하기 때문이야." 형식으로 표현해보세요.' },
]

const INITIAL_MSG = {
  role: 'assistant',
  content: '안녕하세요. 저는 Mirror입니다 ✦\n\n오늘은 투사(Projection)라는 심리 현상을 함께 탐색해볼 거예요. 투사는 우리가 자신 안에서 받아들이기 어려운 감정을 무의식적으로 타인에게 귀인하는 방어 기제입니다.\n\n판단이나 평가 없이 안전한 공간에서 이야기 나눌 수 있어요. 준비되셨으면, 최근 누군가에 대해 강한 감정을 느꼈던 상황을 들려주세요.'
}

export default function ProjectionModule({ userId }) {
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState(null)
  const [step, setStep] = useState(0)

  const { messages, streaming, streamText, sendMessage } = useChat({
    module: 'projection', userId, sessionId
  })

  useEffect(() => {
    fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, module: 'projection' })
    }).then(r => r.json()).then(d => setSessionId(d.session_id)).catch(() => {})
  }, [userId])

  const allMessages = [INITIAL_MSG, ...messages]

  return (
    <div className="min-h-screen flex flex-col" style={{ maxHeight: '100vh' }}>
      {/* Top bar */}
      <div className="glass border-b px-6 py-4 flex items-center justify-between flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/dashboard')} className="text-sm transition-colors hover:opacity-80"
          style={{ color: '#78716c' }}>← 대시보드</button>
        <div className="flex items-center gap-3">
          <span className="text-2xl" style={{ color: '#7a957a' }}>◎</span>
          <div>
            <div className="font-display text-base" style={{ color: '#f5f0eb' }}>투사 인식 모듈</div>
            <div className="text-xs font-mono" style={{ color: '#57534e' }}>Projection Recognition</div>
          </div>
        </div>
        {/* Step progress */}
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s.key} className="w-1.5 h-1.5 rounded-full transition-all"
              style={{ background: i <= step ? '#7a957a' : '#3d3732' }} />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 border-r p-6 overflow-y-auto hidden md:block"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: '#44403c' }}>진행 단계</div>
          <div className="space-y-2">
            {STEPS.map((s, i) => (
              <motion.button key={s.key}
                onClick={() => setStep(i)}
                className="w-full text-left px-4 py-3 rounded-xl border transition-all duration-200"
                style={{
                  border: i === step ? '1px solid rgba(122,149,122,0.4)' : '1px solid transparent',
                  background: i === step ? 'rgba(122,149,122,0.08)' : 'transparent',
                  opacity: i > step + 1 ? 0.4 : 1
                }}>
                <div className="font-mono text-xs mb-0.5" style={{ color: i <= step ? '#7a957a' : '#44403c' }}>{s.label}</div>
                <div className="text-sm" style={{ color: i === step ? '#d6d3d1' : '#78716c' }}>{s.title}</div>
              </motion.button>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl" style={{ background: 'rgba(122,149,122,0.06)', border: '1px solid rgba(122,149,122,0.12)' }}>
            <div className="text-xs font-mono mb-2" style={{ color: '#567056' }}>현재 단계</div>
            <div className="text-sm leading-relaxed" style={{ color: '#a8a29e' }}>{STEPS[step].prompt}</div>
            {step < STEPS.length - 1 && (
              <button onClick={() => setStep(s => Math.min(s + 1, STEPS.length - 1))}
                className="mt-3 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: 'rgba(122,149,122,0.15)', color: '#7a957a' }}>
                다음 단계 →
              </button>
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={allMessages}
            streaming={streaming}
            streamText={streamText}
            onSend={sendMessage}
            placeholder="자유롭게 이야기해주세요..."
          />
        </div>
      </div>
    </div>
  )
}
