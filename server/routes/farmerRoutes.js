import express from "express";
import {
  addProduct,
  updateStock,
  deleteProduct,
  getFarmerProducts,
  getOrdersReceived,
  updateProfile,
} from "../controllers/farmerController.js";
import { isLoggedIn,  } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add a new product
router.post("/product", isLoggedIn, addProduct);

// Update product stock
router.put("/product/stock", isLoggedIn, updateStock);

// Delete a product
router.delete("/product/:productId", isLoggedIn, deleteProduct);

// Get all products added by the farmer
router.get("/products", isLoggedIn, getFarmerProducts);

// Get orders placed for farmer's products
router.get("/orders", isLoggedIn, getOrdersReceived);

// Update farmer profile
router.put("/profile", isLoggedIn, updateProfile);

export default router;
