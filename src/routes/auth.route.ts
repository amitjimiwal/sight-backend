//generate a new route file
import { Router } from "express";
import { asyncHandler } from "../lib/apihandler.js";
import { ApiError } from "../lib/Apierror.js";
import { login, logout, register, sendOtp, verifyUser,resendVerification, forgotPassword, updatePassword } from "../controllers/auth.controller.js";
import { ApiResponse } from "../lib/ApiResponse.js";
import authmiddleware from "../middlewares/auth.middleware.js";
import { userInfo } from "os";
export const authRouter = Router();

authRouter.route("/").get(asyncHandler((req, res, next) => {
  res.status(200).json(new ApiResponse("Auth service working fine", null, req.url, 200));
}));
authRouter.route("/register").post(asyncHandler(register));
authRouter.route("/login").post(asyncHandler(login));
authRouter.route("/logout").get(asyncHandler(authmiddleware), asyncHandler(logout));
authRouter.route("/verify/:otp/:email").patch(asyncHandler(verifyUser));
authRouter.route("/resendotp/:email").patch(asyncHandler(sendOtp));
authRouter.route('/resendverification/:email').patch(asyncHandler(resendVerification));
authRouter.route('/reset/:email').post(asyncHandler(forgotPassword));
authRouter.route('/update/password').post(asyncHandler(updatePassword));
authRouter.route("/me").get(asyncHandler(authmiddleware), asyncHandler((req, res, next) => {
  res.send(new ApiResponse("UserInfo", req.body.user, req.url, 200));
}));