import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { WebSocketServer } from 'ws'
// import { verifyTokenForWS } from './server/utils/ws/VerifyTokenWS.js'

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

app.use((error, req, res) => {
  console.error(error)
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  })
})

import http from 'http'
const server = http.createServer(app)

const wss = new WebSocketServer({ server })

const clients = new Map()

wss.on('connection', (ws) => {
  console.log('WebSocket клиент подключён')

  ws.on('message', (message) => {
    const messageStr = message.toString()
    const parsedMessage = JSON.parse(messageStr)

    if (parsedMessage.userId) {
      ws.userId = parsedMessage.userId
      clients.set(ws.userId, ws)
    }
    console.log('Получено сообщение:', parsedMessage)
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
