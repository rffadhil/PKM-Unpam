/** @format */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

export const loginAdmin = async ({ identifier, password, ingat }) => {
  // 1. Cari user berdasarkan email (case-insensitive) ATAU nip
  const result = await query(
    `SELECT id, nama, nip, email, password_hash, role, status
     FROM users
     WHERE (LOWER(email) = LOWER($1) OR nip = $1)
       AND deleted_at IS NULL
     LIMIT 1`,
    [identifier],
  );

  const user = result.rows[0];

  if (!user) {
    const error = new Error("Email/NIP atau kata sandi salah.");
    error.status = 401;
    throw error;
  }

  // 2. Pastikan status akun Aktif
  if (user.status !== "Aktif") {
    const error = new Error(
      "Akun Anda sedang dinonaktifkan. Hubungi Administrator IT.",
    );
    error.status = 403;
    throw error;
  }

  // 3. Verifikasi kecocokan password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    const error = new Error("Email/NIP atau kata sandi salah.");
    error.status = 401;
    throw error;
  }

  // 4. Buat JWT Token (jika "ingat saya" dicentang berlaku 7 hari, jika tidak sesuai .env / 1 hari)
  const expiresIn = ingat ? "7d" : process.env.JWT_EXPIRES_IN || "1d";
  const payload = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || "rahasia_default_pkm",
    {
      expiresIn,
    },
  );

  return {
    token,
    user: {
      id: user.id,
      nama: user.nama,
      nip: user.nip,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

export const getAdminProfile = async (userId) => {
  const result = await query(
    `SELECT id, nama, nip, email, role, status
     FROM users
     WHERE id = $1 AND deleted_at IS NULL
     LIMIT 1`,
    [userId],
  );

  if (!result.rows[0]) {
    const error = new Error("Sesi pengguna tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};
