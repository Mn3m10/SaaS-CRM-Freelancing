import { check } from "express-validator";
import ValidationMiddleware from "../middlewares/validator.js";

const GetTasktValidator = [
  check("id").isMongoId().withMessage("Invalid Taskt id formate"),
  ValidationMiddleware,
];

const CreateTasktValidator = [
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
  check("project")
    .notEmpty()
    .withMessage("Project is required")
    .isMongoId()
    .withMessage("Invalid project id formate"),
  ValidationMiddleware,
];

const UpdateTasktValidator = [
  check("id").isMongoId().withMessage("Invlaid Taskt id formate"),
  ValidationMiddleware,
];

const DeleteTasktValidator = [
  check("id").isMongoId().withMessage("Invalid Taskt id formate"),
  ValidationMiddleware,
];

export {
  GetTasktValidator,
  CreateTasktValidator,
  UpdateTasktValidator,
  DeleteTasktValidator,
};
