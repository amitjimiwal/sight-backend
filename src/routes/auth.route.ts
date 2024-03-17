//generate a new route file
import { Router } from "express";
export const authrouter = Router();

authrouter.route("/").get((req, res) => {
  res.status(200).json({
    statusCode: 200,
    status: "success",
    message: `Auth service working properly!`,
  });
});
