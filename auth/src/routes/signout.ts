import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;
  // This will delete the cookie, hence signing out the user
  // This is mentioned in the cookie-session documentation

  res.send({});
});

export { router as signoutRouter };
