import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // e.g., "10:00 AM"
      required: true,
    },
    location: {
      type: String, // e.g., "Main Auditorium"
      required: true,
    },
    category: {
      type: String,
      enum: ["General", "Academic", "Cultural", "Workshop", "Sports"],
      default: "General",
    },
    description: {
      type: String,
      required: true,
    },
    banner: {
      type: String, // URL to the uploaded image
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
