import express from "express";
import connectDB from "./config/db.js";
import User from "./models/user.js";
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObject = new User(req.body);
  try {
    await userObject.save();
    res.send("User signed up successfully");
  } catch (err) {
    return res.status(400).send("Error signing up user" + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const users = await User.find({ email: req.body.email });
    users.length ? res.send(users) : res.status(404).send("No user found");
  } catch (err) {
    return res.status(500).send("Error fetching users" + err.message);
  }
});

app.get("/allusers", async (req, res) => {
  try {
    const users = await User.find({});
    users.length ? res.send(users) : res.status(404).send("No feed found");
  } catch (err) {
    return res.status(500).send("Error fetching feed" + err.message);
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (err) {
    return res.status(500).send("Error deleting user" + err.message);
  }
});

app.patch("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    return res.status(500).send("Error updating user " + err.message);
  }
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
