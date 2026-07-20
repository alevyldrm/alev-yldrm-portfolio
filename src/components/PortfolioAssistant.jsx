import { useRef, useState } from 'react'
import { HiArrowUp, HiXMark } from 'react-icons/hi2'

const ENDPOINT = '/.netlify/functions/portfolio-chat'
const MAX_MESSAGE_LENGTH = 500
const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Merhaba, ben Alev\'in portfolio asistanıyım. Projeleri, yetenekleri veya iş arayışı hakkında kısa sorular sorabilirsin.',
}

const suggestions = [
  'Alev hangi teknolojileri kullanıyor?',
  'Penguin E-Commerce projesini anlat.',
  'Alev ile nasıl iletişim kurabilirim?',
]

const renderInlineMarkdown = (text, lineIndex) => (
  text.split(/(\*\*[^*\n]+\*\*)/g).map((part, partIndex) => {
    const key = `${lineIndex}-${partIndex}`

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>
    }

    return <span key={key}>{part}</span>
  })
)

function AssistantMessageContent({ content }) {
  const blocks = []
  let listItems = []

  const flushList = () => {
    if (!listItems.length) return
    blocks.push(<ul key={`list-${blocks.length}`}>{listItems}</ul>)
    listItems = []
  }

  content.split('\n').forEach((line, lineIndex) => {
    const trimmedLine = line.trim()
    const listMatch = trimmedLine.match(/^[-*]\s+(.+)$/)

    if (listMatch) {
      listItems.push(<li key={`item-${lineIndex}`}>{renderInlineMarkdown(listMatch[1], lineIndex)}</li>)
      return
    }

    flushList()
    if (trimmedLine) {
      blocks.push(<p key={`line-${lineIndex}`}>{renderInlineMarkdown(trimmedLine, lineIndex)}</p>)
    }
  })

  flushList()

  return <div className="assistant-message-content">{blocks}</div>
}

function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToLatest = () => {
    window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  const sendMessage = async (rawMessage) => {
    const message = rawMessage.trim()
    if (!message || isSending || message.length > MAX_MESSAGE_LENGTH) return

    const history = messages.slice(-6).map(({ role, content }) => ({ role, content }))
    setMessages((current) => [...current, { role: 'user', content: message }])
    setInput('')
    setIsSending(true)
    scrollToLatest()

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 25000)

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
        signal: controller.signal,
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok || typeof data.reply !== 'string') {
        const requestError = new Error('Assistant request failed')
        requestError.userMessage = typeof data.error === 'string' ? data.error : ''
        throw requestError
      }

      setMessages((current) => [...current, { role: 'assistant', content: data.reply }])
    } catch (error) {
      const content = error.name === 'AbortError'
        ? 'Yanıt süresi aşıldı. Lütfen tekrar dene.'
        : error.userMessage || 'Şu anda yanıt veremiyorum. Lütfen biraz sonra tekrar dene.'

      setMessages((current) => [...current, { role: 'assistant', content, isError: true }])
    } finally {
      window.clearTimeout(timeoutId)
      setIsSending(false)
      scrollToLatest()
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage(input)
  }

  return (
    <aside className={`portfolio-assistant${isOpen ? ' is-open' : ''}`}>
      {isOpen && (
        <section id="portfolio-assistant-dialog" className="assistant-panel" role="dialog" aria-label="Portfolio Assistant">
          <header className="assistant-header">
            <div className="assistant-identity">
              <span className="assistant-mascot assistant-mascot--small" aria-hidden="true"><i /><i /><b /></span>
              <div><strong>Portfolio Assistant</strong><span><i /> AI destekli</span></div>
            </div>
            <button className="assistant-close" type="button" onClick={() => setIsOpen(false)} aria-label="Asistanı kapat" title="Kapat">
              <HiXMark aria-hidden="true" />
            </button>
          </header>

          <div className="assistant-messages" aria-live="polite" aria-busy={isSending}>
            {messages.map((item, index) => (
              <div className={`assistant-message is-${item.role}${item.isError ? ' is-error' : ''}`} key={`${item.role}-${index}`}>
                <span>{item.role === 'assistant' ? 'AY.AI' : 'SEN'}</span>
                {item.role === 'assistant'
                  ? <AssistantMessageContent content={item.content} />
                  : <p>{item.content}</p>}
              </div>
            ))}
            {isSending && (
              <div className="assistant-message is-assistant is-typing">
                <span>AY.AI</span><p><i /><i /><i /></p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="assistant-suggestions" aria-label="Örnek sorular">
              {suggestions.map((suggestion) => (
                <button type="button" key={suggestion} onClick={() => sendMessage(suggestion)} disabled={isSending}>{suggestion}</button>
              ))}
            </div>
          )}

          <form className="assistant-form" onSubmit={handleSubmit}>
            <label htmlFor="portfolio-assistant-input">Mesaj</label>
            <textarea
              id="portfolio-assistant-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) handleSubmit(event)
              }}
              maxLength={MAX_MESSAGE_LENGTH}
              rows="1"
              placeholder="Alev hakkında bir şey sor..."
              disabled={isSending}
            />
            <span className="assistant-count">{input.length}/{MAX_MESSAGE_LENGTH}</span>
            <button type="submit" disabled={!input.trim() || isSending} aria-label="Mesajı gönder" title="Gönder">
              <HiArrowUp aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      {!isOpen && (
        <button
          className="assistant-launcher"
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded="false"
          aria-controls="portfolio-assistant-dialog"
          aria-label="Portfolio Assistantı aç"
          title="Portfolio Assistant"
        >
          <span className="assistant-mascot" aria-hidden="true"><i /><i /><b /></span>
          <span className="assistant-launcher-copy"><strong>AY.AI</strong><small>Bir şey sor</small></span>
        </button>
      )}
    </aside>
  )
}

export default PortfolioAssistant
