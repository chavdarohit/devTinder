import express from "express";
import auth from "../middlewares/auth.js";

import {
  feed,
  userRequestReceived,
  userConnections
} from "../controllers/user.js";

const router = express.Router();

router.get("/user/requests/received", auth, userRequestReceived);

router.get("/user/connections", auth, userConnections);

router.get("/feed", auth, feed);

export default router;
