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
    .isLength({ min: 3, max: 15 })
    .withMessage("Username length must be between 3 and 15"),
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
  ValidationMiddleware
]

const UpdatePasswordValidator = [
  check("currentPassword")
  .notEmpty()
  .withMessage("Current password is required"),
  check("passwordConfirm")
  .notEmpty()
  .withMessage("Password confirm is required"),
  check("password")
  .notEmpty()
  .withMessage("Password is required")
  .custom(async(value , {req}) => {
    const user = await UserModel.findById(req.user._id);
    if(!user) {
      throw new Error("User not found")
    }
    const isCorrect = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    )
    if(!isCorrect) {
      throw new Error("Incorrect current password")
    }
    if(value !== req.body.passwordConfirm) {
      throw new Error("Password confirm is incorrect")
    }
    return true;
  }),
  ValidationMiddleware
]

const DeleteUserValidator = [
  check("id")
  .isMongoId()
  .withMessage("Invalid user id formate"),
  ValidationMiddleware,
]

export {GetUserValidator , CreateUserValidator , UpdateUserValidator , UpdatePasswordValidator , DeleteUserValidator}