import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        message: `{VALUE} is not supported`
      }
    }
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  // check when the fromUserId and toUserId are the same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

export default ConnectionRequest;
