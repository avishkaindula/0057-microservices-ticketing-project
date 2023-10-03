import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

// This will be used to protect the routes that require authentication.
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if (!req.currentUser) {
  //   return res.status(401).send();
  // }
  // next();
  // We can refactor the above code to use our NotAuthorizedError class.
  // This is a better approach because we can use this class in other services.
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
// We should assume that we will always going to run requireAuth middleware only after
// running the currentUser middleware.
