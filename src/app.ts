import express, { Express, NextFunction, Request, Response } from "express";
import config from "./config/config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authrouter } from "./routes/auth.route.js";
import { errorHandler } from "./utils/errorhandler.js";
import { ApiResponse } from "./utils/ApiResponse.js";
const app: Express = express();
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1/auth", authrouter);

app.get("/", (req: Request, res: Response) => {
  res.json(new ApiResponse("Auth service working properly!", ["testing data sent"], req.url));
});

//handling unhandled routes
app.all("*", (req, res, next) => {
  res.json(new ApiResponse(`Can't find ${req.method} Request  ${req.originalUrl}  on this server!`, null, req.url, 404));
});

app.use(errorHandler);
export default app;
