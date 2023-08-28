import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    name: {
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

const SkillModel = mongoose.model("Skill", SkillSchema);

export default SkillModel;
