import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
  createProject,
  getAllProjects,
  getMyProjects,
  deleteProject,
  getProjectById,
  likeProject,
  updateProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/:id/like", protect, likeProject);
router.post("/", protect, upload.array("media", 5), createProject);
router.get("/", getAllProjects);
router.get("/my", protect, getMyProjects);
router.put("/:id", protect, upload.array("media", 5), updateProject);
router.delete("/:id", protect, deleteProject);
router.get("/:id", getProjectById);

export default router;
