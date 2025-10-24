import validator from "validator";
export const signUpValidator = (data) => {
  const { email, firstName, lastName, password } = data;

  if (!firstName || !lastName) {
    throw new Error("First name and Last name are required");
  } else if (firstName.length > 30 || lastName.length > 30) {
    throw new Error(
      "First name and Last name should be less than 30 characters"
    );
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};
export const loginValidator = (data) => {
  const { email, password } = data;

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }

  if (!password) {
    throw new Error("Password is required");
  }
};
