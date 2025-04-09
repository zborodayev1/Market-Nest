import express from 'express';
import { OrderController } from '../controllers/index.js';
import { checkAuth } from '../utils/checkAuth.js';
import { checkAdmin } from '../utils/checkIsAdmin.js';

const router = express.Router();

router.get('/', checkAuth, OrderController.getOrders);
router.get('/:id', checkAuth, OrderController.getOrderById);
router.get('/user/:id', checkAuth, OrderController.getOrdersByUserId);
router.get('/pending', checkAuth, checkAdmin, OrderController.getPendingOrders);

router.delete('/:id', checkAdmin, checkAuth, OrderController.deleteOrder);

router.patch(
  '/status/:id',
  checkAdmin,
  checkAuth,
  OrderController.updateOrderStatus
);
router.patch('/:id', checkAdmin, checkAuth, OrderController.patchOrder);

export default router;
