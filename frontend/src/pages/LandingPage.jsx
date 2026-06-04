import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '◎', title: '투사 인식', desc: '타인에게 귀인하던 감정을 자신 안에서 발견하는 과정', color: '#a3b5a3' },
  { icon: '◈', title: '감정 조절', desc: 'DBT·ACT 기반의 단계별 감정 조절 프로토콜', color: '#c9a84c' },
  { icon: '◇', title: '성장 통찰', desc: '패턴 분석을 통한 나만의 심리 성장 지도 생성', color: '#b09dcc' },
]

export default function LandingPage({ userId }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Orbs */}
      <div className="orb w-96 h-96 top-0 left-1/4 opacity-10" style={{ background: 'radial-gradient(circle, #567056, transparent)' }} />
      <div className="orb w-80 h-80 bottom-20 right-1/4 opacity-8" style={{ background: 'radial-gradient(circle, #c9a84c, transparent)' }} />

      <div className="relative z-10 max-w-3xl w-full text-center">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8"
          style={{ borderColor: 'rgba(122,149,122,0.4)', background: 'rgba(122,149,122,0.08)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#a3b5a3' }}>Beta · 무료 오픈소스</span>
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-7xl md:text-8xl font-light leading-none mb-6">
          <span style={{ color: '#f5f0eb' }}>Mirror</span>
          <span className="gradient-text italic">Self</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg font-light mb-2" style={{ color: '#a8a29e' }}>
          부적절한 투사를 인식하고,
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg font-light mb-12" style={{ color: '#a8a29e' }}>
          감정을 스스로 조절하는 사람으로 성장하는 여정
        </motion.p>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 text-left">
              <div className="text-2xl mb-3" style={{ color: f.color }}>{f.icon}</div>
              <div className="font-display text-lg mb-2" style={{ color: '#f5f0eb' }}>{f.title}</div>
              <div className="text-sm leading-relaxed" style={{ color: '#78716c' }}>{f.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(userId ? '/dashboard' : '/onboard')}
            className="px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #567056, #3d5c3d)', color: '#e8ede8', boxShadow: '0 0 32px rgba(86,112,86,0.3)' }}>
            {userId ? '대시보드로 이동 →' : '지금 시작하기 →'}
          </button>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            className="px-8 py-4 rounded-full font-medium text-sm tracking-wide border transition-all duration-300 hover:scale-105"
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#a8a29e' }}>
            GitHub에서 보기
          </a>
        </motion.div>

        {/* Footer note */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-16 text-xs" style={{ color: '#57534e' }}>
          MIT License · 공익 목적 오픈소스 · AI 응답은 전문 상담을 대체하지 않습니다
        </motion.p>
      </div>
    </div>
  )
}
