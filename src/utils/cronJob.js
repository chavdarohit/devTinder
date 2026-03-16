import cron from "node-cron";
import ConnectionRequest from "../models/connectionRequest.js";
import { startOfDay, subDays, endOfDay } from "date-fns";
import { sendEmail } from "./sendEmail.js";

cron.schedule("0 8 * * * *", async () => {
  // send the email to all people who get request the previousday

  try {
    const yesterdayDate = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterdayDate);
    const yesterdayEnd = endOfDay(yesterdayDate);

    const pendingRequest = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequest.map((i) => i.toUserId.email)),
    ];

    for (const email of listOfEmails) {
      try {
        await sendEmail(
          email,
          "New Connection Request",
          `You got ${pendingRequest.length} new connection requests`,
        );
      } catch (err) {
        console.log("Email Error: ", err.message);
      }
    }
  } catch (error) {
    console.error(error);
  }
});
