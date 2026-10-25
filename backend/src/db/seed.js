/** @format */

import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const runSeed = async () => {
  const client = await pool.connect();
  try {
    console.log("⏳ Menjalankan seeder data awal...");
    await client.query("BEGIN");

    // Enkripsi (hash) password sesuai requirement keamanan PRD
    const passwordHash = await bcrypt.hash("SandiRahasia2026!", 10);

    // 1. Masukkan akun Super Admin sesuai desain Figma Login & Pengaturan
    await client.query(
      `INSERT INTO users (nama, nip, email, password_hash, role, status)
       VALUES 
         ('Drs. Arya Gagah, S.Kom', '198401152008011003', 'admin.it@smaharapanjaya.sch.id', $1, 'Super Admin', 'Aktif'),
         ('Drs. Arya Gagah, S.Kom', '198402152008011008', 'arya.gagah@smaharapanjaya.sch.id', $1, 'Super Admin', 'Aktif')
       ON CONFLICT (email) DO NOTHING;`,
      [passwordHash],
    );

    // 2. Masukkan pengaturan dasar sekolah ke tabel pengaturan_sekolah
    await client.query(
      `INSERT INTO pengaturan_sekolah (key, value)
       VALUES
         ('nama_sekolah', 'SMA Harapan Jaya'),
         ('npsn', '20104829'),
         ('akreditasi', 'A (Unggul) BAN-S/M'),
         ('predikat_adiwiyata', 'Sekolah Adiwiyata Mandiri Nasional'),
         ('motto', 'Unggul, Berkarakter, Berwawasan Lingkungan Adiwiyata'),
         ('email_resmi', 'info@smaharapanjaya.sch.id'),
         ('telepon_ptsp', '+62 21 8765-4321 / 0812-3456-7890'),
         ('kode_pos', '13820'),
         ('alamat_lengkap', 'Jl. Pendidikan Raya No. 45, Harapan Jaya, Kec. Cipayung, Kota Administrasi Jakarta Timur, DKI Jakarta 13820'),
         ('maintenance_mode', 'false'),
         ('ppdb_online_aktif', 'true')
       ON CONFLICT (key) DO NOTHING;`,
    );

    await client.query("COMMIT");
    console.log(
      "✅ Seeder berhasil! Akun Super Admin & pengaturan awal siap digunakan.",
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Seeder gagal:", error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

runSeed();
