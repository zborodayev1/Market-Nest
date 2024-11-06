import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv'

dotenv.config()

import { UserController, ProductController, MainController } from "./server/controllers/index.js";
import { loginValidation, registerValidation } from "./server/utils/validations.js";
import handleValidErr from "./server/utils/hanldeValidErr.js";
import { checkAuth } from "./server/utils/checkAuth.js";
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

// post
app.post('/auth/login',loginValidation, handleValidErr, UserController.login)
app.post('/auth/register',registerValidation, handleValidErr, UserController.register)
app.post('/product', checkAuth, ProductController.createProduct)
app.post('/language', checkAuth, MainController.setLanguage)
app.post('/currency', checkAuth, MainController.setCurrency)

// get
app.get('/product/:id', ProductController.getOneProduct)
app.get('/profile', checkAuth, UserController.getProfile)
app.get('/profile/:id', checkAuth, UserController.getUserProfile)
app.get('/products', ProductController.getAllProducts)

// patch
app.patch('/profile/data', checkAuth, UserController.patchProfileData)
app.patch('/product/:id', checkAuth, ProductController.patchProduct)
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
