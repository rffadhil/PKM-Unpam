
/** @format */

import { query } from "../config/db.js";
import fs from "fs";
import path from "path";

// Format data dokumen

const formatDokumenRow = (row) => ({
  id: row.id,
  nama_dokumen: row.nama_dokumen,
  kategori: row.kategori || "Umum & Siswa",
  deskripsi: row.deskripsi || "",
  file_url: row.file_url,
  tipe_file: row.tipe_file || "",
  ukuran_bytes: row.ukuran_bytes || 0,
  status_publikasi: row.status_publikasi,
  tampil_tombol_utama: row.tampil_tombol_utama,
  jumlah_unduhan: row.jumlah_unduhan,

  created_by: row.created_by,
  created_at: row.created_at,

  updated_by: row.updated_by,
  updated_at: row.updated_at,

  // Nama pengguna dari tabel users
  pengunggah: row.pengunggah_nama || "Tidak diketahui",
  terakhir_diedit_oleh: row.terakhir_diedit_oleh_nama || null,
})


// Memastikan kolom audit dan panjang tipe_file tabel dokumen sesuai kebutuhan
let skemaDokumenSudahDicek = false;
const pastikanSkemaDokumen = async () => {
  if (skemaDokumenSudahDicek) return;
  try {
    await query(`
      ALTER TABLE dokumen ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES users (id) ON DELETE SET NULL;
      ALTER TABLE dokumen ALTER COLUMN tipe_file TYPE VARCHAR(255);
    `);
    skemaDokumenSudahDicek = true;
  } catch {
    // Abaikan jika sudah di-alter atau query tidak diizinkan
  }
};

