import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "No token found , Unauthorized",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default protectedRoute;
