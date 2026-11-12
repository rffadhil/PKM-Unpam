
/** @format */

import { query } from "../config/db.js";

// ==========================================
// FORMAT TANGGAL
// ==========================================
const formatTanggalDb = (val) => {
  if (!val) return null;

  if (typeof val === "string") {
    return val.slice(0, 10);
  }

  const d = new Date(val);

  if (isNaN(d.getTime())) return null;

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
};

// ==========================================
// FORMAT DATA ALBUM GALERI
// ==========================================
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

// ==========================================
// GET: MENAMPILKAN SELURUH ALBUM GALERI
// ==========================================
export const getAllGaleri = async (filters = {}) => {
  const conditions = ["deleted_at IS NULL"];
  const values = [];

  // Filter kategori
  if (
    filters.kategori &&
    filters.kategori !== "Semua" &&
    filters.kategori !== "Semua Album"
  ) {
    values.push(filters.kategori.trim());
    conditions.push(`LOWER(kategori) = LOWER($${values.length})`);
  }

  // Filter status
  if (filters.status) {
    values.push(filters.status.trim().toLowerCase());
    conditions.push(`LOWER(status) = LOWER($${values.length})`);
  }

  // Filter pencarian
  const kataKunci = (
    filters.kata ||
    filters.q ||
    filters.search ||
    ""
  ).trim();

  if (kataKunci) {
    values.push(`%${kataKunci}%`);

    conditions.push(
      `(judul_foto ILIKE $${values.length}
      OR deskripsi ILIKE $${values.length}
      OR pengunggah ILIKE $${values.length}
      OR kategori ILIKE $${values.length})`
    );
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  const sql = `
    SELECT *
    FROM galeri
    ${whereClause}
    ORDER BY created_at DESC
  `;

  const result = await query(sql, values);

  return result.rows.map(formatGaleriRow);
};

// ==========================================
// GET: DETAIL ALBUM BESERTA SELURUH FOTO
// ==========================================
export const getGaleriById = async (id) => {
  const albumResult = await query(
    `SELECT *
     FROM galeri
     WHERE id::text = $1
       AND deleted_at IS NULL
     LIMIT 1`,
    [String(id)]
  );

  if (!albumResult.rows[0]) {
    const error = new Error("Album galeri tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  const album = formatGaleriRow(albumResult.rows[0]);

  const fotoResult = await query(
    `SELECT id, image_url, urutan, created_at
     FROM galeri_foto
     WHERE galeri_id = $1
     ORDER BY urutan ASC, created_at ASC`,
    [id]
  );

  const fotos = fotoResult.rows.map((foto) => ({
    id: foto.id,
    url: foto.image_url,
    image_url: foto.image_url,
    urutan: foto.urutan,
    created_at: foto.created_at,
  }));

  return {
    ...album,
    fotos,
    jumlahFoto: fotos.length || album.jumlahFoto,
    jumlah_foto: fotos.length || album.jumlah_foto,
  };
};

// ==========================================
// POST: MEMBUAT ALBUM BARU
// ==========================================
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

// ==========================================
// PUT: MENGUBAH DATA ALBUM
// ==========================================
export const updateGaleri = async (id, data) => {
  const existing = await query(
    `SELECT id
     FROM galeri
     WHERE id::text = $1
       AND deleted_at IS NULL
     LIMIT 1`,
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

// ==========================================
// POST: MENAMBAHKAN BANYAK FOTO KE ALBUM
// ==========================================
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

  if (!albumResult.rows[0]) {
    const error = new Error("Album galeri tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  // Validasi data foto
  if (!Array.isArray(fotos) || fotos.length === 0) {
    const error = new Error("Tidak ada foto yang dikirim.");
    error.status = 400;
    throw error;
  }

  const fotoValid = fotos.map((foto) => {
    const url = foto.url || foto.image_url;

    if (!url || typeof url !== "string" || !url.trim()) {
      const error = new Error("URL foto tidak valid.");
      error.status = 400;
      throw error;
    }

    return url.trim();
  });

  // Tentukan urutan foto berikutnya
  const urutanResult = await query(
    `SELECT COALESCE(MAX(urutan), 0) AS terakhir
     FROM galeri_foto
     WHERE galeri_id = $1`,
    [id]
  );

  let urutan = Number(urutanResult.rows[0].terakhir);

  // Simpan seluruh foto
  for (const url of fotoValid) {
    urutan += 1;

    await query(
      `INSERT INTO galeri_foto (
        galeri_id,
        image_url,
        urutan
      )
      VALUES ($1, $2, $3)`,
      [id, url, urutan]
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

  return getGaleriById(id);
};

// ==========================================
// DELETE: MENGHAPUS ALBUM SECARA PERMANEN
// ==========================================
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

// ==========================================
// SOFT DELETE: MENYEMBUNYIKAN ALBUM
// ==========================================
export const softDeleteGaleri = async (id) => {
  const result = await query(
    `UPDATE galeri
     SET deleted_at = NOW(),
         updated_at = NOW()
     WHERE id::text = $1
       AND deleted_at IS NULL
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
