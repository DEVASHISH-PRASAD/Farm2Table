import { Router } from "express";
import { getAllItems } from "../controllers/productController.js";

const router =Router();

router.get('/',getAllItems);


export default router;