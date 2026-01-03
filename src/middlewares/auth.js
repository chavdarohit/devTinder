import JWT from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login to access this resource");
    }
    const decodedMessage = await JWT.verify(token, "DEV@TINDER08");

    if (!decodedMessage) {
      throw new Error("Invalid authentication token");
    }

    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Authentication failed: " + err.message);
  }
};
export default auth;
