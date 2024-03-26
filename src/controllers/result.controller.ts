import { NextFunction, Request, Response } from "express";
import prisma from "../db/dbconfig.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import exp from "constants";
import { addResultDto } from "../dto/add-result.dto.js";
import { ApiError } from "../utils/Apierror.js";

async function addResult(req: Request, res: Response, next: NextFunction) {
     await addResultDto.parseAsync(req.body);
     const { score, accuracy, duration } = req.body;
     const user = req.body.user;
     //add the result to the database
     const result = await prisma.result.create({
          data: {
               score: score,
               accuracy: accuracy,
               duration: duration,
               user: {
                    connect: {
                         id: user.id
                    }
               }
          }
     });
     res.statusCode = 200;
     res.send(new ApiResponse("Result added successfully", result, req.url, 200));
}

async function getResults(req: Request<{
     id: string
}>, res: Response, next: NextFunction) {
     const id = req.params.id;
     const results = await prisma.result.findMany({
          where: {
               userID: Number(id),
          }
     });
     if(results.length === 0){
          throw new ApiError(404, "No results found corresponding to Logged in User");
     }
     res.statusCode = 200;
     res.send(new ApiResponse("Results fetched successfully", results, req.url, 200));
}
export { addResult,getResults };