import { ValidationError } from "express-validator";

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
export class RequestValidationError extends Error {
  statusCode = 400;

  constructor(public reasons: ValidationError[]) {
    // We are extending a built-in class. So we need to call super().
    super();

    // Only because we are extending a built-in class, we need to write the following line of code.
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.reasons.map((error) => {
      // .reasons is present on the constructor of RequestValidationError
      if (error.type === "field") {
        return { message: error.msg, field: error.path };
      }
    });
  }
  // We need to create a serializeErrors() in every error class which 
  // will format the error in the common error response structure.
}
