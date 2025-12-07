import express from "express";
import auth from "../middlewares/auth.js";
import bcrypt from "bcrypt";
import {
  validateEditProfile,
  validatePasswordUpdate
} from "../validators/profile.js";

const router = express.Router();
router.get("/profile/view", auth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    return res.status(400).send("Error fetching profile:- " + err.message);
  }
});

router.patch("/profile/edit", auth, (req, res) => {
  try {
    const isEditAllowed = validateEditProfile(req.body);
    if (!isEditAllowed) {
      return res.status(400).send("Invalid fields in profile update");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    loggedInUser
      .save()
      .then(() => res.send(loggedInUser))
      .catch((err) =>
        res.status(400).send("Error saving updated profile:- " + err.message)
      );
  } catch (err) {
    return res.status(400).send("Error updating profile:- " + err.message);
  }
});

router.patch("/password/update", auth, async (req, res) => {
  try {
    const { existingPassword, newPassword } = req.body || {};

    const user = req.user;

    const isValidForUpdate = await validatePasswordUpdate(
      existingPassword,
      newPassword,
      user
    );

    if (isValidForUpdate) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.send("Password updated successfully");
    }
  } catch (err) {
    return res.status(400).send("Error updating password: " + err.message);
  }
});

export default router;
