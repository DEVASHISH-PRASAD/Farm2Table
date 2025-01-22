import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Prevent duplicates
    trim: true,
  },
  img: {
    public_id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  price: {
    type: String, // String type to handle currency symbol
    required: true,
  },
  category: {
    type: String,
    enum: ['fruits', 'grains', 'vegetables'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  soldInPieces: {
    type: Boolean,
    default: false, // False by default
  },
  soldInDozen: {
    type: Boolean,
    default: false, // False by default
  },
  soldByWeight: {
    type: Boolean,
    default: true, // True by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
