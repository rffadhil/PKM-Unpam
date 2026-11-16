/** @format */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

export const loginAdmin = async ({ identifier, password, ingat }) => {
  // Pastikan kolom foto_url tersedia
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS foto_url TEXT;`);

  // 1. Cari user berdasarkan email (case-insensitive) ATAU nip (mendukung format dengan/tanpa prefix NIP:/NUPTK:)
  const result = await query(
    `SELECT id, nama, nip, email, password_hash, role, status, foto_url,
            must_change_password, token_version
     FROM users
     WHERE (
       LOWER(email) = LOWER($1)
       OR nip = $1
       OR nip = ('NIP:' || $1)
       OR nip = ('NUPTK:' || $1)
     )
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

  // 4. Buat JWT Token
  const expiresIn = ingat ? "7d" : process.env.JWT_EXPIRES_IN || "1d";
  const payload = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    token_version: user.token_version,
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
      foto: user.foto_url || "",
      must_change_password: user.must_change_password,
    },
  };
};

export const changeRequiredPassword = async (userId, newPassword) => {
  const existing = await query(
    `SELECT password_hash, must_change_password
     FROM users
     WHERE id = $1 AND deleted_at IS NULL
     LIMIT 1`,
    [userId],
  );
  const user = existing.rows[0];

  if (!user) {
    const error = new Error("Sesi pengguna tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  if (!user.must_change_password) {
    const error = new Error("Akun ini tidak sedang meminta penggantian sandi.");
    error.status = 409;
    throw error;
  }

  if (await bcrypt.compare(newPassword, user.password_hash)) {
    const error = new Error(
      "Kata sandi baru harus berbeda dari sandi sementara.",
    );
    error.status = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const result = await query(
    `UPDATE users
     SET password_hash = $1,
         must_change_password = FALSE,
         updated_at = NOW()
     WHERE id = $2
       AND deleted_at IS NULL
       AND must_change_password = TRUE
     RETURNING id`,
    [passwordHash, userId],
  );

  if (!result.rows[0]) {
    const error = new Error(
      "Status penggantian sandi sudah berubah. Silakan login kembali.",
    );
    error.status = 409;
    throw error;
  }

  return { must_change_password: false };
};

export const getAdminProfile = async (userId) => {
  const result = await query(
    `SELECT id, nama, nip, email, role, status, foto_url,
            must_change_password
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

  const u = result.rows[0];
  return {
    ...u,
    foto: u.foto_url || "",
  };
};
