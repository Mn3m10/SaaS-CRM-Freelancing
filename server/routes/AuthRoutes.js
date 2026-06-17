import express from "express";
import upload from "../middlewares/uploads.js";
import { signup, login , deleteAll } from "../services/AuthServices.js";
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

AuthRouter.delete("/delete-all" , deleteAll);

export default AuthRouter;
