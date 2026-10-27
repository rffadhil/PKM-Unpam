/** @format */

import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    // Ambil token dari cookie httpOnly ATAU dari header Authorization Bearer
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "rahasia_default_pkm",
    );
    req.user = decoded; // Menyimpan data admin yang sedang login ke req.user
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Sesi login telah berakhir atau tidak valid. Silakan login kembali.",
    });
  }
};
