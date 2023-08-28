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

export default class UserService {
  constructor(ClearanceUserModel) {
    this.UserModel = ClearanceUserModel;
  }

  // This service CREATES a new user - Sign up service
  async signupUser(user) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      user.fullName,
      user.email,
      user.password,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if user is already signed up
    const userAlreadyExistsWithEmail = await checkUserEmailValidity(user.email);

    // If user email already exists
    if (userAlreadyExistsWithEmail.status === 409)
      return userAlreadyExistsWithEmail;

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);

    // If the email is available, then proceed to sign up the user
    const newUser = await this.UserModel.create({
      ...user,
      password: hashedPassword,
    });

    return {
      status: 201,
      message: "Your account has been created successfully!",
      user: newUser,
    };
  }

  // This service logs in the user
  async loginUser(email, password) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email, password]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // If the fields are not empty, check the DB for hwid
    const userExists = await checkUserEmailValidity(email);

    if (userExists.status == 200) {
      // i.e If a user with the provided email DOES NOT exist. Check checkEmailValidity() for more context
      return {
        status: 404,
        message: "The email provided is not associated with any accounts.",
      };
    }

    const token = jwtSign(userExists);
    console.log(token);

    return {
      token: token,
      user: userExists,
      status: 200,
      message: "Log in successful!",
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
  async getUserById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the username
    const user = await this.UserModel.findOne({
      _id: _id,
    });

    if (!user) {
      return {
        status: 404,
        message: "No user exists with the id specified.",
        user: user,
      };
    }

    return {
      status: 200,
      message: `Fetched user with id ${_id}.`,
      user: user,
    };
  }

  // This service DELETES user by id
  async deleteUserById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the _id
    const user = await this.UserModel.findOneAndRemove({ _id: _id });

    if (!user) {
      return {
        status: 404,
        message: `No user with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `User with _id ${_id} has been deleted successfully.`,
    };
  }

  // This service UPDATES a user by id
  async updateUserById(_id, updatedUser) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, updatedUser]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the _id
    const user = await this.UserModel.findOneAndUpdate(
      { _id: _id },
      { ...updatedUser }
    );

    if (!user) {
      return {
        status: 404,
        message: `No user with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `User with _id ${_id} has been updated successfully.`,
    };
  }
}
