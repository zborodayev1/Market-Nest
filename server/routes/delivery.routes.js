import express from 'express'
import { DeliveryController } from '../controllers/index.js'
import { checkAdmin } from '../utils/checkIsAdmin.js'

const router = express.Router()

router.post('/', checkAdmin, DeliveryController.createDelivery)

router.get('/', DeliveryController.getDelivery)

export default router
