//generate a new route file
import { Router } from "express";
import { asyncHandler } from "../utils/apihandler.js";
import { ApiError } from "../utils/Apierror.js";
import { login, logout, register, sendOtp, verifyUser } from "../controllers/auth.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import authmiddleware from "../middlewares/auth.middleware.js";
export const authRouter = Router();

authRouter.route("/").get(asyncHandler((req, res, next) => {
  res.status(200).json(new ApiResponse("Auth service working fine", null, req.url, 200));
}));
authRouter.route("/register").post(asyncHandler(register));
authRouter.route("/login").post(asyncHandler(login));
authRouter.route("/logout").get(asyncHandler(authmiddleware), asyncHandler(logout));
authRouter.route("/verify/:otp/:email").get(asyncHandler(verifyUser));
authRouter.route("/resendotp/:email").get(asyncHandler(sendOtp));