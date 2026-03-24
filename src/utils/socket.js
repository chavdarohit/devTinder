import { Server } from "socket.io";
import crypto from "crypto";

const getHashedRoomId = (sender, receiver) => {
  return crypto
    .createHash("sha256")
    .update([sender, receiver].sort().join("&"))
    .digest("hex");
};

export const initalizeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ fromUserId, toUserId }) => {
      const roomId = getHashedRoomId(fromUserId, toUserId);
      console.log("joining room", roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      ({ id, text, senderName, sender, time, receiver }) => {
        // message is coming from sender to backend
        // and we have to send it to the receiver
        const roomId = getHashedRoomId(sender, receiver);
        io.to(roomId).emit("messageReceived", {
          id,
          text,
          senderName,
          sender,
          time,
          receiver,
        });
      },
    );
    socket.on("disconnect", () => {});
  });
};
