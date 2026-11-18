/** @format */

import slugify from "slugify";
import sanitizeHtml from "sanitize-html";

export const validateBeritaInput = (body = {}, options = {}) => {
  const judul = String(body.judul || "").trim();

  if (!judul) {
    const error = new Error("Judul berita wajib diisi.");
    error.status = 400;
    error.field = "judul";
    throw error;
  }

  const rawSlug = String(body.slug || judul).trim();
  const slug = slugify(rawSlug, { lower: true, strict: true });

  if (!slug) {
    const error = new Error("Slug artikel tidak valid.");
    error.status = 400;
    error.field = "slug";
    throw error;
  }

  const kategori = String(body.kategori || "Akademik").trim();

  // Mendukung nama field 'isi' maupun 'konten' dari form frontend
  const rawKonten = String(body.isi ?? body.konten ?? "").trim();

  const konten = sanitizeHtml(rawKonten, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "u",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "class"],
      "*": ["class", "style"],
    },
  });

  if (!konten) {
    const error = new Error("Isi artikel wajib diisi.");
    error.status = 400;
    error.field = "isi";
    throw error;
  }

  // Mendukung nama field 'cuplikan' maupun 'ringkasan'
  let ringkasan = String(body.cuplikan ?? body.ringkasan ?? "").trim();

  if (!ringkasan) {
    const plainText = sanitizeHtml(konten, { allowedTags: [] }).trim();
    ringkasan = plainText.slice(0, 160);
  }

  // Mendukung berbagai variasi nama field gambar cover
  const gambar_cover =
    body.gambarCover ??
    body.gambar_cover ??
    body.cover ??
    body.gambar ??
    "";

  // Mendukung berbagai variasi nama field pin beranda
  const is_pinned = Boolean(
    body.disematkan ?? body.sematkan ?? body.is_pinned ?? false,
  );

  // Validasi tanggal publikasi berdasarkan waktu Jakarta
  const tanggal = String(
    body.tanggal ?? body.tanggalPublikasi ?? "",
  ).trim();

  if (!tanggal) {
    const error = new Error("Tanggal berita wajib diisi.");
    error.status = 400;
    error.field = "tanggal";
    throw error;
  }

  // Pastikan format tanggal YYYY-MM-DD dan tanggalnya benar-benar valid
  const formatTanggal = /^\d{4}-\d{2}-\d{2}$/;
  const [tahun, bulan, hari] = tanggal.split("-").map(Number);
  const tanggalValid = new Date(Date.UTC(tahun, bulan - 1, hari));

  if (
    !formatTanggal.test(tanggal) ||
    tanggalValid.getUTCFullYear() !== tahun ||
    tanggalValid.getUTCMonth() + 1 !== bulan ||
    tanggalValid.getUTCDate() !== hari
  ) {
    const error = new Error("Format tanggal berita tidak valid.");
    error.status = 400;
    error.field = "tanggal";
    throw error;
  }

  // Mengambil tanggal hari ini berdasarkan zona waktu Jakarta.
  const hariIni = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  // Tanggal lama diberikan ketika proses edit berita.
  const tanggalLama = String(options.tanggalLama || "").trim();

  // Tanggal lampau hanya ditolak jika merupakan tanggal baru
  // atau admin benar-benar mengubah tanggal menjadi tanggal lampau.
  if (tanggal < hariIni && tanggal !== tanggalLama) {
    const error = new Error(
      "Tanggal berita tidak boleh mundur dari hari ini. Silakan pilih hari ini atau tanggal mendatang.",
    );
    error.status = 400;
    error.field = "tanggal";
    throw error;
  }

  // Status mengikuti pilihan admin, bukan ditentukan otomatis dari tanggal.
  const status = String(body.status || "Draft").trim();

  if (!["Draft", "Terbit"].includes(status)) {
    const error = new Error("Status berita tidak valid.");
    error.status = 400;
    error.field = "status";
    throw error;
  }

  return {
    judul,
    slug,
    ringkasan,
    konten,
    kategori,
    gambar_cover: String(gambar_cover || ""),
    is_pinned,
    tanggal,
    status,
  };
};