import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();
import { followUser } from "../controllers/userController.js";

router.post("/follow/:id", protect, followUser);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateProfile);

export default router;
