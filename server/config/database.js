import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('DB connected!')
  } catch (err) {
    console.error('DB error:', err)
    process.exit(1)
  }
}
