import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

dotenv.config();

import cookieParser from 'cookie-parser';
import { connectDB } from './server/config/database.js';
import authRoutes from './server/routes/auth.routes.js';
import deliveryRoutes from './server/routes/delivery.routes.js';
import notiRoutes from './server/routes/noti.routes.js';
import orderRoutes from './server/routes/order.routes.js';
import productRoutes from './server/routes/product.routes.js';
import walletRoutes from './server/routes/wallet.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://aircheck.kz'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/noti', notiRoutes);
app.use('/api/del', deliveryRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/orders', orderRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/ws' });
console.log('✅ WebSocket сервер запущен');

const clients = new Map();

wss.on('connection', (ws) => {
  console.log('Новое WebSocket соединение');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('📩 Получено сообщение от клиента:', data);
      if (data.type === 'auth' && data.userId) {
        ws.userId = data.userId;
        clients.set(data.userId, ws);
        console.log(`Пользователь ${data.userId} подключен`);
      } else {
        ws.send(
          JSON.stringify({ status: 'error', message: 'Unknown message type' })
        );
      }
    } catch (error) {
      console.error('Ошибка обработки сообщения:', error);
      ws.send(
        JSON.stringify({ status: 'error', message: 'Invalid message format' })
      );
    }
  });

  ws.on('close', () => {
    if (ws.userId) {
      clients.delete(ws.userId);
      console.log(`Пользователь ${ws.userId} отключен`);
    }
  });
});

export { wss };

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
