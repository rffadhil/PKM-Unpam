
/** @format */

import { getStoredAuth } from "@/services/authService";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://smaharapanjaya.sch.id";

export async function unggahGambar(file) {
  const form = new FormData();
  form.append("file", file);

  const { token } = getStoredAuth();

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
    credentials: "include",
    body: form,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengunggah gambar.");
  }

  return data.url;
}
