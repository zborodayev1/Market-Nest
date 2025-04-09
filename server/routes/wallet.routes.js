import express from 'express';
import { WalletController } from '../controllers/index.js';
import { checkAuth } from '../utils/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, WalletController.getWallet);
router.post('/deposit', checkAuth, WalletController.depositFunds);
router.post('/send', checkAuth, WalletController.sendMoney);

export default router;
