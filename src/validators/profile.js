export const validateEditProfile = (data = {}) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "skills",
    "bio"
  ];

  const isEditAllowed = Object.keys(data).every((key) =>
    allowedFields.includes(key)
  );

  return isEditAllowed;
};
