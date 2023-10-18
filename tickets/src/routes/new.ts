import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@airtickets/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });

    await ticket.save();

    res.status(201).send(ticket);
  }
);
// requireAuth will see whether the user is authenticated or not by checking
// whether the request has the currentUser property which we set on currentUser
// middleware. If the user is not authenticated, then requireAuth will throw a
// NotAuthorizedError which will be handled by the error handler middleware.

export { router as createTicketRouter };
