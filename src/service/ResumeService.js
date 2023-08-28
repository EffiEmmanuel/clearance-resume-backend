import bcrypt from "bcryptjs";
import {
  checkUserEmailValidity,
  validateFields,
  checkUsernameValidity,
  checkHwidValidity,
  jwtSign,
} from "../util/auth.helper.js";
import jsonwebtoken from "jsonwebtoken";
import routes from "../routes.js";
import FolderModel from "../models/folder.model.js";

export default class ResumeService {
  constructor(ClearanceResumeModel) {
    this.ResumeModel = ClearanceResumeModel;
  }

  // This service CREATES a resume
  async createResume(userId, resumeName) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([userId, resumeName]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Create resume with the user id provided
    const resume = await this.ResumeModel.create({
      name: resumeName,
      user: userId,
    });

    return {
      status: 201,
      message: `Resume has been created successfully.`,
      resume: resume,
    };
  }

  // This service GETS a user by their email
  async getUserByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the email
    const user = await this.UserModel.findOne({
      email: email,
    });

    if (!user) {
      return {
        status: 404,
        message: "No user exists with the email specified.",
        user: user,
      };
    }

    return {
      status: 200,
      message: `Fetched user with email ${email}.`,
      user: user,
    };
  }

  // This service GETS a user by their id
  async getResume(_id, userId) {
    console.log("Hi 1");
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("Hi 2");
    // Check if any user exists with the username
    const resume = await this.ResumeModel.findOne({
      _id: _id,
      //   user: userId,
    })
      .populate("education")
      .populate("experience")
      .populate("skill")
      .populate("achievement");

    console.log("Hi 3");
    if (!resume) {
      return {
        status: 404,
        message:
          "No resume exists with the id specified, on this user account.",
      };
    }

    console.log("Hi 4");
    return {
      status: 200,
      message: `Fetched resume with id ${_id}.`,
      resume: resume,
    };
  }

  // This service GETS a user by their id
  async getResumes(userId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([userId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the username
    const resumes = await this.ResumeModel.find({
      user: userId,
    })
      .populate("education")
      .populate("experience")
      .populate("skill")
      .populate("achievement");

    if (!resumes) {
      return {
        status: 404,
        message: "No resume exists on this user account.",
      };
    }

    return {
      status: 200,
      message: `Fetched resumes.`,
      resumes: resumes,
    };
  }

  // This service DELETES user by id
  async deleteResumeById(_id, userId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, userId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any resume exists with the _id
    const resume = await this.ResumeModel.findOneAndRemove({
      _id: _id,
      user: userId,
    });

    if (!resume) {
      return {
        status: 404,
        message: `No resume with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Resume with _id ${_id} has been deleted successfully.`,
    };
  }

  // This service UPDATES a user by id
  async updateResume(_id, userId, updatedResume) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, userId, updatedResume]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the _id
    const resume = await this.ResumeModel.findOneAndUpdate(
      { _id: _id, user: userId },
      { ...updatedResume }
    );

    if (!resume) {
      return {
        status: 404,
        message: `No resume with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Resume with _id ${_id} has been updated successfully.`,
      resume: resume,
    };
  }

  // This service ADDS a resume to a folder
  async addResumeToFolder(resumeId, folderId, userId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([resumeId, folderId, userId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Create folder with the user id provided
    const folder = await FolderModel.findOne({ _id: folderId, user: userId });

    if (!folder) {
      return {
        status: 404,
        message: `Folder does not exist on this user account.`,
      };
    }

    folder.resumes?.unshift(resumeId);
    await folder.save();

    return {
      status: 201,
      message: `Folder has been created successfully.`,
    };
  }
}
