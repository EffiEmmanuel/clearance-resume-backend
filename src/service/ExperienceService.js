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

export default class ExperienceService {
  constructor(ClearanceExperienceModel) {
    this.ExperienceModel = ClearanceExperienceModel;
  }

  // This service CREATES an experience
  async createExperience(
    userId,
    resumeId,
    companyName,
    position,
    startDate,
    endDate,
    present,
    location,
    additionalInfo
  ) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      userId,
      resumeId,
      companyName,
      position,
      startDate,
      endDate,
      present,
      location,
      additionalInfo,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Create experience with the user id provided
    const experience = await this.ExperienceModel.create({
      user: userId,
      resume: resumeId,
      companyName,
      position,
      startDate,
      endDate,
      present,
      location,
      additionalInfo,
    });

    const addExperienceToResume = await ResumeModel.findOne({
      _id: resumeId,
      user: userId,
    });

    if (!addExperienceToResume)
      return {
        status: 404,
        message: `We did not find a corresponding resume to add this experience details to. Please try again.`,
      };

    addExperienceToResume.experience?.push(experience?._id);
    await addExperienceToResume.save();

    console.log("Finally");

    return {
      status: 201,
      message: `Experience has been created successfully.`,
      experience: experience,
    };
  }

  // This service GETS a user's resume's experience by id
  async getExperience(_id, resumeId) {
    console.log("Hi 1");
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, resumeId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("Hi 2");

    // Check if any experience exists with the _id
    const experience = await this.ExperienceModel.findOne({
      _id: _id,
      resume: resumeId,
    });

    console.log("Hi 3");
    if (!experience) {
      return {
        status: 404,
        message:
          "No experience exists with the id specified, on this user account.",
      };
    }

    console.log("Hi 4");
    return {
      status: 200,
      message: `Fetched experience with id ${_id}.`,
      experience: experience,
    };
  }

  // This service GETS all resume experiences
  async getExperiences(resumeId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([resumeId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the username
    const experiences = await this.ExperienceModel.find({
      resume: resumeId,
    });

    if (!experiences) {
      return {
        status: 404,
        message: "No experience exists on this resume yet.",
      };
    }

    return {
      status: 200,
      message: `Fetched experiences.`,
      experiences: experiences,
    };
  }

  // This service DELETES user by id
  async deleteExperience(_id, resumeId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, resumeId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("HEYY 1");

    // Check if any experience exists with the _id
    const experience = await this.ExperienceModel.findOneAndRemove({
      _id: _id,
      //   resume: resumeId,
    });

    console.log("HEYY 2");
    if (!experience) {
      return {
        status: 404,
        message: `No experience with _id ${_id} exists.`,
      };
    }

    const removeExperience = await ResumeModel.findOne({
      _id: resumeId,
    });

    if (!removeExperience)
      return {
        status: 404,
        message: `We did not find a corresponding resume to add this experience details to. Please try again.`,
      };

    const index = removeExperience.experience?.indexOf(experience?._id);

    if (index !== -1) {
      removeExperience.experience?.splice(index, 1);
      await removeExperience.save();
      console.log("Finally");
    }

    return {
      status: 201,
      message: `Experience with _id ${_id} has been deleted successfully.`,
    };
  }

  // This service UPDATES an experience by id
  async updateExperience(_id, resumeId, updatedExperience) {
    console.log("HELLO 1");
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, resumeId, updatedExperience]);

    console.log("HELLO 2");
    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("HELLO 3");
    // Check if any user exists with the _id
    const experience = await this.ExperienceModel.findOneAndUpdate(
      { _id: _id },
      { ...updatedExperience }
    );
    console.log("HELLO 4");

    if (!experience) {
      return {
        status: 404,
        message: `No experience with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Experience with _id ${_id} has been updated successfully.`,
      experience: experience,
    };
  }
}
