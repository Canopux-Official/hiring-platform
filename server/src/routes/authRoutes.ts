import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  changePassword,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../utils/validators";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.patch("/change-password", authenticate, changePassword);

export default router;