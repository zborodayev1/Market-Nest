import mongoose from 'mongoose'
import ProductModel from '../models/product.js'
import UserModel from '../models/user.js'
import dayjs from 'dayjs'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import NotiModel from '../models/noti.js'
import cron from 'node-cron'
import levenshtein from 'fast-levenshtein'
import { sendUnreadCountToClients } from '../webSokets/functions/sendUnreadCountToClients/sendUnreadCountToClients.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '..', '..', 'public', 'uploads')
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating upload directory:', err)
        return cb(new Error('Failed to create upload directory'))
      }
      cb(null, uploadPath)
    })
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname)
    cb(null, filename)
  },
})

const upload = multer({ storage })

export const handleUploadProductImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err)
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file',
      })
    }
    next()
  })
}
export const createProduct = async (req, res) => {
  try {
    const { name, tags, price, description } = req.body

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      })
    }

    if (!name || name.length <= 5 || !tags || !price || price <= 0) {
      const errors = []
      if (!name || name.length <= 5) errors.push('name (> 5 characters)')
      if (!tags) errors.push('tags (>= 1 tag)')
      if (!price || price <= 0) errors.push('price (> 0)')

      return res.status(400).json({
        success: false,
        message: `All fields are required: ${errors.join(', ')}`,
      })
    }

    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags)

    const filePath = `/uploads/${req.file.filename}`
    const fullPath = path.resolve(
      __dirname,
      '..',
      '..',
      'public',
      'uploads',
      req.file.filename
    )

    try {
      await fs.access(fullPath)

      const product = await ProductModel.create({
        _id: new mongoose.Types.ObjectId(),
        name,
        tags: parsedTags,
        price,
        description,
        image: filePath,
        user: req.userId,
        status: 'pending',
      })

      await NotiModel.create({
        userId: req.userId,
        actionType: 'created',
        title: `Your product ${product.name} was created successfully`,
        productId: product._id,
      })

      await sendUnreadCountToClients(req.userId, 1)

      const admins = await UserModel.find({ role: 'admin' })

      cron.schedule('0 13 * * 1', async () => {
        const productsToVerify = await ProductModel.countDocuments({
          status: 'pending',
        })

        if (productsToVerify > 0) {
          const existingNotification = await NotiModel.findOne({
            actionType: 'pending_review',
            createdAt: { $gte: dayjs().startOf('week').toDate() },
          })

          if (!existingNotification) {
            await Promise.all(
              admins.map(async (admin) => {
                await NotiModel.create({
                  userId: admin._id,
                  title: 'Pending products',
                  actionType: 'pending_review',
                  message: `There are ${productsToVerify} products awaiting admin verification this week.`,
                })
              })
            )
          }
        }
      })

      return res.status(201).json({
        success: true,
        product,
        message: 'Product created successfully and notification sent.',
      })
    } catch (err) {
      console.error('Error during file access:', err)
      return res.status(500).json({
        success: false,
        message: 'Failed to create product',
      })
    }
  } catch (error) {
    console.error('Error during product creation:', error)
    return res.status(500).json({
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

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    session.startTransaction()

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { viewsCount: 1 } },
      { new: true, session }
    )

    if (!product) {
      await session.abortTransaction()
      return res.status(404).json({ message: 'Product not found' })
    }

    await session.commitTransaction()

    return res.json({
      ...product.toObject(),
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

    session.startTransaction()

    const { name, tags, image, price, discount } = req.body

    if (!name || !tags || !image || price === undefined) {
      await session.abortTransaction()
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const updateData = {
      name,
      tags,
      image,
      price,
      updatedAt: new Date(),
    }

    const product = await ProductModel.findById(productId).session(session)
    if (!product) {
      await session.abortTransaction()
      return res.status(404).json({ message: 'Product not found' })
    }

    if (typeof discount === 'number' && discount >= 0 && discount <= 100) {
      const { newPrice, discountAmount } = calculateDiscount(
        product.price,
        discount
      )

      updateData.discount = discount
      updateData.oldPrice = product.price
      updateData.price = newPrice
      updateData.saveAmount = discountAmount
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, session }
    )

    if (!updatedProduct) {
      await session.abortTransaction()
      return res.status(404).json({ message: 'Product not found' })
    }

    await NotiModel.create(
      [
        {
          userId: updatedProduct.user,
          title: `Your product has been updated`,
          actionType: `approved`,
          productId: productId,
        },
      ],
      { session }
    )

    await sendUnreadCountToClients(updatedProduct.user, 1)

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

      await NotiModel.create({
        userId: product.user,
        title: `Your product "${product.name}" has been deleted `,
        actionType: `approved`,
        productId: productId,
      })

      await sendUnreadCountToClients(product.user, 1)

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
    const { page = 1, limit = 10 } = req.query

    const pageNumber = Math.max(Number(page), 1)
    const pageSize = Math.min(Number(limit), 50)

    const filter = { status: 'approved' }

    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)

    const total = await ProductModel.countDocuments(filter)

    const totalPages = Math.ceil(total / pageSize)

    const formattedProducts = products.map((product) => ({
      ...product.toObject(),
      createdAt: dayjs(product.createdAt).format('YY-MM-DD'),
      updatedAt: dayjs(product.updatedAt).format('YY-MM-DD'),
    }))

    res.json({
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages,
      products: formattedProducts,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to get products' })
  }
}

export const getPendingProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const pageNumber = Math.max(Number(page), 1)
    const pageSize = Math.min(Number(limit), 50)

    const filter = { status: 'pending' }

    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)

    const total = await ProductModel.countDocuments(filter)

    const totalPages = Math.ceil(total / pageSize)

    const formattedProducts = products.map((product) => ({
      ...product.toObject(),
      createdAt: dayjs(product.createdAt).format('YY-MM-DD'),
      updatedAt: dayjs(product.updatedAt).format('YY-MM-DD'),
    }))

    res.json({
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages,
      products: formattedProducts,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to get pending products' })
  }
}

export const getProductsBySearch = async (req, res) => {
  try {
    const search = req.body.search

    if (!search) {
      return res.status(400).json({ message: 'Search parameter is required' })
    }

    const maxDistance = 3

    const products = await ProductModel.find()

    const filteredProducts = products.filter((product) => {
      const productName = product.name.toLowerCase()

      const distance = levenshtein.get(search.toLowerCase(), productName)

      return distance <= maxDistance
    })

    res.json(filteredProducts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to get products by search' })
  }
}

export const approveProduct = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const productId = req.params.id
    const product = await ProductModel.findById(productId).session(session)

    if (!product) {
      await session.abortTransaction()
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    if (product.status === 'approved') {
      await session.abortTransaction()
      return res.status(400).json({
        success: false,
        message: 'Product is already approved',
      })
    }

    product.status = 'approved'
    await product.save({ session })

    await NotiModel.create(
      [
        {
          userId: product.user,
          title: 'Your product has been approved',
          actionType: 'approved',
          productId: product._id,
        },
      ],
      { session }
    )

    await session.commitTransaction()
    await sendUnreadCountToClients(product.user, 1)

    return res.status(200).json({
      success: true,
      message: 'Product status updated to "approved"',
      product,
    })
  } catch (error) {
    await session.abortTransaction()
    console.error('Error updating product status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update product status',
    })
  } finally {
    session.endSession()
  }
}

export const deleteAllProducts = async (req, res) => {
  try {
    const result = await ProductModel.deleteMany()
    await NotiModel.deleteMany()

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No products found to delete' })
    }

    res.status(200).json({ message: 'All products deleted successfully' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to delete products', error: error.message })
  }
}

const calculateDiscount = (originalPrice, discount) => {
  const discountAmount = (discount / 100) * originalPrice
  const newPrice = originalPrice - discountAmount

  return {
    newPrice: Math.round(newPrice * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
  }
}
