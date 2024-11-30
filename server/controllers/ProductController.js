import mongoose from 'mongoose'
import ProductModel from '../models/product.js'
import UserModel from '../models/user.js'
import dayjs from 'dayjs'

export const createProduct = async (req, res) => {
  try {
    const doc = new ProductModel({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      tags: req.body.tags,
      user: req.userId,
      image: req.body.image,
      price: req.body.price,
      description: req.body.description,
    })

    const product = await doc.save()

    res.status(201).json({
      ...product.toObject(),
      createdAt: dayjs(product.createdAt).format('YY-MM-DD'),
      updatedAt: dayjs(product.updatedAt).format('YY-MM-DD'),
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to create product' })
  }
}

export const getOneProduct = async (req, res) => {
  try {
    const productId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    // Поиск продукта и увеличение счетчика просмотров
    const product = await ProductModel.findOneAndUpdate(
      { _id: productId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after', lean: true } // возвращаем обычный объект, а не Mongoose document
    )

    // Проверяем, если продукт не найден
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Успешный ответ с данными продукта
    res.json({
      ...product, // Спредим данные из продукта
      createdAt: dayjs(product.createdAt).format('YY-MM-DD'), // Форматируем даты
      updatedAt: dayjs(product.updatedAt).format('YY-MM-DD'),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to get product' })
  }
}

export const patchProduct = async (req, res) => {
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

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    )

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({
      ...updatedProduct.toObject(),
      createdAt: dayjs(updatedProduct.createdAt).format('YY-MM-DD'),
      updatedAt: dayjs(updatedProduct.updatedAt).format('YY-MM-DD'),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update product' })
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

export const addProductToBag = async (req, res) => {
  try {
    const userId = req.userId
    const productId = req.params.id

    // Проверка на валидность ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Проверяем, есть ли уже продукт в корзине
    const existingProductIndex = user.bag.findIndex(
      (item) => item.product.toString() === productId
    )

    // Если продукта нет в корзине, добавляем его
    if (existingProductIndex === -1) {
      user.bag.push({
        product: new mongoose.Types.ObjectId(productId), // Используем new для создания ObjectId
      })
    }

    await user.save()

    // Популяция корзины с продуктами, чтобы вернуть подробную информацию
    const populatedUser =
      await UserModel.findById(userId).populate('bag.product')

    res.status(200).json({
      message: 'Product added to bag',
      bag: populatedUser.bag, // Возвращаем корзину с полными данными о продуктах
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to add product to bag' })
  }
}

export const fetchBag = async (req, res) => {
  try {
    const userId = req.userId
    console.log('Fetching bag for user:', userId)

    const user = await UserModel.findById(userId).populate({
      path: 'bag.product',
      model: 'Product',
    })

    if (!user) {
      console.log('User not found')
      return res.status(404).json({ message: 'User not found' })
    }

    console.log('User bag:', user.bag)

    if (!user.bag || user.bag.length === 0) {
      return res.status(200).json({
        message: 'Bag is empty',
        bag: [],
      })
    }

    res.status(200).json({
      message: 'Bag successfully loaded',
      bag: user.bag,
    })
  } catch (err) {
    console.error('Error fetching bag:', err)
    res.status(500).json({ message: 'Failed to load bag' })
  }
}
