import axios from "axios";
import EducationModel from "../models/education.model.js";
import ExperienceModel from "../models/experience.model.js";
import FolderModel from "../models/folder.model.js";
import ResumeModel from "../models/resume.model.js";
import UserModel from "../models/user.model.js";
import EducationService from "../service/EducationService..js";
import ExperienceService from "../service/ExperienceService.js";
import FolderService from "../service/FolderService.js";
import ResumeService from "../service/ResumeService.js";
import UserService from "../service/UserService.js";
import { jwtSign } from "../util/auth.helper.js";
import SkillService from "../service/SkillService.js";
import SkillModel from "../models/skill.model.js";
import AchievementService from "../service/AchievementService.js";
import AchievementModel from "../models/achievement.model.js";

// Generic messages
const internalServerError =
  "An error occured while we processed your request. Please try again.";

// SERVICE INSTANCES
// Create a new UserService instance
const userService = new UserService(UserModel);
const resumeService = new ResumeService(ResumeModel);
const folderService = new FolderService(FolderModel);
const educationService = new EducationService(EducationModel);
const experienceService = new ExperienceService(ExperienceModel);
const skillService = new SkillService(SkillModel);
const achievementService = new AchievementService(AchievementModel);

// Sign up user
export const signupUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Create new user
    const user = await userService.signupUser({
      fullName,
      email,
      password,
    });

    // Return a response
    return res
      .status(user?.status)
      .json({ user: user?.user ?? null, message: user?.message });
  } catch (error) {
    console.log("ERR:", error.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Log in user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Log in user
    const user = await userService.loginUser(email, password);

    // Return a response
    return res.status(user?.status).json({
      user: user?.user ?? null,
      token: user?.token,
      message: user?.message,
    });
  } catch (error) {
    console.log("ERRR:", error.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Get user by email
export const getUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Fetch user
    const user = await userService.getUserByEmail(email);

    // Return a response
    return res
      .status(user?.status)
      .json({ user: user?.user ?? null, message: user?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get user by _id
export const getUserById = async (req, res) => {
  const { _id } = req.body;

  try {
    // Fetch user
    const user = await userService.getUserById(_id);

    // Return a response
    return res
      .status(user?.status)
      .json({ user: user?.user ?? null, message: user?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete user by id
export const deleteUserById = async (req, res) => {
  const { _id } = req.body;
  try {
    // DELETE user
    const user = await userService.deleteUserById(_id);

    // Return a response
    return res
      .status(user?.status)
      .json({ user: user?.user ?? null, message: user?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Update user by id
export const updateUserById = async (req, res) => {
  const { _id /* Other user fields go here */ } = req.body;
  const updatedDetails = {}; // An object with other user fields
  try {
    // UPDATE user
    const user = await userService.updateUserById(_id, updatedDetails);

    // Return a response
    return res
      .status(user?.status)
      .json({ user: user?.user ?? null, message: user?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Adds a resume to a folder
export const addResumeToFolder = async (req, res) => {
  const { folderId, resumeId, userId } = req.params;
  console.log("HI HI HI:::", resumeId, folderId, userId);
  const updatedDetails = {}; // An object with other user fields
  try {
    // UPDATE resume
    const response = await resumeService.addResumeToFolder(
      resumeId,
      folderId,
      userId
    );

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Creates a folder
export const createFolder = async (req, res) => {
  const { userId } = req.params;
  const { folderName } = req.body;

  console.log("HIIIII");

  try {
    // UPDATE resume
    const response = await folderService.createFolder(userId, folderName);

    console.log("FOLDER;", response.folder);

    // Return a response
    return res
      .status(response?.status)
      .json({ folder: response?.folder ?? null, message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Gets a folder by id
export const getFolder = async (req, res) => {
  const { userId, folderId } = req.params;

  try {
    // UPDATE resume
    const response = await folderService.getFolder(folderId, userId);

    // Return a response
    return res
      .status(response?.status)
      .json({ folder: response?.folder ?? null, message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Gets a user's folders
export const getFolders = async (req, res) => {
  const { userId } = req.params;

  try {
    // GET folders
    const response = await folderService.getFolders(userId);

    // Return a response
    return res
      .status(response?.status)
      .json({ folders: response?.folders ?? null, message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Creates a resume
export const createResume = async (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;

  try {
    // GET resume
    const response = await resumeService.createResume(userId, name);

    // Return a response
    return res
      .status(response?.status)
      .json({ resume: response?.resume ?? null, message: response?.message });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Gets a user's resumes
export const getResumes = async (req, res) => {
  const { userId } = req.params;

  try {
    // GET resume
    const response = await resumeService.getResumes(userId);

    // Return a response
    return res
      .status(response?.status)
      .json({ resumes: response?.resumes ?? null, message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Gets a user's resume
export const getResume = async (req, res) => {
  const { userId, resumeId } = req.params;

  try {
    // GET resume
    const response = await resumeService.getResume(resumeId, userId);

    // Return a response
    return res
      .status(response?.status)
      .json({ resume: response?.resume ?? null, message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Update a user's resume
export const updateResume = async (req, res) => {
  const { userId, resumeId } = req.params;

  try {
    // UPDATE resume
    const response = await resumeService.updateResume(
      resumeId,
      userId,
      req.body
    );

    // Return a response
    return res
      .status(response?.status)
      .json({ resume: response?.resume ?? null, message: response?.message });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// DELETE a user's resume
export const deleteResume = async (req, res) => {
  const { userId, resumeId } = req.params;

  try {
    // DELETE resume
    const response = await resumeService.deleteResumeById(resumeId, userId);

    // Return a response
    return res
      .status(response?.status)
      .json({ resume: response?.resume ?? null, message: response?.message });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Creates an education
export const createEducation = async (req, res) => {
  console.log("HWYYYY 1");
  const { userId, resumeId } = req.params;
  const {
    institutionName,
    courseOfStudy,
    graduationDate,
    location,
    additionalInfo,
  } = req.body;

  try {
    // CREATE Education
    const response = await educationService.createEducation(
      userId,
      resumeId,
      institutionName,
      courseOfStudy,
      graduationDate,
      location,
      additionalInfo
    );

    console.log("HWYYYY 2");
    // Return a response
    return res.status(response?.status).json({
      education: response?.education ?? null,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Gets a resume's educations
export const getEducations = async (req, res) => {
  const { resumeId } = req.params;

  try {
    // GET resume
    const response = await educationService.getEducations(resumeId);

    // Return a response
    return res.status(response?.status).json({
      educations: response?.educations ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Gets a resume's education
export const getEducation = async (req, res) => {
  const { educationId, resumeId } = req.params;

  try {
    // GET resume
    const response = await educationService.getEducation(educationId, resumeId);

    // Return a response
    return res.status(response?.status).json({
      education: response?.education ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Update a resume's education
export const updateEducation = async (req, res) => {
  const { educationId, resumeId } = req.params;

  try {
    // UPDATE education
    const response = await educationService.updateEducation(
      educationId,
      resumeId,
      req.body
    );

    // Return a response
    return res.status(response?.status).json({
      education: response?.education ?? null,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete a resume's education
export const deleteEducation = async (req, res) => {
  const { educationId, resumeId } = req.params;

  console.log("HELLO FROM DELETE EDUCATION");

  try {
    // DELETE education
    const response = await educationService.deleteEducation(
      educationId,
      resumeId
    );

    // Return a response
    return res.status(response?.status).json({
      education: response?.education ?? null,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Creates an experience
export const createExperience = async (req, res) => {
  console.log("HWYYYY 1");
  const { userId, resumeId } = req.params;
  const {
    companyName,
    position,
    startDate,
    endDate,
    present,
    location,
    additionalInfo,
  } = req.body;

  try {
    // CREATE Experience
    const response = await experienceService.createExperience(
      userId,
      resumeId,
      companyName,
      position,
      startDate,
      endDate,
      present,
      location,
      additionalInfo
    );

    console.log("HWYYYY 2");
    // Return a response
    return res.status(response?.status).json({
      experience: response?.experience ?? null,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Gets a resume's experiences
export const getExperiences = async (req, res) => {
  const { resumeId } = req.params;

  try {
    // GET resume
    const response = await experienceService.getExperiences(resumeId);

    // Return a response
    return res.status(response?.status).json({
      experiences: response?.experiences ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Gets a resume's experience
export const getExperience = async (req, res) => {
  const { experienceId, resumeId } = req.params;

  try {
    // GET resume
    const response = await experienceService.getExperience(
      experienceId,
      resumeId
    );

    // Return a response
    return res.status(response?.status).json({
      experience: response?.experience ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Update a resume's experience
export const updateExperience = async (req, res) => {
  const { experienceId, resumeId } = req.params;

  try {
    // UPDATE experience
    const response = await experienceService.updateExperience(
      experienceId,
      resumeId,
      req.body
    );

    // Return a response
    return res.status(response?.status).json({
      experience: response?.experience ?? null,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete a resume's experience
export const deleteExperience = async (req, res) => {
  const { experienceId, resumeId } = req.params;

  console.log("HELLO FROM DELETE EXPERIENCE");

  try {
    // DELETE education
    const response = await experienceService.deleteExperience(
      experienceId,
      resumeId
    );

    // Return a response
    return res.status(response?.status).json({
      experience: response?.experience ?? null,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Creates a skill
export const createSkill = async (req, res) => {
  console.log("HWYYYY 1");
  const { userId, resumeId } = req.params;
  const { name } = req.body;

  try {
    // CREATE Experience
    const response = await skillService.createSkill(userId, resumeId, name);

    console.log("HWYYYY 2");
    // Return a response
    return res.status(response?.status).json({
      skill: response?.skill ?? null,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Gets a resume's skills
export const getSkills = async (req, res) => {
  const { resumeId } = req.params;

  try {
    // GET resume
    const response = await skillService.getSkills(resumeId);

    // Return a response
    return res.status(response?.status).json({
      skills: response?.skills ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Gets a resume's skill
export const getSkill = async (req, res) => {
  const { skillId, resumeId } = req.params;

  try {
    // GET resume
    const response = await skillService.getSkill(skillId, resumeId);

    // Return a response
    return res.status(response?.status).json({
      skill: response?.skill ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Update a resume's skill
export const updateSkill = async (req, res) => {
  const { skillId, resumeId } = req.params;

  try {
    // UPDATE skill
    const response = await skillService.updateSkill(
      skillId,
      resumeId,
      req.body
    );

    // Return a response
    return res.status(response?.status).json({
      skill: response?.skill ?? null,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete a resume's skill
export const deleteSkill = async (req, res) => {
  const { skillId, resumeId } = req.params;

  console.log("HELLO FROM DELETE EXPERIENCE");

  try {
    // DELETE skill
    const response = await skillService.deleteSkill(skillId, resumeId);

    // Return a response
    return res.status(response?.status).json({
      skill: response?.skill ?? null,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Creates an achievement
export const createAchievement = async (req, res) => {
  console.log("HWYYYY 1");
  const { userId, resumeId } = req.params;
  const { title, reason } = req.body;

  try {
    // CREATE Achievement
    const response = await achievementService.createAchievement(
      userId,
      resumeId,
      title,
      reason
    );

    console.log("HWYYYY 2");
    // Return a response
    return res.status(response?.status).json({
      achievement: response?.achievement ?? null,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Gets a resume's achievements
export const getAchievements = async (req, res) => {
  const { resumeId } = req.params;

  try {
    // GET achievements
    const response = await achievementService.getAchievements(resumeId);

    // Return a response
    return res.status(response?.status).json({
      achievements: response?.achievements ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Gets a resume's achievement
export const getAchievement = async (req, res) => {
  const { achievementId, resumeId } = req.params;

  try {
    // GET achievement
    const response = await achievementService.getAchievement(
      achievementId,
      resumeId
    );

    // Return a response
    return res.status(response?.status).json({
      achievement: response?.achievement ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Update a resume's achievement
export const updateAchievement = async (req, res) => {
  const { achievementId, resumeId } = req.params;

  try {
    // UPDATE achievement
    const response = await achievementService.updateAchievement(
      achievementId,
      resumeId,
      req.body
    );

    // Return a response
    return res.status(response?.status).json({
      achievement: response?.achievement ?? null,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete a resume's achievement
export const deleteAchievement = async (req, res) => {
  const { achievementId, resumeId } = req.params;

  try {
    // DELETE achievement
    const response = await achievementService.deleteAchievement(
      achievementId,
      resumeId
    );

    // Return a response
    return res.status(response?.status).json({
      achievement: response?.achievement ?? null,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

export const linkedinOAuthHandler = async (request, response) => {
  const REDIRECT_URL = "http%3A%2F%2Flocalhost%3A3000";
  const CLIENT_ID = "77ax1k2mcit2q9";
  const CLIENT_SECRET = "FNtQyVZ2FQGbCaMN";

  const { code } = request.body;
  console.log("CODE:", code);

  const data = new URLSearchParams();
  data.append("grant_type", "authorization_code");
  data.append("code", code);
  data.append("redirect_uri", `http://localhost:3000`);
  data.append("client_id", `${CLIENT_ID}`);
  data.append("client_secret", `${CLIENT_SECRET}`);

  try {
    await axios
      .post(`https://www.linkedin.com/oauth/v2/accessToken`, data, {})
      .then(async (res) => {
        console.log("LINKEDIN CODE RESPONSE:", res.data);
        console.log("LINKEDIN RESPONSE:", res.data.access_token);

        return await axios
          .get("https://api.linkedin.com/v2/userinfo", {
            headers: {
              Authorization: `Bearer ${res.data.access_token}`,
            },
          })
          .then(async (res) => {
            // SEND DATA TO THE DATABASE
            console.log("FINAL RESPONSE::", res.data);
            const fullName = res.data.name;
            const email = res.data.email;
            const password = res.data.sub;
            const user = await userService.signupUser({
              fullName,
              email,
              password,
              isOAuth: true,
            });

            if (user.status === 409 && user?.user?.isOAuth == false) {
              console.log("HI HI");
              return response.status(user?.status).json({
                message: user?.message,
              });
            }

            if (user.status === 409 && user?.user?.isOAuth == true) {
              const token = jwtSign(user);
              return response.status(200).json({
                message: user?.message,
                user: user?.user,
                token: token,
              });
            }

            const token = jwtSign(user);

            return response
              .status(user?.status)
              .json({ message: user?.message, user: user?.user, token: token });
          })
          .catch((err) => {
            console.log("LINKEDIN LOGIN ERROR:", err?.message);
            return response
              .status(err?.response?.data?.status)
              .json({ message: err?.response?.data?.message });
          });
      })
      .catch((err) => {
        console.log("LINKEDIN CODE ERROR:", err?.message);
        return response.status(500).json({ message: internalServerError });
      });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return response.status(500).json({ message: internalServerError });
  }
};

export const googleOAuthHandler = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const user = await userService.signupUser({
      fullName,
      email,
      password,
      isOAuth: true,
    });

    console.log("response:", user);
    console.log("USER:", user?.user);

    if (user.status === 409 && user?.user?.isOAuth == false) {
      console.log("HI HI");
      return res.status(user?.status).json({
        message: user?.message,
      });
    }

    if (user.status === 409 && user?.user?.isOAuth == true) {
      const token = jwtSign(user);
      return res
        .status(200)
        .json({ message: user?.message, user: user?.user, token: token });
    }

    const token = jwtSign(user);
    return res
      .status(user?.status)
      .json({ message: user?.message, user: user?.user, token: token });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};

export const facebookOAuthHandler = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const user = await userService.signupUser({
      fullName,
      email,
      password,
      isOAuth: true,
    });

    if (user.status === 409 && user?.user?.isOAuth == false) {
      console.log("HI HI");
      return res.status(user?.status).json({
        message: user?.message,
      });
    }

    if (user.status === 409 && user?.user?.isOAuth == true) {
      const token = jwtSign(user);
      return res
        .status(200)
        .json({ message: user?.message, user: user?.user, token: token });
    }

    const token = jwtSign(user);
    return res
      .status(user?.status)
      .json({ message: user?.message, user: user?.user, token: token });
  } catch (error) {
    console.log("ERROR:::", error?.message);
    return res.status(500).json({ message: internalServerError });
  }
};
