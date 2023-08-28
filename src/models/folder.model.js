import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    resumes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Resume",
      },
    ],
  },
  { timestamps: true }
);

const FolderModel = mongoose.model("Folder", FolderSchema);

export default FolderModel;
