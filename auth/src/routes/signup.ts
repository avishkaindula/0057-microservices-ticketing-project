import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

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

    res.status(201).send(user);
  }
);

export { router as signupRouter };
