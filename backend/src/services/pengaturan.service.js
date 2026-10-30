import { query } from "../config/db.js";

// Mengambil semua pengaturan sekolah
export const getAllPengaturan = async () => {
  const result = await query(
    `SELECT key, value, updated_at
     FROM pengaturan_sekolah
     ORDER BY key ASC`
  );

  return result.rows;
};

// Mengambil pengaturan berdasarkan key
export const getPengaturanByKey = async (key) => {
  const result = await query(
    `SELECT key, value, updated_at
     FROM pengaturan_sekolah
     WHERE key = $1`,
    [key]
  );

  return result.rows[0];
};

// Menambahkan atau memperbarui satu pengaturan
export const upsertPengaturan = async (key, value) => {
  const result = await query(
    `INSERT INTO pengaturan_sekolah (key, value, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key)
     DO UPDATE SET
       value = EXCLUDED.value,
       updated_at = NOW()
     RETURNING key, value, updated_at`,
    [key, value]
  );

  return result.rows[0];
};

// Menambahkan atau memperbarui banyak pengaturan
export const upsertManyPengaturan = async (settings) => {
  const results = [];

  for (const [key, value] of Object.entries(settings)) {
    const result = await upsertPengaturan(key, value);
    results.push(result);
  }

  return results;
};