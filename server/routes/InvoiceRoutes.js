import express from "express";
import protectedRoute from "../middlewares/protected.js";
import {
  createNewInvoice,
  getAllInvoices,
  getSpecificInvoice,
  updateInvoice,
  deleteInvoice,
} from "../services/InvoiceServices.js";

const InvoiceRouter = express.Router();

InvoiceRouter.post("/", protectedRoute, createNewInvoice);

InvoiceRouter.get("/", protectedRoute, getAllInvoices);

InvoiceRouter.get("/:id", protectedRoute, getSpecificInvoice);

InvoiceRouter.put("/:id", protectedRoute, updateInvoice);

InvoiceRouter.delete("/:id", protectedRoute, deleteInvoice);

export default InvoiceRouter;
