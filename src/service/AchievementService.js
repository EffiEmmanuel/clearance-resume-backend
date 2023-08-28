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
import ResumeModel from "../models/resume.model.js";

export default class AchievementService {
  constructor(ClearanceAchievementModel) {
    this.AchievementModel = ClearanceAchievementModel;
  }

  // This service CREATES a achievement
  async createAchievement(userId, resumeId, title, reason) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([userId, resumeId, title, reason]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("HIIIIIIII:", reason);

    // Create achievement with the user id provided
    const achievement = await this.AchievementModel.create({
      user: userId,
      resume: resumeId,
      title,
      reason,
    });

    const addAchievementToResume = await ResumeModel.findOne({
      _id: resumeId,
      user: userId,
    });

    if (!addAchievementToResume)
      return {
        status: 404,
        message: `We did not find a corresponding resume to add this achievement details to. Please try again.`,
      };

    addAchievementToResume.achievement?.push(achievement?._id);
    await addAchievementToResume.save();

    console.log("Finally");

    return {
      status: 201,
      message: `Achievement has been created successfully.`,
      achievement: achievement,
    };
  }

  // This service GETS a user's resume's achievement by id
  async getAchievement(_id, resumeId) {
    console.log("Hi 1");
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, resumeId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("Hi 2");

    // Check if any achievement exists with the _id
    const achievement = await this.AchievementModel.findOne({
      _id: _id,
      resume: resumeId,
    });

    console.log("Hi 3");
    if (!achievement) {
      return {
        status: 404,
        message:
          "No achievement exists with the id specified, on this user account.",
      };
    }

    console.log("Hi 4");
    return {
      status: 200,
      message: `Fetched achievement with id ${_id}.`,
      achievement: achievement,
    };
  }

  // This service GETS all resume achievements
  async getAchievements(resumeId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([resumeId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the username
    const achievements = await this.AchievementModel.find({
      resume: resumeId,
    });

    if (!achievements) {
      return {
        status: 404,
        message: "No achievement exists on this resume yet.",
      };
    }

    return {
      status: 200,
      message: `Fetched achievements.`,
      achievements: achievements,
    };
  }

  // This service DELETES an achievement by id
  async deleteAchievement(_id, resumeId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, resumeId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("HEYY 1");

    // Check if any achievement exists with the _id
    const achievement = await this.AchievementModel.findOneAndRemove({
      _id: _id,
      resume: resumeId,
    });

    console.log("HEYY 2");
    if (!achievement) {
      return {
        status: 404,
        message: `No achievement with _id ${_id} exists.`,
      };
    }

    const removeSkill = await ResumeModel.findOne({
      _id: resumeId,
    });

    if (!removeSkill)
      return {
        status: 404,
        message: `We did not find a corresponding resume to add this achievement details to. Please try again.`,
      };

    const index = removeSkill.achievement?.indexOf(achievement?._id);

    if (index !== -1) {
      removeSkill.achievement?.splice(index, 1);
      await removeSkill.save();
      console.log("Finally");
    }

    return {
      status: 201,
      message: `Achievement with _id ${_id} has been deleted successfully.`,
    };
  }

  // This service UPDATES an achievement by id
  async updateAchievement(_id, resumeId, updatedAchievement) {
    console.log("HELLO 1");
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, resumeId, updatedAchievement]);

    console.log("HELLO 2");
    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("HELLO 3");
    // Check if any user exists with the _id
    const achievement = await this.AchievementModel.findOneAndUpdate(
      { _id: _id },
      { ...updatedAchievement }
    );
    console.log("HELLO 4");

    if (!achievement) {
      return {
        status: 404,
        message: `No achievement with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Achievement with _id ${_id} has been updated successfully.`,
      achievement: achievement,
    };
  }
}
