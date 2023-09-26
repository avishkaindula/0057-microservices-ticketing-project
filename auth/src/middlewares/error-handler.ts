import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

// Common error response structure
// {
//   errors:
//     {
//       message: string;
//       field?: string;
//     }[]
// }
// So the errors should always be an array of objects with a message property.
// field is optional because not all errors will have a field property.

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    const formattedErrors = err.reasons.map((error) => {
      // .reasons is present on the constructor of RequestValidationError
      if (error.type === "field") {
        return { message: error.msg, field: error.path };
      }
    });
    return res.status(400).send({ errors: formattedErrors });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(500).send({
      errors: [{ message: err.reason }],
      // We are sending an array of objects with a message property because
      // we want to follow the common error response structure.
      // .reason is a property we've written in the DatabaseConnectionError class
      // and that is specific to the DatabaseConnectionError class.
    });
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
