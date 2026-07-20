import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const CHAT_ENDPOINT = '/.netlify/functions/portfolio-chat'

const readRequestBody = (request) => new Promise((resolve, reject) => {
  let body = ''

  request.setEncoding('utf8')
  request.on('data', (chunk) => { body += chunk })
  request.on('end', () => resolve(body))
  request.on('error', reject)
})

const portfolioChatDevPlugin = (env) => ({
  name: 'portfolio-chat-dev-function',
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      const pathname = new URL(request.url, 'http://localhost').pathname
      if (pathname !== CHAT_ENDPOINT) return next()

      try {
        const { handlePortfolioChat } = await server.ssrLoadModule('/netlify/functions/portfolio-chat.js')
        const result = await handlePortfolioChat({
          httpMethod: request.method,
          body: await readRequestBody(request),
        }, {
          apiKey: env.GEMINI_API_KEY,
          model: env.GEMINI_MODEL,
        })

        response.statusCode = result.statusCode || 500
        Object.entries(result.headers || {}).forEach(([name, value]) => {
          response.setHeader(name, value)
        })
        response.end(result.body)
      } catch (error) {
        console.error('Local Portfolio Assistant middleware failed', error)
        response.statusCode = 500
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(JSON.stringify({ error: 'Portfolio Assistant isteği işlenemedi.' }))
      }
    })
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), portfolioChatDevPlugin(env)],
  }
})
