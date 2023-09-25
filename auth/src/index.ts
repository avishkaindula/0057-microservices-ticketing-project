import express from "express";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(errorHandler);
// Now when we send requests to other routes and they throw errors, they will
// automatically get passed to this error handler middleware and they will be
// handled in a consistent way.

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
