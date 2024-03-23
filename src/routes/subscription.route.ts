import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/apihandler.js";
import authmiddleware from "../middlewares/auth.middleware.js";
import { createSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', asyncHandler((req, res) => {
     res.statusCode = 200;
     res.send(new ApiResponse("Subscription service working", null, req.url, 200));
}));

subscriptionRouter.post('/subscribe', authmiddleware, asyncHandler(createSubscription));


export { subscriptionRouter };