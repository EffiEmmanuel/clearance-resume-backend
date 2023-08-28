import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    resume: {
      type: mongoose.Types.ObjectId,
      ref: "Resume",
    },
  },
  { timestamps: true }
);

const AchievementModel = mongoose.model("Achievement", AchievementSchema);

export default AchievementModel;
