import { Router, Request, Response, NextFunction } from "express";
import { ApiResponse } from "../lib/ApiResponse.js";
import { asyncHandler } from "../lib/apihandler.js";
import authmiddleware from "../middlewares/auth.middleware.js";
import { createSubscription } from "../controllers/subscription.controller.js";
import { addResult, getResults } from "../controllers/result.controller.js";


const resultRouter = Router();
resultRouter.get('/', asyncHandler((req: Request, res: Response, next: NextFunction) => {
     res.statusCode = 200;
     res.send(new ApiResponse("Results service working", null, req.url, 200));
}));
resultRouter.post('/add', asyncHandler(authmiddleware), asyncHandler(addResult));
resultRouter.get('/:id', asyncHandler(authmiddleware), asyncHandler(getResults));
export { resultRouter }