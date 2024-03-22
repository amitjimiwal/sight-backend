import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/Apierror.js";
import { decodeAuthToken } from "../utils/functions/generateToken.js";
import prisma from "../db/dbconfig.js";
import { JwtPayload } from "jsonwebtoken";

export default async function authmiddleware(req: Request, res: Response, next: NextFunction) {
     const cookie = req.cookies['auth_token'];
     if (!cookie) {
          next(new ApiError(401, 'Unauthorzed access, please login first'));
     }
     const decoded_token = decodeAuthToken(cookie);
     //check if it's a registered User;
     const user = await prisma.user.findUnique({
          where: {
               id: Number((decoded_token as JwtPayload)._id)
          }
     });
     req.body.user = user; //sending the user info forward in order to reduce the db call again in the api.
     next();
}