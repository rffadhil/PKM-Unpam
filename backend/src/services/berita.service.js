
/** @format */

import { query } from "../config/db.js";

const buatInisial = (nama = "") => {
  const parts = String(nama).trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[1][0]).toUpperCase();
};

// ==========================================
// FORMAT DATA BERITA
// ==========================================

const formatPostRow = (row) => {
  const namaPenulis = row.penulis_nama || "Humas & Kesiswaan";
  const emailPenulis = row.penulis_email || "humas@smaharapanjaya.sch.id";

  const tanggalIso =
    row.tanggal_berita ||
    (row.created_at ? String(row.created_at).slice(0, 10) : "");

  return {
    id: row.id,
    judul: row.judul,
    slug: row.slug,
    cuplikan: row.ringkasan || "",
    ringkasan: row.ringkasan || "",
    isi: row.konten || "",
    konten: row.konten || "",
    kategori: row.kategori,
    gambarCover: row.gambar_cover || "",
    gambar_cover: row.gambar_cover || "",
    cover: row.gambar_cover || "",
    gambar: row.gambar_cover || "",
    disematkan: Boolean(row.is_pinned),
    sematkan: Boolean(row.is_pinned),
    is_pinned: Boolean(row.is_pinned),
    status: row.status || "Draft",
    tanggal: tanggalIso,
    tanggalPublikasi: tanggalIso,
    created_at: row.created_at,
    updated_at: row.updated_at,
    penulis: {
      nama: namaPenulis,
      email: emailPenulis,
      inisial: buatInisial(namaPenulis),
      tone: "netral",
    },
  };
};

// ==========================================
// ADMIN: Mengambil semua berita
// Termasuk berita Draft dan Terbit
// ==========================================

export const getAllPosts = async () => {
  const result = await query(
    `SELECT
       p.*,
       TO_CHAR(p.created_at, 'YYYY-MM-DD') AS tanggal_berita,
       u.nama AS penulis_nama,
       u.email AS penulis_email
     FROM posts p
     LEFT JOIN users u ON p.created_by = u.id
     WHERE p.deleted_at IS NULL
     ORDER BY p.created_at DESC`,
  );

  return result.rows.map(formatPostRow);
};

// ==========================================
// PUBLIK: Mengambil berita yang sudah Terbit
// ==========================================

export const getPublishedPosts = async () => {
  const result = await query(
    `SELECT
       p.*,
       TO_CHAR(p.created_at, 'YYYY-MM-DD') AS tanggal_berita,
       u.nama AS penulis_nama,
       u.email AS penulis_email
     FROM posts p
     LEFT JOIN users u ON p.created_by = u.id
     WHERE p.deleted_at IS NULL
       AND p.status = 'Terbit'
     ORDER BY p.created_at DESC`,
  );

  return result.rows.map(formatPostRow);
};

// ==========================================
// ADMIN: Mengambil detail berita berdasarkan ID
// ==========================================

export const getPostById = async (id) => {
  const result = await query(
    `SELECT
       p.*,
       TO_CHAR(p.created_at, 'YYYY-MM-DD') AS tanggal_berita,
       u.nama AS penulis_nama,
       u.email AS penulis_email
     FROM posts p
     LEFT JOIN users u ON p.created_by = u.id
     WHERE p.id::text = $1
       AND p.deleted_at IS NULL
     LIMIT 1`,
    [String(id)],
  );

  if (!result.rows[0]) {
    const error = new Error("Artikel tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  return formatPostRow(result.rows[0]);
};

// ==========================================
// PUBLIK: Mengambil detail berita berdasarkan slug
// Hanya berita Terbit
// ==========================================

export const getPublishedPostBySlug = async (slug) => {
  const result = await query(
    `SELECT
       p.*,
       TO_CHAR(p.created_at, 'YYYY-MM-DD') AS tanggal_berita,
       u.nama AS penulis_nama,
       u.email AS penulis_email
     FROM posts p
     LEFT JOIN users u ON p.created_by = u.id
     WHERE p.slug = $1
       AND p.status = 'Terbit'
       AND p.deleted_at IS NULL
     LIMIT 1`,
    [String(slug)],
  );

  if (!result.rows[0]) {
    const error = new Error("Artikel tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  return formatPostRow(result.rows[0]);
};

// ==========================================
// ADMIN: Membuat berita
// ==========================================

export const createPost = async (data, userId) => {
  const slugCheck = await query(
    `SELECT id
     FROM posts
     WHERE slug = $1
       AND deleted_at IS NULL
     LIMIT 1`,
    [data.slug],
  );

  if (slugCheck.rows.length > 0) {
    const error = new Error("Slug sudah dipakai artikel lain.");
    error.status = 409;
    error.field = "slug";
    throw error;
  }

  const insertResult = await query(
    `INSERT INTO posts (
       judul,
       slug,
       ringkasan,
       konten,
       kategori,
       gambar_cover,
       status,
       is_pinned,
       created_by,
       created_at,
       updated_at
     )
     VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9,
       COALESCE($10::date, CURRENT_DATE),
       NOW()
     )
     RETURNING id`,
    [
      data.judul,
      data.slug,
      data.ringkasan,
      data.konten,
      data.kategori,
      data.gambar_cover,
      data.status || "Draft",
      data.is_pinned,
      userId || null,
      data.tanggal || null,
    ],
  );

  return getPostById(insertResult.rows[0].id);
};

// ==========================================
// ADMIN: Memperbarui berita
// ==========================================

export const updatePost = async (id, data) => {
  const existing = await query(
    `SELECT id
     FROM posts
     WHERE id::text = $1
       AND deleted_at IS NULL
     LIMIT 1`,
    [String(id)],
  );

  if (!existing.rows[0]) {
    const error = new Error("Artikel tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  const slugCheck = await query(
    `SELECT id
     FROM posts
     WHERE slug = $1
       AND id::text <> $2
       AND deleted_at IS NULL
     LIMIT 1`,
    [data.slug, String(id)],
  );

  if (slugCheck.rows.length > 0) {
    const error = new Error("Slug sudah dipakai artikel lain.");
    error.status = 409;
    error.field = "slug";
    throw error;
  }

  await query(
    `UPDATE posts
     SET judul = $1,
         slug = $2,
         ringkasan = $3,
         konten = $4,
         kategori = $5,
         gambar_cover = $6,
         status = $7,
         is_pinned = $8,
         created_at = COALESCE($9::date, created_at),
         updated_at = NOW()
     WHERE id::text = $10`,
    [
      data.judul,
      data.slug,
      data.ringkasan,
      data.konten,
      data.kategori,
      data.gambar_cover,
      data.status || "Draft",
      data.is_pinned,
      data.tanggal || null,
      String(id),
    ],
  );

  return getPostById(id);
};

// ==========================================
// ADMIN: Menghapus berita (soft delete)
// ==========================================

export const softDeletePost = async (id) => {
  const result = await query(
    `UPDATE posts
     SET deleted_at = NOW(),
         updated_at = NOW()
     WHERE id::text = $1
       AND deleted_at IS NULL
     RETURNING id`,
    [String(id)],
  );

  if (!result.rows[0]) {
    const error = new Error("Artikel tidak ditemukan.");
    error.status = 404;
    throw error;
  }

  return true;
};
