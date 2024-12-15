import express from 'express'
import { ProductController } from '../controllers/index.js'
import { productValidation } from '../utils/validations.js'
import handleValidErr from '../utils/hanldeValidErr.js'
import { checkAuth } from '../utils/checkAuth.js'
import { checkAdmin } from '../utils/checkIsAdmin.js'

const router = express.Router()

router.post(
  '/',
  checkAuth,
  ProductController.handleUploadProductImage,
  ProductController.createProduct
)
router.post('/noti', checkAuth, ProductController.createNotification)
router.get('/noti', checkAuth, ProductController.getNotifications)

router.get('/:id', ProductController.getOneProduct)
router.get('/', ProductController.getAllProducts)
router.post('/products-by-tags', ProductController.getProductsByTags)
router.post('/products-by-search', ProductController.getProductsBySearch)
router.patch(
  '/:id',
  checkAuth,
  productValidation,
  handleValidErr,
  ProductController.patchProduct
)
router.patch(
  '/:id/status',
  checkAuth,
  checkAdmin,
  ProductController.updateProductStatus
)
router.patch('/noti/:id', checkAuth, ProductController.markNotificationAsRead)

router.delete('/:id', checkAuth, ProductController.deleteProduct)

export default router
