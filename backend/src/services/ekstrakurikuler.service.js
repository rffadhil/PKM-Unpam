
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
  const conditions = ["deleted_at IS NULL"];
  const values = [];

  if (filters.status) {
    values.push(filters.status.trim().toLowerCase());
    conditions.push(`LOWER(status) = LOWER($${values.length})`);
  }

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

  const sql = `
    SELECT *
    FROM ekstrakurikuler
    WHERE ${conditions.join(" AND ")}
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
       AND deleted_at IS NULL
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

// POST: TAMBAH EKSTRAKURIKULER + LOG
export const createEkstrakurikuler = async (data, userId) => {
  const result = await query(
    `
    WITH data_baru AS (
      INSERT INTO ekstrakurikuler (
        nama,
        pembina,
        foto_url,
        status,
        created_by,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    ),
    log_baru AS (
      INSERT INTO aktivitas_log (
        user_id,
        jenis,
        aksi,
        objek,
        keterangan,
        created_at
      )
      SELECT
        $5,
        'ekstrakurikuler',
        'tambah',
        nama,
        'Menambahkan ekstrakurikuler "' || nama ||
        '" dengan status ' || status || '.',
        NOW()
      FROM data_baru
      RETURNING id
    )
    SELECT data_baru.*
    FROM data_baru
    CROSS JOIN log_baru
    `,
    [
      data.nama,
      data.pembina,
      data.foto_url || "",
      data.status || "tayang",
      userId || null,
    ]
  );

  if (!result.rows[0]) {
    throw new Error("Gagal menambahkan ekstrakurikuler.");
  }

  return formatEkstrakurikulerRow(result.rows[0]);
};

// PUT: EDIT EKSTRAKURIKULER + LOG
export const updateEkstrakurikuler = async (
  id,
  data,
  userId
) => {
  const result = await query(
    `
    WITH data_lama AS (
      SELECT *
      FROM ekstrakurikuler
      WHERE id::text = $1
        AND deleted_at IS NULL
      FOR UPDATE
    ),
    data_update AS (
      UPDATE ekstrakurikuler e
      SET
        nama = $2,
        pembina = $3,
        foto_url = $4,
        status = $5,
        updated_at = NOW()
      FROM data_lama l
      WHERE e.id = l.id
      RETURNING e.*, l.status AS status_lama
    ),
    log_baru AS (
      INSERT INTO aktivitas_log (
        user_id,
        jenis,
        aksi,
        objek,
        keterangan,
        created_at
      )
      SELECT
        $6,
        'ekstrakurikuler',
        CASE
          WHEN LOWER(status_lama) <> LOWER(status)
          THEN 'ubah_status'
          ELSE 'edit'
        END,
        nama,
        CASE
          WHEN LOWER(status_lama) <> LOWER(status)
          THEN 'Mengubah status publikasi "' || nama ||
               '" dari ' || status_lama || ' menjadi ' || status || '.'
          ELSE 'Memperbarui informasi ekstrakurikuler "' || nama || '".'
        END,
        NOW()
      FROM data_update
      RETURNING id
    )
    SELECT data_update.*
    FROM data_update
    CROSS JOIN log_baru
    `,
    [
      String(id),
      data.nama,
      data.pembina,
      data.foto_url || "",
      data.status || "tayang",
      userId || null,
    ]
  );

  if (!result.rows[0]) {
    const error = new Error("Ekstrakurikuler tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  return formatEkstrakurikulerRow(result.rows[0]);
};

// DELETE: SOFT DELETE + LOG
export const softDeleteEkstrakurikuler = async (
  id,
  userId
) => {
  const result = await query(
    `
    WITH data_hapus AS (
      UPDATE ekstrakurikuler
      SET
        deleted_at = NOW(),
        updated_at = NOW()
      WHERE id::text = $1
        AND deleted_at IS NULL
      RETURNING *
    ),
    log_baru AS (
      INSERT INTO aktivitas_log (
        user_id,
        jenis,
        aksi,
        objek,
        keterangan,
        created_at
      )
      SELECT
        $2,
        'ekstrakurikuler',
        'hapus',
        nama,
        'Menghapus ekstrakurikuler "' || nama || '".',
        NOW()
      FROM data_hapus
      RETURNING id
    )
    SELECT data_hapus.id
    FROM data_hapus
    CROSS JOIN log_baru
    `,
    [
      String(id),
      userId || null,
    ]
  );

  if (!result.rows[0]) {
    const error = new Error("Ekstrakurikuler tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  return true;
};
