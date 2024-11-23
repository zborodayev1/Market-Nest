import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import path from "path";
import { fileURLToPath } from "url";

dotenv.config()

import { connectDB } from './server/config/database.js';
import authRoutes from './server/routes/auth.routes.js';
import productRoutes from './server/routes/product.routes.js';
import uploadRoutes from './server/routes/upload.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express() 

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))



app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/upload', uploadRoutes);


app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});