// models/farmerModel.js
import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    unique: true, // Unique within the farmer's products
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
  },
  category: {
    type: String,
    enum: ["fruits", "grains", "vegetables"],
    required: [true, "Category is required"],
  },
  description: {
    type: String,
    default: "",
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
  monthlySales: {
    type: Number,
    default: 0,
    min: [0, "Monthly sales cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const farmerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "UserData",
      required: [true, "User ID is required"],
      unique: true,
    },
    farmName: {
      type: String,
      required: [true, "Farm name is required"],
      trim: true,
      minlength: [2, "Farm name must be at least 2 characters"],
      maxlength: [100, "Farm name cannot exceed 100 characters"],
    },
    farmSize: {
      type: Number,
      required: [true, "Farm size is required"],
      min: [0.1, "Farm size must be at least 0.1 acres/hectares"],
      validate: {
        validator: Number.isFinite,
        message: "Farm size must be a valid number",
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, "Location coordinates are required"],
      },
    },
    products: [productSchema], // Embedded product schema
    certifications: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) =>
          arr.every((cert) => typeof cert === "string" && cert.length > 0),
        message: "Certifications must be non-empty strings",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
farmerSchema.index({ location: "2dsphere" });
farmerSchema.index({ user: 1 });

const Farmer = model("Farmer", farmerSchema);
export default Farmer;
