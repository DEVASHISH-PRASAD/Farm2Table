import {Router} from "express";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/AdminController/userAdminController.js";
import upload from "../middlewares/multer.js";
import { createProduct, updateProductPrice, updateProductQuantity } from "../controllers/productController.js";
const router = Router();

/**
 * USER MANAGEMENT ROUTES
 */
router.get("/users", getAllUsers);
router.put("/update-role/:userId", updateUserRole);
router.delete("/delete-user/:userId", deleteUser);



/**
 * PRODUCT MANAGEMENT ROUTES
 */

router.post('/createitem',upload.single('image'),createProduct);
router.put('/update-quantity/:id', updateProductQuantity);
router.put('/update-price/:id', updateProductPrice);

export default router;