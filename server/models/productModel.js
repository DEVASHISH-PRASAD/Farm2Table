import mongoose from 'mongoose'

// Define the Item schema
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
    type: String,
    required: true, // Price format can be string to handle currency symbols
  },
  category: {
    type: String,
    enum: ['fruits', 'grains', 'vegetables'], // Allowed categories
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0, // Default quantity is 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Item model
const Item = mongoose.model('Item', itemSchema);

export default Item;
