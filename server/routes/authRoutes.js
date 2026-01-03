import express from "express";
import {
  signup,
  login,
  sendSignupOtp,
  verifyOtp, // 👈 IMPORT THIS
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendSignupOtp);
router.post("/verify-otp", verifyOtp); // 👈 ADD THIS LINE
router.post("/signup", signup);
router.post("/login", login);

export default router;
