import ClientModel from "../models/ClientModel.js";
import ApiError from "../errors/ApiError.js";

const createNewClient = async (req, res) => {
  try {
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({
        message: "Name and Email are required",
      });
    }
    const newClient = await ClientModel.create({
      ...req.body,
      user: req.user._id,
    });
    return res.status(201).json({
      message: "Client created successfully",
      data: newClient,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await ClientModel.find().populate("user");
    const count = await ClientModel.countDocuments();
    return res.status(200).json({
      message: "All clients and related users",
      count,
      data: clients,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const getSpecificClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await ClientModel.findById(id).populate("user");
    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }
    return res.status(200).json({
      message: "Client found",
      data: client,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClient = await ClientModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedClient) {
      return res.status(404).json({
        message: "Client not found",
      });
    }
    return res.status(200).json({
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClient = await ClientModel.findByIdAndDelete(id);
    if (!deleteClient) {
      return res.status(404).json({
        message: "Client not found",
      });
    }
    return res.status(200).json({
      message: "Client deleted successfully",
      data: deletedClient,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

export {
  createNewClient,
  getAllClients,
  getSpecificClient,
  updateClient,
  deleteClient,
};
