/** @format */

import slugify from "slugify";
import sanitizeHtml from "sanitize-html";

export const validateBeritaInput = (body = {}) => {
  const judul = String(body.judul || "").trim();
  if (!judul) {
    const error = new Error("Judul berita wajib diisi.");
    error.status = 400;
    error.field = "judul";
    throw error;
  }

  const RE_TEKS_AMAN = /^[\p{L}\p{N}\s.,!?'"“”‘’():;/\-&[\]%–—]+$/u;
  if (!RE_TEKS_AMAN.test(judul)) {
    const error = new Error("Judul berita tidak boleh mengandung karakter khusus.");
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

  // Mendukung berbagai variasi nama field gambar cover & pin beranda dari frontend
  const gambar_cover =
    body.gambarCover ?? body.gambar_cover ?? body.cover ?? body.gambar ?? "";
  const is_pinned = Boolean(
    body.disematkan ?? body.sematkan ?? body.is_pinned ?? false,
  );
  const tanggal = body.tanggal || body.tanggalPublikasi || null;

  return {
    judul,
    slug,
    ringkasan,
    konten,
    kategori,
    gambar_cover: String(gambar_cover || ""),
    is_pinned,
    tanggal,
  };
};
