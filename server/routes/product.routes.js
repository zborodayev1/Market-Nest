import express from 'express';
import upload from '../config/cloudinaryConfig.js';
import { ProductController } from '../controllers/index.js';
import { checkAuth } from '../utils/checkAuth.js';
import { checkAdmin } from '../utils/checkIsAdmin.js';

const router = express.Router();

router.post(
  '/',
  checkAuth,
  upload.single('image'),
  ProductController.createProduct
);

router.get('/products-pending', ProductController.getPendingProducts);

router.get('/', ProductController.getAllProducts);

router.post('/products-by-search', ProductController.getProductsBySearch);

router.delete('/delete/all', ProductController.deleteAllProducts);

router.patch(
  '/:id',
  upload.single('image'),
  checkAuth,
  ProductController.patchProduct
);

router.patch(
  '/:id/status',
  checkAuth,
  checkAdmin,
  ProductController.approveProduct
);
router.get('/:id', ProductController.getOneProduct);

router.delete('/:id', checkAuth, ProductController.deleteProduct);

export default router;
