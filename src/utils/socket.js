import { Server } from "socket.io";
import crypto from "crypto";
import Chat from "../models/chat.js";

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

  const userOnlineList = new Map();

  io.on("connection", (socket) => {
    socket.on("goOnline", ({ userId }) => {
      userOnlineList.set(userId, socket.id);
      // Immediately broadcast to ALL clients that this user has come online!
      io.emit("status-changed", {
        userOnlineList: Object.fromEntries(userOnlineList),
      });
    });

    socket.on("joinChat", ({ senderId, receiverId }) => {
      const roomId = getHashedRoomId(senderId, receiverId);
      socket.join(roomId);
      userOnlineList.set(senderId, socket.id);

      io.to(roomId).emit("status-changed", {
        userOnlineList: Object.fromEntries(userOnlineList),
      });
    });
    socket.on(
      "sendMessage",
      async ({ text, senderId, time, receiverId, senderName }) => {
        try {
          let chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [senderId, receiverId],
              messages: [],
            });
          }

          chat.messages.push({
            text,
            senderId,
            time,
            receiverId,
          });

          await chat.save();

          const roomId = getHashedRoomId(senderId, receiverId);
          io.to(roomId).emit("messageReceived", {
            text,
            senderId,
            time,
            receiverId,
            senderName,
          });
        } catch (error) {
          console.log("error while sending message", error.message);
        }
      },
    );

    socket.on("disconnect", (reason) => {
      // Find the user ID by checking which map entry has this socket.id
      let disconnectedUserId = null;

      for (const [key, value] of userOnlineList.entries()) {
        if (value === socket.id) {
          disconnectedUserId = key;
          break;
        }
      }

      if (disconnectedUserId) {
        userOnlineList.delete(disconnectedUserId);

        io.emit("status-changed", {
          userOnlineList: Object.fromEntries(userOnlineList),
        });
      }
    });
  });
};
