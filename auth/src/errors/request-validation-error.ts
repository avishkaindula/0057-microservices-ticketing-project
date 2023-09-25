import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    // We are extending a built-in class. So we need to call super().
    super();

    // Only because we are extending a built-in class, we need to write the following line of code.
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
