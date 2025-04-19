import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
    type: Number, // Changed from String to Number
    required: true,
  },
  category: {
    type: String,
    enum: ["fruits", "grains", "vegetables"], // Note: Case differs from controller (Vegetables vs vegetables)
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  soldInPieces: {
    type: Boolean,
    default: false,
  },
  soldInDozen: {
    type: Boolean,
    default: false,
  },
  soldByWeight: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: "", // Added to match addProduct
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
    required: true, // Links to the farmer who owns the item
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  monthlySales: {
    type: Number,
    default: 0,
  },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
