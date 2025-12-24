import Project from "../models/Project.js";

// CREATE
export const createProject = async (req, res) => {
  try {
    const media = req.files?.map((file) => file.path) || [];
    const project = await Project.create({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      repoLink: req.body.repoLink,
      techStack: req.body.techStack?.split(",") || [],
      media,
    });
    res.status(201).json({ message: "Project created", project });
  } catch {
    res.status(500).json({ message: "Creation failed" });
  }
};

// GET BY ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "user",
      "name email department profilePic"
    );
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
    res.status(500).json({ message: "Deletion failed" });
  }
};

// LIKE / UNLIKE
export const likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const userId = req.user._id.toString();
    const isLiked = project.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      project.likes = project.likes.filter((id) => id.toString() !== userId);
    } else {
      project.likes.push(userId);
    }

    await project.save();
    res.status(200).json({ likes: project.likes });
  } catch {
    res.status(500).json({ message: "Like failed" });
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

    const { title, description, repoLink, removedMedia = [] } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (repoLink) project.repoLink = repoLink;

    if (Array.isArray(removedMedia)) {
      project.media = project.media.filter((m) => !removedMedia.includes(m));
    }

    const newMedia = req.files?.map((f) => f.path) || [];
    project.media.push(...newMedia);

    await project.save();
    res.status(200).json(project);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};
