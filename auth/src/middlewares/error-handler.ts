import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  // As all Error classes extends the CustomError class, we can use the
  // instanceof operator to check if the error is an instance of the
  // CustomError class. If it is, then we can send the error in the
  // common error response structure.

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
