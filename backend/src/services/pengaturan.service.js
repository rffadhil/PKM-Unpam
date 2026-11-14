/** @format */

import bcrypt from "bcryptjs";
import { query } from "../config/db.js";

// Pastikan kolom foto_url tersedia di tabel users untuk mendukung AdminFormModal
let kolomFotoSiap = false;
const pastikanKolomFotoUsers = async () => {
  if (kolomFotoSiap) return;
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS foto_url TEXT;`);
  kolomFotoSiap = true;
};

// Mengambil semua pengaturan sekolah (format array key-value)
export const getAllPengaturan = async () => {
  const result = await query(
    `SELECT key, value, updated_at
     FROM pengaturan_sekolah
     ORDER BY key ASC`,
  );

  return result.rows;
};

// Mengambil pengaturan dalam bentuk object siap pakai untuk Frontend KelolaPengaturanPage & PublicLayout
export const getPortalPengaturanObject = async () => {
  const rows = await getAllPengaturan();
  const map = {};
  for (const r of rows) {
    if (r.value !== null && r.value !== undefined) {
      map[r.key] = r.value;
    }
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
    whatsapp: map.whatsapp || "085813548624",
    jamSenKam: map.jamSenKam || map.jam_sen_kam || "07:00 - 15:00 WIB",
    jamJumat: map.jamJumat || map.jam_jumat || "07:00 - 11:30 WIB",
    peta: map.peta || "",
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
    ppdbLink: map.ppdbLink || map.ppdb_link || "",
    ppdb_link: map.ppdbLink || map.ppdb_link || "",
    profil_judul_hero: map.profil_judul_hero || map.profilJudulHero,
    profil_deskripsi_hero: map.profil_deskripsi_hero || map.profilDeskripsiHero,
    profil_judul_sejarah: map.profil_judul_sejarah || map.profilJudulSejarah,
    profil_sejarah_p1: map.profil_sejarah_p1 || map.profilSejarahP1,
    profil_sejarah_p2: map.profil_sejarah_p2 || map.profilSejarahP2,
    profil_sejarah_p3: map.profil_sejarah_p3 || map.profilSejarahP3,
    sambutan_judul: map.sambutan_judul || map.sambutanJudul,
    sambutan_kepsek:
      map.sambutan_kepsek || map.sambutanKepsek || map.sambutan_kepala_sekolah,
    visi_sekolah: map.visi_sekolah || map.visiSekolah,
    komitmen_budaya: map.komitmen_budaya || map.komitmenBudaya,
    misi_sekolah_json: map.misi_sekolah_json || map.misiSekolahJson,
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
  if (value === undefined) return null;
  const strValue = value === null ? "" : String(value);
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
    ppdbLink: "ppdb_link",
    profilJudulHero: "profil_judul_hero",
    profilDeskripsiHero: "profil_deskripsi_hero",
    profilJudulSejarah: "profil_judul_sejarah",
    profilSejarahP1: "profil_sejarah_p1",
    profilSejarahP2: "profil_sejarah_p2",
    profilSejarahP3: "profil_sejarah_p3",
    sambutanJudul: "sambutan_judul",
    sambutanKepsek: "sambutan_kepsek",
    sambutan_kepsek: "sambutan_kepala_sekolah",
    visiSekolah: "visi_sekolah",
    komitmenBudaya: "komitmen_budaya",
    misiSekolahJson: "misi_sekolah_json",
  };

  for (const [key, value] of Object.entries(settings || {})) {
    if (value === undefined) continue;
    await upsertPengaturan(key, value);
    if (aliasMap[key]) {
      await upsertPengaturan(aliasMap[key], value);
    }
  }

  return getPortalPengaturanObject();
};

// ============================================================================
// MANAJEMEN ADMIN & HAK AKSES (Developer = Super Admin, Buat dari CMS = Admin)
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
  const isAktif = row.status !== "Nonaktif";

  return {
    id: row.id,
    nama: row.nama,
    tipeNomor,
    nomor,
    email: row.email,
    foto: row.foto_url || "",
    // 'superadmin' -> tampil "Super Admin" | 'subadmin' -> tampil "Admin"
    role: isSuper ? "superadmin" : "subadmin",
    peran: isSuper ? "Super Admin" : "Admin",
    aktif: isAktif,
    status: isAktif ? "Aktif" : "Nonaktif",
  };
};

export const getAllAdmins = async () => {
  await pastikanKolomFotoUsers();
  const result = await query(
    `SELECT id, nama, nip, email, role, status, foto_url, created_at
     FROM users
     WHERE deleted_at IS NULL
     ORDER BY created_at ASC`,
  );
  return result.rows.map(formatAdminRow);
};

export const createAdmin = async (payload) => {
  await pastikanKolomFotoUsers();

  const nama = String(payload.nama || "").trim();
  const email = String(payload.email || "").trim();
  const tipeNomor = String(payload.tipeNomor || "NIP").toUpperCase();
  const nomorBersih = String(payload.nomor ?? payload.nip ?? "").trim();
  const nipSimpan = nomorBersih ? `${tipeNomor}:${nomorBersih}` : null;
  const fotoUrl = String(payload.foto || "").trim();

  // Akun yang dibuat oleh Super Admin dari modal otomatis menjadi "Admin"
  const roleDb = "Admin";

  // Status mengikuti centang "Akun aktif" di modal
  const statusDb =
    payload.aktif === false || payload.status === "Nonaktif"
      ? "Nonaktif"
      : "Aktif";

  const rawPassword =
    payload.sandi ||
    payload.password ||
    payload.kataSandi ||
    "SandiRahasia2026!";

  if (!nama || !email) {
    const err = new Error("Nama dan email admin wajib diisi.");
    err.status = 400;
    throw err;
  }

  const cekDuplikat = await query(
    `SELECT id FROM users
     WHERE (
       LOWER(email) = LOWER($1)
       OR ($2 <> '' AND (nip = $2 OR nip = $3))
     )
     AND deleted_at IS NULL
     LIMIT 1`,
    [email, nomorBersih, nipSimpan || ""],
  );

  if (cekDuplikat.rows.length > 0) {
    const err = new Error("Email atau NIP/NUPTK sudah terdaftar.");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(String(rawPassword), 10);

  const result = await query(
    `INSERT INTO users (nama, nip, email, password_hash, role, status, foto_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, nama, nip, email, role, status, foto_url`,
    [nama, nipSimpan, email, passwordHash, roleDb, statusDb, fotoUrl],
  );

  return formatAdminRow(result.rows[0]);
};

export const updateAdmin = async (id, payload) => {
  await pastikanKolomFotoUsers();

  const existing = await query(
    `SELECT id, role, status, foto_url FROM users WHERE id::text = $1 AND deleted_at IS NULL LIMIT 1`,
    [String(id)],
  );

  if (!existing.rows[0]) {
    const err = new Error("Akun admin tidak ditemukan.");
    err.status = 404;
    throw err;
  }

  const nama = String(payload.nama || "").trim();
  const email = String(payload.email || "").trim();
  const tipeNomor = String(payload.tipeNomor || "NIP").toUpperCase();
  const nomorBersih = String(payload.nomor ?? payload.nip ?? "").trim();
  const nipSimpan = nomorBersih ? `${tipeNomor}:${nomorBersih}` : null;
  const fotoUrl =
    payload.foto !== undefined
      ? String(payload.foto || "").trim()
      : existing.rows[0].foto_url || "";

  // Role tetap mengikuti role asli di database (Super Admin dari developer tetap Super Admin, Admin tetap Admin)
  const roleDb = existing.rows[0].role;

  // Status mengikuti centang "Akun aktif" di modal
  const statusDb =
    payload.aktif === false || payload.status === "Nonaktif"
      ? "Nonaktif"
      : "Aktif";

  // Pastikan minimal ada 1 Super Admin yang aktif
  if (/super/i.test(roleDb) && statusDb !== "Aktif") {
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
     WHERE (
       LOWER(email) = LOWER($1)
       OR ($2 <> '' AND (nip = $2 OR nip = $3))
     )
     AND id::text <> $4
     AND deleted_at IS NULL
     LIMIT 1`,
    [email, nomorBersih, nipSimpan || "", String(id)],
  );

  if (cekDuplikat.rows.length > 0) {
    const err = new Error("Email atau NIP/NUPTK sudah dipakai admin lain.");
    err.status = 409;
    throw err;
  }

  const rawPassword = payload.sandi || payload.password || payload.kataSandi;
  if (rawPassword && String(rawPassword).trim()) {
    const passwordHash = await bcrypt.hash(String(rawPassword).trim(), 10);
    const result = await query(
      `UPDATE users
       SET nama = $1, nip = $2, email = $3, role = $4, status = $5, foto_url = $6, password_hash = $7, updated_at = NOW()
       WHERE id::text = $8
       RETURNING id, nama, nip, email, role, status, foto_url`,
      [
        nama,
        nipSimpan,
        email,
        roleDb,
        statusDb,
        fotoUrl,
        passwordHash,
        String(id),
      ],
    );
    return formatAdminRow(result.rows[0]);
  }

  const result = await query(
    `UPDATE users
     SET nama = $1, nip = $2, email = $3, role = $4, status = $5, foto_url = $6, updated_at = NOW()
     WHERE id::text = $7
     RETURNING id, nama, nip, email, role, status, foto_url`,
    [nama, nipSimpan, email, roleDb, statusDb, fotoUrl, String(id)],
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
