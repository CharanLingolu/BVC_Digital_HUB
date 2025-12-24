import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getStaff, getEvents, getJobs, getEventById } from "../controllers/infoController.js";
import { getStaffById } from "../controllers/staffController.js";
import { applyForJob } from "../controllers/infoController.js";
const router = express.Router();

router.post("/jobs/:id/apply", applyForJob);

router.get("/staff", protect, getStaff);
router.get("/events", protect, getEvents);
router.get("/jobs", protect, getJobs);
router.get("/staff/:id", protect, getStaffById);
router.get("/events/:id", getEventById);

export default router;
