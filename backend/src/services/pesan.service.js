
/** @format */

import { query } from "../config/db.js";

// Memastikan kolom dibaca tersedia pada tabel pesan_masuk
let skemaPesanSudahDicek = false;
const pastikanSkemaPesan = async () => {
  if (skemaPesanSudahDicek) return;
  try {
    await query(`
      ALTER TABLE pesan_masuk ADD COLUMN IF NOT EXISTS dibaca BOOLEAN NOT NULL DEFAULT FALSE;
    `);
    skemaPesanSudahDicek = true;
  } catch {
    // Abaikan jika sudah ada atau izin terbatas
  }
};

// Menambahkan pesan dari pengunjung
export const createPesan = async ({
  nama,
  email,
  telepon = null,
  kategori_layanan,
  subjek,
  pesan,
}) => {
  await pastikanSkemaPesan();
  if (!kategori_layanan) {
    const error = new Error("Kategori layanan wajib dipilih.");
    error.statusCode = 400;
    throw error;
  }

  const result = await query(
    `INSERT INTO pesan_masuk (
        nama,
        email,
        telepon,
        kategori_layanan,
        subjek,
        pesan
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING
       id,
       nama,
       email,
       telepon,
       kategori_layanan,
       subjek,
       pesan,
       status,
       dibaca,
       catatan_admin,
       created_at`,
    [
      nama,
      email,
      telepon,
      kategori_layanan.trim(),
      subjek,
      pesan,
    ]
  );

  return result.rows[0];
};

// Menampilkan semua pesan masuk untuk admin
export const getAllPesan = async ({ status } = {}) => {
  await pastikanSkemaPesan();
  let sql = `
    SELECT
      id,
      nama,
      email,
      telepon,
      kategori_layanan,
      subjek,
      pesan,
      status,
      dibaca,
      catatan_admin,
      created_at,
      updated_at
    FROM pesan_masuk
  `;

  const params = [];

  if (status) {
    sql += ` WHERE status = $1`;
    params.push(status);
  }

  sql += ` ORDER BY created_at DESC`;

  const result = await query(sql, params);

  return result.rows;
};

// Menampilkan detail pesan berdasarkan ID
export const getPesanById = async (id) => {
  await pastikanSkemaPesan();
  const result = await query(
    `SELECT
        id,
        nama,
        email,
        telepon,
        kategori_layanan,
        subjek,
        pesan,
        status,
        dibaca,
        catatan_admin,
        created_at,
        updated_at
     FROM pesan_masuk
     WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

// Mengubah status, catatan admin, dan menandai pesan sudah dibaca
export const updatePesanStatus = async (
  id,
  { status, catatan_admin = null }
) => {
  await pastikanSkemaPesan();
  const result = await query(
    `UPDATE pesan_masuk
     SET status = $1,
         catatan_admin = $2,
         dibaca = TRUE,
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [status, catatan_admin, id]
  );

  return result.rows[0];
};
