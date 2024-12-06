import express from 'express'
import { UserController } from '../controllers/index.js'
import { loginValidation, registerValidation } from '../utils/validations.js'
import handleValidErr from '../utils/hanldeValidErr.js'
import { checkAuth } from '../utils/checkAuth.js'

const router = express.Router()

router.post('/login', loginValidation, handleValidErr, UserController.login)
router.post(
  '/register',
  registerValidation,
  handleValidErr,
  UserController.register
)
router.get('/profile', checkAuth, UserController.getProfile)
router.get('/user/:id', checkAuth, UserController.getUserProfile)
router.get('/profile/products', checkAuth, UserController.getUserProducts)
router.patch('/profile/data', checkAuth, UserController.patchProfileData)
router.patch('/profile/email', checkAuth, UserController.patchProfileEmail)
router.patch(
  '/profile/password',
  checkAuth,
  UserController.patchProfilePassword
)

export default router
