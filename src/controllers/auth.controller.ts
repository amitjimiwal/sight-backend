import { Request, Response, NextFunction, CookieOptions } from "express";
import { ApiError } from "../lib/Apierror.js";
import { ApiResponse } from "../lib/ApiResponse.js";
import { CreateUserDto, createuserdto } from "../dto/create-user.dto.js";
import {
  comparepassword,
  generatehasspassword,
} from "../lib/functions/hashing.js";
import prisma from "../db/dbconfig.js";
import { decodeEmailVerificationToken, generateAuthToken, generateEmailVerificationToken } from "../lib/functions/generateToken.js";
import { loginUser } from "../dto/login-user.dto.js";
import { sendMail } from "../lib/functions/sendmail.js";
import config from "../config/config.js";
import { verify } from "crypto";
const cookieOptions: CookieOptions = { domain: config.cookieDomain, path: '/', httpOnly: true, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), sameSite: "none", secure: true }
const localCookieOptions = {
  httponly: true,
  secure: false,
}
async function login(
  req: Request<
    {},
    {
      email: string;
      password: string;
    }
  >,
  res: Response,
  next: NextFunction
) {
  //check if user already exist in the DB
  //if yes then send a cookie to the frontend and send a response
  //if no then sent a error response to the frontend or by the api
  await loginUser.parseAsync(req.body);
  const { email, password } = req.body;
  const userdata = await prisma.user.findUnique({
    where: {
      email,
    }
  });
  if (!userdata) {
    next(new ApiError(400, "User does not exist"));
    return;
  }
  const ispasswordmatch = await comparepassword(password, userdata.password);
  if (!ispasswordmatch) {
    next(new ApiError(400, "Entered Password is incorrect"));
    return;
  }
  const { password: pass, ...user } = userdata;
  const token = await generateAuthToken(userdata.id);
  res.cookie("auth_token", token, cookieOptions);
  if (!userdata?.isEmailVerified) {
    return res.json(new ApiResponse("Login Successful", user, req.url, 403));
  }
  return res.json(
    new ApiResponse("Successfully User logged in", user, req.url, 200)
  );
}
async function register(
  req: Request<{}, createuserdto>,
  res: Response,
  next: NextFunction
) {
  await CreateUserDto.parseAsync(req.body);
  const { email, name, password } = req.body;
  // const valid = await validateEmail(email);
  // if (!valid) {
  //   next(new ApiError(400, "Invalid Email Address"));
  //   return;
  // }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    next(
      new ApiError(
        400,
        "User already exists, please login or use another email address"
      )
    );
    return;
  }
  //generate a otp and a otp expiry time
  const otp = Math.floor(Math.random() * 900000) + 100000;
  const otpExpires = new Date();
  otpExpires.setMinutes(otpExpires.getMinutes() + 10);
  //hashing the password
  const hasspassword = await generatehasspassword(password);
  //create a user
  await prisma.user.create({
    data: {
      email: email,
      name: name,
      password: hasspassword,
      Otp: {
        create: {
          otp,
          otpExpiresAt: otpExpires,
        },
      },
    },
    include: {
      Subscription: true,
      Result: true,
    }
  });
  const token = generateEmailVerificationToken(email);
  const magicUrl = `${config.frontendUrl}/verify?email=${email}&redirect=${token}`;
  Promise.all([sendMail({
    name,
    email,
    subject: "Welcome to TypeSight",
    type: "welcome",
    otp: otp.toString(),
  }), sendMail({
    name,
    email,
    subject: "Verification Link",
    type: "verify",
    magicUrl
  })])

  return res.json(
    new ApiResponse(
      "Account verification link sent to your registered email",
      null,
      req.url,
      201
    )
  );
}
async function verifyUser(
  req: Request<{
    email: string;
    otp: string;
  }>,
  res: Response,
  next: NextFunction
) {
  //check if user already exist in the DB
  //if not then give error
  //if otp not equaL then give error
  //IF EXPIRY TIME IS LESS THEN CURRENT TIME THEN GIVE ERROR
  //IF ALL GOOD THEN UPDATE THE USER AND SEND A RESPONSE
  const { email, otp } = req.params;
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
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
    throw new Error("There is no account associated with this Email");
  }
  if (user.isEmailVerified) {
    throw new ApiError(409,
      "User is already verified,Please continue to proceed with your account"
    );
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || email !== decodeEmailVerificationToken(token).email) {
    console.log(token);
    throw new ApiError(400, "Token Invalid.Please retry!")
  }
  if (user.Otp?.otp !== parseInt(otp)) {
    throw new Error("OTP is incorrect");
  }
  if (user.Otp?.otpExpiresAt < new Date()) {
    throw new Error("OTP is Expired,Please resend the OTP");
  }
  sendMail({
    name: user.name,
    email,
    subject: "Account Verified Successfully",
    type: "verifySuccess",
  });
  const updatedData = await prisma.user.update({
    where: {
      email,
    },
    data: {
      isEmailVerified: true,
    },
  });
  const { password: pass, ...data } = updatedData;
  return res.json(
    new ApiResponse("User Verified Successfully", data, req.url, 200)
  );
}

