import { Request, Response } from "express";
import config from "./config/config.js";
import app from "./app.js";
app.get("/", (req: Request, res: Response) => {
  res.json({
    statusCode: 200,
    status: "success",
    message: `Global Service is working properly!`,
  });
});

//handling unhandled routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    status: "fail",
    message: `Can't find ${req.url} on this server!`,
  });
});

app.listen(config.port, () => {
  console.log(` TS Server is running on port ${config.port}`);
});
