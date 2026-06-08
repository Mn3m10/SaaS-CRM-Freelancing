import ProjectModel from "../models/ProjectModel.js";
import ApiError from "../errors/ApiError.js";

const createNewProject = async (req, res) => {
  try {
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({
        message: "Title and Description are required",
      });
    }
    const newProject = await ProjectModel.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      deadline: req.body.deadline,
      client: req.body.client,
      user: req.user._id,
    });
    return res.status(201).json({
      message: "Project Created Successfully",
      data: newProject,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find()
      .populate("client")
      .populate("user");
    const count = await ProjectModel.countDocuments();
    return res.status(200).json({
      message: "All Projects",
      count,
      data: projects,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const getSpecificProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectModel.findById(id)
      .populate("client")
      .populate("user");
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    return res.status(200).json({
      message: "Project found",
      data: project,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = await ProjectModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updateProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    return res.status(200).json({
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await ProjectModel.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    return res.status(200).json({
      message: "Project deleted successfully",
      data: deletedProject,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

export {
  createNewProject,
  getAllProjects,
  getSpecificProject,
  updateProject,
  deleteProject,
};
