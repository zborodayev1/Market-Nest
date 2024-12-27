import express from 'express'
import { ProductController } from '../controllers/index.js'
import { checkAuth } from '../utils/checkAuth.js'
import { checkAdmin } from '../utils/checkIsAdmin.js'

const router = express.Router()

router.post(
  '/',
  checkAuth,
  ProductController.handleUploadProductImage,
  ProductController.createProduct
)

router.get('/:id', ProductController.getOneProduct)
router.get('/', ProductController.getAllProducts)
router.post('/products-by-search', ProductController.getProductsBySearch)
router.patch('/:id', checkAuth, ProductController.patchProduct)
router.patch(
  '/:id/status',
  checkAuth,
  checkAdmin,
  ProductController.updateProductStatus
)

router.delete('/:id', checkAuth, ProductController.deleteProduct)

export default router
