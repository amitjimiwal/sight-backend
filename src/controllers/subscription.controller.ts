import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { razorPay } from "../utils/razorpayconfig.js";
import config from "../config/config.js";


async function createSubscription(req: Request, res: Response, next: NextFunction) {
     const user= req.body.user;
     const subscription=await razorPay.subscriptions.create({
          plan_id: config.planId,
          total_count: 12,
          quantity: 1,
          customer_notify: 1,
     });
     if (process.env.NODE_ENV === "development") {
          console.log(subscription);
     }
     res.statusCode = 200;
     res.send(new ApiResponse("Create Subscription service working", null, req.baseUrl, 200));
}
export { createSubscription };