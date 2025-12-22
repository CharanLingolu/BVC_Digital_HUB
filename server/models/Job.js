import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    selectedStudents: {
      type: [String],
      default: [],
    },
    year: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
