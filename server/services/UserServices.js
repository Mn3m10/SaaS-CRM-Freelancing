import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import ApiError from "../errors/ApiError.js";

const createNewUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const profileImage = req.file ? req.file.filename : null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    const usersCount = await UserModel.countDocuments();

    if (usersCount < 1) {
      res.status(200).json({
        message: "No users yet",
      });
    }

    return res.status(200).json({
      message: "Users Data",
      count: usersCount,
      data: users,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const getSpecificUser = async (req, res) => {
  try {
    const { id } = req.params;
    const theUser = await UserModel.findById(id);
    if (!theUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User found",
      data: theUser,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "Password updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

export {
  createNewUser,
  getAllUsers,
  getSpecificUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};
