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

const validatePassword = (value, label) => {
  const password = String(value || "");

  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    const error = new Error(`${label} harus terdiri dari 8 sampai 72 karakter.`);
    error.status = 400;
    throw error;
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    const error = new Error(`${label} harus menggunakan kombinasi huruf dan angka.`);
    error.status = 400;
    throw error;
  }

  return password;
};

export const validateNewPasswordInput = ({ newPassword }) => ({
  newPassword: validatePassword(newPassword, "Kata sandi baru"),
});

export const validateTemporaryPasswordInput = ({ password }) => ({
  temporaryPassword: validatePassword(password, "Kata sandi sementara"),
});
