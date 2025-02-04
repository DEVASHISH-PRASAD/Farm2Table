import express from "express";
import { itemSales, monthlySales, orderSales, userSignups } from "../controllers/AdminController/analyticsController.js";


const router = express.Router();

router.get("/user-signups",userSignups);
router.get("/order-sales",orderSales);
router.get("/item-sales",itemSales);
router.get("/monthly-sales",monthlySales);

export default router;