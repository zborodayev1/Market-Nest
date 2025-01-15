import express from 'express'
import { UserController } from '../controllers/index.js'
import { loginValidation, registerValidation } from '../utils/validations.js'
import handleValidErr from '../utils/hanldeValidErr.js'
import { checkAuth } from '../utils/checkAuth.js'

const router = express.Router()

router.post('/login', loginValidation, handleValidErr, UserController.login)
router.post(
  '/temporary-register',
  registerValidation,
  handleValidErr,
  UserController.temporaryRegister
)
router.post('/complete-register', UserController.completeRegistration)
router.post(
  '/request-password-change-code',
  UserController.requestPasswordChangeCode
)
router.post('/confirm-password-change', UserController.confirmPasswordChange)
router.get('/profile', checkAuth, UserController.getProfile)
router.get('/user/:id', checkAuth, UserController.getUserProfile)
router.get('/profile/products', checkAuth, UserController.getUserProducts)
router.patch('/profile/data', checkAuth, UserController.patchProfileData)
router.patch('/profile/email', checkAuth, UserController.patchProfileEmail)
router.patch(
  '/profile/request-password-change',
  checkAuth,
  UserController.requestPasswordChangeCode
)
router.patch(
  '/profile/confirm-password-change',
  checkAuth,
  UserController.confirmPasswordChange
)

export default router
