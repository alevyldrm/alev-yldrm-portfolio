import { GoogleGenAI } from '@google/genai'

const DEFAULT_MODEL = 'gemini-3.1-flash-lite'
const MAX_MESSAGE_LENGTH = 500
const MAX_BODY_LENGTH = 15000
const MAX_HISTORY_MESSAGES = 6

const PORTFOLIO_INSTRUCTIONS = `
Sen Alev Yıldırım'ın portfolio sitesindeki AI asistanısın.

Yanıt kuralları:
- Her zaman Türkçe, kısa, doğal ve profesyonel yanıt ver.
- Yalnızca Alev'in portfolio bilgileri, projeleri, frontend yetenekleri, eğitim bilgileri, iş arayışı ve iletişim kanalları hakkında yanıt ver.
- Aşağıdaki doğrulanmış bilgiler dışında bilgi uydurma. Bilgi yoksa bunu açıkça söyle.
- Alev'i senior, full-stack veya uzman olmadığı alanlarda öyleymiş gibi gösterme.
- Genel bilgi, siyaset, sağlık, hukuk veya alakasız konuları cevaplama; kullanıcıyı Alev'in portfolio bilgilerine yönlendir.
- Gereksiz uzun cevap, karmaşık tablo veya abartılı pazarlama dili kullanma.
- Markdown kullanabilirsin fakat yanıtları sade tut.

Doğrulanmış portfolio bilgileri:
- Alev Yıldırım, React odaklı Frontend Developer'dır ve aktif olarak iş aramaktadır.
- Teknik yetenekler: React, JavaScript ES6+, Next.js, Redux Toolkit, Context API, HTML5, CSS3, Tailwind CSS, Bootstrap, React Router, Framer Motion, Axios, REST API, Firebase Authentication, Responsive Design, Component-Based Architecture.
- Araçlar: Git, GitHub, Vite, VS Code, Netlify, Firebase, Figma.
- İletişim: GitHub https://github.com/alevyldrm ve LinkedIn https://www.linkedin.com/in/alevyldrm/.

Penguin E-Commerce:
- React, Redux Toolkit, Firebase, Tailwind CSS, Framer Motion, Axios ve REST API kullanıldı.
- Ürün listeleme, kategori ve fiyat filtreleme, arama ve sıralama, sepet yönetimi, kullanıcı kayıt/giriş, korumalı sepet sayfası ve responsive tasarım geliştirildi.

Netflix Clone:
- React, JavaScript, CSS ve React Router kullanıldı.
- Component tabanlı yapı, responsive arayüz, routing ve navigasyon geliştirildi.
`.trim()

const jsonResponse = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  },
  body: JSON.stringify(body),
})

const validateHistory = (history) => {
  if (history === undefined) return []
  if (!Array.isArray(history)) return null

  const recentHistory = history.slice(-MAX_HISTORY_MESSAGES)
  const isValid = recentHistory.every((item) => (
    item
    && typeof item === 'object'
    && !Array.isArray(item)
    && (item.role === 'user' || item.role === 'assistant')
    && typeof item.content === 'string'
    && item.content.trim().length > 0
    && item.content.length <= MAX_MESSAGE_LENGTH
  ))

  if (!isValid) return null

  return recentHistory.map(({ role, content }) => ({
    role: role === 'assistant' ? 'model' : 'user',
    parts: [{ text: content.trim() }],
  }))
}

export async function handlePortfolioChat(event, runtime = {}) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Yalnızca POST isteği desteklenir.' }, { Allow: 'POST' })
  }

  if (typeof event.body !== 'string' || event.body.length > MAX_BODY_LENGTH) {
    return jsonResponse(413, { error: 'İstek gövdesi çok büyük veya geçersiz.' })
  }

  let payload
  try {
    payload = JSON.parse(event.body)
  } catch {
    return jsonResponse(400, { error: 'Geçerli bir JSON gövdesi gönderilmelidir.' })
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return jsonResponse(400, { error: 'İstek gövdesi bir JSON nesnesi olmalıdır.' })
  }

  if (typeof payload.message !== 'string') {
    return jsonResponse(400, { error: 'message alanı metin olmalıdır.' })
  }

  const message = payload.message.trim()
  if (!message) return jsonResponse(400, { error: 'Mesaj boş olamaz.' })
  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(413, { error: `Mesaj en fazla ${MAX_MESSAGE_LENGTH} karakter olabilir.` })
  }

  const history = validateHistory(payload.history)
  if (history === null) {
    return jsonResponse(400, { error: 'history alanı geçerli kullanıcı ve asistan mesajlarından oluşmalıdır.' })
  }

  const apiKey = runtime.apiKey || process.env.GEMINI_API_KEY
  if (!apiKey) {
    return jsonResponse(503, { error: 'Portfolio Assistant henüz yapılandırılmadı.' })
  }

  try {
    const client = runtime.client || new GoogleGenAI({ apiKey })
    const response = await client.models.generateContent({
      model: runtime.model || process.env.GEMINI_MODEL || DEFAULT_MODEL,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] },
      ],
      config: {
        systemInstruction: PORTFOLIO_INSTRUCTIONS,
        maxOutputTokens: 300,
        temperature: 0.35,
      },
    })

    const reply = response.text?.trim()
    if (!reply) throw new Error('Empty model response')

    return jsonResponse(200, { reply })
  } catch (error) {
    console.error('Portfolio Assistant request failed', {
      name: error?.name,
      status: error?.status,
    })

    return jsonResponse(502, { error: 'AI servisine şu anda ulaşılamıyor.' })
  }
}

export async function handler(event) {
  return handlePortfolioChat(event)
}
