import express from "express";
import protectedRoute from "../middlewares/protected.js";
import {
  createNewInvoice,
  getAllInvoices,
  getSpecificInvoice,
  updateInvoice,
  deleteInvoice,
} from "../services/InvoiceServices.js";
import {
  GetInvoicetValidator,
  CreateInvoicetValidator,
  UpdateInvoicetValidator,
  DeleteInvoicetValidator,
} from "../validators/InvoiceValidator.js";

const InvoiceRouter = express.Router();

InvoiceRouter.post(
  "/",
  protectedRoute,
  CreateInvoicetValidator,
  createNewInvoice,
);

InvoiceRouter.get("/", protectedRoute, getAllInvoices);

InvoiceRouter.get(
  "/:id",
  protectedRoute,
  GetInvoicetValidator,
  getSpecificInvoice,
);

InvoiceRouter.put(
  "/:id",
  protectedRoute,
  UpdateInvoicetValidator,
  updateInvoice,
);

InvoiceRouter.delete(
  "/:id",
  protectedRoute,
  DeleteInvoicetValidator,
  deleteInvoice,
);

export default InvoiceRouter;
