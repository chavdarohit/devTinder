import express from "express";
import connectDB from "./config/db.js";
import User from "./models/user.js";
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "John",
    lastName: "Doe",
    email: "john@gmail.com",
    password: "john@123",
    age: 25,
    gender: "Male"
  });
  await user.save();
  res.send("User signed up successfully");
});

// error handling middleware
app.use((err, req, res, next) => {
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
