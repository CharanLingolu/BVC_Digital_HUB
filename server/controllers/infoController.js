import Staff from "../models/Staff.js";
import Event from "../models/Event.js";
import Job from "../models/Job.js";

// 👨‍🏫 Get all staff
export const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ department: 1 });
    res.status(200).json(staff);
  } catch {
    res.status(500).json({ message: "Failed to fetch staff" });
  }
};

// 🎉 Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.status(200).json(events);
  } catch {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// 💼 Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};
