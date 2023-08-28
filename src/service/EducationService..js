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

export default class EducationService {
  constructor(ClearanceEducationModel) {
    this.EducationModel = ClearanceEducationModel;
  }

  // This service CREATES a resume
  async createEducation(
    userId,
    resumeId,
    institutionName,
    courseOfStudy,
    graduationDate,
    location,
    additionalInfo
  ) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      userId,
      institutionName,
      graduationDate,
      location,
      additionalInfo,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Create education with the user id provided
    const education = await this.EducationModel.create({
      user: userId,
      institutionName,
      courseOfStudy,
      graduationDate,
      location,
      additionalInfo,
    });

    const addEducationToResume = await ResumeModel.findOne({
      _id: resumeId,
      user: userId,
    });

    if (!addEducationToResume)
      return {
        status: 404,
        message: `We did not find a corresponding resume to add this education details to. Please try again.`,
      };

    addEducationToResume.education?.push(education?._id);
    await addEducationToResume.save();

    console.log("Finally");

    return {
      status: 201,
      message: `Education has been created successfully.`,
      education: education,
    };
  }

  // This service GETS a user's resume's education by id
  async getEducation(_id, resumeId) {
    console.log("Hi 1");
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, resumeId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("Hi 2");

    // Check if any education exists with the _id
    const education = await this.EducationModel.findOne({
      _id: _id,
      resume: resumeId,
    });

    console.log("Hi 3");
    if (!education) {
      return {
        status: 404,
        message:
          "No education exists with the id specified, on this user account.",
      };
    }

    console.log("Hi 4");
    return {
      status: 200,
      message: `Fetched education with id ${_id}.`,
      education: education,
    };
  }

  // This service GETS all resume educations
  async getEducations(resumeId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([resumeId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the username
    const educations = await this.EducationModel.find({
      resume: resumeId,
    });

    if (!educations) {
      return {
        status: 404,
        message: "No education exists on this resume yet.",
      };
    }

    return {
      status: 200,
      message: `Fetched educations.`,
      educations: educations,
    };
  }

  // This service DELETES user by id
  async deleteEducation(_id, resumeId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, resumeId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("HEYY 1");

    // Check if any education exists with the _id
    const education = await this.EducationModel.findOneAndRemove({
      _id: _id,
      //   resume: resumeId,
    });

    console.log("HEYY 2");
    if (!education) {
      return {
        status: 404,
        message: `No education with _id ${_id} exists.`,
      };
    }

    const removeEducation = await ResumeModel.findOne({
      _id: resumeId,
    });

    if (!removeEducation)
      return {
        status: 404,
        message: `We did not find a corresponding resume to add this education details to. Please try again.`,
      };

    const index = removeEducation.education?.indexOf(education?._id);

    if (index !== -1) {
      removeEducation.education?.splice(index, 1);
      await removeEducation.save();
      console.log("Finally");
    }

    return {
      status: 201,
      message: `Education with _id ${_id} has been deleted successfully.`,
    };
  }

  // This service UPDATES an education by id
  async updateEducation(_id, resumeId, updatedEducation) {
    console.log("HELLO 1");
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, resumeId, updatedEducation]);

    console.log("HELLO 2");
    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("HELLO 3");
    // Check if any user exists with the _id
    const education = await this.EducationModel.findOneAndUpdate(
      { _id: _id },
      { ...updatedEducation }
    );
    console.log("HELLO 4");

    if (!education) {
      return {
        status: 404,
        message: `No education with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Education with _id ${_id} has been updated successfully.`,
      education: education,
    };
  }
}
