import { check } from "express-validator";
import ValidationMiddleware from "../middlewares/validator.js";

const GetProjecttValidator = [
  check("id").isMongoId().withMessage("Invalid Projectt id formate"),
  ValidationMiddleware,
];

const CreateProjecttValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 15 })
    .withMessage("Title lenght between 5 and 15"),
  check("description").optional(),
  check("deadline")
    .notEmpty()
    .withMessage("Deadline is required")
    .isISO8601()
    .withMessage("Invalid Date formate"),
  check("client")
    .notEmpty()
    .withMessage("Client is required")
    .isMongoId()
    .withMessage("Invalid client id formate"),
  ValidationMiddleware,
];

const UpdateProjecttValidator = [
  check("id").isMongoId().withMessage("Invlaid Projectt id formate"),
  ValidationMiddleware,
];

const DeleteProjecttValidator = [
  check("id").isMongoId().withMessage("Invalid Projectt id formate"),
  ValidationMiddleware,
];

export {
  GetProjecttValidator,
  CreateProjecttValidator,
  UpdateProjecttValidator,
  DeleteProjecttValidator,
};
