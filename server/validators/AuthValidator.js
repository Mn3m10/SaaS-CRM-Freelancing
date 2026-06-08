import { check } from "express-validator";
import ValidationMiddleware from "../middlewares/validator.js"

const SignupValidatro = [
  ValidationMiddleware
]

const LoginValidatro = [
  ValidationMiddleware
]

export {SignupValidatro , LoginValidatro};