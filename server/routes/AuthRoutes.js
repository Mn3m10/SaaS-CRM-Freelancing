import express from "express";
import upload from "../middlewares/uploads.js";
import { signup, login } from "../services/AuthServices.js";
import {
  SignupValidator,
  LoginValidator,
} from "../validators/AuthValidator.js";

const AuthRouter = express.Router();

AuthRouter.post(
  "/signup",
  upload.single("profileImage"),
  SignupValidator,
  signup,
);

AuthRouter.post("/login", LoginValidator, login);

export default AuthRouter;
