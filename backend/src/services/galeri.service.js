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
  const tanggal = formatTanggalDb(row.tanggal) || formatTanggalDb(row.created_at);
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

export const buatSlugGaleri = (judul = "") => {
  const dasar = String(judul)
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return dasar || `album-${Date.now()}`;
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
    ORDER BY tanggal DESC NULLS LAST, created_at DESC
  `;

  const result = await query(sql, values);
  return result.rows.map(formatGaleriRow);
};

// GET: Detail album galeri
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

  return formatGaleriRow(result.rows[0]);
};

// POST: Membuat album baru
export const createGaleri = async (data, userId) => {
  let slug = buatSlugGaleri(data.judul_foto);
  const slugCheck = await query(
    `SELECT id FROM galeri WHERE slug = $1 AND deleted_at IS NULL LIMIT 1`,
    [slug]
  );
  if (slugCheck.rows.length > 0) {
    slug = `${slug}-${Date.now().toString().slice(-6)}`;
  }

  const insertResult = await query(
    `INSERT INTO galeri (
      judul_foto,
      slug,
      kategori,
      deskripsi,
      image_url,
      jumlah_foto,
      pengunggah,
      status,
      tanggal,
      created_by,
      created_at,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()
    )
    RETURNING id`,
    [
      data.judul_foto,
      slug,
      data.kategori || "Adiwiyata",
      data.deskripsi || "",
      data.image_url || "",
      data.jumlah_foto ?? 1,
      data.pengunggah || "Admin Sekolah",
      data.status || "tayang",
      data.tanggal || new Date().toISOString().slice(0, 10),
      userId || null,
    ]
  );

  return getGaleriById(insertResult.rows[0].id);
};

// PUT: Mengubah album
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

  let slug = buatSlugGaleri(data.judul_foto);
  const slugCheck = await query(
    `SELECT id FROM galeri WHERE slug = $1 AND id::text <> $2 AND deleted_at IS NULL LIMIT 1`,
    [slug, String(id)]
  );
  if (slugCheck.rows.length > 0) {
    slug = `${slug}-${Date.now().toString().slice(-6)}`;
  }

  await query(
    `UPDATE galeri
     SET judul_foto = $1,
         slug = $2,
         kategori = $3,
         deskripsi = $4,
         image_url = $5,
         jumlah_foto = $6,
         pengunggah = $7,
         status = $8,
         tanggal = $9,
         updated_at = NOW()
     WHERE id::text = $10
       AND deleted_at IS NULL`,
    [
      data.judul_foto,
      slug,
      data.kategori || "Adiwiyata",
      data.deskripsi || "",
      data.image_url || "",
      data.jumlah_foto ?? 1,
      data.pengunggah || "Admin Sekolah",
      data.status || "tayang",
      data.tanggal || new Date().toISOString().slice(0, 10),
      String(id),
    ]
  );

  return getGaleriById(id);
};

// DELETE: Menghapus album (soft delete)
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