// GET: Daftar dokumen publik
export const getAllDokumen = async (filters = {}) => {
  await pastikanSkemaDokumen();
  const conditions = [
    "deleted_at IS NULL",
    "status_publikasi = 'Aktif di SIS'",
  ];

  const values = [];

  if (filters.kategori) {
    values.push(filters.kategori);
    conditions.push(`kategori = $${values.length}`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(
      `nama_dokumen ILIKE $${values.length}`,
    );
  }

  const result = await query(
    `SELECT *
     FROM dokumen
     WHERE ${conditions.join(" AND ")}
     ORDER BY tampil_tombol_utama DESC, created_at DESC`,
    values,
  );

  return result.rows.map(formatDokumenRow);
};

// GET: Daftar dokumen admin

export const getAllDokumenAdmin = async (filters = {}) => {
  await pastikanSkemaDokumen()
  const conditions = ["d.deleted_at IS NULL"]
  const values = []

  if (filters.kategori) {
    values.push(filters.kategori)
    conditions.push(`d.kategori = $${values.length}`)
  }

  if (filters.status_publikasi) {
    values.push(filters.status_publikasi)
    conditions.push(
      `d.status_publikasi = $${values.length}`
    )
  }

  if (filters.search) {
    values.push(`%${filters.search}%`)
    conditions.push(
      `d.nama_dokumen ILIKE $${values.length}`
    )
  }

  const result = await query(
    `SELECT
        d.*,
        pembuat.nama AS pengunggah_nama,
        pengubah.nama AS terakhir_diedit_oleh_nama
     FROM dokumen d

     LEFT JOIN users pembuat
        ON d.created_by = pembuat.id

     LEFT JOIN users pengubah
        ON d.updated_by = pengubah.id

     WHERE ${conditions.join(" AND ")}

     ORDER BY d.created_at DESC`,
    values,
  )

  return result.rows.map(formatDokumenRow)
}


// GET: Detail dokumen
export const getDokumenById = async (
  id,
  admin = false,
) => {
  const conditions = [
    "id::text = $1",
    "deleted_at IS NULL",
  ];

  if (!admin) {
    conditions.push(
      "status_publikasi = 'Aktif di SIS'",
    );
  }

  const result = await query(
    `SELECT *
     FROM dokumen
     WHERE ${conditions.join(" AND ")}
     LIMIT 1`,
    [String(id)],
  );

  if (!result.rows[0]) {
    const error = new Error(
      "Dokumen tidak ditemukan.",
    );

    error.status = 404;
    throw error;
  }

  return formatDokumenRow(result.rows[0]);
};

// POST: Membuat dokumen baru
export const createDokumen = async (
  data,
  file,
  userId,
) => {
  await pastikanSkemaDokumen();
  if (!file) {
    const error = new Error(
      "File dokumen wajib diunggah.",
    );

    error.status = 400;
    throw error;
  }

  const fileUrl = `/uploads/dokumen/${file.filename}`;
  const tipeFile = file.mimetype ? String(file.mimetype).slice(0, 255) : '';

  const result = await query(
    `INSERT INTO dokumen (
      nama_dokumen,
      kategori,
      deskripsi,
      file_url,
      tipe_file,
      ukuran_bytes,
      versi,
      status_publikasi,
      tampil_tombol_utama,
      created_by,
      created_at,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      NOW(), NOW()
    )
    RETURNING id`,
    [
      data.nama_dokumen,
      data.kategori || "Umum & Siswa",
      data.deskripsi || null,
      fileUrl,
      tipeFile,
      file.size,
      data.versi || "Rev 1.0",
      data.status_publikasi || "Aktif di SIS",
      data.tampil_tombol_utama ?? false,
      userId || null,
    ],
  );

  return getDokumenById(
    result.rows[0].id,
    true,
  );
};

// PUT: Mengubah informasi dokumen
export const updateDokumen = async (
  id,
  data,
  file = null,
  userId = null,
) => {
  await pastikanSkemaDokumen();
  const existing = await query(
    `SELECT *
     FROM dokumen
     WHERE id::text = $1
       AND deleted_at IS NULL
     LIMIT 1`,
    [String(id)],
  );

  if (!existing.rows[0]) {
    const error = new Error("Dokumen tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  const dokumenLama = existing.rows[0];

  const fileUrl = file
    ? `/uploads/dokumen/${file.filename}`
    : dokumenLama.file_url;

  await query(
    `UPDATE dokumen
     SET nama_dokumen = COALESCE($1, nama_dokumen),
         kategori = COALESCE($2, kategori),
         deskripsi = $3,
         file_url = $4,
         tipe_file = $5,
         ukuran_bytes = $6,
         status_publikasi = COALESCE($7, status_publikasi),
         updated_by = $8,
         updated_at = NOW()
     WHERE id::text = $9
       AND deleted_at IS NULL`,
    [
      data.nama_dokumen ?? null,
      data.kategori ?? null,
      data.deskripsi ?? dokumenLama.deskripsi,
      fileUrl,
      file ? (file.mimetype ? String(file.mimetype).slice(0, 255) : '') : dokumenLama.tipe_file,
      file ? file.size : dokumenLama.ukuran_bytes,
      data.status_publikasi ?? null,
      userId,
      String(id),
    ],
  );

  // Hapus file lama setelah update database berhasil.
  if (file) {
    const namaFileLama = path.basename(dokumenLama.file_url || "");
    const lokasiFileLama = path.resolve(
      process.cwd(),
      "uploads",
      "dokumen",
      namaFileLama,
    );

    if (
      namaFileLama &&
      fs.existsSync(lokasiFileLama)
    ) {
      fs.unlinkSync(lokasiFileLama);
    }
  }

  return getDokumenById(id, true);
};

// DELETE: Soft delete dokumen
export const softDeleteDokumen = async (id) => {
  const result = await query(
    `UPDATE dokumen
     SET deleted_at = NOW(),
         updated_at = NOW()
     WHERE id::text = $1
       AND deleted_at IS NULL
     RETURNING id`,
    [String(id)],
  );

  if (!result.rows[0]) {
    const error = new Error(
      "Dokumen tidak ditemukan.",
    );

    error.status = 404;
    throw error;
  }

  return true;
};

// GET: Menambah jumlah unduhan
export const incrementJumlahUnduhan = async (id) => {
  const result = await query(
    `UPDATE dokumen
     SET jumlah_unduhan = jumlah_unduhan + 1
     WHERE id::text = $1
       AND deleted_at IS NULL
       AND status_publikasi = 'Aktif di SIS'
     RETURNING id, jumlah_unduhan`,
    [String(id)],
  );

  if (!result.rows[0]) {
    const error = new Error(
      "Dokumen tidak ditemukan.",
    );

    error.status = 404;
    throw error;
  }

  return result.rows[0];
};
