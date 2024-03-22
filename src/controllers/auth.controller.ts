import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/Apierror.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { CreateUserDto, createuserdto } from '../dto/create-user.dto.js';
import { comparepassword, generatehasspassword } from '../utils/functions/hashing.js';
import prisma from '../db/dbconfig.js';
import { generateAuthToken } from '../utils/functions/generateToken.js';
import { loginUser } from '../dto/login-user.dto.js';
import { sendMail } from '../utils/functions/sendmaill.js';
async function login(req: Request<{}, {
     email: string,
     password: string
}>, res: Response, next: NextFunction) {
     //check if user already exist in the DB
     //if yes then send a cookie to the frontend and send a response
     //if no then sent a error response to the frontend or by the api
     await loginUser.parseAsync(req.body);
     const { email, password } = req.body;
     const userdata = await prisma.user.findUnique({
          where: {
               email,
          },
          include: {
               Subscription: true,
               Result: true,
          }
     });
     if (!userdata) {
          next(new ApiError(400, "User does not exist"));
          return;
     }
     if (!userdata?.isEmailVerified) {
          next(new ApiError(400, "User is not verified"));
          return;
     }
     const ispasswordmatch = await comparepassword(
          password,
          userdata.password,
     );
     if (!ispasswordmatch) {
          next(new ApiError(400, "Entered Password is incorrect"));
     }
     const token = await generateAuthToken(userdata.id);
     res.cookie("auth_token", token, {
          httpOnly: true,
     });
     return res.json(new ApiResponse("Successfully User logged in", userdata, req.url, 200));
}
async function register(req: Request<{}, createuserdto>, res: Response, next: NextFunction) {
     await CreateUserDto.parseAsync(req.body);
     const { email, name, password } = req.body;
     const user = await prisma.user.findUnique({
          where: {
               email,
          },
     });
     if (user) {
          next(new ApiError(400, 'User already exists, please login or use another email address'));
     }
     //generate a otp and a otp expiry time
     const otp = Math.floor(Math.random() * 900000) + 100000;
     const otpExpires = new Date();
     otpExpires.setMinutes(otpExpires.getMinutes() + 10);
     //hashing the password
     const hasspassword = await generatehasspassword(password);
     //create a user
     const newUser = await prisma.user.create({
          data: {
               email: email,
               name: name,
               password: hasspassword,
               Otp: {
                    create: {
                         otp,
                         otpExpiresAt: otpExpires,
                    }
               }
          },
          include: {
               Subscription: true,
               Result: true
          }
     });
     await sendMail({
          name,
          email,
          subject: "Welcome to the Auth Service",
          type: 'welcome',
          otp: otp.toString(),
     })
     res.cookie("auth_token", generateAuthToken(newUser.id), {
          httpOnly: true,
     })
     return res.json(new ApiResponse("Your account is created. Check your Email for otp and verify Yourself", newUser, req.url, 201));
}
async function verifyUser(req: Request<{
     email: string,
     otp: string
}>, res: Response, next: NextFunction) {
     //check if user already exist in the DB
     //if not then give error
     //if otp not equaL then give error
     //IF EXPIRY TIME IS LESS THEN CURRENT TIME THEN GIVE ERROR
     //IF ALL GOOD THEN UPDATE THE USER AND SEND A RESPONSE
     const { email, otp } = req.params;
     if (!email || !otp) {
          throw new Error('Email and OTP are required');
     }
     const user = await prisma.user.findUnique({
          where: {
               email: email,
          },
          include: {
               Otp: true,
          },
     });
     if (!user) {
          throw new Error('There is no account associated with this Email');
     }
     if (user.isEmailVerified) {
          throw new Error('User is already verified,Please continue to proceed with your account');
     }
     if (user.Otp?.otp !== parseInt(otp)) {
          throw new Error('OTP is incorrect');
     }
     if (user.Otp?.otpExpiresAt < new Date()) {
          throw new Error('OTP is Expired,Please resend the OTP');
     }
     await sendMail({
          name: user.name,
          email,
          subject: "Account Verified Successfully",
          type: 'verify'
     })
     const updatedData = await prisma.user.update({
          where: {
               email,
          },
          data: {
               isEmailVerified: true,
          },
     });
     return res.json(new ApiResponse('User Verified Successfully', updatedData, req.url, 200));
}

async function sendOtp(req: Request<{
     email: string
}>, res: Response, next: NextFunction) {
     //check if user already exist in the DB
     //check if user is verified or not , if verified send a error that it is verified
     //if not then generate a new otp and update the user and send a response
     console.log("Hhh");
     const { email } = req.params;
     if (!email) {
          throw new Error('Email is required');
     }
     const user = await prisma.user.findUnique({
          where: {
               email: email,
          },
          include: {
               Otp: true,
          },
     });
     console.log(user);
     if (!user) {
          throw new Error('There is no account associated with this Email');
     }
     if (user.isEmailVerified) {
          throw new Error('User is already verified,Please Login');
     }
     const otp = Math.floor(Math.random() * 900000) + 100000;
     const otpExpires = new Date();
     otpExpires.setMinutes(otpExpires.getMinutes() + 10);

     await prisma.otp.update({
          where: {
               userID: user.id
          },
          data: {
               otp,
               otpExpiresAt: otpExpires,
          },
     });
     await sendMail({
          name: user.name,
          email,
          subject: "OTP for Verification",
          type: 'reset',
          otp: otp.toString(),
     })
     return res.json(new ApiResponse('OTP sent successfully', null, req.url, 200));
}
async function logout(req: Request, res: Response, next: NextFunction) {
     const cookie = req.cookies['auth_token'];
     if (!cookie) {
          next(new ApiError(400, 'User is not logged in'));
     }
     res.clearCookie('auth_token');
     return res.json(new ApiResponse('User Logged out successfully', null, req.url, 200));
}
export { login, register, verifyUser, sendOtp, logout };