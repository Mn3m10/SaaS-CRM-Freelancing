import TaskModel from "../models/TaskModel.js";
import ApiError from "../errors/ApiError.js";
import {
  CreateOne,
  GetAllDocuments,
  GetOne,
  UpdateOne,
  DeleteOne,
} from "../util/HandlerFactory.js";

const createNewTask = CreateOne(TaskModel);
// async (req, res) => {
//   try {
//     if (!req.body.title || !req.body.description) {
//       return res.status(400).json({
//         message: "Title and Description are required",
//       });
//     }
//     const newTask = await TaskModel.create({
//       title: req.body.title,
//       description: req.body.description,
//       status: req.body.status,
//       project: req.body.project,
//       user: req.user._id,
//     });
//     return res.status(201).json({
//       message: "Task created successfully",
//       data: newTask,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

const getAllTasks = GetAllDocuments(TaskModel);
// async (req, res) => {
//   try {
//     const tasks = await TaskModel.find().populate("project").populate("user");
//     const count = await TaskModel.countDocuments();
//     return res.status(200).json({
//       message: "All tasks:",
//       count,
//       data: tasks,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

const getSpecificTask = GetOne(TaskModel);
// async (req, res) => {
//   try {
//     const { id } = req.params;
//     const theTask = await TaskModel.findById(id)
//       .populate("project")
//       .populate("user");
//     if (!theTask) {
//       return res.status(404).json({
//         message: "Task not found",
//       });
//     }
//     return res.status(200).json({
//       message: "Task found",
//       data: theTask,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

const updateTask = UpdateOne(TaskModel);
// async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedTask = await TaskModel.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedTask) {
//       return res.status(404).json({
//         message: "Task not found",
//       });
//     }
//     return res.status(200).json({
//       message: "Task updated successfully",
//       data: updatedTask,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

const deletedTask = DeleteOne(TaskModel);
// async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedTask = await TaskModel.findByIdAndDelete(id);
//     if (!deletedTask) {
//       return res.status(404).json({
//         message: "Task not found",
//       });
//     }
//     return res.status(200).json({
//       message: "Task deleted successfully",
//       data: deletedTask,
//     });
//   } catch (error) {
//     return next(new ApiError(error, 500));
//   }
// };

export { createNewTask, getAllTasks, getSpecificTask, updateTask, deletedTask };
