/** @format */

import { query } from "../config/db.js";

const buatInisial = (nama = "") => {
  const parts = String(nama).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const formatPostRow = (row) => {
  const namaPenulis = row.penulis_nama || "Humas & Kesiswaan";
  const emailPenulis = row.penulis_email || "humas@smaharapanjaya.sch.id";
  const tanggalIso = row.created_at
    ? new Date(row.created_at).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  return {
    id: row.id,
    judul: row.judul,
    slug: row.slug,
    // Sediakan alias field agar cocok dengan semua komponen tabel & form frontend
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
    status: "Terbit",
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

export const getAllPosts = async () => {
  const result = await query(
    `SELECT p.*, u.nama AS penulis_nama, u.email AS penulis_email
     FROM posts p
     LEFT JOIN users u ON p.created_by = u.id
     WHERE p.deleted_at IS NULL
     ORDER BY p.created_at DESC`,
  );
  return result.rows.map(formatPostRow);
};

export const getPostById = async (id) => {
  const result = await query(
    `SELECT p.*, u.nama AS penulis_nama, u.email AS penulis_email
     FROM posts p
     LEFT JOIN users u ON p.created_by = u.id
     WHERE (p.id::text = $1 OR p.slug = $1) AND p.deleted_at IS NULL
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

export const createPost = async (data, userId) => {
  // Bebaskan slug dari artikel yang sudah dihapus agar tidak bentrok dengan UNIQUE constraint
  await query(
    `UPDATE posts
     SET slug = SUBSTRING(slug FROM 1 FOR 180) || '-deleted-' || id::text
     WHERE slug = $1 AND deleted_at IS NOT NULL`,
    [data.slug],
  );

  // Cek apakah slug sudah dipakai artikel lain yang belum dihapus
  const slugCheck = await query(
    `SELECT id FROM posts WHERE slug = $1 AND deleted_at IS NULL LIMIT 1`,
    [data.slug],
  );
  if (slugCheck.rows.length > 0) {
    const error = new Error("Slug sudah dipakai artikel lain.");
    error.status = 409;
    error.field = "slug";
    throw error;
  }

  const createdAt = data.tanggal ? new Date(data.tanggal) : new Date();

  const insertResult = await query(
    `INSERT INTO posts (judul, slug, ringkasan, konten, kategori, gambar_cover, status, is_pinned, created_by, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'Terbit', $7, $8, $9, NOW())
     RETURNING id`,
    [
      data.judul,
      data.slug,
      data.ringkasan,
      data.konten,
      data.kategori,
      data.gambar_cover,
      data.is_pinned,
      userId || null,
      createdAt,
    ],
  );

  return getPostById(insertResult.rows[0].id);
};

export const updatePost = async (id, data) => {
  const existing = await query(
    `SELECT id FROM posts WHERE (id::text = $1 OR slug = $1) AND deleted_at IS NULL LIMIT 1`,
    [String(id)],
  );
  if (!existing.rows[0]) {
    const error = new Error("Artikel tidak ditemukan.");
    error.status = 404;
    throw error;
  }
  const realId = existing.rows[0].id;

  // Bebaskan slug dari artikel yang sudah dihapus
  await query(
    `UPDATE posts
     SET slug = SUBSTRING(slug FROM 1 FOR 180) || '-deleted-' || id::text
     WHERE slug = $1 AND id <> $2 AND deleted_at IS NOT NULL`,
    [data.slug, realId],
  );

  // Cek apakah slug bentrok dengan artikel lain
  const slugCheck = await query(
    `SELECT id FROM posts WHERE slug = $1 AND id <> $2 AND deleted_at IS NULL LIMIT 1`,
    [data.slug, realId],
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
         status = 'Terbit',
         is_pinned = $7,
         updated_at = NOW()
     WHERE id = $8`,
    [
      data.judul,
      data.slug,
      data.ringkasan,
      data.konten,
      data.kategori,
      data.gambar_cover,
      data.is_pinned,
      realId,
    ],
  );

  return getPostById(realId);
};

export const deletePost = async (id) => {
  const result = await query(
    `DELETE FROM posts
     WHERE id::text = $1 OR slug = $1
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

export const softDeletePost = deletePost;
