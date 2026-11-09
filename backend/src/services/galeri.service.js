/** @format */

import { query } from "../config/db.js";

const formatTanggalDb = (val) => {
  if (!val) return null;
  if (typeof val === "string") return val.slice(0, 10);
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const formatGaleriRow = (row) => {
  const tanggal = formatTanggalDb(row.tanggal || row.created_at);
  const coverUrl = row.image_url || "";

  return {
    id: row.id,
    judul: row.judul_foto,
    judul_foto: row.judul_foto,
    kategori: row.kategori || "Adiwiyata",
    deskripsi: row.deskripsi || "",
    cover: coverUrl,
    gambar: coverUrl,
    image_url: coverUrl,
    jumlahFoto: Number(row.jumlah_foto ?? 1),
    jumlah_foto: Number(row.jumlah_foto ?? 1),
    penyelenggara: row.pengunggah || "",
    pengunggah: row.pengunggah || "",
    status: (row.status || "tayang").toLowerCase(),
    tanggal,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

// GET: Menampilkan seluruh album galeri
export const getAllGaleri = async (filters = {}) => {
  const conditions = ["deleted_at IS NULL"];
  const values = [];

  // Filter kategori
  if (filters.kategori && filters.kategori !== "Semua" && filters.kategori !== "Semua Album") {
    values.push(filters.kategori.trim());
    conditions.push(`LOWER(kategori) = LOWER($${values.length})`);
  }

  // Filter status (misal untuk publik hanya yang 'tayang')
  if (filters.status) {
    values.push(filters.status.trim().toLowerCase());
    conditions.push(`LOWER(status) = LOWER($${values.length})`);
  }

  // Filter kata kunci pencarian
  const kataKunci = (filters.kata || filters.q || filters.search || "").trim();
  if (kataKunci) {
    values.push(`%${kataKunci}%`);
    conditions.push(
      `(judul_foto ILIKE $${values.length} OR deskripsi ILIKE $${values.length} OR pengunggah ILIKE $${values.length} OR kategori ILIKE $${values.length})`
    );
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const sql = `
    SELECT *
    FROM galeri
    ${whereClause}
    ORDER BY created_at DESC
  `;

  const result = await query(sql, values);
  return result.rows.map(formatGaleriRow);
};

// GET: Detail album beserta seluruh foto
export const getGaleriById = async (id) => {
  const result = await query(
    `SELECT *
     FROM galeri
     WHERE id::text = $1
       AND deleted_at IS NULL
     LIMIT 1`,
    [String(id)]
  );

  if (!result.rows[0]) {
    const error = new Error("Album galeri tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  const album = formatGaleriRow(result.rows[0]);

  // Ambil semua foto yang terhubung dengan album
  const fotoResult = await query(
    `SELECT
       id,
       image_url,
       caption,
       urutan,
       created_at
     FROM galeri_foto
     WHERE galeri_id = $1
     ORDER BY urutan ASC, created_at ASC`,
    [result.rows[0].id]
  );

  const fotos = fotoResult.rows.map((foto) => ({
    id: foto.id,
    url: foto.image_url,
    image_url: foto.image_url,
    caption: foto.caption || "",
    urutan: foto.urutan,
  }));

  return {
    ...album,
    fotos,
    jumlahFoto: fotos.length || album.jumlahFoto,
    jumlah_foto: fotos.length || album.jumlah_foto,
  };
};

// POST: Membuat album baru (Hanya memakai kolom standar skema PostgreSQL)
export const createGaleri = async (data, userId) => {
  const insertResult = await query(
    `INSERT INTO galeri (
      judul_foto,
      kategori,
      deskripsi,
      image_url,
      jumlah_foto,
      pengunggah,
      status,
      created_by,
      created_at,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()
    )
    RETURNING id`,
    [
      data.judul_foto,
      data.kategori || "Adiwiyata",
      data.deskripsi || "",
      data.image_url || "",
      data.jumlah_foto ?? 1,
      data.pengunggah || "Admin Sekolah",
      data.status || "tayang",
      userId || null,
    ]
  );

  return getGaleriById(insertResult.rows[0].id);
};

// PUT: Mengubah album (Hanya memakai kolom standar skema PostgreSQL)
export const updateGaleri = async (id, data) => {
  const existing = await query(
    `SELECT id FROM galeri WHERE id::text = $1 AND deleted_at IS NULL LIMIT 1`,
    [String(id)]
  );

  if (!existing.rows[0]) {
    const error = new Error("Album galeri tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  await query(
    `UPDATE galeri
     SET judul_foto = $1,
         kategori = $2,
         deskripsi = $3,
         image_url = $4,
         jumlah_foto = $5,
         pengunggah = $6,
         status = $7,
         updated_at = NOW()
     WHERE id::text = $8
       AND deleted_at IS NULL`,
    [
      data.judul_foto,
      data.kategori || "Adiwiyata",
      data.deskripsi || "",
      data.image_url || "",
      data.jumlah_foto ?? 1,
      data.pengunggah || "Admin Sekolah",
      data.status || "tayang",
      String(id),
    ]
  );

  return getGaleriById(id);
};

// DELETE: Menghapus album secara permanen dari database
export const deleteGaleri = async (id) => {
  const result = await query(
    `DELETE FROM galeri
     WHERE id::text = $1
     RETURNING id`,
    [String(id)]
  );

  if (!result.rows[0]) {
    const error = new Error("Album galeri tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  return true;
};

export const softDeleteGaleri = deleteGaleri;

// POST: Menambahkan banyak foto ke dalam album
export const tambahFotoGaleri = async (id, fotos) => {
  // Pastikan album tersedia
  const albumResult = await query(
    `SELECT id, image_url
     FROM galeri
     WHERE id::text = $1
       AND deleted_at IS NULL
     LIMIT 1`,
    [String(id)]
  );

  const album = albumResult.rows[0];

  if (!album) {
    const error = new Error("Album galeri tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  if (!Array.isArray(fotos) || fotos.length === 0) {
    const error = new Error("Tidak ada foto yang dikirim.");
    error.status = 400;
    throw error;
  }

  // Tentukan urutan foto berikutnya
  const urutanResult = await query(
    `SELECT COALESCE(MAX(urutan), 0) AS terakhir
     FROM galeri_foto
     WHERE galeri_id = $1`,
    [id]
  );

  let urutan = Number(urutanResult.rows[0].terakhir);

  // Simpan seluruh foto
  for (const foto of fotos) {
    const url = foto.url || foto.image_url;

    if (!url || typeof url !== "string") {
      const error = new Error("URL foto tidak valid.");
      error.status = 400;
      throw error;
    }

    urutan += 1;

    await query(
      `INSERT INTO galeri_foto (
        galeri_id,
        image_url,
        caption,
        urutan
      )
      VALUES ($1, $2, $3, $4)`,
      [
        id,
        url,
        foto.caption || foto.keterangan || "",
        urutan,
      ]
    );
  }

  // Perbarui jumlah foto dan sampul album
  await query(
    `UPDATE galeri
     SET jumlah_foto = (
       SELECT COUNT(*)
       FROM galeri_foto
       WHERE galeri_id = $1
     ),
     image_url = CASE
       WHEN COALESCE(image_url, '') = ''
       THEN (
         SELECT image_url
         FROM galeri_foto
         WHERE galeri_id = $1
         ORDER BY urutan ASC
         LIMIT 1
       )
       ELSE image_url
     END,
     updated_at = NOW()
     WHERE id = $1`,
    [id]
  );

  // Kembalikan album beserta seluruh foto
  return getGaleriById(id);
};