import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

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

// interface CustomError {
//   statusCode: number;
//   serializeErrors(): {
//     message: string;
//     field?: string;
//   }[];
// }
// export class RequestValidationError extends Error implements CustomError {

// This way we can make sure that the RequestValidationError class implements
// the CustomError interface. So it will reduce the chances of creating wrong
// kind of methods and properties in Error classes.

// ------------------------------------------------------------------------------------------------
// export class RequestValidationError extends Error {
export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public reasons: ValidationError[]) {
    // We are extending a built-in class. So we need to call super().
    super("Invalid request parameters.");

    // Only because we are extending a built-in class, we need to write the following line of code.
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.reasons.map((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path };
      }
      return { message: err.msg };
    });
  }
  // We need to create a serializeErrors() in every error class which 
  // will format the error in the common error response structure.
}
