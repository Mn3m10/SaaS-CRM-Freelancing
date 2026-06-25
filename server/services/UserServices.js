import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import ApiError from "../errors/ApiError.js";

const createNewUser = async (req, res, next) => {
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
      title,
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

const getAllUsers = async (req, res, next) => {
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

const getSpecificUser = async (req, res, next) => {
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

const updateUser = async (req, res, next) => {
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

const updateUserPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

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

    return res.status(200).json({
      message: "Password updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const deleteUser = async (req, res, next) => {
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
