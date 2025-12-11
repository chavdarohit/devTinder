import bcrypt from "bcrypt";
import User from "../models/user.js";
import { signUpValidator, loginValidator } from "../validators/auth.js";

export const signUp = async (req, res) => {
  try {
    signUpValidator(req.body);
  } catch (err) {
    return res.status(400).send("Validation Error: " + err.message);
  }
  const {
    firstName,
    lastName,
    email,
    password,
    age,
    gender,
    photoUrl,
    skills,
    bio
  } = req.body;

  const userObject = new User({
    firstName,
    lastName,
    email,
    password,
    age,
    gender,
    photoUrl,
    skills,
    bio
  });
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    userObject.password = passwordHash;
    await userObject.save();
    res.send("User signed up successfully");
  } catch (err) {
    return res.status(400).send("Error signing up user" + err.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    loginValidator(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("Invalid username or password");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.json({ message: "User logged in successfully", user });
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (err) {
    return res.status(500).send("Error logging in user:- " + err.message);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.send("User logged out successfully");
};
