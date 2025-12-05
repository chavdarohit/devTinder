import express from "express";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.post("/sendConnectionRequest", auth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sent this connection request");
});

export default router;
