import mongoose from "mongoose";
import ConnectionRequest from "../models/connectionRequest.js";

export const isUserAlreadyFriendForChat = async (req, res, next) => {
  const { receiverId } = req.params;

  if (!receiverId || !mongoose.isValidObjectId(receiverId)) {
    return res.status(400).json({ message: "Invalid receiver ID" });
  }

  try {
    const isFriend = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: req.user._id, toUserId: receiverId, status: "accepted" },
        { fromUserId: receiverId, toUserId: req.user._id, status: "accepted" },
      ],
    });

    if (!isFriend) {
      return res.status(403).json({
        message: "You are not friends with this user.",
      });
    }

    next();
  } catch (error) {
    throw new Error({ error: error.message });
  }
};
