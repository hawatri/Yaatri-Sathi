import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  verifyOtp,
  forgotPassword
} from '../controllers/auth.controller.js';
const router = express.Router();

// Authentication
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);

export default router;
