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

export default class FolderService {
  constructor(ClearanceFolderModel) {
    this.FolderModel = ClearanceFolderModel;
  }

  // This service CREATES a resume
  async createFolder(userId, folderName) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([userId, folderName]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Create folder with the user id provided
    const folder = await this.FolderModel.create({
      name: folderName,
      user: userId,
    });

    return {
      status: 201,
      message: `Folder has been created successfully.`,
      folder: folder,
    };
  }

  // This service GETS a folder by id
  async getFolder(_id, userId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, userId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the username
    const folder = await this.FolderModel.findOne({
      _id: _id,
      user: userId,
    }).populate("resumes");

    if (!folder) {
      return {
        status: 404,
        message:
          "No folder exists with the id specified, on this user account.",
      };
    }

    return {
      status: 200,
      message: `Fetched folder with id ${_id}.`,
      folder: folder,
    };
  }

  // This service GETS all user folders
  async getFolders(userId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([userId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the username
    const folders = await this.FolderModel.find({
      user: userId,
    }).populate("resumes");

    if (!folders) {
      return {
        status: 404,
        message: "No folders exists on this user account.",
      };
    }

    return {
      status: 200,
      message: `Fetched user's folders`,
      folders: folders,
    };
  }

  // This service DELETES user by id
  async deleteFolderById(_id, userId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, userId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any folder exists with the _id
    const folder = await this.FolderModel.findOneAndRemove({
      _id: _id,
      user: userId,
    });

    if (!folder) {
      return {
        status: 404,
        message: `No folder with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Folder with _id ${_id} has been deleted successfully.`,
    };
  }
}
