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

export default class SkillService {
  constructor(ClearanceSkillModel) {
    this.SkillModel = ClearanceSkillModel;
  }

  // This service CREATES a skill
  async createSkill(userId, resumeId, name) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([userId, resumeId, name]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Create skill with the user id provided
    const skill = await this.SkillModel.create({
      user: userId,
      resume: resumeId,
      name,
    });

    const addSkillToResume = await ResumeModel.findOne({
      _id: resumeId,
      user: userId,
    });

    if (!addSkillToResume)
      return {
        status: 404,
        message: `We did not find a corresponding resume to add this skill details to. Please try again.`,
      };

    addSkillToResume.skill?.push(skill?._id);
    await addSkillToResume.save();

    console.log("Finally");

    return {
      status: 201,
      message: `Skill has been created successfully.`,
      skill: skill,
    };
  }

  // This service GETS a user's resume's skill by id
  async getSkill(_id, resumeId) {
    console.log("Hi 1");
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, resumeId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("Hi 2");

    // Check if any skill exists with the _id
    const skill = await this.SkillModel.findOne({
      _id: _id,
      resume: resumeId,
    });

    console.log("Hi 3");
    if (!skill) {
      return {
        status: 404,
        message: "No skill exists with the id specified, on this user account.",
      };
    }

    console.log("Hi 4");
    return {
      status: 200,
      message: `Fetched skill with id ${_id}.`,
      skill: skill,
    };
  }

  // This service GETS all resume skills
  async getSkills(resumeId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([resumeId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the username
    const skills = await this.SkillModel.find({
      resume: resumeId,
    });

    if (!skills) {
      return {
        status: 404,
        message: "No skill exists on this resume yet.",
      };
    }

    return {
      status: 200,
      message: `Fetched skills.`,
      skills: skills,
    };
  }

  // This service DELETES a skill by id
  async deleteSkill(_id, resumeId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, resumeId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("HEYY 1");

    // Check if any skill exists with the _id
    const skill = await this.SkillModel.findOneAndRemove({
      _id: _id,
      resume: resumeId,
    });

    console.log("HEYY 2");
    if (!skill) {
      return {
        status: 404,
        message: `No skill with _id ${_id} exists.`,
      };
    }

    const removeSkill = await ResumeModel.findOne({
      _id: resumeId,
    });

    if (!removeSkill)
      return {
        status: 404,
        message: `We did not find a corresponding resume to add this skill details to. Please try again.`,
      };

    const index = removeSkill.skill?.indexOf(skill?._id);

    if (index !== -1) {
      removeSkill.skill?.splice(index, 1);
      await removeSkill.save();
      console.log("Finally");
    }

    return {
      status: 201,
      message: `Skill with _id ${_id} has been deleted successfully.`,
    };
  }

  // This service UPDATES an skill by id
  async updateSkill(_id, resumeId, updatedSkill) {
    console.log("HELLO 1");
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, resumeId, updatedSkill]);

    console.log("HELLO 2");
    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("HELLO 3");
    // Check if any user exists with the _id
    const skill = await this.SkillModel.findOneAndUpdate(
      { _id: _id },
      { ...updatedSkill }
    );
    console.log("HELLO 4");

    if (!skill) {
      return {
        status: 404,
        message: `No skill with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Skill with _id ${_id} has been updated successfully.`,
      skill: skill,
    };
  }
}
