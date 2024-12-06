import mongoose from 'mongoose'
import ProductModel from '../models/product.js'
import dayjs from 'dayjs'

export const createProduct = async (req, res) => {
  try {
    const product = await ProductModel.create({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      tags: req.body.tags,
      user: req.userId,
      image: req.body.image,
      price: req.body.price,
      description: req.body.description,
    })

    res.status(201).json({
      ...product.toObject(),
      createdAt: dayjs(product.createdAt).format('YY-MM-DD'),
      updatedAt: dayjs(product.updatedAt).format('YY-MM-DD'),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create product' })
  }
}

export const getOneProduct = async (req, res) => {
  const session = await mongoose.startSession() // Инициализация транзакции

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
    const updateData = {
      name: req.body.name,
      tags: req.body.tags,
      image: req.body.image,
      price: req.body.price,
      description: req.body.description,
      updatedAt: new Date(),
    }

    session.startTransaction()

    const product = await ProductModel.findById(productId).session(session)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, session }
    )

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
    const result = await ProductModel.deleteOne({ _id: req.params.id })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ message: 'Product deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete product' })
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find()
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

export const addDiscount = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    const productId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    const { discount } = req.body

    if (typeof discount !== 'number' || discount < 0 || discount > 100) {
      return res
        .status(400)
        .json({ message: 'Discount must be a number between 0 and 100' })
    }

    session.startTransaction()

    const product = await ProductModel.findById(productId).session(session)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const discountAmount = (discount / 100) * product.price
    const newPrice = product.price - discountAmount

    const oldPrice = product.price
    const price = Math.round(newPrice * 100) / 100
    const saveAmount = Math.round(discountAmount * 100) / 100

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        discount,
        price,
        oldPrice,
        saveAmount,
        updatedAt: new Date(),
      },
      { new: true, session }
    )

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
