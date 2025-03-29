import express from "express";
import {
  purchaseProduct,
  getOrderHistory,
  getAvailableProducts,
  updateProfile,
} from "../controllers/wholesalerController.js";
import {isLoggedIn }from "../middlewares/authMiddleware.js";

const router = express.Router();

// Purchase a product (Wholesaler)
router.post("/purchase", isLoggedIn, purchaseProduct);

// Get wholesaler order history
router.get("/orders", isLoggedIn, getOrderHistory);

// Get available products
router.get("/products", isLoggedIn, getAvailableProducts);

// Update wholesaler profile
router.put("/profile", isLoggedIn, updateProfile);

export default router;
