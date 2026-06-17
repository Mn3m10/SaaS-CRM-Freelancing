import express from "express";
import protectedRoute from "../middlewares/protected.js";
import DashboardData from "../services/DashboardServices.js";

const DashboardRouter = express.Router();

DashboardRouter.get("/" ,protectedRoute, DashboardData);

export default DashboardRouter;