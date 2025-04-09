import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['preparing', 'shipped', 'delivered', 'cancelled'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    time: {
      type: Date,
      default: Date.now,
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Delivery',
      required: true,
    },
    timeToDelivery: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
OrderSchema.virtual('timeRemaining').get(function () {
  const now = new Date();
  const timeToDelivery = new Date(this.timeToDelivery);
  const timeDiff = timeToDelivery - now;

  const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesRemaining = Math.floor(
    (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
  );

  return {
    days: daysRemaining,
    hours: hoursRemaining,
    minutes: minutesRemaining,
  };
});

OrderSchema.set('toJSON', {
  virtuals: true,
});

export default mongoose.model('Order', OrderSchema);
