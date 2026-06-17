import TaskModel from "../models/TaskModel.js";
import ProjectModel from "../models/ProjectModel.js";
import InvoiceModel from "../models/InvoiceModel.js";
import ClientModel from "../models/ClientModel.js";
import ApiError from "../errors/ApiError.js";

const DashboardData = async (req, res, next) => {
  try {
    const totalClients = await ClientModel.countDocuments();
    const totalProjects = await ProjectModel.countDocuments();
    const totalTasks = await TaskModel.countDocuments();
    const totalInvoices = await InvoiceModel.countDocuments();
    const completedTasks = await TaskModel.countDocuments({
      status: "completed",
    });
    const pendingTasks = await TaskModel.countDocuments({ status: "pending" });
    const completedProjects = await ProjectModel.countDocuments({
      status: "completed",
    });
    const pendingProjects = await ProjectModel.countDocuments({
      status: "pending",
    });
    return res.status(200).json({
      message: "Dashboard data:",
      data: {
        totalClients,
        totalProjects,
        totalTasks,
        totalInvoices,
        completedProjects,
        completedTasks,
        pendingProjects,
        pendingTasks,
      },
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

export default DashboardData;
