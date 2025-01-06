import express from 'express'
import { upload } from '../config/multer.js'
import { checkAuth } from '../utils/checkAuth.js'
import { handleUpload } from '../controllers/uploadController.js'

const router = express.Router()

router.post('/', checkAuth, upload.single('image'), handleUpload)

export default router
