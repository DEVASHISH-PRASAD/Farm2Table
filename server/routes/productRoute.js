import { Router } from "express";
import { createProduct, getAllItems } from "../controllers/productController.js";
import upload from "../middlewares/multer.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/authMiddleware.js";


const router =Router();

router.get('/',getAllItems);
router.post('/createitem',isLoggedIn,authorizeRoles("ADMIN"),upload.single('image'),createProduct);


export default router;