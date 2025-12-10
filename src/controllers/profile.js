import bcrypt from "bcrypt";
import {
  validateEditProfile,
  validatePasswordUpdate
} from "../validators/profile.js";

export const profileView = async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    return res.status(400).send("Error fetching profile:- " + err.message);
  }
};

export const profileEdit = (req, res) => {
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
};

export const passwordUpdate = async (req, res) => {
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
};
