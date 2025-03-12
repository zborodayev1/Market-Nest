import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { WebSocketServer } from 'ws'
import http from 'http'
import multer from 'multer'

dotenv.config()

import { connectDB } from './server/config/database.js'
import authRoutes from './server/routes/auth.routes.js'
import productRoutes from './server/routes/product.routes.js'
import notiRoutes from './server/routes/noti.routes.js'
import deliveryRoutes from './server/routes/delivery.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB()

const app = express()

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
)

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(multer().none())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/noti', notiRoutes)
app.use('/api/del', deliveryRoutes)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use((error, req, res) => {
  console.error(error)
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  })
})

const server = http.createServer(app)

const wss = new WebSocketServer({ server, path: '/ws' })

const clients = new Map()

wss.on('connection', (ws) => {
  console.log('Новое WebSocket соединение')

  ws.on('message', (message) => {
    try {
      const { type, userId } = JSON.parse(message)

      if (type === 'auth' && userId) {
        ws.userId = userId
        clients.set(userId, ws)
        console.log(`Пользователь ${userId} подключен`)
      } else {
        ws.send(
          JSON.stringify({ status: 'error', message: 'Unknown message type' })
        )
      }
    } catch (error) {
      console.error('Ошибка обработки сообщения:', error)
      ws.send(
        JSON.stringify({ status: 'error', message: 'Invalid message format' })
      )
    }
  })

  ws.on('close', () => {
    if (ws.userId) {
      clients.delete(ws.userId)
      console.log(`Пользователь ${ws.userId} отключен`)
    }
  })
})

export { wss }

const PORT = process.env.PORT || 3000
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})
