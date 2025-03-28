import mongoose from 'mongoose';

const NotiSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    actionType: {
      type: String,
      enum: ['created', 'approved', 'info', 'error', 'deleted'],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Noti', NotiSchema);
