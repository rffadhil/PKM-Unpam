/** @format */

import { getStoredAuth } from "@/services/authService";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

async function request(endpoint, options = {}) {
  const { token } = getStoredAuth();

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: "include",
  });

  // Antisipasi respons kosong, misalnya dari DELETE.
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan pada API.");
  }

  return data;
}

// GET: mengambil semua data staf.
export async function ambilSemuaStaf() {
  return request("/staf");
}

// POST: menambahkan staf baru.
export async function tambahStaf(payload) {
  return request("/staf", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// PUT: memperbarui data staf.
export async function editStaf(id, payload) {
  return request(`/staf/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// DELETE: menghapus staf.
export async function hapusStaf(id) {
  return request(`/staf/${id}`, {
    method: "DELETE",
  });
}

// PUT: mengubah status tampil staf.
export async function ubahTampilStaf(id, tampil) {
  return request(`/staf/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      tampil_publik: tampil,
    }),
  });
}