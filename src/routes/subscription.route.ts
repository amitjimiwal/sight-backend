import { Router } from "express";
import { ApiResponse } from "../lib/ApiResponse.js";
import { asyncHandler } from "../lib/apihandler.js";
import authmiddleware from "../middlewares/auth.middleware.js";
import { createSubscription, getsubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', asyncHandler((req, res) => {
     res.statusCode = 200;
     res.send(new ApiResponse("Subscription service working", null, req.url, 200));
}));

subscriptionRouter.post('/create-stripe-session', asyncHandler(authmiddleware), asyncHandler(createSubscription));
subscriptionRouter.get("/mysubscription", asyncHandler(authmiddleware), asyncHandler(getsubscription));

export { subscriptionRouter };