import express from "express";
import auth from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";

const router = express.Router();

router.get("/user/requests/received", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId", ["firstName", " lastName"]); // more ways to write
    // }).populate("fromUserId", "firstName lastName");

    res
      .status(200)
      .json({ message: "Data fetched succesfully", data: connectionRequests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/connections", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" }
      ]
    })
      .populate("fromUserId toUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    const data = connections.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.status(200).json({ message: "Data fetched succesfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
