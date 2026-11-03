
/** @format */

import { query } from "../config/db.js";

// Menampilkan semua data staf
export const getAllStaf = async () => {
  const result = await query(
    `SELECT
        id,
        nama,
        nip_nuptk,
        jabatan,
        rumpun,
        mata_pelajaran,
        pendidikan_terakhir,
        almamater,
        status_kepegawaian,
        foto_url,
        urutan,
        tampil_publik,
        created_at,
        updated_at
     FROM staf
     WHERE deleted_at IS NULL
     ORDER BY urutan ASC`
  );

  return result.rows;
};

// Menampilkan staf berdasarkan ID
export const getStafById = async (id) => {
  const result = await query(
    `SELECT
        id,
        nama,
        nip_nuptk,
        jabatan,
        rumpun,
        mata_pelajaran,
        pendidikan_terakhir,
        almamater,
        status_kepegawaian,
        foto_url,
        urutan,
        tampil_publik,
        created_at,
        updated_at
     FROM staf
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  );

  return result.rows[0];
};

// Menambahkan data staf
export const createStaf = async ({
  nama,
  nip_nuptk = null,
  jabatan,
  rumpun = null,
  mata_pelajaran = null,
  pendidikan_terakhir = null,
  almamater = null,
  status_kepegawaian = null,
  foto_url = null,
  urutan = 0,
  tampil_publik = true,
}) => {
  const result = await query(
    `INSERT INTO staf (
        nama,
        nip_nuptk,
        jabatan,
        rumpun,
        mata_pelajaran,
        pendidikan_terakhir,
        almamater,
        status_kepegawaian,
        foto_url,
        urutan,
        tampil_publik
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      nama,
      nip_nuptk,
      jabatan,
      rumpun,
      mata_pelajaran,
      pendidikan_terakhir,
      almamater,
      status_kepegawaian,
      foto_url,
      urutan,
      tampil_publik,
    ]
  );

  return result.rows[0];
};

// Mengubah data staf
export const updateStaf = async (
  id,
  {
    nama,
    nip_nuptk = null,
    jabatan,
    rumpun = null,
    mata_pelajaran = null,
    pendidikan_terakhir = null,
    almamater = null,
    status_kepegawaian = null,
    foto_url = null,
    urutan = 0,
    tampil_publik = true,
  }
) => {
  const result = await query(
    `UPDATE staf
     SET nama = $1,
         nip_nuptk = $2,
         jabatan = $3,
         rumpun = $4,
         mata_pelajaran = $5,
         pendidikan_terakhir = $6,
         almamater = $7,
         status_kepegawaian = $8,
         foto_url = $9,
         urutan = $10,
         tampil_publik = $11,
         updated_at = NOW()
     WHERE id = $12
       AND deleted_at IS NULL
     RETURNING *`,
    [
      nama,
      nip_nuptk,
      jabatan,
      rumpun,
      mata_pelajaran,
      pendidikan_terakhir,
      almamater,
      status_kepegawaian,
      foto_url,
      urutan,
      tampil_publik,
      id,
    ]
  );

  return result.rows[0];
};

// Menghapus data staf (soft delete)
export const deleteStaf = async (id) => {
  const result = await query(
    `UPDATE staf
     SET deleted_at = NOW(),
         updated_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL
     RETURNING id`,
    [id]
  );

  return result.rows[0];
};
