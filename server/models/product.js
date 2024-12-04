import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tags: {
      type: [String], // Четко указываем, что это массив строк
      required: true,
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Цена должна быть положительной
    },
    oldPrice: {
      type: Number,
      min: 0, // Старая цена тоже должна быть положительной
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100, // Указываем допустимый диапазон скидок
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    viewedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 500, // Ограничиваем длину описания
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Product', ProductSchema)