async function sendOtp(
  req: Request<{
    email: string;
  }>,
  res: Response,
  next: NextFunction
) {
  //check if user already exist in the DB
  //check if user is verified or not , if verified send a error that it is verified
  //if not then generate a new otp and update the user and send a response
  const { email } = req.params;
  if (!email) {
    throw new Error("Email is required");
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
    throw new Error("There is no account associated with this Email");
  }
  if (user.isEmailVerified) {
    throw new Error("User is already verified,Please Login");
  }
  const otp = Math.floor(Math.random() * 900000) + 100000;
  const otpExpires = new Date();
  otpExpires.setMinutes(otpExpires.getMinutes() + 10);

  await prisma.otp.update({
    where: {
      userID: user.id,
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
    type: "reset",
    otp: otp.toString(),
  });
  return res.json(new ApiResponse("OTP sent successfully", null, req.url, 200));
}
async function logout(req: Request, res: Response, next: NextFunction) {
  const cookie = req.cookies["auth_token"];
  if (!cookie) {
    next(new ApiError(400, "User is not logged in"));
  }
  res.clearCookie("auth_token", { domain: config.cookieDomain, path: '/', sameSite: "none", secure: true, httpOnly: true });
  return res.json(
    new ApiResponse("User Logged out successfully", null, req.url, 200)
  );
}
async function resendVerification(req: Request<{
  email: string
}>, res: Response, next: NextFunction) {
  const email = req.params.email;
  if (!email) throw new ApiError(400, "Email is Required");
  const userWithEmailExist = await prisma.user.findUnique({
    where: {
      email
    }
  })
  if (!userWithEmailExist) throw new ApiError(404, "No account exists for this email");
  const token = generateEmailVerificationToken(email);
  const name = userWithEmailExist.name;
  const magicUrl = `${config.frontendUrl}/verify?email=${email}&redirect=${token}`;
  Promise.all([sendMail({
    name,
    email,
    subject: "Verification Link",
    type: "verify",
    magicUrl
  })])
}

async function forgotPassword(req: Request<{
  email: string
}>, res: Response, next: NextFunction) {
  const email = req.params.email;
  if (!email) throw new ApiError(404, "No email Found");
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) throw new ApiError(404, "User doesn't exist");
  const token = generateEmailVerificationToken(email);
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  const forgotEmail = await prisma.forgotPassword.findUnique({
    where: {
      id: user.id
    }
  })
  const magicUrl = `${config.frontendUrl}/reset?email=${email}&token=${token}`;
  if (!forgotEmail) {
    await prisma.forgotPassword.create({
      data: {
        userID: user.id,
        email,
        token,
        expiresAt
      }
    })
  } else {
    if (forgotEmail.expiresAt < new Date()) throw new ApiError(400, "One request already in progress, Retry after 5 mins");
    else {
      //send new email with token and update expiry
      await prisma.forgotPassword.update({
        where: {
          id: user.id
        },
        data: {
          token,
          expiresAt
        }
      })
    }
  }
  sendMail({ name: user.name, email, subject: "Reset Password Link", type: "resetemail", magicUrl });
  return res.json(new ApiResponse("Password reset link sent to your email", null, req.url, 200));
}

async function updatePassword(req: Request<{},{
  password:string;
  email:string;
}>, res: Response, next: NextFunction) {
  const {email,password}=req.body;
  if(!email || !password) throw new ApiError(404,"Invalid Payload");
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || email !== decodeEmailVerificationToken(token).email) {
    console.log(token);
    throw new ApiError(400, "Token Invalid.Please retry!")
  }
  const forgotEmail=await prisma.forgotPassword.findFirst({
    where:{
      email
    }
  });
  if(!forgotEmail) throw new ApiError(400,"You haven't generated a link");
  if(forgotEmail.expiresAt<new Date()) throw new ApiError(400,"Token Expired, Generate new Url")
  const hashpasswod=await generatehasspassword(password);
  await prisma.user.update({
    where:{
      email
    },
    data:{
      password:hashpasswod
    }
  })
  await prisma.forgotPassword.deleteMany({
    where:{
      email
    }
  });
  return res.json(new ApiResponse("Update the Password successfully, You can Login",null,req.url,201))
}
export { login, register, verifyUser, sendOtp, logout, resendVerification ,forgotPassword,updatePassword};

