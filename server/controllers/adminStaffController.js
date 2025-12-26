import Staff from "../models/Staff.js";

/* ➕ ADD STAFF */
export const addStaff = async (req, res) => {
  try {
    const staff = await Staff.create({
      ...req.body,              // includes name, role, email, etc.
      photo: req.file?.path || "" // Cloudinary photo URL
    });

    res.status(201).json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add staff" });
  }
};

/* 📄 GET ALL STAFF */
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch staff" });
  }
};

/* ✏️ UPDATE STAFF */
export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Update normal fields (including email)
    Object.assign(staff, req.body);

    // Update photo if uploaded
    if (req.file) {
      staff.photo = req.file.path;
    }

    await staff.save();

    res.json({ message: "Staff updated successfully", staff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update staff" });
  }
};

/* 🗑️ DELETE STAFF */
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete staff" });
  }
};
