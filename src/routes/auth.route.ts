//generate a new route file
import { Router } from "express";
import { asyncHandler } from "../utils/apihandler.js";
import { ApiError } from "../utils/Apierror.js";
import { login, logout, register, sendOtp, verifyUser } from "../controllers/auth.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const authrouter = Router();

authrouter.route("/").get(asyncHandler((req, res, next) => {
  res.status(200).json(new ApiResponse("Auth service working fine", null, req.url, 200));
}));

authrouter.route("/register").post(asyncHandler(register));

authrouter.route("/login").post(asyncHandler(login));

authrouter.route("/logout").get(asyncHandler(logout));

authrouter.route("/verify/:otp/:email").get(asyncHandler(verifyUser));

authrouter.route("/resendotp/:email").get(asyncHandler(sendOtp));