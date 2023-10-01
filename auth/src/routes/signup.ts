import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // JavaScript approach on handling errors
      // const error = new Error("Invalid email or password");
      // error.reasons = errors.array();
      // throw error;
      // The reasons array will be appended to the error object and will be
      // available in the error handler middleware.

      throw new RequestValidationError(errors.array());
      // As we've imported the express-async-errors package, we can throw errors
      // inside of async functions without having to use next() to pass the error.
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    const user = User.build({
      email,
      password,
      // test: "test"
      // This will throw an error because the type of test property is not defined in the UserAttrs interface.
    });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
      // We need to add an exclamation mark (!) after process.env.JWT_KEY because
      // typescript will throw an error if we don't do it. process.env.JWT_KEY has two
      // possible values: string or undefined. So we need to tell typescript that we are sure
      // that the value of process.env.JWT_KEY will be a string. As we've already checked
      // if the value of process.env.JWT_KEY is defined or not at the index.ts file, we can use the exclamation
      // mark (!) to tell typescript that we are sure that the value of process.env.JWT_KEY
      // will be a string.
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };
    // We can't use req.session.jwt = userJwt because type definition file for the
    // cookie-session package doesn't have a type definition for the session object.
    // In here, a cookie session will be created and the jwt property will be added to it.

    res.status(201).send(user);
  }
);

export { router as signupRouter };
