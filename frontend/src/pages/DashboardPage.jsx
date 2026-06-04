import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const MODULES = [
  {
    id: 'projection',
    path: '/projection',
    icon: '◎',
    title: '투사 인식 모듈',
    subtitle: 'Projection Recognition',
    desc: '내가 타인에게 귀인하는 감정이 실은 나의 것임을 발견합니다. 소크라테스식 대화를 통해 방어 기제를 부드럽게 해체합니다.',
    tags: ['자기인식', '방어기제', '나 전달법'],
    color: '#7a957a',
    glow: 'rgba(122,149,122,0.15)',
  },
  {
    id: 'regulation',
    path: '/regulation',
    icon: '◈',
    title: '감정 조절 모듈',
    subtitle: 'Emotion Regulation',
    desc: 'DBT·ACT·CBT 기반의 단계별 감정 조절 프로토콜. 감정 명명부터 행동 활성화까지 실용적인 기술을 훈련합니다.',
    tags: ['DBT', 'ACT', '감정명명', '인지재구성'],
    color: '#c9a84c',
    glow: 'rgba(201,168,76,0.15)',
  },
  {
    id: 'insight',
    path: '/insight',
    icon: '◇',
    title: '성장 통찰',
    subtitle: 'Growth Insight',
    desc: '나의 세션 기록을 분석하여 패턴을 발견하고, 다음 성장 단계를 제시합니다.',
    tags: ['패턴 분석', '성장 지도'],
    color: '#b09dcc',
    glow: 'rgba(176,157,204,0.15)',
  },
]

const PROTOCOL_STEPS = [
  { step: '01', title: '정지 (Pause)', desc: '반응하기 전 3초 멈추기' },
  { step: '02', title: '탐지 (Detect)', desc: '지금 내 감정은 무엇인가?' },
  { step: '03', title: '귀인 (Attribute)', desc: '이 감정의 주인은 누구인가?' },
  { step: '04', title: '표현 (Express)', desc: '나 전달법으로 표현하기' },
  { step: '05', title: '조절 (Regulate)', desc: '감정 조절 기술 적용하기' },
]

export default function DashboardPage({ userId, userName }) {
  const navigate = useNavigate()
  const [entryCount, setEntryCount] = useState(0)

  useEffect(() => {
    fetch(`/api/entries/${userId}`)
      .then(r => r.json())
      .then(d => setEntryCount(d.length))
      .catch(() => {})
  }, [userId])

  return (
    <div className="min-h-screen relative px-6 py-12">
      <div className="orb w-96 h-96 -top-20 -right-20 opacity-8" style={{ background: 'radial-gradient(circle, #2d452d, transparent)' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <div className="font-mono text-xs tracking-widest uppercase" style={{ color: '#57534e' }}>MirrorSelf Dashboard</div>
            <div className="text-xs font-mono px-3 py-1 rounded-full" style={{ background: 'rgba(122,149,122,0.1)', color: '#7a957a' }}>
              {entryCount}회 세션 완료
            </div>
          </div>
          <h1 className="font-display text-5xl font-light" style={{ color: '#f5f0eb' }}>
            안녕하세요, <span className="gradient-text italic">{userName}</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#78716c' }}>오늘 어떤 감정과 함께하고 있나요?</p>
        </motion.div>

        {/* Protocol strip */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-8 overflow-x-auto">
          <div className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: '#57534e' }}>5단계 핵심 프로토콜</div>
          <div className="flex gap-3 min-w-max">
            {PROTOCOL_STEPS.map((s, i) => (
              <div key={s.step} className="flex items-start gap-2 text-left">
                {i > 0 && <div className="text-sm mt-1" style={{ color: '#3d3732' }}>→</div>}
                <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', minWidth: '120px' }}>
                  <div className="font-mono text-xs mb-1" style={{ color: '#567056' }}>{s.step}</div>
                  <div className="text-sm font-medium mb-0.5" style={{ color: '#d6d3d1' }}>{s.title}</div>
                  <div className="text-xs" style={{ color: '#78716c' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Module cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODULES.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
              onClick={() => navigate(m.path)}
              className="glass rounded-2xl p-6 text-left group transition-all duration-300 hover:scale-[1.02] hover:border-opacity-50"
              style={{ boxShadow: `0 0 0 transparent` }}
              whileHover={{ boxShadow: `0 8px 32px ${m.glow}` }}>

              <div className="text-3xl mb-4" style={{ color: m.color }}>{m.icon}</div>
              <div className="font-display text-xl font-light mb-0.5" style={{ color: '#f5f0eb' }}>{m.title}</div>
              <div className="text-xs font-mono mb-3" style={{ color: '#57534e' }}>{m.subtitle}</div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#78716c' }}>{m.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {m.tags.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${m.glow}`, color: m.color, border: `1px solid ${m.color}33` }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-xs font-mono transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: m.color }}>
                시작하기 →
              </div>
            </motion.button>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center text-xs mt-12" style={{ color: '#44403c' }}>
          본 프로그램의 AI 응답은 심리 교육적 목적이며 전문 상담을 대체하지 않습니다
        </motion.p>
      </div>
    </div>
  )
}
