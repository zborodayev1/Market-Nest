import express from 'express';
import { ProductController, UserController } from '../controllers/index.js';
import { checkAuth } from '../utils/checkAuth.js';
import handleValidErr from '../utils/hanldeValidErr.js';
import { loginValidation, registerValidation } from '../utils/validations.js';

const router = express.Router();

router.post('/login', loginValidation, handleValidErr, UserController.login);
router.post(
  '/temporary-register',
  registerValidation,
  handleValidErr,
  UserController.temporaryRegister
);
router.post('/logout', UserController.logout);

router.patch(
  '/user/avatar',
  checkAuth,
  ProductController.handleUploadImage,
  UserController.uploadAvatar
);

router.delete('/user/avatar', checkAuth, UserController.deleteAvatar);

router.post('/complete-register', UserController.completeRegistration);

router.patch(
  '/profile/password',
  checkAuth,
  UserController.patchProfilePassword
);

router.patch('/profile/phone', checkAuth, UserController.patchProfilePhone);

router.post(
  '/request-password-change-code',
  checkAuth,
  UserController.requestPasswordChangeWEmail
);
router.post(
  '/confirm-password-change',
  checkAuth,
  UserController.confirmPasswordChangeWEmail
);
router.post(
  '/request-phone-change-code',
  checkAuth,
  UserController.requestPhoneChangeWEmail
);
router.post(
  '/confirm-phone-change',
  checkAuth,
  UserController.confirmPhoneChangeWEmail
);
router.get('/profile', checkAuth, UserController.getProfile);
router.get('/profile/products', checkAuth, UserController.getUserProducts);
router.patch('/profile/data', checkAuth, UserController.patchProfileData);
router.patch('/profile/email', checkAuth, UserController.patchProfileEmail);

router.get('/user/:id', UserController.getUserProfile);

export default router;
