import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/Apierror.js';
import { ApiResponse } from '../utils/ApiResponse.js';
function login(req: Request<{}, {
     email: string,
     password: string
}>, res: Response, next: NextFunction) {
     const { email, password } = req.body;
     if (!email || !password) {
          next(new ApiError(400, 'Email and password are required'));
     }
     // Do something
     return res.json(new ApiResponse("Got data", { email, password }, "/login"));
}

export { login };