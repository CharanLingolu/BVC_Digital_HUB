import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    techStack: {
      type: [String],
      default: [],
    },

    repoLink: {
      type: String,
      default: "",
    },

    liveLink: {
      type: String,
      default: "",
    },
    likes: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
}],

  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
