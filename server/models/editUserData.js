import mongoose from 'mongoose'

const UserEditDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    phoneChangeVerificationCode: {
      type: String,
      default: '',
    },
    emailChangeVerificationCode: {
      type: String,
      default: '',
    },
    passwordChangeVerificationCode: {
      type: String,
      default: '',
    },
    newPhone: {
      type: String,
      unique: true,
      default: '',
    },
    newEmail: {
      type: String,
      unique: true,
      default: '',
    },
    newPassword: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

export const UserEditDataModel = mongoose.model(
  'UserEditData',
  UserEditDataSchema
)
