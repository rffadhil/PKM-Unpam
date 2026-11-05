/** @format */

export const validateLoginInput = ({ email, password }) => {
  if (!email || !String(email).trim() || !password) {
    const error = new Error("Email/NIP dan kata sandi wajib diisi.");
    error.status = 400;
    throw error;
  }

  return {
    identifier: String(email).trim(),
    password: String(password),
  };
};
