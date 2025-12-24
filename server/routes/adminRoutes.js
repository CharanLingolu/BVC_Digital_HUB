import express from "express";
import upload from "../middleware/upload.js";

// Import Controllers
// (Make sure these paths match where you created the files)
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/adminEventController.js";

import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/adminJobController.js";

// You might also have user/staff controllers imported here
// import { ... } from "../controllers/adminStaffController.js";

const router = express.Router();

/* ================= EVENTS ROUTES ================= */
// GET all events
router.get("/events", getEvents);

// CREATE event (needs image upload middleware)
router.post("/events", upload.single("banner"), createEvent);

// UPDATE event (needs image upload middleware)
router.put("/events/:id", upload.single("banner"), updateEvent);

// DELETE event
router.delete("/events/:id", deleteEvent);

/* ================= JOBS ROUTES ================= */
// GET all jobs
router.get("/jobs", getJobs);

// CREATE job
router.post("/jobs", createJob);

// UPDATE job
router.put("/jobs/:id", updateJob);

// DELETE job
router.delete("/jobs/:id", deleteJob);

export default router;
