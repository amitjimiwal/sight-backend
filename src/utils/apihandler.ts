import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const asyncHandler = (requestHandler: (arg0: any, arg1: any, arg2: any) => any) => {
     return (req: Request, res: Response, next: NextFunction) => {
          Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
     }
}
export { asyncHandler }