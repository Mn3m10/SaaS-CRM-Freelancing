import express from "express";
import protectedRoute from "../middlewares/protected.js";
import {
  createNewTask,
  getAllTasks,
  getSpecificTask,
  updateTask,
  deletedTask,
} from "../services/TaskServices.js";
import {
  GetTasktValidator,
  CreateTasktValidator,
  UpdateTasktValidator,
  DeleteTasktValidator,
} from "../validators/TaskValidator.js";

const TaskRouter = express.Router();

TaskRouter.post("/", protectedRoute, CreateTasktValidator, createNewTask);

TaskRouter.get("/", protectedRoute, getAllTasks);

TaskRouter.get("/:id", protectedRoute, GetTasktValidator, getSpecificTask);

TaskRouter.put("/:id", protectedRoute, UpdateTasktValidator, updateTask);

TaskRouter.delete("/:id", protectedRoute, DeleteTasktValidator, deletedTask);

export default TaskRouter;
