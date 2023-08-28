import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    position: {
      type: String,
      required: true,
    },

    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      //   required: true,
    },

    present: {
      type: Boolean,
      required: true,
      default: false,
    },

    location: {
      type: String,
      required: true,
    },

    additionalInfo: {
      type: String,
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

const ExperienceModel = mongoose.model("Experience", ExperienceSchema);

export default ExperienceModel;
