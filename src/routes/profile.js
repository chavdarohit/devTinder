import express from "express";
import auth from "../middlewares/auth.js";

import {
  passwordUpdate,
  profileEdit,
  profileView
} from "../controllers/profile.js";

const router = express.Router();
router.get("/profile/view", auth, profileView);

router.patch("/profile/edit", auth, profileEdit);

router.patch("/password/update", auth, passwordUpdate);

export default router;
