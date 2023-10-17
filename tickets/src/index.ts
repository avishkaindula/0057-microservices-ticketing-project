import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
    // Better if we create a new error class for this error, but for now we'll use the built-in Error class.
  }
  // We need to check if the JWT_KEY environment variable is defined or not at the start of the application.
  // Otherwise, typescript will throw an error when we try to access the JWT_KEY environment variable.

  if(!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
