import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import setupAPI from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

setupAPI(app);

// error handling middleware
app.use((err, res) => {
  if (err) {
    console.error(err.stack);
    res.status(500).send("Something not working good there is some problem!");
  }
});

//! TIP: Connect to the database first and then start the server

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
