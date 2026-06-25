import { check } from "express-validator";
import ValidationMiddleware from "../middlewares/validator.js";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";

const GetUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id formate"),
  ValidationMiddleware,
];

const CreateUserValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username length must be between 3 and 30"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ min: 5, max: 30 })
    .withMessage("Email length must be between 5 and 30")
    .custom(async (value) => {
      const user = await UserModel.findOne({ email: value });
      if (user) throw new Error("Email already in use");
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  ValidationMiddleware,
];

const UpdateUserValidator = [
  check("id").isMongoId().withMessage("Invlaid user id formate"),
  ValidationMiddleware,
];

const UpdatePasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .isLength({ max: 30 })
    .withMessage("Password must be at most 30 characters"),

  check("confirmNewPassword")
    .notEmpty()
    .withMessage("Please confirm your new password")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("currentPassword").custom(async (value, { req }) => {
    const userId = req.params.id;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await UserModel.findById(userId).select("+password");
    if (!user) {
      throw new Error("User not found");
    }

    const isCorrect = await bcrypt.compare(value, user.password);
    if (!isCorrect) {
      throw new Error("Incorrect current password");
    }

    req.user = user;
    return true;
  }),

  ValidationMiddleware,
];

const DeleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id formate"),
  ValidationMiddleware,
];

export {
  GetUserValidator,
  CreateUserValidator,
  UpdateUserValidator,
  UpdatePasswordValidator,
  DeleteUserValidator,
};
