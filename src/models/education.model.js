import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema(
  {
    institutionName: {
      type: String,
      required: true,
    },

    courseOfStudy: {
      type: String,
      required: true,
    },

    graduationDate: {
      type: String,
      required: true,
      trim: true,
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

const EducationModel = mongoose.model("Education", EducationSchema);

export default EducationModel;
