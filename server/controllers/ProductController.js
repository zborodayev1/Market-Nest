import cloudinary from 'cloudinary';
import dayjs from 'dayjs';
import mongoose from 'mongoose';
import DeliveryModel from '../models/delivery.js';
import NotiModel from '../models/noti.js';
import OrderModel from '../models/order.js';
import ProductModel from '../models/product.js';
import TransactionModel from '../models/transaction.js';
import UserModel from '../models/user.js';
import WalletModel from '../models/wallet.js';
import { sendUnreadCountToClients } from '../webSokets/functions/sendUnreadCountToClients/sendUnreadCountToClients.js';

export const createProduct = async (req, res) => {
  try {
    const { name, tags, price } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    if (!name || name.length <= 5 || !tags || !price || price <= 0) {
      const errors = [];
      if (!name || name.length <= 5) errors.push('name (> 5 characters)');
      if (!tags) errors.push('tags (>= 1 tag)');
      if (!price || price <= 0) errors.push('price (> 0)');

      return res.status(400).json({
        success: false,
        message: `All fields are required: ${errors.join(', ')}`,
      });
    }

    const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);

    const product = await ProductModel.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      tags: parsedTags,
      price,
      image: req.file.path,
      public_id: req.file.filename,
      user: req.userId,
      status: 'pending',
    });

    await NotiModel.create({
      userId: req.userId,
      actionType: 'created',
      title: `Your product`,
      productName: product.name,
      title2: `has been created`,
      productId: product._id,
    });

    await sendUnreadCountToClients(req.userId, 1);

    return res.status(201).json({
      success: true,
      product,
      message: 'Product created successfully and notification sent.',
    });
  } catch (error) {
    console.error('Error during product creation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

export const getOneProduct = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    session.startTransaction();

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { viewsCount: 1 } },
      { new: true, session }
    ).populate('user', 'fullName email phone address city country avatarUrl');

    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Product not found' });
    }

    await session.commitTransaction();

    return res.json({
      ...product.toObject(),
      createdAt: dayjs(product.createdAt).format('YYYY-MM-DD'),
      updatedAt: dayjs(product.updatedAt).format('YYYY-MM-DD'),
    });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ message: 'Failed to get product' });
  } finally {
    session.endSession();
  }
};

export const patchProduct = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    session.startTransaction();

    const { name } = req.body;

    const price = Number(req.body.price);

    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (error) {
        await session.abortTransaction();
        console.error(error);
        return res.status(400).json({ message: 'Invalid tags format' });
      }
    }

    const imageFile = req.file;

    if (
      !name ||
      !Array.isArray(tags) ||
      tags.length === 0 ||
      price === undefined ||
      price === null ||
      Number(price) < 0
    ) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = await ProductModel.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = {
      name,
      tags,
      price,
      updatedAt: new Date(),
    };

    if (imageFile) {
      if (product.public_id) {
        await cloudinary.uploader.destroy(product.public_id);
      }

      updateData.image = imageFile.path;
      updateData.public_id = imageFile.filename;
    }

    updateData.oldPrice = product.price;
    updateData.price = price;

    if (updateData.price < updateData.oldPrice) {
      updateData.saveAmount = updateData.oldPrice - updateData.price;
    } else {
      updateData.saveAmount = null;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, session }
    );

    if (!updatedProduct) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Product not found' });
    }

    await NotiModel.create(
      [
        {
          userId: updatedProduct.user,
          title: `Your product`,
          productName: updatedProduct.name,
          title2: `has been updated`,
          actionType: `approved`,
          productId: productId,
        },
      ],
      { session }
    );

    await sendUnreadCountToClients(updatedProduct.user, 1);

    await session.commitTransaction();

    res.json({
      ...updatedProduct.toObject(),
      createdAt: dayjs(updatedProduct.createdAt).format('YYYY-MM-DD'),
      updatedAt: dayjs(updatedProduct.updatedAt).format('YYYY-MM-DD'),
    });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);

    res.status(500).json({ message: 'Failed to update product' });
  } finally {
    session.endSession();
  }
};

