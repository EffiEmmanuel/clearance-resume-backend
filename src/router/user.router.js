import express from "express";
import {
  deleteUserById,
  getUserById,
  getUserByEmail,
  loginUser,
  signupUser,
  updateUserById,
  getFolder,
  createFolder,
  addResumeToFolder,
  getFolders,
  getResumes,
  createResume,
  updateResume,
  getResume,
  createEducation,
  getEducations,
  getEducation,
  updateEducation,
  deleteEducation,
  createExperience,
  getExperiences,
  getExperience,
  updateExperience,
  deleteExperience,
  linkedinOAuthHandler,
  facebookOAuthHandler,
  googleOAuthHandler,
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  deleteSkill,
  createAchievement,
  getAchievements,
  getAchievement,
  deleteAchievement,
  updateAchievement,
  deleteResume,
} from "../controllers/user.controller.js";
import { verifyUserToken } from "../util/auth.helper.js";

const userRouter = express.Router();

// Routes
userRouter.post("/login", loginUser);
userRouter.post("/signup", signupUser);
userRouter.post("/create-folder", signupUser);
userRouter.get("/get-user-by-email", getUserByEmail);
userRouter.get("/get-user-by-id", getUserById);
userRouter.delete("/delete-user-by-id", deleteUserById);
userRouter.patch("/update-user-by-id", updateUserById);

// FOLDERS
userRouter.patch(
  "/folders/add-resume/:folderId/:resumeId/:userId",
  addResumeToFolder
);
userRouter.get("/folders/get-folder/:folderId/:userId", getFolder);
userRouter.get("/folders/get-folders/:userId", getFolders);
userRouter.post("/folders/create/:userId", createFolder);

// RESUMES
userRouter.post("/resumes/create/:userId", createResume);
userRouter.get("/resumes/get-resume/:userId/:resumeId", getResume);
userRouter.get("/resumes/get-resumes/:userId", getResumes);
userRouter.patch("/resumes/update/:userId/:resumeId", updateResume);
userRouter.delete("/resumes/delete/:userId/:resumeId", deleteResume);

// EDUCATIONS
userRouter.post("/educations/create/:userId/:resumeId", createEducation);
userRouter.get("/educations/get-educations/:resumeId", getEducations);
userRouter.get(
  "/educations/get-educations/:educationId/:resumeId",
  getEducation
);
userRouter.patch("/educations/update/:educationId/:resumeId", updateEducation);
userRouter.delete("/educations/delete/:educationId/:resumeId", deleteEducation);

// EXPERIENCES
userRouter.post("/experiences/create/:userId/:resumeId", createExperience);
userRouter.get("/experiences/get-experiences/:resumeId", getExperiences);
userRouter.get(
  "/experiences/get-experiences/:experienceId/:resumeId",
  getExperience
);
userRouter.patch(
  "/experiences/update/:experienceId/:resumeId",
  updateExperience
);
userRouter.delete(
  "/experiences/delete/:experienceId/:resumeId",
  deleteExperience
);

// SKILLS
userRouter.post("/skills/create/:userId/:resumeId", createSkill);
userRouter.get("/skills/get-skills/:resumeId", getSkills);
userRouter.get("/skills/get-skills/:skillId/:resumeId", getSkill);
userRouter.patch("/skills/update/:skillId/:resumeId", updateSkill);
userRouter.delete("/skills/delete/:skillId/:resumeId", deleteSkill);

// ACHIEVEMENTS
userRouter.post("/achievements/create/:userId/:resumeId", createAchievement);
userRouter.get("/achievements/get-achievements/:resumeId", getAchievements);
userRouter.get(
  "/achievements/get-achievements/:skillId/:resumeId",
  getAchievement
);
userRouter.patch("/achievements/update/:skillId/:resumeId", updateAchievement);
userRouter.delete("/achievements/delete/:skillId/:resumeId", deleteAchievement);

// OAUTH
userRouter.post("/oauth/google", googleOAuthHandler);
userRouter.post("/oauth/facebook", facebookOAuthHandler);
userRouter.post("/oauth/linkedin", linkedinOAuthHandler);

export default userRouter;
