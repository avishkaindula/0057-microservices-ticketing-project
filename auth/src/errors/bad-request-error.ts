import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    // We are passing the message property to the parent class constructor.
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
    // This is needed because we are extending a built-in class.
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
