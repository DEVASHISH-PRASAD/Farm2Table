import { Schema, model } from "mongoose";

const farmerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserData",
    required: true,
  },
  farmName: {
    type: String,
    required: true,
  },
  farmSize: {
    type: Number, // Acres or hectares
    required: true,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  certifications: {
    type: [String], // Organic certification, etc.
    default: [],
  },
});

const Farmer = model("Farmer", farmerSchema);
export default Farmer;
