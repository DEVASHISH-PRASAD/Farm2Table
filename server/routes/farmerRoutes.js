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


router.get("/profile", authorizeRoles("FARMER"), getFarmerProfile);
router.patch("/profile", authorizeRoles("FARMER"), updateProfile);
router.post(
  "/products/add",
  authorizeRoles("FARMER"),
  upload.single("image"),
  addProduct
);
router.patch("/products/update-stock", authorizeRoles("FARMER"), updateStock);
router.delete("/products/:productId", authorizeRoles("FARMER"), deleteProduct);
router.get("/products/my-products", authorizeRoles("FARMER"), getMyProducts);
router.get("/orders", authorizeRoles("FARMER"), getOrdersReceived);
router.patch(
  "/orders/delivery-status",
  authorizeRoles("FARMER"),
  updateOrderDeliveryStatus
);
router.get("/products/all", authorizeRoles("ADMIN"), getAllFarmerProducts);
router.post("/orders/admin", authorizeRoles("ADMIN"), createAdminOrder);
router.get("/users", authorizeRoles("ADMIN"), getAllUsers);

export default router;
