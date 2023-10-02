import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
  // As there's no error argument in this middleware, this will not be treated as
  // an error handler middleware.
) => {
  // This middleware will be executed after the express-validator middleware
  // has been executed. So, we can assume that the validation has already been
  // done.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};
