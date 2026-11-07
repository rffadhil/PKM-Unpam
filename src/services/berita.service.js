/** @format */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("cms_token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export function resetBerita() {
  // Dipertahankan agar tidak merusak file unit test jika masih mengimpor fungsi ini
}

export async function daftarBerita() {
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal memuat daftar berita.");
  }
  return data;
}

export async function ambilBerita(id) {
  const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Artikel tidak ditemukan.");
  }
  return data;
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

  return data;
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
}
