import express from "express";
import protectedRoute from "../middlewares/protected.js";
import {
  createNewProject,
  getAllProjects,
  getSpecificProject,
  updateProject,
  deleteProject,
} from "../services/ProjectServices.js";
import {
  GetProjecttValidator,
  CreateProjecttValidator,
  UpdateProjecttValidator,
  DeleteProjecttValidator,
} from "../validators/ProjectValidator.js";

const ProjectRouter = express.Router();

ProjectRouter.post(
  "/",
  protectedRoute,
  CreateProjecttValidator,
  createNewProject,
);

ProjectRouter.get("/", protectedRoute, getAllProjects);

ProjectRouter.get(
  "/:id",
  protectedRoute,
  GetProjecttValidator,
  getSpecificProject,
);

ProjectRouter.put(
  "/:id",
  protectedRoute,
  UpdateProjecttValidator,
  updateProject,
);

ProjectRouter.delete(
  "/:id",
  protectedRoute,
  DeleteProjecttValidator,
  deleteProject,
);

export default ProjectRouter;
