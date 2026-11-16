
/** @format */

import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

export const requireAuth = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  const tokenFromHeader =
    bearerHeader && bearerHeader.startsWith("Bearer ")
      ? bearerHeader.split(" ")[1]
      : null;
  const token = req.cookies?.token || tokenFromHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Akses ditolak. Silakan login terlebih dahulu.",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "rahasia_default_pkm",
    );
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Sesi login telah berakhir atau tidak valid. Silakan login kembali.",
    });
  }

  try {
    const result = await query(
      `SELECT role, status, must_change_password, token_version
       FROM users
       WHERE id = $1 AND deleted_at IS NULL
       LIMIT 1`,
      [decoded.id],
    );
    const account = result.rows[0];

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Sesi pengguna tidak ditemukan. Silakan login kembali.",
      });
    }

    if (account.status !== "Aktif") {
      return res.status(403).json({
        success: false,
        message: "Akun Anda sedang dinonaktifkan.",
      });
    }

    if (Number(decoded.token_version || 0) !== Number(account.token_version)) {
      return res.status(401).json({
        success: false,
        message: "Sesi login telah diperbarui. Silakan login kembali.",
      });
    }

    req.user = {
      ...decoded,
      role: account.role,
      must_change_password: account.must_change_password,
    };

    // Hanya halaman sesi dan endpoint perubahan sandi yang boleh diakses.
    const isAllowedDuringPasswordChange =
      req.baseUrl === "/api/auth" &&
      ((req.method === "GET" && req.path === "/me") ||
        (req.method === "POST" && req.path === "/change-password"));

    if (account.must_change_password && !isAllowedDuringPasswordChange) {
      return res.status(403).json({
        success: false,
        code: "PASSWORD_CHANGE_REQUIRED",
        message: "Buat kata sandi baru sebelum menggunakan CMS.",
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const requireSuperAdmin = (req, res, next) => {
  if (!/super/i.test(req.user?.role || "")) {
    return res.status(403).json({
      success: false,
      message: "Akses hanya tersedia untuk Super Admin.",
    });
  }

  return next();
};
