import express from "express";
import auth from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

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

router.get("/feed", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (limit > 50) limit = 50;
    const skip = (page - 1) * limit;

    const connectionRequestsSent = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
    });

    const hideUserFromFeed = new Set();
    connectionRequestsSent.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId.toString());
      hideUserFromFeed.add(request.toUserId.toString());
    });

    const user = await User.find({
      $and: [
        { _id: { $ne: loggedInUser._id } },
        { _id: { $nin: Array.from(hideUserFromFeed) } }
      ]
    })
      .select("firstName lastName skills photoUrl bio")
      .skip(skip)
      .limit(limit);

    res.status(200).json({ message: "Fetched Feed data", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
