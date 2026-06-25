import InvoiceModel from "../models/InvoiceModel.js";
import ApiError from "../errors/ApiError.js";
import {
  CreateOne,
  GetAllDocuments,
  GetOne,
  UpdateOne,
  DeleteOne,
} from "../util/HandlerFactory.js";
const createNewInvoice = CreateOne(InvoiceModel);
// async (req, res) => {
//   try {
//     if (!req.body.amount || !req.body.invoiceNumber) {
//       return res.status(400).json({
//         message: "Invoice amount and number are required",
//       });
//     }
//     const newInvoice = await InvoiceModel.create({
//       ...req.body,
//       user: req.user._id,
//     });
//     return res.status(201).json({
//       message: "Invoice created successfully",
//       data: newInvoice,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

const getAllInvoices = GetAllDocuments(InvoiceModel, ["client", "project"]);
// async (req, res) => {
//   try {
//     const invoices = await InvoiceModel.find()
//       .populate("user")
//       .populate("client")
//       .populate("project");
//     const count = await InvoiceModel.countDocuments();
//     return res.status(200).json({
//       message: "All Invoices:",
//       count,
//       data: invoices,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

const getSpecificInvoice = GetOne(InvoiceModel, ["client", "project"]);
// async (req, res) => {
//   try {
//     const { id } = req.params;
//     const theInvoice = await InvoiceModel.findById(id)
//       .populate("user")
//       .populate("client")
//       .populate("project");
//     if (!theInvoice) {
//       return res.status(404).json({
//         message: "Invoice not found",
//       });
//     }
//     return res.status(200).json({
//       message: "Invoice found successfully",
//       data: theInvoice,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

const updateInvoice = UpdateOne(InvoiceModel);
// async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedInvoice = await InvoiceModel.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedInvoice) {
//       return res.status(404).json({
//         message: "Invoice not found",
//       });
//     }
//     return res.status(200).json({
//       message: "Invoice updated successfully",
//       data: updatedInvoice,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

const deleteInvoice = DeleteOne(InvoiceModel);
// async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedInvoice = await InvoiceModel.findByIdAndDelete(id);
//     if (!deletedInvoice) {
//       return res.status(404).json({
//         message: "Invoice not found",
//       });
//     }
//     return res.status(200).json({
//       message: "Invoice deleted successfully",
//       data: deletedInvoice,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

export {
  createNewInvoice,
  getAllInvoices,
  getSpecificInvoice,
  updateInvoice,
  deleteInvoice,
};
