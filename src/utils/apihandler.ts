import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const apiHandler = (fn: (arg0: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, arg1: Response<any, Record<string, any>>, arg2: NextFunction) => any) => {
     return async function (req: Request, res: Response, next: NextFunction) {
          try {
               await fn(req, res, next);
          } catch (err) {
               next(err)
          }
     }
}