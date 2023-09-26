import { CustomError } from "./custom-error";

// ------------------------------------------------------------------------------------------------

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

// ------------------------------------------------------------------------------------------------
// export class RequestValidationError extends Error {
export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error connecting to database";
  // This is a property that is specific to the DatabaseConnectionError class.
  // It will be attached to the error object and will be available in the error handler middleware.

  constructor() {
    // We are extending a built-in class. So we need to call super().
    super("Error connecting to db.");

    // Only because we are extending a built-in class, we need to write the following line of code.
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
    // We are sending an array of objects with a message property because
    // we want to follow the common error response structure.
    // .reason is a property we've written in the DatabaseConnectionError class
    // and that is specific to the DatabaseConnectionError class.
  }
  // We need to create a serializeErrors() in every error class which
  // will format the error in the common error response structure.
}
