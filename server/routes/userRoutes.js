import { Router } from "express";
import { login, register } from "../controllers/userController.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login",login);

export default router;
