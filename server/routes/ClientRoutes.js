import express from "express";
import {
  createNewClient,
  getAllClients,
  getSpecificClient,
  updateClient,
  deleteClient,
} from "../services/ClientServices.js";
import protectedRoute from "../middlewares/protected.js";
import {
  GetClientValidator,
  CreateClientValidator,
  UpdateClientValidator,
  DeleteClientValidator,
} from "../validators/ClientValidator.js";

const ClientRouter = express.Router();

ClientRouter.post("/", protectedRoute, CreateClientValidator, createNewClient);

ClientRouter.get("/", protectedRoute, getAllClients);

ClientRouter.get("/:id", protectedRoute, GetClientValidator, getSpecificClient);

ClientRouter.put("/:id", protectedRoute, UpdateClientValidator, updateClient);

ClientRouter.delete(
  "/:id",
  protectedRoute,
  DeleteClientValidator,
  deleteClient,
);

export default ClientRouter;
