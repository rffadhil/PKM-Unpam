/** @format */

import { validateLoginInput } from "../validators/auth.validator.js";
import { loginAdmin, getAdminProfile } from "../services/auth.service.js";

export const loginController = async (req, res, next) => {
  try {
    const { identifier, password } = validateLoginInput(req.body || {});
    const ingat = Boolean(req.body?.ingat);

    const { token, user } = await loginAdmin({ identifier, password, ingat });

    // Simpan token ke dalam cookie httpOnly sesuai spesifikasi PRD & authService.js
    const maxAge = ingat ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
    });

    return res.status(200).json({
      success: true,
      message: "Berhasil masuk ke Dashboard CMS",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Berhasil keluar dari sistem",
  });
};

export const meController = async (req, res, next) => {
  try {
    const user = await getAdminProfile(req.user.id);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
