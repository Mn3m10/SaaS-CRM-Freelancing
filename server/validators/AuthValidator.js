import { check } from "express-validator";
import ValidationMiddleware from "../middlewares/validator.js";
import UserModel from "../models/UserModel.js";

const SignupValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 15 })
    .withMessage("Username lenght must be between 3 and 15"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ min: 7, max: 30 })
    .withMessage("Email lenght must be between 7 and 30")
    .custom(async (value) => {
      const user = await UserModel.findOne({ email: value });
      if (user) throw new Error("User with this email is already exist");
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  ValidationMiddleware,
];

const LoginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  ValidationMiddleware,
];

export { SignupValidator, LoginValidator };
