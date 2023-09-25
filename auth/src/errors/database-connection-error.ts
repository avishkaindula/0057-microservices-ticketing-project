export class DatabaseConnectionError extends Error {
  reason = "Error connecting to database";
  // This is a property that is specific to the DatabaseConnectionError class.
  // It will be attached to the error object and will be available in the error handler middleware.

  constructor() {
    // We are extending a built-in class. So we need to call super().
    super();

    // Only because we are extending a built-in class, we need to write the following line of code.
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}