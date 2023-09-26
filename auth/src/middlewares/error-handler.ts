import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
  // This is the generic error that will be thrown if we don't have a specific
  // error handler for a specific error. This generic error should also follow
  // the common error response structure.
};

// -----------------------------------------------------------------------------------------------

// Example of a common error response structure
// {
//   "errors": [
//       {
//           "message": "Email must be valid",
//           "field": "email"
//       },
//       {
//           "message": "Password must be between 4 and 20 characters",
//           "field": "password"
//       }
//   ]
// }

// -----------------------------------------------------------------------------------------------

// Another example of a common error response structure
// {
//   "errors": [
//       {
//           "message": "Error connecting to database"
//       }
//   ]
// }

// -----------------------------------------------------------------------------------------------
