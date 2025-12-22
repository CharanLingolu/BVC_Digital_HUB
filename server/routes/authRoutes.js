import express from "express";
// Initialize the router
const router = express.Router(); 

import { signup, verifyOtp, login } from "../controllers/authController.js";

// Routes
router.post("/signup", signup);      // Step 1: User registers, system sends OTP
router.post("/verify-otp", verifyOtp); // Step 2: User submits OTP to activate account
router.post("/login", login);        // Step 3: Standard login

export default router;