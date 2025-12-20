import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

export const requestSend = async (req, res) => {
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
        { fromUserId, toUserId: toUser._id },
        { fromUserId: toUser._id, toUserId: fromUserId }
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
};

export const requestReview = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowStatuses = ["accepted", "rejected"];
    if (!allowStatuses.includes(status)) {
      return res.status(404).json({ message: "Status not allowed" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    });

    if (!connectionRequest) {
      return res
        .status(404)
        .json({ message: "Connection request not found or already processed" });
    }

    connectionRequest.status = status;
    const updatedRequest = await connectionRequest.save();
    res.status(200);
    res.json({
      message: `Connection request ${status} successfully`,
      data: updatedRequest
    });
  } catch (error) {
    res.status(500).json({ "ERROR: ": error.message });
  }
};
