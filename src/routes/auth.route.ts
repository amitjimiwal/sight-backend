//generate a new route file
import { Router } from "express";
import { asyncHandler } from "../utils/apihandler.js";
import { ApiError } from "../utils/Apierror.js";
import { login } from "../controllers/auth.controller.js";
export const authrouter = Router();

authrouter.route("/").get(asyncHandler((req, res, next) => {
  // res.status(200).json({
  //   statusCode: 200,
  //   status: "success",
  //   message: `Auth service working properly!`,
  // });
  next(new ApiError(500, "ek or hai bkc"));
}));
authrouter.route("/login").post(asyncHandler(login));
