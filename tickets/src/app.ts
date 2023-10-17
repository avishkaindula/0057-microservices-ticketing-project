import express from "express";
import "express-async-errors";
// This package will allow us to throw errors inside of async functions
// without having to use next() to pass the error to the error handler.
// We need to import express-async-errors before importing any other
// routes or middlewares inside index.ts file because the package will
// only effect routes or middlewares that are imported after
// the package is imported.
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@airtickets/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
    // This will create a environment variable called NODE_ENV that will be
    // set to "test" when we run tests. So if we are in a test environment,
    // then we will set the secure property to false. This will allow us to
    // send requests to our application over http instead of https when we
    // are running tests. This is because when we run tests, we don't have
    // a https connection.
  })
);
// once the JWT is set in the session and sent to the client as a cookie as we do in singin.ts and signup.ts,
// it will be automatically included in subsequent requests / followup requests from the client to your server.
// (client can be a browser or postman)
// This is because the cookie is sent along with each HTTP request to the domain it belongs to.

// normal way of handling errors in async functions if we don't use express-async-errors package
// app.all("*", async (req, res, next) => {
//   next(new NotFoundError());
// });

app.all("*", async () => {
  throw new NotFoundError();
});
// This is a catch-all route handler. If the user tries to access a route that
// doesn't exist, then this route handler will be executed and it will throw
// a NotFoundError. This error will be passed to the error handler middleware
// and will be handled in a consistent way.
// app.all means that this route handler will be executed for all types of
// requests (GET, POST, PUT, DELETE, etc.).

app.use(errorHandler);
// Now when we send requests to other routes and they throw errors, they will
// automatically get passed to this error handler middleware and they will be
// handled in a consistent way.

export { app };
