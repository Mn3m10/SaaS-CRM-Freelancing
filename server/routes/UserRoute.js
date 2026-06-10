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
import {
  GetUserValidator,
  CreateUserValidator,
  UpdateUserValidator,
  UpdatePasswordValidator,
  DeleteUserValidator,
} from "../validators/UserValidator.js";

const UserRouter = express.Router();

UserRouter.post("/", protectedRoute, CreateUserValidator, createNewUser);

UserRouter.get("/", protectedRoute, getAllUsers);

UserRouter.get("/:id", protectedRoute, GetUserValidator, getSpecificUser);

UserRouter.put("/:id", protectedRoute, UpdateUserValidator, updateUser);

UserRouter.put(
  "/pass/:id",
  protectedRoute,
  UpdatePasswordValidator,
  updateUserPassword,
);

UserRouter.delete("/:id", protectedRoute, DeleteUserValidator, deleteUser);

export default UserRouter;
