import express from "express";
import upload from "../middlewares/uploads.js";
import protectedRoute from "../middlewares/protected.js";
import {
  signup,
  login,
  deleteAll,
  setUserProfileImage,
} from "../services/AuthServices.js";
import {
  SignupValidator,
  LoginValidator,
} from "../validators/AuthValidator.js";

const AuthRouter = express.Router();

AuthRouter.post("/signup", SignupValidator, signup);

AuthRouter.post("/login", LoginValidator, login);

AuthRouter.post(
  "/set-user-image",
  protectedRoute,
  upload.single("profileImage"),
  setUserProfileImage,
);

AuthRouter.delete("/delete-all", deleteAll);

export default AuthRouter;
