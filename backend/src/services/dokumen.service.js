
/** @format */

import { query } from "../config/db.js";

// Format data dokumen
const formatDokumenRow = (row) => ({
  id: row.id,
  nama_dokumen: row.nama_dokumen,
  kategori: row.kategori || "Umum & Siswa",
  deskripsi: row.deskripsi || "",
  file_url: row.file_url,
  tipe_file: row.tipe_file || "",
  ukuran_bytes: row.ukuran_bytes || 0,
  versi: row.versi || "Rev 1.0",
  status_publikasi: row.status_publikasi,
  tampil_tombol_utama: row.tampil_tombol_utama,
  jumlah_unduhan: row.jumlah_unduhan,
  created_by: row.created_by,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

// GET: Daftar dokumen publik
export const getAllDokumen = async (filters = {}) => {
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
  const conditions = ["deleted_at IS NULL"];
  const values = [];

  if (filters.kategori) {
    values.push(filters.kategori);
    conditions.push(`kategori = $${values.length}`);
  }

  if (filters.status_publikasi) {
    values.push(filters.status_publikasi);
    conditions.push(
      `status_publikasi = $${values.length}`,
    );
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
     ORDER BY created_at DESC`,
    values,
  );

  return result.rows.map(formatDokumenRow);
};

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
  if (!file) {
    const error = new Error(
      "File dokumen wajib diunggah.",
    );

    error.status = 400;
    throw error;
  }

  const fileUrl = `/uploads/dokumen/${file.filename}`;

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
      file.mimetype,
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
export const updateDokumen = async (id, data) => {
  const existing = await query(
    `SELECT id
     FROM dokumen
     WHERE id::text = $1
       AND deleted_at IS NULL
     LIMIT 1`,
    [String(id)],
  );

  if (!existing.rows[0]) {
    const error = new Error(
      "Dokumen tidak ditemukan.",
    );

    error.status = 404;
    throw error;
  }

  await query(
    `UPDATE dokumen
     SET nama_dokumen = COALESCE($1, nama_dokumen),
         kategori = COALESCE($2, kategori),
         deskripsi = COALESCE($3, deskripsi),
         versi = COALESCE($4, versi),
         status_publikasi = COALESCE($5, status_publikasi),
         tampil_tombol_utama = COALESCE($6, tampil_tombol_utama),
         updated_at = NOW()
     WHERE id::text = $7
       AND deleted_at IS NULL`,
    [
      data.nama_dokumen ?? null,
      data.kategori ?? null,
      data.deskripsi ?? null,
      data.versi ?? null,
      data.status_publikasi ?? null,
      data.tampil_tombol_utama ?? null,
      String(id),
    ],
  );

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
