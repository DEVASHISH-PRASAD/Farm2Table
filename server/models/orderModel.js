import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        weight: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Cancelled', 'Refunded'],
      default: 'Pending',
    },
    paymentId: {
      type: String,
      required: false, // Will be added after successful payment
    },
    signature: {
      type: String,
      required: false, // Will be added after payment verification
    },
    refundStatus: {
      type: String,
      enum: ['Not Requested', 'Requested', 'Refunded'],
      default: 'Not Requested',
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt'
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
