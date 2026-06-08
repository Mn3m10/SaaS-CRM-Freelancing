import express from "express";
import {
  createNewUser,
  getAllUsers,
  getSpecificUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} from "../services/UserServices.js";
import protectedRoute from "../middlewares/protected.js";

const UserRouter = express.Router();

UserRouter.post("/", protectedRoute, createNewUser);

UserRouter.get("/", protectedRoute, getAllUsers);

UserRouter.get("/:id", protectedRoute, getSpecificUser);

UserRouter.put("/:id", protectedRoute, updateUser);

UserRouter.put("/pass/:id", protectedRoute, updateUserPassword);

UserRouter.delete("/:id", protectedRoute, deleteUser);

export default UserRouter;
