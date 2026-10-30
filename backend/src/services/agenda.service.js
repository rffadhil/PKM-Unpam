
/** @format */

import { query } from "../config/db.js";

const formatAgendaRow = (row) => {
  return {
    id: row.id,
    judul: row.judul,
    slug: row.slug,
    kategori: row.kategori || "",
    periode: row.periode || "",
    deskripsi: row.deskripsi || "",
    tanggal_mulai: row.tanggal_mulai,
    tanggal_selesai: row.tanggal_selesai,
    waktu: row.waktu || "",
    lokasi: row.lokasi || "",
    kapasitas_target: row.kapasitas_target || "",
    penyelenggara: row.penyelenggara || "",
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

// GET: Menampilkan seluruh agenda
export const getAllAgenda = async (filters = {}) => {
  const conditions = ["deleted_at IS NULL"];
  const values = [];

  // Filter kategori
  if (filters.kategori) {
    values.push(filters.kategori);
    conditions.push(`kategori = $${values.length}`);
  }

  // Filter periode
  if (filters.periode) {
    values.push(filters.periode);
    conditions.push(`periode = $${values.length}`);
  }

  // Filter tanggal mulai
  if (filters.tanggal_mulai) {
    values.push(filters.tanggal_mulai);
    conditions.push(`tanggal_mulai >= $${values.length}`);
  }

  // Filter tanggal selesai
  if (filters.tanggal_selesai) {
    values.push(filters.tanggal_selesai);
    conditions.push(
      `tanggal_mulai <= $${values.length}`,
    );
  }

  const result = await query(
    `SELECT *
     FROM agenda
     WHERE ${conditions.join(" AND ")}
     ORDER BY tanggal_mulai ASC, created_at DESC`,
    values,
  );

  return result.rows.map(formatAgendaRow);
};

// GET: Menampilkan detail agenda berdasarkan ID
export const getAgendaById = async (id) => {
  const result = await query(
    `SELECT *
     FROM agenda
     WHERE id::text = $1
       AND deleted_at IS NULL
     LIMIT 1`,
    [String(id)],
  );

  if (!result.rows[0]) {
    const error = new Error("Agenda tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  return formatAgendaRow(result.rows[0]);
};

// POST: Membuat agenda baru
export const createAgenda = async (data, userId) => {
  // Cek slug agar tidak duplikat
  const slugCheck = await query(
    `SELECT id
     FROM agenda
     WHERE slug = $1
       AND deleted_at IS NULL
     LIMIT 1`,
    [data.slug],
  );

  if (slugCheck.rows.length > 0) {
    const error = new Error("Slug agenda sudah digunakan.");
    error.status = 409;
    error.field = "slug";
    throw error;
  }

  const insertResult = await query(
    `INSERT INTO agenda (
      judul,
      slug,
      kategori,
      periode,
      deskripsi,
      tanggal_mulai,
      tanggal_selesai,
      waktu,
      lokasi,
      kapasitas_target,
      penyelenggara,
      created_by,
      created_at,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, NOW(), NOW()
    )
    RETURNING id`,
    [
      data.judul,
      data.slug,
      data.kategori || null,
      data.periode || null,
      data.deskripsi || null,
      data.tanggal_mulai,
      data.tanggal_selesai || null,
      data.waktu || null,
      data.lokasi || null,
      data.kapasitas_target || null,
      data.penyelenggara || null,
      userId || null,
    ],
  );

  return getAgendaById(insertResult.rows[0].id);
};

// PUT: Mengubah agenda
export const updateAgenda = async (id, data) => {
  const existing = await query(
    `SELECT id
     FROM agenda
     WHERE id::text = $1
       AND deleted_at IS NULL
     LIMIT 1`,
    [String(id)],
  );

  if (!existing.rows[0]) {
    const error = new Error("Agenda tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  // Cek slug agar tidak bentrok dengan agenda lain
  const slugCheck = await query(
    `SELECT id
     FROM agenda
     WHERE slug = $1
       AND id::text <> $2
       AND deleted_at IS NULL
     LIMIT 1`,
    [data.slug, String(id)],
  );

  if (slugCheck.rows.length > 0) {
    const error = new Error("Slug agenda sudah digunakan.");
    error.status = 409;
    error.field = "slug";
    throw error;
  }

  await query(
    `UPDATE agenda
     SET judul = $1,
         slug = $2,
         kategori = $3,
         periode = $4,
         deskripsi = $5,
         tanggal_mulai = $6,
         tanggal_selesai = $7,
         waktu = $8,
         lokasi = $9,
         kapasitas_target = $10,
         penyelenggara = $11,
         updated_at = NOW()
     WHERE id::text = $12
       AND deleted_at IS NULL`,
    [
      data.judul,
      data.slug,
      data.kategori || null,
      data.periode || null,
      data.deskripsi || null,
      data.tanggal_mulai,
      data.tanggal_selesai || null,
      data.waktu || null,
      data.lokasi || null,
      data.kapasitas_target || null,
      data.penyelenggara || null,
      String(id),
    ],
  );

  return getAgendaById(id);
};

// DELETE: Soft delete agenda
export const softDeleteAgenda = async (id) => {
  const result = await query(
    `UPDATE agenda
     SET deleted_at = NOW(),
         updated_at = NOW()
     WHERE id::text = $1
       AND deleted_at IS NULL
     RETURNING id`,
    [String(id)],
  );

  if (!result.rows[0]) {
    const error = new Error("Agenda tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  return true;
};
