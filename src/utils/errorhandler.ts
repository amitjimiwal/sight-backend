//Global error handling middleware
import { NextFunction, Request, Response } from "express";
interface ErrorCustom extends Error {
     statusCode?: number;
}
function errorHandler(
     err: ErrorCustom,
     req: Request,
     res: Response,
     next: NextFunction
) {
     //handling logs in development mode only
     if (process.env.NODE_ENV === 'development' && err.message) {
          console.log(err);
     }else if(process.env.NODE_ENV === 'development' && !err.message){
          console.log(err);
     }
     res.status(err?.statusCode || 500).json({
          success: false,
          statusCode: err?.statusCode || 500,
          timestamp: new Date().toISOString(),
          path: req.url,
          message: err.message || err,
     });
}
/* 
Note- whenever you are passing any error to this middleware, make sure to pass the error with statusCode property, otherwise it will take 500 as default status code. Make sure to pass the value of the message and code as object to the next else it will take statuscode as 500 and message as error.
*/
export { errorHandler };
