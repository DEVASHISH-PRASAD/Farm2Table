import { Router } from "express";
import { register } from "../controllers/userController.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);

export default router;
