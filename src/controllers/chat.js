import Chat from "../models/chat.js";
export const getChats = async (req, res) => {
  const { receiverId } = req.params;

  const senderId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [senderId, receiverId],
        messages: [],
      });
      await chat.save();
    }
    return res.status(200).json({ chat });
  } catch (error) {
    throw new Error({ error: error.message });
  }
};
