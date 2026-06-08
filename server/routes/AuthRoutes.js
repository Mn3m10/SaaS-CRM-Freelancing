import express from "express";
import upload from "../middlewares/uploads.js";
import { signup , login } from "../services/AuthServices.js";

const AuthRouter = express.Router();

AuthRouter.post("/signup" , upload.single("profileImage") , signup);

AuthRouter.post("/login" , login);

export default AuthRouter;