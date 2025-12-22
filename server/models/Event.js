import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
