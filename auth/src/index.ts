import express from "express";
import "express-async-errors";
// This package will allow us to throw errors inside of async functions
// without having to use next() to pass the error to the error handler.
// We need to import express-async-errors before importing any other
// routes or middlewares inside index.ts file because the package will
// only effect routes or middlewares that are imported after
// the package is imported.
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true
}))

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

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

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
    // Better if we create a new error class for this error, but for now we'll use the built-in Error class.
  }
  // We need to check if the JWT_KEY environment variable is defined or not at the start of the application.
  // Otherwise, typescript will throw an error when we try to access the JWT_KEY environment variable.

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
}


start();