import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getStaff,
  getEvents,
  getJobs,
  getEventById,
  getJobById,
  getStats,
  applyForJob,
} from "../controllers/infoController.js";
import { getStaffById } from "../controllers/staffController.js";

const router = express.Router();

/**
 * --- PUBLIC ROUTES ---
 */
router.get("/stats", getStats);

/**
 * --- PROTECTED ROUTES (Requires Login) ---
 */
// Staff Routes
router.get("/staff", protect, getStaff);
router.get("/staff/:id", protect, getStaffById);

// Event Routes
router.get("/events", protect, getEvents);
router.get("/events/:id", getEventById);

// Job Routes
router.get("/jobs", protect, getJobs);
router.get("/jobs/:id", protect, getJobById);
router.post("/jobs/:id/apply", applyForJob);

export default router;
