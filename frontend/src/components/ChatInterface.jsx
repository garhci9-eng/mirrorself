import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function MessageBubble({ msg, isLast, streaming, streamText }) {
  const isUser = msg.role === 'user'
  const content = (isLast && streaming) ? streamText : msg.content

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-mono text-xs"
          style={{ background: 'rgba(122,149,122,0.2)', color: '#7a957a', border: '1px solid rgba(122,149,122,0.3)' }}>
          M
        </div>
      )}
      <div className={`max-w-[78%] px-5 py-3.5 rounded-2xl prose-chat ${isUser ? '' : (isLast && streaming ? 'typing-cursor' : '')}`}
        style={isUser
          ? { background: 'rgba(122,149,122,0.15)', border: '1px solid rgba(122,149,122,0.2)', color: '#d6d3d1' }
          : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#d6d3d1' }}>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
      </div>
    </motion.div>
  )
}

export default function ChatInterface({ messages, streaming, streamText, onSend, placeholder = '메시지를 입력하세요...' }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText])

  const handleSend = () => {
    if (!input.trim() || streaming) return
    onSend(input.trim())
    setInput('')
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} isLast={i === messages.length - 1} streaming={streaming} streamText={streamText} />
          ))}
          {streaming && messages[messages.length - 1]?.role === 'user' && (
            <motion.div key="streaming" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="flex justify-start">
              <div className="w-7 h-7 rounded-full flex items-center justify-center mr-3 font-mono text-xs"
                style={{ background: 'rgba(122,149,122,0.2)', color: '#7a957a', border: '1px solid rgba(122,149,122,0.3)' }}>M</div>
              <div className="px-5 py-3.5 rounded-2xl prose-chat typing-cursor"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#d6d3d1' }}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{streamText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder={placeholder}
            rows={1}
            className="flex-1 px-4 py-3 rounded-xl text-sm resize-none outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f5f0eb',
              fontFamily: 'DM Sans',
              maxHeight: '120px',
              overflowY: 'auto'
            }}
            onInput={e => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || streaming}
            className="px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-30 hover:scale-105 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #567056, #3d5c3d)', color: '#e8ede8' }}>
            {streaming ? '…' : '↑'}
          </button>
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: '#44403c' }}>Enter로 전송 · Shift+Enter 줄바꿈</p>
      </div>
    </div>
  )
}
