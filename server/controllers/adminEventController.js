import Event from "../models/Event.js";
import User from "../models/User.js";
import Staff from "../models/Staff.js";
import {sendEmail} from "../utils/sendEmail.js";

/* ================= GET ALL EVENTS ================= */
export const getEvents = async (req, res) => {
  try {
    // Sort by date ascending (soonest events first)
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CREATE EVENT + EMAIL ================= */
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

    /* ========== EMAIL NOTIFICATION LOGIC (ADDED) ========== */

    // Fetch all user emails
    const users = await User.find({ email: { $exists: true } }).select("email");
    const userEmails = users.map((u) => u.email);

    // Fetch all staff emails
    const staff = await Staff.find({ email: { $exists: true } }).select("email");
    const staffEmails = staff.map((s) => s.email);

    // Merge emails
    const allEmails = [...userEmails, ...staffEmails];

    if (allEmails.length > 0) {
      const emailHtml = `
        <div style="font-family:Arial;padding:20px">
          <h2 style="color:#4f46e5">📢 New Event Announced</h2>
          <p><strong>${title}</strong></p>
          <p>${description}</p>

          <p>
            📅 <b>Date:</b> ${new Date(date).toDateString()}<br/>
            ⏰ <b>Time:</b> ${time}<br/>
            📍 <b>Location:</b> ${location}
          </p>

          <p>Please login to BVC Digital Hub for more details.</p>
          <hr />
          <small>This is an automated email.</small>
        </div>
      `;

      await sendEmail({
        to: allEmails,
        subject: `📢 New Event: ${title}`,
        html: emailHtml,
      });
    }

    /* ===================================================== */

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

/* ================= UPDATE EVENT ================= */
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

/* ================= DELETE EVENT ================= */
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
