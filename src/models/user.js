import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      }
    },
    password: {
      type: String,
      required: true
    },
    age: {
      type: Number
    },
    gender: {
      type: String,
      validate(value) {
        const allowedGenders = ["male", "female", "other"];
        if (value && !allowedGenders.includes(value.toLowerCase())) {
          throw new Error("Gender must be 'male', 'female', or 'other'");
        }
      }
    },
    photoUrl: {
      type: String,
      default: "https://avatar.iran.liara.run/public/6",
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid URL for photo");
        }
      }
    },
    skills: {
      type: [String],
      default: [],
      maxlength: 10
    },
    bio: {
      type: String,
      maxlength: 500
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
