import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getStaff, getEvents, getJobs } from "../controllers/infoController.js";

const router = express.Router();

router.get("/staff", protect, getStaff);
router.get("/events", protect, getEvents);
router.get("/jobs", protect, getJobs);

export default router;
