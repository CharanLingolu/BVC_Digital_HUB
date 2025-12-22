import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createProject,
  getAllProjects,
  getMyProjects,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();
import { likeProject } from "../controllers/projectController.js";

router.post("/:id/like", protect, likeProject);
router.post("/", protect, createProject);
router.get("/", protect, getAllProjects);
router.get("/my", protect, getMyProjects);
router.delete("/:id", protect, deleteProject);

export default router;
