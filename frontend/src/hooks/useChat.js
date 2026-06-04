import { useState, useRef, useCallback } from 'react'

export function useChat({ module, userId, sessionId }) {
  const [messages, setMessages] = useState([])
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const abortRef = useRef(null)

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim() || streaming) return

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setStreaming(true)
    setStreamText('')

    const ctrl = new AbortController()
    abortRef.current = ctrl

    let accumulated = ''

    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          module,
          user_id: userId,
          session_id: sessionId,
          user_input: userText,
          messages: newMessages
        })
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.text) {
                accumulated += data.text
                setStreamText(accumulated)
              }
              if (data.done) {
                setMessages(prev => [...prev, { role: 'assistant', content: accumulated }])
                setStreamText('')
                setStreaming(false)
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev => [...prev, { role: 'assistant', content: '응답을 가져오는 중 오류가 발생했습니다.' }])
      }
      setStreaming(false)
      setStreamText('')
    }
  }, [messages, streaming, module, userId, sessionId])

  const reset = () => {
    abortRef.current?.abort()
    setMessages([])
    setStreamText('')
    setStreaming(false)
  }

  return { messages, streaming, streamText, sendMessage, reset }
}
