import express from "express";

import { currentUser } from "@airtickets/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
  // We add || null because req.currentUser can be undefined.
  // We should not send undefined as a response, instead we should send null.
});

export { router as currentUserRouter };
