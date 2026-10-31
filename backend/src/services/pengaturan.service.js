/** @format */

import bcrypt from "bcryptjs";
import { query } from "../config/db.js";

// Mengambil semua pengaturan sekolah (format array key-value)
export const getAllPengaturan = async () => {
  const result = await query(
    `SELECT key, value, updated_at
     FROM pengaturan_sekolah
     ORDER BY key ASC`,
  );

  return result.rows;
};

// Mengambil pengaturan dalam bentuk object siap pakai untuk Frontend KelolaPengaturanPage
export const getPortalPengaturanObject = async () => {
  const rows = await getAllPengaturan();
  const map = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }

  return {
    namaInstitusi: map.namaInstitusi || map.nama_sekolah || "SMAS Harapan Jaya",
    npsn: map.npsn || "20104829",
    akreditasi: map.akreditasi || "A (Unggul) BAN-S/M",
    adiwiyata:
      map.adiwiyata ||
      map.predikat_adiwiyata ||
      "Sekolah Adiwiyata Mandiri Nasional",
    slogan:
      map.slogan ||
      map.motto ||
      "Unggul, Berkarakter, Berwawasan Lingkungan Adiwiyata",
    logo: map.logo || "",
    logoNama: map.logoNama || "Logo Resmi SMAHJ.svg",
    favicon: map.favicon || "",
    faviconNama: map.faviconNama || "favicon.ico",
    email: map.email || map.email_resmi || "harapanjayasma@gmail.com",
    telepon: map.telepon || map.telepon_ptsp || "085813548624 / 0895626288424",
    kodePos: map.kodePos || map.kode_pos || "11730",
    alamat:
      map.alamat ||
      map.alamat_lengkap ||
      "Kec. Cengkareng, Kota Adm. Jakarta Barat, Prov. D.K.I. Jakarta 11730",
    maintenance:
      (map.maintenance ?? map.maintenance_mode) === "true" ||
      map.maintenance === true,
    ppdb:
      (map.ppdb ?? map.ppdb_online_aktif ?? "true") === "true" ||
      map.ppdb === true,
  };
};

// Mengambil pengaturan berdasarkan key
export const getPengaturanByKey = async (key) => {
  const result = await query(
    `SELECT key, value, updated_at
     FROM pengaturan_sekolah
     WHERE key = $1`,
    [key],
  );

  return result.rows[0];
};

// Menambahkan atau memperbarui satu pengaturan
export const upsertPengaturan = async (key, value) => {
  const strValue = value === null || value === undefined ? "" : String(value);
  const result = await query(
    `INSERT INTO pengaturan_sekolah (key, value, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key)
     DO UPDATE SET
       value = EXCLUDED.value,
       updated_at = NOW()
     RETURNING key, value, updated_at`,
    [key, strValue],
  );

  return result.rows[0];
};

// Menambahkan atau memperbarui banyak pengaturan sekaligus + sinkronisasi key
export const upsertManyPengaturan = async (settings) => {
  const aliasMap = {
    namaInstitusi: "nama_sekolah",
    adiwiyata: "predikat_adiwiyata",
    slogan: "motto",
    email: "email_resmi",
    telepon: "telepon_ptsp",
    kodePos: "kode_pos",
    alamat: "alamat_lengkap",
    maintenance: "maintenance_mode",
    ppdb: "ppdb_online_aktif",
  };

  const results = [];

  for (const [key, value] of Object.entries(settings)) {
    const saved = await upsertPengaturan(key, value);
    results.push(saved);

    // Simpan juga ke key snake_case agar halaman publik/komponen lain tetap sinkron
    if (aliasMap[key]) {
      await upsertPengaturan(aliasMap[key], value);
    }
  }

  return getPortalPengaturanObject();
};

// ============================================================================
// MANAJEMEN ADMIN & HAK AKSES (2 Peran: Super Admin & Admin)
// ============================================================================

const formatAdminRow = (row) => {
  const rawNip = String(row.nip || "").trim();
  const hasPrefix = /^(NIP|NUPTK):/i.test(rawNip);
  const tipeNomor = hasPrefix
    ? rawNip.split(":")[0].toUpperCase()
    : rawNip.replace(/\s+/g, "").length === 16
      ? "NUPTK"
      : "NIP";
  const nomor = hasPrefix ? rawNip.replace(/^(NIP|NUPTK):\s*/i, "") : rawNip;
  const isSuper = /super/i.test(row.role);

  return {
    id: row.id,
    nama: row.nama,
    tipeNomor,
    nomor,
    email: row.email,
    role: isSuper ? "superadmin" : "admin",
    peran: isSuper ? "Super Admin" : "Admin",
    aktif: row.status !== "Nonaktif",
  };
};

export const getAllAdmins = async () => {
  const result = await query(
    `SELECT id, nama, nip, email, role, status, created_at
     FROM users
     WHERE deleted_at IS NULL
     ORDER BY created_at ASC`,
  );
  return result.rows.map(formatAdminRow);
};

