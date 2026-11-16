
/** @format */

import { getStoredAuth } from "@/services/authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = (isJson = true) => {
  const headers = {};

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  const { token } = getStoredAuth();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Mengambil array dari beberapa kemungkinan bentuk respons API.
export function ambilArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.data)) return data.data.data;
  if (Array.isArray(data?.posts)) return data.posts;

  return [];
}

// Menyamakan format data berita dari API.
export function formatBeritaFrontend(row) {
  if (!row) return {};

  // Prioritaskan tanggal berita, bukan waktu pembuatan data.
  const tanggalSumber =
    row.tanggal_berita ||
    row.tanggal_publikasi ||
    row.tanggalPublikasi ||
    row.tanggal ||
    row.published_at ||
    row.created_at ||
    "";

  const gambarCover =
    row.gambarCover ||
    row.gambar_cover ||
    row.gambar ||
    row.cover ||
    "";

  const penulisAsli =
    typeof row.penulis === "string"
      ? row.penulis
      : row.penulis?.nama || row.penulis_nama || "";

  const emailPenulis =
    row.penulis?.email ||
    row.penulis_email ||
    "";

  const namaPenulis = String(penulisAsli || "").trim();

  const inisialPenulis = namaPenulis
    ? namaPenulis
        .split(/\s+/)
        .slice(0, 2)
        .map((kata) => kata.charAt(0))
        .join("")
        .toUpperCase()
    : "";

  const tanggalIso = tanggalSumber
    ? String(tanggalSumber).slice(0, 10)
    : "";

  const disematkan = Boolean(
    row.is_pinned ?? row.disematkan ?? row.sematkan,
  );

  return {
    ...row,
    id: row.id,
    judul: row.judul || "",
    slug: row.slug || String(row.id ?? ""),
    ringkasan: row.ringkasan || row.cuplikan || "",
    cuplikan: row.cuplikan || row.ringkasan || "",
    konten: row.konten || row.isi || "",
    isi: row.isi || row.konten || "",
    kategori: row.kategori || "",
    gambar: gambarCover,
    cover: gambarCover,
    gambarCover,
    gambar_cover: gambarCover,
    disematkan,
    sematkan: disematkan,
    is_pinned: disematkan,
    status: row.status || "Draft",
    tanggal: tanggalIso,
    tanggalPublikasi: tanggalIso,
    penulis: {
      nama: namaPenulis,
      email: emailPenulis,
      inisial: row.penulis?.inisial || inisialPenulis,
      tone: row.penulis?.tone || "",
    },
  };
}

// ==========================================
// ADMIN: Mengambil semua berita, termasuk Draft
// ==========================================

export async function daftarBerita() {
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "GET",
    headers: getHeaders(false),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal memuat daftar berita.");
  }

  return ambilArray(data).map(formatBeritaFrontend);
}

// ==========================================
// PUBLIK: Mengambil berita yang sudah Terbit
// ==========================================

export async function daftarBeritaPublik() {
  const response = await fetch(`${API_BASE_URL}/api/posts/public`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal memuat berita publik.");
  }

  return ambilArray(data).map(formatBeritaFrontend);
}

// ==========================================
// ADMIN: Detail berita berdasarkan ID
// ==========================================

export async function ambilBerita(id) {
  const response = await fetch(
    `${API_BASE_URL}/api/posts/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: getHeaders(false),
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Artikel tidak ditemukan.");
  }

  const item = data?.data?.post || data?.data || data?.post || data;

  return formatBeritaFrontend(item);
}

// ==========================================
// PUBLIK: Detail berita berdasarkan slug
// ==========================================

export async function ambilBeritaPublik(slug) {
  const response = await fetch(
    `${API_BASE_URL}/api/posts/public/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Artikel tidak ditemukan.");
  }

  const item = data?.data?.post || data?.data || data?.post || data;

  return formatBeritaFrontend(item);
}

// ==========================================
// ADMIN: Menambah atau memperbarui berita
// ==========================================

export async function simpanBerita(input) {
  const isUpdate = Boolean(input.id);

  const url = isUpdate
    ? `${API_BASE_URL}/api/posts/${input.id}`
    : `${API_BASE_URL}/api/posts`;

  const method = isUpdate ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: getHeaders(true),
    credentials: "include",
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    const galat = new Error(data.message || "Gagal menyimpan berita.");

    if (data.field) {
      galat.field = data.field;
    }

    throw galat;
  }

  const saved = data?.data?.post || data?.data || data?.post || data;

  return formatBeritaFrontend(saved);
}

// ==========================================
// ADMIN: Menghapus berita
// ==========================================

export async function hapusBerita(id) {
  const response = await fetch(
    `${API_BASE_URL}/api/posts/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: getHeaders(false),
      credentials: "include",
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus artikel.");
  }

  return data;
}
