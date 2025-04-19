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
    type: String, 
    required: true,
  },
  category: {
    type: String,
    enum: ["fruits", "grains", "vegetables"],
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
  // field for tracking sales per month
  monthlySales: {
    type: Number,
    default: 0,
  },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
