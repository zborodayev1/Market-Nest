import mongoose from 'mongoose'

const MainShema = new mongoose.Schema(
  {
    language: {
      type: String,
      default: 'en',
    },
    currency: {
      type: String,
      default: 'usd',
    },
  },
  {
    timestamps: true,
  }
)
export default mongoose.model('Main', MainShema)
