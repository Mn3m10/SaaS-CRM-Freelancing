import ClientModel from "../models/ClientModel.js";
import ApiError from "../errors/ApiError.js";
import {
  CreateOne,
  GetAllDocuments,
  GetOne,
  UpdateOne,
  DeleteOne,
} from "../util/HandlerFactory.js";
import ProjectModel from "../models/ProjectModel.js";
import InvoiceModel from "../models/InvoiceModel.js";

const createNewClient = CreateOne(ClientModel);
//  async (req, res) => {
//   try {
//     if (!req.body.name || !req.body.email) {
//       return res.status(400).json({
//         message: "Name and Email are required",
//       });
//     }
//     const newClient = await ClientModel.create({
//       ...req.body,
//       user: req.user._id,
//     });
//     return res.status(201).json({
//       message: "Client created successfully",
//       data: newClient,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

const getAllClients = GetAllDocuments(ClientModel);
// async (req, res) => {
//   try {
//     const clients = await ClientModel.find().populate("user");
//     const count = await ClientModel.countDocuments();
//     return res.status(200).json({
//       message: "All clients and related users",
//       count,
//       data: clients,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

const getSpecificClient = GetOne(ClientModel);
// async (req, res) => {
//   try {
//     const { id } = req.params;
//     const client = await ClientModel.findById(id).populate("user");
//     if (!client) {
//       return res.status(404).json({
//         message: "Client not found",
//       });
//     }
//     return res.status(200).json({
//       message: "Client found",
//       data: client,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

const updateClient = UpdateOne(ClientModel);
// async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedClient = await ClientModel.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedClient) {
//       return res.status(404).json({
//         message: "Client not found",
//       });
//     }
//     return res.status(200).json({
//       message: "Client updated successfully",
//       data: updatedClient,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

const deleteClient = DeleteOne(ClientModel);
// async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedClient = await ClientModel.findByIdAndDelete(id);
//     if (!deleteClient) {
//       return res.status(404).json({
//         message: "Client not found",
//       });
//     }
//     return res.status(200).json({
//       message: "Client deleted successfully",
//       data: deletedClient,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };


const getClientDetails = async (req, res, next) => {
  try {
    const client = await ClientModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const totalProjects = await ProjectModel.countDocuments({
      client: client._id,
      user: req.user._id,
    });

    const invoices = await InvoiceModel.find({
      client: client._id,
      user: req.user._id,
    });

    const totalValue = invoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );

    return res.status(200).json({
      client,
      stats: {
        totalProjects,
        totalInvoices: invoices.length,
        totalValue,
      },
    });
  } catch (error) {
    next(error);
  }
};


export {
  createNewClient,
  getAllClients,
  getSpecificClient,
  updateClient,
  deleteClient,
  getClientDetails
};
