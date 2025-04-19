import { Schema, model } from "mongoose";

const farmerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "UserData",
      required: [true, "User ID is required"],
      unique: true, // Ensure one farmer per user
    },
    farmName: {
      type: String,
      required: [true, "Farm name is required"],
      trim: true, // Remove leading/trailing whitespace
      minlength: [2, "Farm name must be at least 2 characters"],
      maxlength: [100, "Farm name cannot exceed 100 characters"],
    },
    farmSize: {
      type: Number, // Acres or hectares
      required: [true, "Farm size is required"],
      min: [0.1, "Farm size must be at least 0.1 acres/hectares"], // Prevent unrealistic values
      validate: {
        validator: Number.isFinite,
        message: "Farm size must be a valid number",
      },
    },
    location: {
      type: {
        type: String, // 'Point' for GeoJSON
        enum: ["Point"], // Only allow 'Point'
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude] per GeoJSON standard
        required: [true, "Location coordinates are required"],
      },
    },
    products: [
      {
        name: {
          type: String,
          required: [true, "Product name is required"],
          trim: true,
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
          required: [true, "Category is required"],
          enum: ["fruits", "grains", "vegetables"],
        },
        description: {
          type: String,
          default: "",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        monthlySales: {
          type: Number,
          default: 0,
        },
      },
    ],
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
    timestamps: true, // Add createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtuals in JSON output
    toObject: { virtuals: true },
  }
);

// Index for geospatial queries on location
farmerSchema.index({ location: "2dsphere" });

// Index for faster lookups by user
farmerSchema.index({ user: 1 });

// Virtual to populate products (optional, now redundant since products are embedded)
farmerSchema.virtual("productDetails", {
  ref: "Product", // This can be removed or adjusted if no separate Product model exists
  localField: "products",
  virtualField: "_id",
});

// Custom method to add a product (optional, for convenience)
farmerSchema.methods.addProduct = function (productData) {
  this.products.push(productData);
  return this.save();
};

const Farmer = model("Farmer", farmerSchema);
export default Farmer;
