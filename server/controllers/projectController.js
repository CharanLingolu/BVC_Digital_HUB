import Project from "../models/Project.js";
import mongoose from "mongoose";

// CREATE
export const createProject = async (req, res) => {
  try {
    const media = req.files?.map((file) => file.path) || [];
    const project = await Project.create({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      repoLink: req.body.repoLink,
      techStack: req.body.techStack ? req.body.techStack.split(",") : [],
      media,
    });
    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    res.status(500).json({ message: "Creation failed" });
  }
};

// GET BY ID
export const getProjectById = async (req, res) => {
  try {
    // Safety check: validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Project ID" });
    }

    const project = await Project.findById(req.params.id).populate(
      "user",
      "name email department profilePic"
    );
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Error fetching project" });
  }
};

// GET ALL
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("user", "name email department profilePic")
      .sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// GET MY PROJECTS
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user projects" });
  }
};

// DELETE
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await project.deleteOne();
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed" });
  }
};

// LIKE / UNLIKE — FIXED LOGIC
export const likeProject = async (req, res) => {
  try {
    const userId = req.user?._id; // Ensure user exists
    const projectId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Please login" });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check if already liked
    const alreadyLiked = project.likes.includes(userId);

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      alreadyLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true }
    );

    res.status(200).json({ likes: updatedProject.likes });
  } catch (err) {
    console.error("Like Error:", err);
    res.status(500).json({ message: "Like action failed" });
  }
};

// UPDATE (EDIT PROJECT + MEDIA)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
      title,
      description,
      repoLink,
      techStack,
      removedMedia = [],
    } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (repoLink) project.repoLink = repoLink;

    // Fix: Handle techStack update
    if (techStack) {
      project.techStack = techStack.split(",");
    }

    if (Array.isArray(removedMedia) && removedMedia.length > 0) {
      project.media = project.media.filter((m) => !removedMedia.includes(m));
    }

    const newMedia = req.files?.map((f) => f.path) || [];
    if (newMedia.length > 0) {
      project.media.push(...newMedia);
    }

    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};
