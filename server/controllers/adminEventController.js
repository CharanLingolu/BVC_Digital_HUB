import Event from "../models/Event.js";

// Get All Events
export const getEvents = async (req, res) => {
  try {
    // Sort by date ascending (soonest events first)
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Event
export const createEvent = async (req, res) => {
  try {
    const { title, date, time, location, description, category } = req.body;

    // Handle Cloudinary Image Upload
    let banner = "";
    if (req.file) {
      banner = req.file.path; // Cloudinary URL
    }

    const newEvent = new Event({
      title,
      date,
      time,
      location,
      description,
      category,
      banner,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Update banner only if a new file is uploaded
    if (req.file) {
      updates.banner = req.file.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
