import mongoose from 'mongoose'

const UnverifiedUserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  verificationCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('UnverifiedUser', UnverifiedUserSchema)
