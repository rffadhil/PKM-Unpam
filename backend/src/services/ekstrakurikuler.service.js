/** @format */

import { query } from "../config/db.js";

// FORMAT DATA EKSTRAKURIKULER
export const formatEkstrakurikulerRow = (row) => ({
  id: row.id,
  nama: row.nama,
  pembina: row.pembina,
  foto_url: row.foto_url || "",
  foto: row.foto_url || "",
  status: (row.status || "tayang").toLowerCase(),
  created_by: row.created_by,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

// GET: MENAMPILKAN SELURUH EKSTRAKURIKULER
export const getAllEkstrakurikuler = async (filters = {}) => {
  const conditions = [];
  const values = [];

  // Filter status
  if (filters.status) {
    values.push(filters.status.trim().toLowerCase());
    conditions.push(`LOWER(status) = LOWER($${values.length})`);
  }

  // Pencarian nama atau pembina
  const kataKunci = (
    filters.kata ||
    filters.q ||
    filters.search ||
    ""
  ).trim();

  if (kataKunci) {
    values.push(`%${kataKunci}%`);
    conditions.push(
      `(nama ILIKE $${values.length}
      OR pembina ILIKE $${values.length})`
    );
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const sql = `
    SELECT *
    FROM ekstrakurikuler
    ${whereClause}
    ORDER BY created_at DESC
  `;

  const result = await query(sql, values);

  return result.rows.map(formatEkstrakurikulerRow);
};

// GET: DETAIL EKSTRAKURIKULER
export const getEkstrakurikulerById = async (id) => {
  const result = await query(
    `SELECT *
     FROM ekstrakurikuler
     WHERE id::text = $1
     LIMIT 1`,
    [String(id)]
  );

  if (!result.rows[0]) {
    const error = new Error("Ekstrakurikuler tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  return formatEkstrakurikulerRow(result.rows[0]);
};

// POST: MENAMBAHKAN EKSTRAKURIKULER
export const createEkstrakurikuler = async (data, userId) => {
  const result = await query(
    `INSERT INTO ekstrakurikuler (
      nama,
      pembina,
      foto_url,
      status,
      created_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING id`,
    [
      data.nama,
      data.pembina,
      data.foto_url || "",
      data.status || "tayang",
      userId || null,
    ]
  );

  return getEkstrakurikulerById(result.rows[0].id);
};

// PUT: MENGUBAH EKSTRAKURIKULER
export const updateEkstrakurikuler = async (id, data) => {
  const existing = await query(
    `SELECT id
     FROM ekstrakurikuler
     WHERE id::text = $1
     LIMIT 1`,
    [String(id)]
  );

  if (!existing.rows[0]) {
    const error = new Error("Ekstrakurikuler tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  await query(
    `UPDATE ekstrakurikuler
     SET nama = $1,
         pembina = $2,
         foto_url = $3,
         status = $4,
         updated_at = NOW()
     WHERE id::text = $5`,
    [
      data.nama,
      data.pembina,
      data.foto_url || "",
      data.status || "tayang",
      String(id),
    ]
  );

  return getEkstrakurikulerById(id);
};

// DELETE: HAPUS PERMANEN EKSTRAKURIKULER
export const deleteEkstrakurikuler = async (id) => {
  const result = await query(
    `DELETE FROM ekstrakurikuler
     WHERE id::text = $1
     RETURNING id`,
    [String(id)]
  );

  if (!result.rows[0]) {
    const error = new Error("Ekstrakurikuler tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  return true;
};