/** @format */

import app from "./app.js";
import pool from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Mengecek koneksi ke database PostgreSQL
    const client = await pool.connect();
    console.log("✅ Berhasil terhubung ke database PostgreSQL");
    client.release();
  } catch (error) {
    console.warn(
      "⚠️ Catatan: Database PostgreSQL belum terhubung:",
      error.message,
    );
    console.warn(
      "   (Server tetap menyala, pastikan DATABASE_URL di .env sudah sesuai)",
    );
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`🔗 Cek status server di http://localhost:${PORT}/api/health`);
  });
};

startServer();
