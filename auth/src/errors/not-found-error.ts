import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    // We are extending a built-in class. So we need to call super().
    super("Route not found.");

    // Only because we are extending a built-in class, we need to write the following line of code.
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not Found" }];
  }
  // We need to create a serializeErrors() in every error class which
  // will format the error in the common error response structure.
}
