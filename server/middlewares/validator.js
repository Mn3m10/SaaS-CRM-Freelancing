import { validationResult } from "express-validator";
import ApiError from "../errors/ApiError.js";

const ValidationMiddleware = (req , res , next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return next(new ApiError(errors.array(), 400));
  }
  next();
}

export default ValidationMiddleware;