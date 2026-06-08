import express from "express";
import protectedRoute from "../middlewares/protected.js";
import {
  createNewProject,
  getAllProjects,
  getSpecificProject,
  updateProject,
  deleteProject,
} from "../services/ProjectServices.js";

const ProjectRouter = express.Router();

ProjectRouter.post("/", protectedRoute, createNewProject);

ProjectRouter.get("/", protectedRoute, getAllProjects);

ProjectRouter.get("/:id", protectedRoute, getSpecificProject);

ProjectRouter.put("/:id", protectedRoute, updateProject);

ProjectRouter.delete("/:id", protectedRoute, deleteProject);

export default ProjectRouter;