export const buyProduct = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const productId = req.params.id;
    const count = req.body;
    const deliveryId = req.params.deliveryId;
    const buyerId = req.userId;

    if (!count || count <= 0) {
      return res.status(400).json({
        message: 'Invalid product count',
      });
    }

    session.startTransaction();

    const product = await ProductModel.findById(productId).session(session);

    if (!product || product.status !== 'approved') {
      await session.abortTransaction();
      return res.status(404).json({
        message: 'Product not found or not approved',
      });
    }

    const delivery = await DeliveryModel.findById(deliveryId).session(session);
    if (!delivery) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Delivery not found' });
    }

    const buyerWallet = await WalletModel.findOne({ user: buyerId }).session(
      session
    );
    if (!buyerWallet) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Buyer wallet not found' });
    }

    const totalPrice = product.price * count;
    if (buyerWallet.balance < totalPrice) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Not enough balance' });
    }

    const sellerWallet = await WalletModel.findOne({
      user: product.user._id,
    }).session(session);

    if (!sellerWallet) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Seller wallet not found' });
    }

    buyerWallet.balance -= totalPrice;
    buyerWallet.expenses += totalPrice;

    sellerWallet.balance += totalPrice;
    sellerWallet.income += totalPrice;

    await buyerWallet.save();
    await sellerWallet.save();

    const buyerTransaction = new TransactionModel({
      amount: -totalPrice,
      type: 'expense',
      description: `Purchase of ${count} ${product.name}`,
      wallet: buyerWallet._id,
    });

    const sellerTransaction = new TransactionModel({
      amount: totalPrice,
      type: 'income',
      description: `Sale of ${count} ${product.name}`,
      wallet: sellerWallet._id,
    });

    await buyerTransaction.save();
    await sellerTransaction.save();

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { ordersCount: count } },
      { new: true, session }
    );

    timeToDelivery = delivery.time * (1000 * 60 * 60 * 24);

    const order = new OrderModel({
      type: 'preparing',
      user: buyerId,
      product: [productId],
      delivery: delivery._id,
      timeToDelivery: timeToDelivery,
    });

    await NotiModel.create({
      userId: req.userId,
      actionType: 'created',
      title: `Your product`,
      productName: product.name,
      title2: `has been bought`,
      productId: product._id,
    });

    await order.save();

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: 'Product bought successfully',
      product: updatedProduct,
      order,
      buyerWallet,
      sellerWallet,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: 'Failed to buy product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.userId;

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (
      user.role === 'admin' ||
      product.user.toString() === userId.toString()
    ) {
      if (product.public_id) {
        await cloudinary.uploader.destroy(product.public_id);
      }

      await ProductModel.findByIdAndDelete(productId);

      await NotiModel.create({
        userId: product.user,
        title: `Your product`,
        productName: product.name,
        title2: `has been deleted`,
        actionType: `deleted`,
        productId: productId,
      });

      await sendUnreadCountToClients(product.user, 1);

      return res.status(200).json({
        message: 'Product deleted successfully',
      });
    } else {
      return res.status(403).json({
        message: 'You do not have permission to delete this product',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to delete product',
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.min(Number(limit), 50);

    const filter = { status: 'approved' };

    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const total = await ProductModel.countDocuments(filter);

    const totalPages = Math.ceil(total / pageSize);

    const formattedProducts = products.map((product) => {
      let tags = [...product.tags];

      // discount tag

      if (product.saveAmount && product.saveAmount > 0) {
        if (!tags.includes('Discount')) {
          tags.push('Discount');
        }
      }

      // New tag

      const isNew = dayjs()
        .subtract(15, 'day')
        .isBefore(dayjs(product.createdAt));
      if (isNew && !tags.includes('New')) {
        tags.push('New');
      }

      // Popular tag

      // if (product.ordersCount && product.ordersCount > 100) {
      //   if (!tags.includes('Popular')) {
      //     tags.push('Popular');
      //   }
      // }
      return {
        ...product.toObject(),
        createdAt: dayjs(product.createdAt).format('YYYY-MM-DD'),
        updatedAt: dayjs(product.updatedAt).format('YYYY-MM-DD'),
        tags,
      };
    });

    res.json({
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages,
      products: formattedProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get products' });
  }
};

export const getPendingProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.min(Number(limit), 50);

    const filter = { status: 'pending' };

    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const total = await ProductModel.countDocuments(filter);

    const totalPages = Math.ceil(total / pageSize);

    const formattedProducts = products.map((product) => ({
      ...product.toObject(),
      createdAt: dayjs(product.createdAt).format('YYYY-MM-DD'),
      updatedAt: dayjs(product.updatedAt).format('YYYY-MM-DD'),
    }));

    res.json({
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages,
      products: formattedProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get pending products' });
  }
};

export const getProductsBySearch = async (req, res) => {
  try {
    const search = req.body.search;

    if (search.length > 50) {
      return res.status(400).json({ message: 'Search query too long' });
    }

    if (!search) {
      return res.status(400).json({ message: 'Search parameter is required' });
    }

    const products = await ProductModel.find({
      name: { $regex: search, $options: 'i' },
      status: 'approved',
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get products by search' });
  }
};

export const approveProduct = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const productId = req.params.id;
    const product = await ProductModel.findById(productId).session(session);

    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.status === 'approved') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Product is already approved',
      });
    }

    product.status = 'approved';
    await product.save({ session });

    await NotiModel.create(
      [
        {
          userId: product.user,
          title: 'Your product',
          productName: product.name,
          title2: 'has been approved',
          actionType: 'approved',
          productId: product._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    await sendUnreadCountToClients(product.user, 1);

    return res.status(200).json({
      success: true,
      message: 'Product status updated to "approved"',
      product,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating product status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product status',
    });
  } finally {
    session.endSession();
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({}, 'public_id');

    const deleteImagePromises = products
      .filter((product) => product.public_id)
      .map((product) => cloudinary.uploader.destroy(product.public_id));

    await Promise.all(deleteImagePromises);

    const result = await ProductModel.deleteMany();
    await NotiModel.deleteMany();

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No products found to delete' });
    }

    res
      .status(200)
      .json({ message: 'All products and images deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Failed to delete products', error: error.message });
  }
};