export const createAdmin = async (payload) => {
  const nama = String(payload.nama || "").trim();
  const email = String(payload.email || "").trim();
  const nomor = String(payload.nomor ?? payload.nip ?? "").trim();
  const roleDb =
    payload.role === "superadmin" || /super/i.test(payload.role)
      ? "Super Admin"
      : "Admin";
  const statusDb = payload.aktif === false ? "Nonaktif" : "Aktif";
  const rawPassword =
    payload.password ||
    payload.kataSandi ||
    payload.sandi ||
    "SandiRahasia2026!";

  if (!nama || !email) {
    const err = new Error("Nama dan email admin wajib diisi.");
    err.status = 400;
    throw err;
  }

  const cekDuplikat = await query(
    `SELECT id FROM users
     WHERE (LOWER(email) = LOWER($1) OR ($2 <> '' AND nip = $2))
       AND deleted_at IS NULL
     LIMIT 1`,
    [email, nomor],
  );

  if (cekDuplikat.rows.length > 0) {
    const err = new Error("Email atau NIP/NUPTK sudah terdaftar.");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(String(rawPassword), 10);

  const result = await query(
    `INSERT INTO users (nama, nip, email, password_hash, role, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, nama, nip, email, role, status`,
    [nama, nomor || null, email, passwordHash, roleDb, statusDb],
  );

  return formatAdminRow(result.rows[0]);
};

export const updateAdmin = async (id, payload) => {
  const existing = await query(
    `SELECT id, role, status FROM users WHERE id::text = $1 AND deleted_at IS NULL LIMIT 1`,
    [String(id)],
  );

  if (!existing.rows[0]) {
    const err = new Error("Akun admin tidak ditemukan.");
    err.status = 404;
    throw err;
  }

  const nama = String(payload.nama || "").trim();
  const email = String(payload.email || "").trim();
  const nomor = String(payload.nomor ?? payload.nip ?? "").trim();
  const roleDb =
    payload.role === "superadmin" || /super/i.test(payload.role)
      ? "Super Admin"
      : "Admin";
  const statusDb = payload.aktif === false ? "Nonaktif" : "Aktif";

  // Pastikan minimal ada 1 Super Admin yang aktif
  if (roleDb !== "Super Admin" || statusDb !== "Aktif") {
    const superCount = await query(
      `SELECT COUNT(*)::int AS total FROM users
       WHERE role ILIKE '%Super%' AND status = 'Aktif' AND deleted_at IS NULL AND id::text <> $1`,
      [String(id)],
    );
    if ((superCount.rows[0]?.total || 0) < 1) {
      const err = new Error("Harus ada minimal satu Super Admin yang aktif.");
      err.status = 400;
      throw err;
    }
  }

  // Cek duplikat email / NIP dengan user lain
  const cekDuplikat = await query(
    `SELECT id FROM users
     WHERE (LOWER(email) = LOWER($1) OR ($2 <> '' AND nip = $2))
       AND id::text <> $3
       AND deleted_at IS NULL
     LIMIT 1`,
    [email, nomor, String(id)],
  );

  if (cekDuplikat.rows.length > 0) {
    const err = new Error("Email atau NIP/NUPTK sudah dipakai admin lain.");
    err.status = 409;
    throw err;
  }

  const rawPassword = payload.password || payload.kataSandi || payload.sandi;
  if (rawPassword && String(rawPassword).trim()) {
    const passwordHash = await bcrypt.hash(String(rawPassword).trim(), 10);
    const result = await query(
      `UPDATE users
       SET nama = $1, nip = $2, email = $3, role = $4, status = $5, password_hash = $6, updated_at = NOW()
       WHERE id::text = $7
       RETURNING id, nama, nip, email, role, status`,
      [nama, nomor || null, email, roleDb, statusDb, passwordHash, String(id)],
    );
    return formatAdminRow(result.rows[0]);
  }

  const result = await query(
    `UPDATE users
     SET nama = $1, nip = $2, email = $3, role = $4, status = $5, updated_at = NOW()
     WHERE id::text = $6
     RETURNING id, nama, nip, email, role, status`,
    [nama, nomor || null, email, roleDb, statusDb, String(id)],
  );

  return formatAdminRow(result.rows[0]);
};

export const deleteAdmin = async (id, currentUserId) => {
  if (currentUserId && String(id) === String(currentUserId)) {
    const err = new Error(
      "Tidak dapat menghapus akun yang sedang Anda gunakan.",
    );
    err.status = 400;
    throw err;
  }

  const superCount = await query(
    `SELECT COUNT(*)::int AS total FROM users
     WHERE role ILIKE '%Super%' AND status = 'Aktif' AND deleted_at IS NULL AND id::text <> $1`,
    [String(id)],
  );
  if ((superCount.rows[0]?.total || 0) < 1) {
    const err = new Error(
      "Harus menyisakan minimal satu Super Admin yang aktif.",
    );
    err.status = 400;
    throw err;
  }

  const result = await query(
    `UPDATE users
     SET deleted_at = NOW(), updated_at = NOW()
     WHERE id::text = $1 AND deleted_at IS NULL
     RETURNING id`,
    [String(id)],
  );

  if (!result.rows[0]) {
    const err = new Error("Akun admin tidak ditemukan.");
    err.status = 404;
    throw err;
  }

  return true;
};
