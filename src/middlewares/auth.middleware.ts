import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/Apierror.js";
import { decodeAuthToken } from "../utils/functions/generateToken.js";
import prisma from "../db/dbconfig.js";
import { JwtPayload } from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
export default async function authmiddleware(req: Request, res: Response, next: NextFunction) {
     const cookie = req.cookies['auth_token'];
     if (!cookie) {
          throw new ApiError(401, 'Unauthorzed access, please login first');
     }
     if(process.env.NODE_ENV === 'development'){
          console.log(cookie);
     }
     const decoded_token = await decodeAuthToken(cookie);
     //check if it's a registered User;
     const user = await prisma.user.findUnique({
          where: {
               id: Number((decoded_token as JwtPayload)._id)
          }
     });
     if(!user){
          throw new ApiError(401,"Could'nt find an account, Please Register");
     }
     if(!user?.isEmailVerified) return res.json(new ApiResponse("You're not Verified Please verify yourself",user,req.url,403))
     req.body.user = user; //sending the user info forward in order to reduce the db call again in the api.
     next();
}