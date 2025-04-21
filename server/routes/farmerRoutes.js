// routes/farmerRoutes.js
import express from "express";
import {
  addProduct,
  updateStock,
  deleteProduct,
  getFarmerProducts,
  getOrdersReceived,
  updateProfile,
  getAllFarmerProducts,
  getFarmerProfile,
  getMyProducts,
  updateOrderDeliveryStatus,
  updateProduct,
  createAdminOrder,
  getAllUsers,
} from "../controllers/farmerController.js";
import { isLoggedIn,authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Farmer routes
router.get("/profile", authorizeRoles("FARMER"), getFarmerProfile);
router.post("/products/add", isLoggedIn,upload.single("image"), addProduct);
router.patch("/products/update-stock", isLoggedIn, updateStock);
router.delete("/products/:productId", isLoggedIn, deleteProduct);
router.get("/products/my-products", restrictTo("FARMER"), getMyProducts);
router.get("/products/my-products", isLoggedIn, getFarmerProducts);
router.get("/orders", isLoggedIn, getOrdersReceived);
router.patch("/profile", isLoggedIn, updateProfile);
router.patch(
  "/products/update",
  authorizeRoles("FARMER"),
  upload.single("image"),
  updateProduct
);
router.get("/products/my-products", authorizeRoles("FARMER"), getMyProducts);
router.get("/orders", authorizeRoles("FARMER"), getOrdersReceived);
router.patch(
  "/orders/delivery-status",
  authorizeRoles("FARMER"),
  updateOrderDeliveryStatus
);

// Admin route
router.get("/products/all", authorizeRoles("ADMIN"), getAllFarmerProducts);
router.post("/orders/admin", authorizeRoles("ADMIN"), createAdminOrder);
router.get("/users", authorizeRoles("ADMIN"), getAllUsers);

export default router;