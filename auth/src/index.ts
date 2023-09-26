import express from "express";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

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

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
