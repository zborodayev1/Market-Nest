import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { WebSocketServer } from 'ws'
import http from 'http'

dotenv.config()

import { connectDB } from './server/config/database.js'
import authRoutes from './server/routes/auth.routes.js'
import productRoutes from './server/routes/product.routes.js'
import uploadRoutes from './server/routes/upload.routes.js'
import notiRoutes from './server/routes/noti.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB()

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/upload', uploadRoutes)
app.use('/noti', notiRoutes)

app.use((error, req, res, next) => {
  console.error(error)
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  })
})

const server = http.createServer(app)

const wss = new WebSocketServer({ server })

const clients = new Map()

wss.on('connection', (ws) => {
  console.log('WebSocket клиент подключён')

  ws.on('message', async (message) => {
    try {
      const { type, userId } = JSON.parse(message)

      if (type === 'auth' && userId) {
        ws.userId = userId
        clients.set(userId, ws)
        console.log(`Клиент аутентифицирован с userId: ${userId}`)
      } else {
        ws.send(
          JSON.stringify({ status: 'error', message: 'Unknown message type' })
        )
      }
    } catch (error) {
      console.error('Error processing message:', error)
      ws.send(
        JSON.stringify({ status: 'error', message: 'Invalid message format' })
      )
    }
  })

  ws.on('close', () => {
    console.log('Клиент отключился')
    if (ws.userId) {
      clients.delete(ws.userId)
    }
  })
})

export { wss }

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
