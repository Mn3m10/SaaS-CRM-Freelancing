import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../errors/ApiError.js";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "90d",
    });

    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
      token,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const setUserProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError("Please upload an image", 400));
    }

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { profileImage: req.file.filename },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    return res.status(200).json({
      message: "Profile image updated successfully",
      user,
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "All fileds are required",
      });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "90d",
    });
    return res.status(200).json({
      message: "User logged in successfully",
      data: user,
      token,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const deleteAll = async (req, res, next) => {
  try {
    await UserModel.deleteMany();
    return res.status(200).json({
      message: "All data deleted successfully",
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

export { signup, login, deleteAll, setUserProfileImage };
