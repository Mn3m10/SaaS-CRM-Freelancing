import { check } from "express-validator";
import ClientModel from "../models/ClientModel.js";
import ValidationMiddleware from "../middlewares/validator.js";

const GetClientValidator = [
  check("id").isMongoId().withMessage("Invalid Client id formate"),
  ValidationMiddleware,
];

const CreateClientValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 15 })
    .withMessage("Name length must between 3 and 15"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ min: 5, max: 30 })
    .withMessage("Email length is between 5 and 30"),
  check("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid mobile phone number"),
  check("company").optional(),
  check("notes")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Notes length can't be above 100 characters"),
  ValidationMiddleware,
];

const UpdateClientValidator = [
  check("id").isMongoId().withMessage("Invlaid Client id formate"),
  ValidationMiddleware,
];

const DeleteClientValidator = [
  check("id").isMongoId().withMessage("Invalid Client id formate"),
  ValidationMiddleware,
];

export {
  GetClientValidator,
  CreateClientValidator,
  UpdateClientValidator,
  DeleteClientValidator,
};
