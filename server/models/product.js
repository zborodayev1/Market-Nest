import mongoose from 'mongoose'

const ProductShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
      default: '',
    },
    price: {
      type: Number,
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
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
      required: false,
      unique: false,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    _id: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
)
export default mongoose.model('Product', ProductShema)
