export abstract class CustomError extends Error {
    abstract statusCode: number;
    constructor(message: string) {
        super(message);
        // This is the message that get logged in the console when we throw an error.
        // Pre-built Error class has this built-in message property, and we are
        // sending the message to that built-in message property.
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    abstract serializeErrors(): { message: string; field?: string }[];
}
// We create abstract classes so that other classes can extend them and
// then we can make sure that all those classes are having the same
// properties and methods we define in the abstract class.