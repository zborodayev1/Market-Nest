import mongoose from 'mongoose'

const DeliveryShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      default: 'No description',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    time: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Delivery', DeliveryShema)
