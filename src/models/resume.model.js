import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    folder: {
      type: mongoose.Types.ObjectId,
      ref: "Folder",
    },

    previewImage: {
      type: String,
    },
    // TEMPLATE
    font: {
      type: String,
    },

    letterSpacing: {
      type: String,
    },

    fontSize: {
      type: String,
    },

    primaryColor: {
      type: String,
    },

    secondaryColor: {
      type: String,
    },

    // JOB DESCRIPTION
    jobTitle: {
      type: String,
    },

    message: {
      type: String,
    },

    // PERSONAL INFORMATIONS
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    graduationDate: {
      type: String,
    },

    location: {
      type: String,
    },

    email: {
      type: String,
    },

    phone: {
      type: String,
    },

    linkedin: {
      type: String,
    },

    education: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Education",
      },
    ],

    experience: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Experience",
      },
    ],

    skill: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Skill",
      },
    ],

    achievement: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Achievement",
      },
    ],
  },
  { timestamps: true }
);

const ResumeModel = mongoose.model("Resume", ResumeSchema);

export default ResumeModel;
