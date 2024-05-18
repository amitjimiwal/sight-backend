import express, { Express, NextFunction, Request, Response } from "express";
import config from "./config/config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.route.js";
import { errorHandler } from "./lib/errorhandler.js";
import { ApiResponse } from "./lib/ApiResponse.js";
import authmiddleware from "./middlewares/auth.middleware.js";
import { subscriptionRouter } from "./routes/subscription.route.js";
import { asyncHandler } from "./lib/apihandler.js";
import { resultRouter } from "./routes/results.route.js";
import { stripeWebhook } from "./webhooks/stripewebhook.js";
const app: Express = express();
app.disable("x-powered-by");
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.post("/api/v1/webhook",express.raw({ type: 'application/json' }), asyncHandler(stripeWebhook));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/pro", subscriptionRouter);
app.use("/api/v1/result", resultRouter); //for stripe webhooks
app.get("/", asyncHandler(authmiddleware), (req: Request, res: Response) => {
  res.json(new ApiResponse("Backend service working properly!", ["testing data sent"], req.url));
});
//for render 
app.get("/ping", (req: Request, res: Response) => {
  res.send("Server is running");
});
//handling unhandled routes
app.all("*", asyncHandler(authmiddleware), (req, res, next) => {
  res.json(new ApiResponse(`Can't find ${req.method} Request  ${req.originalUrl}  on this server!`, null, req.url, 404));
});

app.use(errorHandler);
export default app;
