import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isOAuth: {
      type: Boolean,
      default: false,
    },

    pricingPlan: {
      type: String,
      enum: ["free", "oneTimePurchase", "premium", "enterprise"],
      default: "free",
    },

    folders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Folder",
      },
    ],

    resumes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Resumes",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
