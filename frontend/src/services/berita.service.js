/** @format */

import { getStoredAuth } from "@/services/authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STORAGE_KEY = "cms_berita_data";

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const { token } = getStoredAuth();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export function ambilArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.data)) return data.data.data;
  if (Array.isArray(data?.posts)) return data.posts;
  return [];
}

export function formatBeritaFrontend(row) {
  if (!row) return {};
  const tglSumber =
    row.created_at || row.tanggal || new Date().toISOString().split("T")[0];
  const gambarCover =
    row.gambarCover || row.gambar_cover || row.gambar || row.cover || "";
  const namaPenulis =
    (typeof row.penulis === "string" ? row.penulis : row.penulis?.nama) ||
    row.penulis_nama ||
    "Humas & Kesiswaan";
  const emailPenulis =
    row.penulis?.email || row.penulis_email || "humas@smaharapanjaya.sch.id";

  const tanggalIso = String(tglSumber).slice(0, 10);

  return {
    ...row,
    id: row.id,
    judul: row.judul || "",
    slug: row.slug || String(row.id),
    ringkasan: row.ringkasan || row.cuplikan || "",
    cuplikan: row.cuplikan || row.ringkasan || "",
    konten: row.konten || row.isi || "",
    isi: row.isi || row.konten || "",
    kategori: row.kategori || "Akademik",
    gambar: gambarCover,
    cover: gambarCover,
    gambarCover: gambarCover,
    gambar_cover: gambarCover,
    disematkan: Boolean(row.is_pinned ?? row.disematkan ?? row.sematkan),
    sematkan: Boolean(row.is_pinned ?? row.disematkan ?? row.sematkan),
    is_pinned: Boolean(row.is_pinned ?? row.disematkan ?? row.sematkan),
    status: row.status || "Terbit",
    tanggal: tanggalIso,
    tanggalPublikasi: tanggalIso,
    penulis: {
      nama: namaPenulis,
      email: emailPenulis,
      inisial: row.penulis?.inisial || "HK",
      tone: row.penulis?.tone || "netral",
    },
  };
}

export function getLocalBerita() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(formatBeritaFrontend);
      }
    }
  } catch {
    // Abaikan error parsing JSON
  }
  return [];
}

export function setLocalBerita(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Abaikan error storage quota
  }
}

export function resetBerita() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Abaikan
  }
}

export async function daftarBerita() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Gagal memuat daftar berita.");
    }
    const list = ambilArray(data).map(formatBeritaFrontend);
    setLocalBerita(list);
    return list;
  } catch (err) {
    const lokal = getLocalBerita();
    if (lokal && lokal.length > 0) return lokal;
    throw err;
  }
}

export async function ambilBerita(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Artikel tidak ditemukan.");
    }
    const item = data?.data ? data.data : data;
    return formatBeritaFrontend(item);
  } catch (err) {
    const lokal = getLocalBerita();
    const item = lokal.find(
      (a) => String(a.id) === String(id) || String(a.slug) === String(id),
    );
    if (item) return item;
    throw err;
  }
}

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
    if (data.field) galat.field = data.field;
    throw galat;
  }

  const saved = formatBeritaFrontend(data?.data ? data.data : data);
  const lokal = getLocalBerita();
  let updated;
  if (isUpdate) {
    updated = lokal.map((item) =>
      String(item.id) === String(input.id) ||
      String(item.slug) === String(input.slug)
        ? saved
        : item,
    );
  } else {
    updated = [saved, ...lokal];
  }
  setLocalBerita(updated);

  return saved;
}

export async function hapusBerita(id) {
  const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: "DELETE",
    headers: getHeaders(false),
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus artikel.");
  }

  const lokal = getLocalBerita();
  const updated = lokal.filter(
    (item) => String(item.id) !== String(id) && String(item.slug) !== String(id),
  );
  setLocalBerita(updated);

  return data;
}
