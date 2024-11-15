import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv'
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config()

import { UserController, ProductController, MainController } from "./server/controllers/index.js";
import { loginValidation, registerValidation, productValidation } from "./server/utils/validations.js";
import handleValidErr from "./server/utils/hanldeValidErr.js";
import { checkAuth } from "./server/utils/checkAuth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose
  .connect(
    process.env.MONGO_URL
  ) 
  .then(() => {
    console.log("DB connect!");
  })
  .catch((err) => {
    console.log("DB error:", err);
  });

const app = express() 

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


// multer
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  try {
    res.json({
      message: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}`, 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload file', error });
  }
});
app.use(express.static(path.join(__dirname, 'public')))

// post

app.post('/auth/login',loginValidation, handleValidErr, UserController.login)
app.post('/auth/register',registerValidation, handleValidErr, UserController.register)
app.post('/product', checkAuth, productValidation, handleValidErr, ProductController.createProduct)
app.post('/language', checkAuth, MainController.setLanguage)
app.post('/currency', checkAuth, MainController.setCurrency)

// get
app.get('/product/:id', ProductController.getOneProduct)
app.get('/profile', checkAuth, UserController.getProfile)
app.get('/user/:id', checkAuth, UserController.getUserProfile)
app.get('/products', ProductController.getAllProducts)

// patch
app.patch('/profile/data', checkAuth, UserController.patchProfileData)
app.patch('/product/:id', checkAuth, productValidation, handleValidErr, ProductController.patchProduct)
app.patch('/profile/email', checkAuth, UserController.patchProfileEmail)
app.patch('/profile/password', checkAuth, UserController.patchProfilePassword)

// delete
app.delete('/product/:id', checkAuth, ProductController.deleteProduct)

app.listen(3000, (err) => {
    if (err) {
      console.log('Server error', err);
    }
    console.log("Server OK");
  });
