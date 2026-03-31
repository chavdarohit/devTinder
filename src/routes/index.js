import authRouter from "./auth.js";
import profileRouter from "./profile.js";
import requestRouter from "./request.js";
import userRouter from "./user.js";
import chatRouter from "./chat.js";

const routers = [
  authRouter,
  profileRouter,
  requestRouter,
  userRouter,
  chatRouter,
];

export default (app) =>
  routers.forEach((router) => {
    app.use("/", router);
  });
