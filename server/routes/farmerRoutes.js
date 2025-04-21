import express from "express";
import {
  addProduct,
  updateStock,
  deleteProduct,
  getMyProducts,
  getOrdersReceived,
  updateOrderDeliveryStatus,
  updateProfile,
  getFarmerProfile,
  getAllFarmerProducts,
  createAdminOrder,
  getAllUsers,
} from "../controllers/farmerController.js";
import { isLoggedIn, authorizeRoles } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();


router.get("/profile", isLoggedIn, getFarmerProfile);
router.patch("/profile", isLoggedIn, updateProfile);
router.post("/products/add", isLoggedIn, upload.single("image"), addProduct);
router.patch("/products/update-stock", isLoggedIn, updateStock);
router.delete("/products/:productId", isLoggedIn, deleteProduct);
router.get("/products/my-products", isLoggedIn, getMyProducts);
router.get("/orders", isLoggedIn, getOrdersReceived);
router.patch(
  "/orders/delivery-status",
  updateOrderDeliveryStatus
);
router.get(
  "/products/all",
  isLoggedIn,
  getAllFarmerProducts
);
router.post(
  "/orders/admin",
  isLoggedIn,
  createAdminOrder
);
router.get("/users", isLoggedIn, getAllUsers);

export default router;
