import express from "express";
import protectedRoute from "../middlewares/protected.js";
import { createNewTask , getAllTasks , getSpecificTask , updateTask , deletedTask } from "../services/TaskServices.js";

const TaskRouter = express.Router();

TaskRouter.post("/" , protectedRoute , createNewTask);

TaskRouter.get("/" , protectedRoute , getAllTasks);

TaskRouter.get("/:id" , protectedRoute , getSpecificTask);

TaskRouter.put("/:id" , protectedRoute , updateTask);

TaskRouter.delete("/:id" , protectedRoute , deletedTask);

export default TaskRouter;