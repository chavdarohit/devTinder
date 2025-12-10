import express from "express";
import auth from "../middlewares/auth.js";
const router = express.Router();

import { requestReview, requestSend } from "../controllers/request.js";

router.post("/request/send/:status/:toUserId", auth, requestSend);

router.post("/request/review/:status/:requestId", auth, requestReview);

export default router;
