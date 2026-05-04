import { Router } from "express";
import {
  sendOtpController,
  verifyOtpController,
  logoutController,
} from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/logout", verifyToken, logoutController);

export default router;
