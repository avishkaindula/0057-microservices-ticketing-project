import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

// This is how we can modify an existing type definition
// This is called type merging
// This is how we can add a new property to an existing type definition
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
      // we add ? because we want to tell typescript that this property is optional
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if (!req.session?.jwt) { is the same as if (!req.session || !req.session.jwt)
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
  // next() is called here because we want to call the next middleware
};
