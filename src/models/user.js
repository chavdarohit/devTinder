import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

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
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value, { minLength: 6 })) {
          throw new Error(
            "Password is not strong enough and should be at least 6 characters long"
          );
        }
      }
    },
    age: {
      type: Number,
      validate(value) {
        if (typeof value === "number") {
          throw new Error("Age must be a number");
        }
      }
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
      maxlength: 10,
      validate(value) {
        if (value.length > 10) {
          throw new Error("A maximum of 10 skills are allowed");
        }
      }
    },
    bio: {
      type: String,
      maxlength: 500,
      validate(value) {
        if (value.length > 500) {
          throw new Error("Bio cannot exceed 500 characters");
        }
      }
    }
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await JWT.sign({ _id: user._id }, "DEV@TINDER08", {
    expiresIn: "1d"
  });
  return token;
};

userSchema.methods.comparePassword = async function (passwordByUser) {
  const user = this;
  return await bcrypt.compare(passwordByUser, user.password);
};

const User = mongoose.model("User", userSchema);
export default User;
