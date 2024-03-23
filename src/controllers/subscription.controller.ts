import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";


async function createSubscription(req: Request, res: Response) {
     res.statusCode = 200;
     res.send(new ApiResponse("Subscription service working", null, req.url, 200));
}
export { createSubscription };