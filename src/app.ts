import express, { Express, Request, Response } from "express";
import config from "./config/config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authrouter } from "./routes/auth.route.js";
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
export default app;
