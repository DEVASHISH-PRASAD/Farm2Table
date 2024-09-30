import mongoose from 'mongoose';

// Define the Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Trim whitespace from name
  },
  category: {
    type: String,
    required: true,
    enum: ['fruits', 'vegetables', 'grains'], // Only allow certain categories
  },
  pricePerUnit: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true, // URL of the product image
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically add creation date
  },
});

// Create the Product Model
const Product = mongoose.model('Product', productSchema);

export default Product;
