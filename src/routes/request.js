import express from "express";
import auth from "../middlewares/auth.js";
const router = express.Router();
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

router.post("/request/send/:status/:toUserId", auth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowStatuses = ["interested", "ignored"];
    if (!allowStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already Exists!!" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });
    const data = await connectionRequest.save();
    res.json({
      message:
        status === "interested"
          ? req.user.firstName + " is " + status + " in " + toUser.firstName
          : req.user.firstName + " " + status + " " + toUser.firstName,
      data
    });
  } catch (error) {
    res.status(400).json({ "ERROR: ": error.message });
  }
});

export default router;
