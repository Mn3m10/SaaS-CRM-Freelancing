import express from "express";
import {
  createNewClient,
  getAllClients,
  getSpecificClient,
  updateClient,
  deleteClient,
} from "../services/ClientServices.js";
import protectedRoute from "../middlewares/protected.js";
const ClientRouter = express.Router();

ClientRouter.post("/", protectedRoute, createNewClient);

ClientRouter.get("/", protectedRoute, getAllClients);

ClientRouter.get("/:id", protectedRoute, getSpecificClient);

ClientRouter.put("/:id" , protectedRoute , updateClient);

ClientRouter.delete("/:id", protectedRoute, deleteClient);

export default ClientRouter;
