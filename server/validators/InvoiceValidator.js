import { check } from "express-validator";
import ValidationMiddleware from "../middlewares/validator.js";
import InvoiceModel from "../models/InvoiceModel.js";

const GetInvoicetValidator = [
  check("id").isMongoId().withMessage("Invalid Invoicet id formate"),
  ValidationMiddleware,
];

const CreateInvoicetValidator = [
  check("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("The amount must be number"),
  check("invoiceNumber")
    .notEmpty()
    .withMessage("Invoice Number is required")
    .custom(async (value) => {
      const Invoice = await InvoiceModel.findOne({ invoiceNumber: value });
      if (Invoice) {
        throw new Error("The Invoice Number is already in user");
      }
      return true;
    }),
  check("dueDate")
    .notEmpty()
    .withMessage("Due Date is required")
    .isISO8601()
    .withMessage("Invalid Date formate"),
  check("client")
    .notEmpty()
    .withMessage("Client is required")
    .isMongoId()
    .withMessage("Invalid client id formate"),
  check("project")
    .notEmpty()
    .withMessage("Project is required")
    .isMongoId()
    .withMessage("Invalid project id formate"),
  ValidationMiddleware,
];

const UpdateInvoicetValidator = [
  check("id").isMongoId().withMessage("Invlaid Invoicet id formate"),
  ValidationMiddleware,
];

const DeleteInvoicetValidator = [
  check("id").isMongoId().withMessage("Invalid Invoicet id formate"),
  ValidationMiddleware,
];

export {
  GetInvoicetValidator,
  CreateInvoicetValidator,
  UpdateInvoicetValidator,
  DeleteInvoicetValidator,
};
