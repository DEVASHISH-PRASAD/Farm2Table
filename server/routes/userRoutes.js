import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  register,
  requestResetPassword,
  resetPassword,
} from "../controllers/userController.js";
import upload from "../middlewares/multer.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/me", isLoggedIn, getProfile);
router.get("/logout", logout);
router.post("/request-password-reset",requestResetPassword)
router.post("/reset-password", resetPassword);


export default router;
