import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { UserController, ProductController } from "./server/controllers/index.js";
import { loginValidation, registerValidation } from "./server/utils/validations.js";
import handleValidErr from "./server/utils/hanldeValidErr.js";
import { checkAuth } from "./server/utils/checkAuth.js";

mongoose
  .connect(
    "mongodb+srv://zakharb713:12058080@marketnest.blfcp.mongodb.net/Market?retryWrites=true&w=majority&appName=MarketNest",
  ) 
  .then(() => {
    console.log("DB connect!");
  })
  .catch((err) => {
    console.log("DB error", err);
  });

const app = express() 

app.use(express.json());
app.use(cors());
// post
app.post('/auth/login',loginValidation, handleValidErr, UserController.login)
app.post('/auth/register',registerValidation, handleValidErr, UserController.register)
app.post('/product', checkAuth, ProductController.createProduct)

// get
app.get('/', (req, res) => {res.json({ message: "Server Started!" })})
app.get('/product/:id', ProductController.getOneProduct)
app.get('/profile', checkAuth, UserController.getProfile)
app.get('/profile/:id', checkAuth, UserController.getUserProfile)
app.get('/products', ProductController.getAllProducts)

// patch
app.patch('/auth/password', checkAuth, UserController.patchPassword)
app.patch('/profile', checkAuth, UserController.patchProfile)
app.patch('/product/:id', checkAuth, ProductController.patchProduct)
// delete
app.delete('/product/:id', checkAuth, ProductController.deleteProduct)
app.delete('/profile', checkAuth, UserController.deleteProfile)

app.listen(3000, (err) => {
    if (err) {
      console.log('Server error', err);
    }
    console.log("Server OK");
  });
