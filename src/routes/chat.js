import express from "express";
import auth from "../middlewares/auth.js";
import { getChats } from "../controllers/chat.js";
import { isUserAlreadyFriendForChat } from "../validators/chat.js";

const chatRouter = express.Router();

chatRouter.get("/chat/:receiverId", auth, isUserAlreadyFriendForChat, getChats);

export default chatRouter;
