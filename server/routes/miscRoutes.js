import { Router } from "express";
import { contactUs } from "../controllers/miscController.js";

const router = Router();

router.post('/contact',contactUs)

export default router;