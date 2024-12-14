import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    noti: [
      {
        type: {
          type: String,
          enum: ['info', 'warning', 'error', 'success'],
          required: true,
          default: 'info',
        },
        message: {
          type: String,
          required: true,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
        productImageUrl: {
          type: String,
          default: 'http://defaulturl.com/defaultimage.png',
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        actionType: {
          type: String,
          enum: ['created', 'approved', 'rejected'],
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  {
    timestamps: true, // Автоматически добавляет createdAt и updatedAt
  }
)

export default mongoose.model('User', UserSchema)
