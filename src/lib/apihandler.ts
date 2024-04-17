import { NextFunction, Request, Response } from "express";

const asyncHandler = (requestHandler: (arg0: any, arg1: any, arg2: any) => any) => {
     return (req: Request, res: Response, next: NextFunction) => {
          Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
     }
}
export { asyncHandler };