import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Matches 'title' in your React formData
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true, // e.g., "Bangalore (Hybrid)"
    },
    type: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
    salary: {
      type: String, // String to handle text like "₹12LPA - ₹15LPA"
      default: "",
    },
    deadline: {
      type: Date, // To handle the date picker input
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String, // Application URL
      default: "",
    },
    // Kept these from your original model for internal use
    selectedStudents: {
      type: [String],
      default: [],
    },
    year: {
      type: String,
      default: new Date().getFullYear().toString(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
