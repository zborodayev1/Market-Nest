import mongoose from 'mongoose'
import ProductModel from '../models/product.js'
import UserModel from '../models/user.js'
import dayjs from 'dayjs'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '..', '..', 'public', 'uploads')
    console.log('Destination path:', uploadPath)
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname)
    console.log('File name:', filename)
    cb(null, filename)
  },
})

const upload = multer({ storage })

export const handleUploadProductImage = upload.single('image')

export const createProduct = async (req, res) => {
  try {
    const { name, tags, price, description } = req.body

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      })
    }

    const filePath = `/uploads/${req.file.filename}`
    const fullPath = path.resolve(
      __dirname,
      '..',
      '..',
      'public',
      'uploads',
      req.file.filename
    )
    console.log('Full file path:', fullPath)

    try {
      await fs.access(fullPath)

      const product = await ProductModel.create({
        _id: new mongoose.Types.ObjectId(),
        name,
        tags,
        price,
        description,
        image: filePath,
        user: req.userId,
      })

      return res.status(201).json({
        success: true,
        product,
        message: 'Product created successfully with image',
      })
    } catch (err) {
      console.error('Error during file access:', err)
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
      })
    }
  } catch (error) {
    console.error('Error during product creation:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to upload product',
      error: error.message,
    })
  }
}

export const getOneProduct = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    const productId = req.params.id
    const userId = req.userId

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    session.startTransaction()

    let product = await ProductModel.findById(productId).session(session).lean()

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (!product.viewedBy.includes(userId)) {
      product = await ProductModel.findOneAndUpdate(
        { _id: productId },
        {
          $inc: { viewsCount: 1 },
          $push: { viewedBy: userId },
        },
        { new: true, session, lean: true }
      )
    }

    await session.commitTransaction()

    res.json({
      ...product,
      createdAt: dayjs(product.createdAt).format('YY-MM-DD'),
      updatedAt: dayjs(product.updatedAt).format('YY-MM-DD'),
    })
  } catch (err) {
    await session.abortTransaction()
    console.error(err)
    res.status(500).json({ message: 'Failed to get product' })
  } finally {
    session.endSession()
  }
}

export const patchProduct = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    const productId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    const { discount } = req.body

    const updateData = {
      name: req.body.name,
      tags: req.body.tags,
      image: req.body.image,
      price: req.body.price,
      description: req.body.description,
      updatedAt: new Date(),
    }

    if (typeof discount === 'number' && discount >= 0 && discount <= 100) {
      const product = await ProductModel.findById(productId).session(session)
      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }

      const discountAmount = (discount / 100) * product.price
      const newPrice = product.price - discountAmount

      updateData.discount = discount
      updateData.oldPrice = product.price
      updateData.price = Math.round(newPrice * 100) / 100
      updateData.saveAmount = Math.round(discountAmount * 100) / 100
    }

    session.startTransaction()

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, session }
    )

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    await session.commitTransaction()

    res.json({
      ...updatedProduct.toObject(),
      createdAt: dayjs(updatedProduct.createdAt).format('YY-MM-DD'),
      updatedAt: dayjs(updatedProduct.updatedAt).format('YY-MM-DD'),
    })
  } catch (err) {
    await session.abortTransaction()
    console.error(err)
    res.status(500).json({ message: 'Failed to update product' })
  } finally {
    session.endSession()
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const userId = req.userId

    const product = await ProductModel.findById(productId)

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      })
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (
      user.role === 'admin' ||
      product.user.toString() === userId.toString()
    ) {
      await ProductModel.findByIdAndDelete(productId)
      return res.status(200).json({
        message: 'Product deleted successfully',
      })
    } else {
      return res.status(403).json({
        message: 'You do not have permission to delete this product',
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to delete product',
    })
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 })
    const formattedProducts = products.map((product) => ({
      ...product.toObject(),
      createdAt: dayjs(product.createdAt).format('YY-MM-DD'),
      updatedAt: dayjs(product.updatedAt).format('YY-MM-DD'),
    }))

    res.json(formattedProducts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to get products' })
  }
}

export const getProductsByTags = async (req, res) => {
  try {
    const tags = req.body.tags

    if (!tags || tags.length === 0) {
      return res.status(400).json({ message: 'Tags are required' })
    }

    const products = await ProductModel.find({ tags: { $in: tags } })

    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to get products by tags' })
  }
}

export const getProductsBySearch = async (req, res) => {
  try {
    const search = req.body.search
    if (!search) {
      return res.status(400).json({ message: 'Search parameter is required' })
    }

    const products = await ProductModel.find({
      name: { $regex: search, $options: 'i' },
    })
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to get products by search' })
  }
}
