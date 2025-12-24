import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    department: { type: String, required: true, trim: true },

    position: { type: String, required: true, trim: true },

    qualification: { type: String, trim: true },

    subjects: { type: [String], default: [] },

    experience: { type: String, trim: true },

    bio: { type: String, trim: true },

    photo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Staff", staffSchema);
