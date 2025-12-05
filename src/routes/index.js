import authRouter from "./auth.js";
import profileRouter from "./profile.js";
import requestRouter from "./request.js";

const routers = [authRouter, profileRouter, requestRouter];

export default (app) =>
  routers.forEach((router) => {
    app.use("/", router);
  });
