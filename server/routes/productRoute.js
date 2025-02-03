import { Router } from "express";
import { getAllItems, updateStockAfterPurchase } from "../controllers/productController.js";

const router =Router();

router.get('/',getAllItems);
router.patch("/update-stock", updateStockAfterPurchase);

export default router;